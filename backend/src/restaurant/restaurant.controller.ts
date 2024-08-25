import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { createRestaurantDto } from './dto/CreateRestaurant.dto';
import { updateRestaurantDto } from './dto/UpdateRestaurant.dto';

@UseGuards(JwtAuthGuard)
@Controller('restaurant')
export class RestaurantController {
    constructor(private restaurantService: RestaurantService) {}

    @Get(':id')
    async getRestaurant(@Param('id') id: string, @Request() req: any) {
        return this.restaurantService.getRestaurant(req, id)
    }

    @Post() // create a dto for this later
    async createRestaurant(@Request() req: any, @Body() body: createRestaurantDto) {
        return this.restaurantService.createRestaurant(req, body)
    }

    @Delete(':id')
    async deleteRestaurant(@Param('id') id: string, @Request() req: any) {
        return this.restaurantService.deleteRestaurant(req, id)
    }

    @Patch(':id')
    async updateRestaurant(@Param('id') id: string, @Request() req: any, 
    @Body() body: updateRestaurantDto) {
        return this.restaurantService.updateRestaurant(req, id, body)
    }
}
