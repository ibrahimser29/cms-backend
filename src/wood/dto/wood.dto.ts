import { IsString, IsOptional, IsArray, ValidateNested, IsIn, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class WoodFeatureDto {
  @ApiProperty({ example: 'Durability' })
  @IsString()
  content: string;

  @ApiProperty({ enum: ['positive', 'negative'], example: 'positive' })
  @IsIn(['positive', 'negative'])
  type: 'positive' | 'negative';

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  sortOrder?: number;
}

export class CreateWoodDto {
  @ApiProperty({ example: 'Oak' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'oak' })
  @IsString()
  slug: string;

  @ApiPropertyOptional({ type: [WoodFeatureDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WoodFeatureDto)
  features?: WoodFeatureDto[];
}

export class UpdateWoodDto {
  @ApiPropertyOptional({ example: 'Oak' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'oak' })
  @IsOptional()
  @IsString()
  slug?: string;
}
