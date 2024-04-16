import { Test, TestingModule } from '@nestjs/testing';
import { ZnsdieutriController } from './znsdieutri.controller';
import { ZnsdieutriService } from './znsdieutri.service';

describe('ZnsdieutriController', () => {
  let controller: ZnsdieutriController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ZnsdieutriController],
      providers: [ZnsdieutriService],
    }).compile();

    controller = module.get<ZnsdieutriController>(ZnsdieutriController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
