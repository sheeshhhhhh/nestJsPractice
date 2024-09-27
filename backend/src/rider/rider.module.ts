import { Module } from '@nestjs/common';
import { RiderService } from './rider.service';
import { LocationModule } from 'src/location/location.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [LocationModule, PrismaModule],
  providers: [RiderService],
  exports: [RiderService],
})
export class RiderModule {}
