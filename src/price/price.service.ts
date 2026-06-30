import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePriceItemDto, UpdatePriceItemDto } from './dto/price.dto';

@Injectable()
export class PriceService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.priceItem.findMany({
      orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }],
    });
  }

  findByCategory(category: string) {
    return this.prisma.priceItem.findMany({
      where: { category },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findOne(id: number) {
    const item = await this.prisma.priceItem.findUnique({ where: { id } });
    if (!item) throw new NotFoundException(`Price item #${id} not found`);
    return item;
  }

  create(dto: CreatePriceItemDto) {
    return this.prisma.priceItem.create({ data: dto });
  }

  async update(id: number, dto: UpdatePriceItemDto) {
    await this.findOne(id);
    return this.prisma.priceItem.update({ where: { id }, data: dto });
  }

  async delete(id: number) {
    await this.findOne(id);
    return this.prisma.priceItem.delete({ where: { id } });
  }
}
