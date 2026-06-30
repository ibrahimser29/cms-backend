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
  UploadedFiles,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { HomepageService } from './homepage.service';
import { CreateSectionDto, UpdateSectionDto } from './dto/section.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Homepage')
@Controller('homepage')
export class HomepageController {
  constructor(private homepageService: HomepageService) {}

  // ---- PUBLIC ----
  @ApiOperation({ summary: 'Get all active sections (ordered)' })
  @Get()
  getPublic() {
    return this.homepageService.getPublicSections();
  }

  @ApiOperation({ summary: 'Get a single section by key' })
  @Get(':key')
  getOne(@Param('key') key: string) {
    return this.homepageService.getOne(key);
  }

  // ---- ADMIN (protected) ----
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all sections including inactive (admin)' })
  @UseGuards(JwtAuthGuard)
  @Get('admin/all')
  getAll() {
    return this.homepageService.getAllSections();
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new section' })
  @UseGuards(JwtAuthGuard)
  @Post('admin')
  create(@Body() dto: CreateSectionDto) {
    return this.homepageService.create(dto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a section by key' })
  @UseGuards(JwtAuthGuard)
  @Patch('admin/:key')
  update(@Param('key') key: string, @Body() dto: UpdateSectionDto) {
    return this.homepageService.update(key, dto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a section by key' })
  @UseGuards(JwtAuthGuard)
  @Delete('admin/:key')
  remove(@Param('key') key: string) {
    return this.homepageService.delete(key);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload images for a section' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { files: { type: 'array', items: { type: 'string', format: 'binary' } } } } })
  @UseGuards(JwtAuthGuard)
  @Post('admin/:key/images')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
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
  uploadImages(
    @Param('key') key: string,
    @UploadedFiles() files: Array<{ filename: string }>,
  ) {
    const filenames = files.map((f) => f.filename);
    return this.homepageService.addImages(key, filenames);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove an image from a section' })
  @UseGuards(JwtAuthGuard)
  @Delete('admin/:key/images')
  removeImage(@Param('key') key: string, @Body('imageUrl') imageUrl: string) {
    return this.homepageService.removeImage(key, imageUrl);
  }
}
