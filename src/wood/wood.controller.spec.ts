import { Test, TestingModule } from '@nestjs/testing';
import { WoodController } from './wood.controller';

describe('WoodController', () => {
  let controller: WoodController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WoodController],
    }).compile();

    controller = module.get<WoodController>(WoodController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
