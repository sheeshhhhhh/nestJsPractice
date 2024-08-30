import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { createRestaurantDto } from './dto/CreateRestaurant.dto';
import { updateRestaurantDto } from './dto/UpdateRestaurant.dto';
import { MenuService } from 'src/menu/menu.service';
import { isBusinessOwner } from 'src/guards/businessOwner.guard';
import { UpdateMenuDto } from 'src/menu/dto/UpdateMenu.dtio';
import { CreateMenuDto } from 'src/menu/dto/CreateMenu.dto';

@UseGuards(JwtAuthGuard)
@Controller('restaurant')
export class RestaurantController {
    constructor(
        private restaurantService: RestaurantService,
    ) {}

    @Get('GetManyRestaurants')
    async getManyRestaurant(@Query('search') search: string) {
        return this.restaurantService.getManyRestaurant(search)
    }
    // about restaurant
    @Get(':id')
    async getRestaurant(@Param('id') id: string, @Request() req: any) {
        return this.restaurantService.getRestaurant(req, id)
    }

    @Post()
    async createRestaurant(@Request() req: any, @Body() body: createRestaurantDto) {
        return this.restaurantService.createRestaurant(req, body)
    }

    @UseGuards(isBusinessOwner)
    @Delete(':id')
    async deleteRestaurant(@Param('id') id: string, @Request() req: any) {
        return this.restaurantService.deleteRestaurant(req, id)
    }

    @UseGuards(isBusinessOwner)
    @Patch(':id')
    async updateRestaurant(@Param('id') id: string, @Request() req: any, 
    @Body() body: updateRestaurantDto) {
        return this.restaurantService.updateRestaurant(req, id, body)
    }
}
