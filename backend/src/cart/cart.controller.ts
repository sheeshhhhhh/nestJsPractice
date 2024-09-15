import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { isCustomer } from '../guards/isCustomer.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CartService } from './cart.service';
import { CreateCartMenuDto } from './dto/CreateCartMenu.dto';
import { UpdateCartMenuDto } from './dto/UpdateCartMenu.Dto';

@UseGuards(JwtAuthGuard)

@Controller('cart')
export class CartController {
    constructor(private cartService: CartService) {}

    @UseGuards(isCustomer)
    @Post()
    async addCart(@Body() body: CreateCartMenuDto, @Request() req: any) {
        return this.cartService.addCart(body, req)
    }

    @Get()
    async getCurrentCart(@Request() req: any) {
        return this.cartService.getCurrentCart(req)
    }

    @Patch(':cartItemId')
    async updateCart(@Body() body: UpdateCartMenuDto, @Param('cartItemId') id: string) {
        return this.cartService.updateCart(body, id)
    }


    @Delete(':cartItemId')
    async deleteMenuCart(@Param('cartItemId') id: string) {
        return this.cartService.deleteMenuCart(id)
    }
}
