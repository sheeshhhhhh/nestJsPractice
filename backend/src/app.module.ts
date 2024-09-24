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

const software_Status = process.env.SOFTWARE_STATUS 

const imports = [
  AuthModule, 
  UserModule, 
  RestaurantModule, 
  MenuModule, 
  CategoryModule,
  LocationModule, 
  CartModule, 
  PrismaModule, 
  PaymongoModule, 
  OrderModule,
  ConfigModule.forRoot({
    isGlobal: true
  }), 
]

if(software_Status === 'production') {
  imports.push(ServeStaticModule.forRoot({
    rootPath: join(__dirname, '../../../', 'frontend', 'dist'),
  }))
}

@Module({
  imports: imports,
  controllers: [AppController],
  providers: [AppService, OrderGatewayGateway],
})
export class AppModule {}
