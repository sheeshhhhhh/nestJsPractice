import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [LocationService],
  exports: [LocationService],
  imports: [PrismaModule]
})
export class LocationModule {}
