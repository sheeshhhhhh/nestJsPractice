import { Module } from '@nestjs/common';
import { PaymongoService } from './paymongo.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [PaymongoService],
  exports: [PaymongoService],
  imports: [PrismaModule]
})
export class PaymongoModule {}
