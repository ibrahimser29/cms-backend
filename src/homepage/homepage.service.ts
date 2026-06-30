import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSectionDto, UpdateSectionDto } from './dto/section.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class HomepageService {
  constructor(private prisma: PrismaService) {}

  // Public: get all active sections, ordered
  async getPublicSections() {
    return this.prisma.section.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });
  }

  async getAllSections() {
    return this.prisma.section.findMany({ orderBy: { order: 'asc' } });
  }

  async getOne(key: string) {
    const section = await this.prisma.section.findUnique({ where: { key } });
    if (!section) throw new NotFoundException(`Section "${key}" not found`);
    return section;
  }

  async create(dto: CreateSectionDto) {
    return this.prisma.section.create({ data: { ...dto, images: [] } });
  }

  async update(key: string, dto: UpdateSectionDto) {
    await this.getOne(key); 
    return this.prisma.section.update({ where: { key }, data: dto });
  }

  async delete(key: string) {
    await this.getOne(key);
    return this.prisma.section.delete({ where: { key } });
  }

  // Add uploaded image(s) to a section
  async addImages(key: string, filenames: string[]) {
    const section = await this.getOne(key);
    const urls = filenames.map((f) => `/uploads/${f}`);
    return this.prisma.section.update({
      where: { key },
      data: { images: [...section.images, ...urls] },
    });
  }

 
  async removeImage(key: string, imageUrl: string) {
    const section = await this.getOne(key);
    const updatedImages = section.images.filter((img) => img !== imageUrl);

    const filePath = path.join(__dirname, '..', '..', imageUrl);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    return this.prisma.section.update({
      where: { key },
      data: { images: updatedImages },
    });
  }
}