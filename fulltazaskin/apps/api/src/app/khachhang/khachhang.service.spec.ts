import { Test, TestingModule } from '@nestjs/testing';
import { KhachhangService } from './khachhang.service';

describe('KhachhangService', () => {
  let service: KhachhangService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KhachhangService],
    }).compile();

    service = module.get<KhachhangService>(KhachhangService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
