import { Body, Controller, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/createOrder.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { OrderStatusDto } from './dto/OrderStatus.dto';

@UseGuards(JwtAuthGuard)
@Controller('order')
export class OrderController {
    constructor(private orderService: OrderService) {}

    // createOrder
    @Post()
    async createOrder(@Body() body: CreateOrderDto, @Request() req: any) {
        return this.orderService.createOrder(body, req)
    }

    @Get('/currOrder/:orderId')
    async getCurrOrder(@Param('orderId') orderId: string, @Request() req: any) {
        return this.orderService.getCurrentOrder(orderId, req)
    }

    @Patch('/updateStatus/:orderId')
    async updateOrderStatus(@Param('orderId') orderId: string, @Body() body: OrderStatusDto) {
        return this.orderService.updateOrderStatus(orderId, body)
    }
    
    @Get('/getOrderContext')
    async getOrderContext(@Request() req: any) {
        return this.orderService.getOrderContext(req)
    }

    @Get(':paymentIntendId')
    async confirmPaymentOrder(@Param('paymentIntendId') paymentIntentId: string, @Request() req: any) {
        return this.orderService.confirmPaymentOrder(paymentIntentId, req)
    }
    // get Order History // optional can be for a specific restaurant
}
