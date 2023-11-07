import { Test, TestingModule } from '@nestjs/testing';
import { CauhinhController } from './cauhinh.controller';
import { CauhinhService } from './cauhinh.service';

describe('CauhinhController', () => {
  let controller: CauhinhController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CauhinhController],
      providers: [CauhinhService],
    }).compile();

    controller = module.get<CauhinhController>(CauhinhController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
