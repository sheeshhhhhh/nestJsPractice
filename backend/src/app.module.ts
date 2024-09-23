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
import { OrderGatewayGateway } from './order-gateway/order-gateway.gateway';
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path';

@Module({
  imports: [AuthModule, UserModule, RestaurantModule, MenuModule, CategoryModule, 
    ConfigModule.forRoot({
      isGlobal: true
    }), 
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../../', 'frontend', 'dist'),
    }),
    LocationModule, CartModule, PrismaModule, PaymongoModule, OrderModule
  ],
  controllers: [AppController],
  providers: [AppService, OrderGatewayGateway],
})
export class AppModule {}
