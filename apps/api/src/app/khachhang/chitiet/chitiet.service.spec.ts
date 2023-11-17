import { Test, TestingModule } from '@nestjs/testing';
import { ChitietService } from './chitiet.service';

describe('ChitietService', () => {
  let service: ChitietService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChitietService],
    }).compile();

    service = module.get<ChitietService>(ChitietService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
