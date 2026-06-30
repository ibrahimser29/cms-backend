import { Controller, Get, Post, Patch, Delete, Param, Body, ParseIntPipe, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PriceService } from './price.service';
import { CreatePriceItemDto, UpdatePriceItemDto } from './dto/price.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Price List')
@Controller('price')
export class PriceController {
  constructor(private priceService: PriceService) {}

  // ---- PUBLIC ----
  @ApiOperation({ summary: 'Get all price items, optionally filtered by category' })
  @ApiQuery({ name: 'category', required: false, example: 'buk pr' })
  @Get()
  findAll(@Query('category') category?: string) {
    if (category) return this.priceService.findByCategory(category);
    return this.priceService.findAll();
  }

  @ApiOperation({ summary: 'Get a price item by ID' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.priceService.findOne(id);
  }

  // ---- ADMIN ----
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a price item' })
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreatePriceItemDto) {
    return this.priceService.create(dto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a price item' })
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePriceItemDto) {
    return this.priceService.update(id, dto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a price item' })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.priceService.delete(id);
  }
}
