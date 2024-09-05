import { Module } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { CategoryModule } from 'src/category/category.module';

@Module({
  providers: [MenuService],
  controllers: [MenuController]
})
export class MenuModule {}
