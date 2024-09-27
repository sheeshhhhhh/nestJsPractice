import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { PaymongoModule } from 'src/paymongo/paymongo.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { OrderGatewayGateway } from 'src/order-gateway/order-gateway.gateway';
import { RiderModule } from 'src/rider/rider.module';

@Module({
  controllers: [OrderController],
  providers: [OrderService, OrderGatewayGateway],
  imports: [PaymongoModule, PrismaModule, RiderModule]
})
export class OrderModule {}
