import { Module } from '@nestjs/common';
import { PaymongoService } from './paymongo.service';

@Module({
  providers: [PaymongoService],
  imports: []
})
export class PaymongoModule {}
