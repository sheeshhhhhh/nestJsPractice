import { Test, TestingModule } from '@nestjs/testing';
import { PaymongoService } from './paymongo.service';
import axios from 'axios';

describe('PaymongoService', () => {
  let service: PaymongoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymongoService]
    }).compile();

    service = module.get<PaymongoService>(PaymongoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
