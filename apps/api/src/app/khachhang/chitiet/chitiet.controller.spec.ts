import { Test, TestingModule } from '@nestjs/testing';
import { ChitietController } from './chitiet.controller';
import { ChitietService } from './chitiet.service';

describe('ChitietController', () => {
  let controller: ChitietController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChitietController],
      providers: [ChitietService],
    }).compile();

    controller = module.get<ChitietController>(ChitietController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
