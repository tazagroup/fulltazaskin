import { Test, TestingModule } from '@nestjs/testing';
import { ZnsdieutriService } from './znsdieutri.service';

describe('ZnsdieutriService', () => {
  let service: ZnsdieutriService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ZnsdieutriService],
    }).compile();

    service = module.get<ZnsdieutriService>(ZnsdieutriService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
