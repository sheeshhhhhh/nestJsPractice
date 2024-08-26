import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { MenuModule } from './menu/menu.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [AuthModule, UserModule, RestaurantModule, MenuModule, CategoryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
