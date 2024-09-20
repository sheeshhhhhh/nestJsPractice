import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { PaymongoModule } from 'src/paymongo/paymongo.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [OrderController],
  providers: [OrderService],
  imports: [PaymongoModule, PrismaModule]
})
export class OrderModule {}
