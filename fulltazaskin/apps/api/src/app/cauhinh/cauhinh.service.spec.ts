import { Test, TestingModule } from '@nestjs/testing';
import { CauhinhService } from './cauhinh.service';

describe('CauhinhService', () => {
  let service: CauhinhService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CauhinhService],
    }).compile();

    service = module.get<CauhinhService>(CauhinhService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
