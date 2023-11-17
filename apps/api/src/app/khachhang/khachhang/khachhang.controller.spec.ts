import { Test, TestingModule } from '@nestjs/testing';
import { KhachhangController } from './khachhang.controller';
import { KhachhangService } from './khachhang.service';

describe('KhachhangController', () => {
  let controller: KhachhangController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KhachhangController],
      providers: [KhachhangService],
    }).compile();

    controller = module.get<KhachhangController>(KhachhangController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
