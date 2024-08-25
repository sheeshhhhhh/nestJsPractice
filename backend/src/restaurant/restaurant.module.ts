import { Module } from '@nestjs/common';
import { RestaurantController } from './restaurant.controller';
import { RestaurantService } from './restaurant.service';
import { MenuModule } from 'src/menu/menu.module';

@Module({
  imports: [MenuModule],
  controllers: [RestaurantController],
  providers: [RestaurantService]
})
export class RestaurantModule {}
