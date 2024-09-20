import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { MenuModule } from './menu/menu.module';
import { CategoryModule } from './category/category.module';
import { ConfigModule } from '@nestjs/config';
import { LocationModule } from './location/location.module';
import { CartModule } from './cart/cart.module';
import { PrismaModule } from './prisma/prisma.module';
import { PaymongoModule } from './paymongo/paymongo.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [AuthModule, UserModule, RestaurantModule, MenuModule, CategoryModule, 
    ConfigModule.forRoot({
      isGlobal: true
    }), LocationModule, CartModule, PrismaModule, PaymongoModule, OrderModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
