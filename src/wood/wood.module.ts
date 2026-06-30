import { Module } from '@nestjs/common';
import { WoodService } from './wood.service';
import { WoodController } from './wood.controller';

@Module({
  providers: [WoodService],
  controllers: [WoodController],
})
export class WoodModule {}