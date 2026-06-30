import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { WoodService } from './wood.service';
import { CreateWoodDto, UpdateWoodDto, WoodFeatureDto } from './dto/wood.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Wood')
@Controller('wood')
export class WoodController {
  constructor(private woodService: WoodService) {}

  // ---- PUBLIC ----
  @ApiOperation({ summary: 'Get all wood products with features' })
  @Get()
  findAll() {
    return this.woodService.findAll();
  }

  @ApiOperation({ summary: 'Get a wood product by slug' })
  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.woodService.findBySlug(slug);
  }

  @ApiOperation({ summary: 'Get a wood product by ID' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.woodService.findOne(id);
  }

  // ---- ADMIN ----
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a wood product' })
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateWoodDto) {
    return this.woodService.create(dto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a wood product' })
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateWoodDto) {
    return this.woodService.update(id, dto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a wood product' })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.woodService.delete(id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload image for a wood product' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } } })
  @UseGuards(JwtAuthGuard)
  @Post(':id/image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${unique}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp|gif)$/)) {
          return cb(new Error('Only image files are allowed'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  uploadImage(@Param('id', ParseIntPipe) id: number, @UploadedFile() file: { filename: string }) {
    return this.woodService.setImage(id, file.filename);
  }

  // ---- Features ----
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a feature to a wood product' })
  @UseGuards(JwtAuthGuard)
  @Post(':id/features')
  addFeature(@Param('id', ParseIntPipe) id: number, @Body() dto: WoodFeatureDto) {
    return this.woodService.addFeature(id, dto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a wood feature' })
  @UseGuards(JwtAuthGuard)
  @Patch('features/:featureId')
  updateFeature(
    @Param('featureId', ParseIntPipe) featureId: number,
    @Body() dto: Partial<WoodFeatureDto>,
  ) {
    return this.woodService.updateFeature(featureId, dto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a wood feature' })
  @UseGuards(JwtAuthGuard)
  @Delete('features/:featureId')
  removeFeature(@Param('featureId', ParseIntPipe) featureId: number) {
    return this.woodService.deleteFeature(featureId);
  }
}
