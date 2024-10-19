import { Body, Controller, Get, Param, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
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

    @Post('/messageOrderCustomer/:orderId')
    async messageOrderCustomer(@Param('orderId') orderId: string, @Body() body: { message: string }, @Request() req: any) {
        return this.orderService.messageOrderForCustomer(orderId, body.message, req);
    }

    @Post('/messageOrderRider/:orderId')
    async messageOrderRider(@Param('orderId') orderId: string, @Body() body: { message: string }, @Request() req: any) {
        return this.orderService.messageOrderForRider(orderId, body.message, req);
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

    @Get('/orderMessages')
    async getOrderMessage(@Request() req: any, @Query('orderId') orderId: string) {
        return this.orderService.getOrderMessages(orderId)
    }
    
    @Get(':paymentIntendId')
    async confirmPaymentOrder(@Param('paymentIntendId') paymentIntentId: string, @Request() req: any) {
        return this.orderService.confirmPaymentOrder(paymentIntentId, req)
    }
    // get Order History // optional can be for a specific restaurant
}
