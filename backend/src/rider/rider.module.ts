import { Module } from '@nestjs/common';
import { RiderService } from './rider.service';
import { LocationModule } from 'src/location/location.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { OrderGatewayGateway } from 'src/order-gateway/order-gateway.gateway';
import { RiderController } from './rider.controller';

@Module({
  imports: [LocationModule, PrismaModule],
  providers: [RiderService, OrderGatewayGateway],
  exports: [RiderService],
  controllers: [RiderController],
})
export class RiderModule {}
