import { Test, TestingModule } from '@nestjs/testing';
import { VttechthanhtoanService } from './vttechthanhtoan.service';

describe('VttechthanhtoanService', () => {
  let service: VttechthanhtoanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VttechthanhtoanService],
    }).compile();

    service = module.get<VttechthanhtoanService>(VttechthanhtoanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
