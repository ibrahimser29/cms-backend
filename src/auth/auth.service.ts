import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already in use');

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: { email: dto.email, password: hashed, name: dto.name },
    });

    return this.issueTokens(user.id, user.email, user.role);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    return this.issueTokens(user.id, user.email, user.role);
  }

  async refresh(rawToken: string) {
    const hashed = this.hashToken(rawToken);

    const stored = await this.prisma.refreshToken.findUnique({
      where: { token: hashed },
      include: { user: true },
    });

    if (!stored || stored.revoked || stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    await this.prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revoked: true },
    });

    return this.issueTokens(stored.user.id, stored.user.email, stored.user.role);
  }

  async logout(rawToken: string) {
    const hashed = this.hashToken(rawToken);
    await this.prisma.refreshToken.updateMany({
      where: { token: hashed },
      data: { revoked: true },
    });
    return { message: 'Logged out successfully' };
  }

  async logoutAll(userId: number) {
    await this.prisma.refreshToken.updateMany({
      where: { userId, revoked: false },
      data: { revoked: true },
    });
    return { message: 'Logged out from all devices' };
  }

  private async issueTokens(userId: number, email: string, role: Role) {
    const payload = { sub: userId, email, role };

    const access_token = this.jwt.sign(payload);

    const refresh_token = this.jwt.sign(payload, {
      secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });

    const hashed = this.hashToken(refresh_token);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.prisma.refreshToken.create({
      data: { token: hashed, userId, expiresAt },
    });

    return { access_token, refresh_token };
  }

  private hashToken(token: string): string {
    return require('crypto').createHash('sha256').update(token).digest('hex');
  }
}
