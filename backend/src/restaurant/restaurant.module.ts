import { Module } from '@nestjs/common';
import { RestaurantController } from './restaurant.controller';
import { RestaurantService } from './restaurant.service';
import { MenuModule } from 'src/menu/menu.module';
import { LocationModule } from 'src/location/location.module';

@Module({
  imports: [LocationModule],
  controllers: [RestaurantController],
  providers: [RestaurantService]
})
export class RestaurantModule {}
