import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { HomepageModule } from './homepage/homepage.module';
import { WoodModule } from './wood/wood.module';
import { PriceModule } from './price/price.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    HomepageModule,
    WoodModule,
    PriceModule,
  ],
})
export class AppModule {}