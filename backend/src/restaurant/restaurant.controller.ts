import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request, Search, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { createRestaurantDto } from './dto/CreateRestaurant.dto';
import { updateRestaurantDto } from './dto/UpdateRestaurant.dto';
import { MenuService } from 'src/menu/menu.service';
import { isBusinessOwner } from 'src/guards/businessOwner.guard';
import { UpdateMenuDto } from 'src/menu/dto/UpdateMenu.dtio';
import { CreateMenuDto } from 'src/menu/dto/CreateMenu.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import diskMulterStorage from 'src/util/discMulterStorage';

@UseGuards(JwtAuthGuard)
@Controller('restaurant')
export class RestaurantController {
    constructor(
        private restaurantService: RestaurantService,
    ) {}

    @Get('GetManyRestaurants')
    async getManyRestaurant(@Query('search') search: string) {
        return this.restaurantService.getManyRestaurant(search || '')
    }

    @Get('getOrders')
    async getOrders(@Request() req: any, @Query('search') search: string) {
        return this.restaurantService.getOrders(req, search)
    }

    @Get('getOrderDetail/:orderId')
    async getOrderDetail(@Param('orderId') orderId: string, @Request() req: any) {
        return this.restaurantService.getOrderDetail(req, orderId)
    }
    // about restaurant
    @Get(':id')
    async getRestaurant(@Param('id') id: string, @Request() req: any) {
        return this.restaurantService.getRestaurant(req, id)
    }

    @Post() // later on add Header photo for restaurants // nest js multer
    @UseInterceptors(
        FileInterceptor('HeaderPhoto', {
            storage: diskMulterStorage('uploads/RestaurantHeaderPhoto')
        })
    )
    async createRestaurant(@Request() req: any, @Body() body: createRestaurantDto,
    @UploadedFile() file: Express.Multer.File) {
        return this.restaurantService.createRestaurant(req, body, file)
    }

    @UseGuards(isBusinessOwner)
    @Delete(':id')
    async deleteRestaurant(@Param('id') id: string, @Request() req: any) {
        return this.restaurantService.deleteRestaurant(req, id)
    }

    @UseGuards(isBusinessOwner)
    @Patch(':id')
    @UseInterceptors(
        FileInterceptor('HeaderPhoto', {
            storage: diskMulterStorage('uploads/RestaurantHeaderPhoto')
        })
    )
    async updateRestaurant(@Param('id') id: string, @Request() req: any, 
    @Body() body: updateRestaurantDto, @UploadedFile() file: Express.Multer.File) {
        body = {
            ...body,
            openingHours: JSON.parse(body.openingHours)
        }
        return this.restaurantService.updateRestaurant(req, id, body, file)
    }
}
