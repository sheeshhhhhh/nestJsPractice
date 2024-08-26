import { Module } from '@nestjs/common';
import { RestaurantController } from './restaurant.controller';
import { RestaurantService } from './restaurant.service';
import { MenuModule } from 'src/menu/menu.module';

@Module({
  controllers: [RestaurantController],
  providers: [RestaurantService]
})
export class RestaurantModule {}
