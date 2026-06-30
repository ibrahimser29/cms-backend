import { IsString, IsInt, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePriceItemDto {
  @ApiProperty({ example: 'buk pr' })
  @IsString()
  category: string;

  @ApiProperty({ example: 1000, description: 'Length in mm' })
  @IsInt() @Min(1)
  length: number;

  @ApiProperty({ example: 300, description: 'Width in mm' })
  @IsInt() @Min(1)
  width: number;

  @ApiProperty({ example: 40, description: 'Thickness in mm' })
  @IsInt() @Min(1)
  thickness: number;

  @ApiProperty({ example: 1100, description: 'Price per m3 in CZK' })
  @IsInt() @Min(0)
  pricePerM3: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  sortOrder?: number;
}

export class UpdatePriceItemDto {
  @ApiPropertyOptional({ example: 'buk pr' })
  @IsOptional() @IsString()
  category?: string;

  @ApiPropertyOptional({ example: 1000, description: 'Length in mm' })
  @IsOptional() @IsInt() @Min(1)
  length?: number;

  @ApiPropertyOptional({ example: 300, description: 'Width in mm' })
  @IsOptional() @IsInt() @Min(1)
  width?: number;

  @ApiPropertyOptional({ example: 40, description: 'Thickness in mm' })
  @IsOptional() @IsInt() @Min(1)
  thickness?: number;

  @ApiPropertyOptional({ example: 1100, description: 'Price per m3 in CZK' })
  @IsOptional() @IsInt() @Min(0)
  pricePerM3?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional() @IsInt()
  sortOrder?: number;
}
