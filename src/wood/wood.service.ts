import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWoodDto, UpdateWoodDto, WoodFeatureDto } from './dto/wood.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class WoodService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.wood.findMany({
      include: { features: { orderBy: { sortOrder: 'asc' } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const wood = await this.prisma.wood.findUnique({
      where: { id },
      include: { features: { orderBy: { sortOrder: 'asc' } } },
    });
    if (!wood) throw new NotFoundException(`Wood #${id} not found`);
    return wood;
  }

  async findBySlug(slug: string) {
    const wood = await this.prisma.wood.findUnique({
      where: { slug },
      include: { features: { orderBy: { sortOrder: 'asc' } } },
    });
    if (!wood) throw new NotFoundException(`Wood "${slug}" not found`);
    return wood;
  }

  async create(dto: CreateWoodDto) {
    return this.prisma.wood.create({
      data: {
        name: dto.name,
        slug: dto.slug,
        features: dto.features
          ? { create: dto.features.map((f) => ({ ...f })) }
          : undefined,
      },
      include: { features: true },
    });
  }

  async update(id: number, dto: UpdateWoodDto) {
    await this.findOne(id);
    return this.prisma.wood.update({ where: { id }, data: dto });
  }

  async delete(id: number) {
    const wood = await this.findOne(id);

    if (wood.image) this.deleteFile(wood.image);

    return this.prisma.wood.delete({ where: { id } }); 
  }

  async setImage(id: number, filename: string) {
    const wood = await this.findOne(id);
    if (wood.image) this.deleteFile(wood.image); 

    const imageUrl = `/uploads/${filename}`;
    return this.prisma.wood.update({ where: { id }, data: { image: imageUrl } });
  }

  // ---- Features ----

  async addFeature(woodId: number, dto: WoodFeatureDto) {
    await this.findOne(woodId);
    return this.prisma.woodFeature.create({
      data: { ...dto, woodId },
    });
  }

  async updateFeature(featureId: number, dto: Partial<WoodFeatureDto>) {
    const feature = await this.prisma.woodFeature.findUnique({ where: { id: featureId } });
    if (!feature) throw new NotFoundException(`Feature #${featureId} not found`);
    return this.prisma.woodFeature.update({ where: { id: featureId }, data: dto });
  }

  async deleteFeature(featureId: number) {
    const feature = await this.prisma.woodFeature.findUnique({ where: { id: featureId } });
    if (!feature) throw new NotFoundException(`Feature #${featureId} not found`);
    return this.prisma.woodFeature.delete({ where: { id: featureId } });
  }

  private deleteFile(imageUrl: string) {
    const filePath = path.join(__dirname, '..', '..', imageUrl);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }
}