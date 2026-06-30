import { IsString, IsOptional, IsBoolean, IsInt, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSectionDto {
  @ApiProperty({ example: 'hero' })
  @IsString()
  key: string;

  @ApiProperty({ example: 'hero' })
  @IsString()
  type: string;

  @ApiPropertyOptional({ example: 'SOLID WOOD PRODUCTS' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: '/uploads/hero-bg.png' })
  @IsOptional()
  @IsString()
  background?: string;

  @ApiProperty({ example: { subtitle: 'Oak, beech, ash from' } })
  @IsObject()
  content: Record<string, any>;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  order?: number;
}

export class UpdateSectionDto {
  @ApiPropertyOptional({ example: 'SOLID WOOD PRODUCTS' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: '/uploads/hero-bg.png' })
  @IsOptional()
  @IsString()
  background?: string;

  @ApiPropertyOptional({ example: { subtitle: 'Oak, beech, ash from' } })
  @IsOptional()
  @IsObject()
  content?: Record<string, any>;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  order?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
