import { Test, TestingModule } from '@nestjs/testing';
import { VttechthanhtoanController } from './vttechthanhtoan.controller';
import { VttechthanhtoanService } from './vttechthanhtoan.service';

describe('VttechthanhtoanController', () => {
  let controller: VttechthanhtoanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VttechthanhtoanController],
      providers: [VttechthanhtoanService],
    }).compile();

    controller = module.get<VttechthanhtoanController>(VttechthanhtoanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
