import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateOrderDto } from './dto/createOrder.dto';
import { PaymongoService } from 'src/paymongo/paymongo.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderStatus, PaymentStatus, Prisma } from '@prisma/client';
import { paymentMethod as paymentMethodenum} from './entities/paymentMethods.entities';
import { OrderStatusDto } from './dto/OrderStatus.dto';
import { CreateorderTransactionDto } from './dto/createOrderTransaction.dto';
import { OrderGatewayGateway } from 'src/order-gateway/order-gateway.gateway';

@Injectable()
export class OrderService {
    constructor(
        private paymongo: PaymongoService,
        private prisma: PrismaService,
        private orderGateway: OrderGatewayGateway
    ) {}

    async getTotalPrice(userId: string) {
        try {

            const carts = await this.prisma.cart.findUnique({
                where: {
                    userId: userId
                },
                include: {
                    cartItems: true
                }
            })

            const calculateTotalPrice = carts.cartItems.reduce(
                (total, currCartItem) => (
                    currCartItem.price * currCartItem.quantity) + total, 0
            )

            return calculateTotalPrice

        } catch (error: any) {
            if(error instanceof Prisma.PrismaClientKnownRequestError) {
                if(error.code === 'P2025') {
                    throw new InternalServerErrorException('carts not found')
                }
            }
        }
    }

    async deleteCartTransaction(userId: string) {
        return this.prisma.$transaction(async txprisma => {
            const findCart = await this.prisma.cart.findFirst({
                where: {
                    userId: userId
                }
            })
            if(findCart) { 
                return await this.prisma.cart.delete({
                    where: {
                        id: findCart.id
                    }
                })
            } 
            return 
        })
    }

    async CreateOrderTransaction({ userId, deliveryFee, paymentIntendId, paymentMethod, itemPrice, totalPrice, deliveryInstructions }: CreateorderTransactionDto) {
        if(itemPrice || totalPrice) {
            // if this does not exist this can be
            itemPrice = await this.getTotalPrice(userId)
            totalPrice = itemPrice + deliveryFee
        }
        
        const newOrderTransaction =  await this.prisma.$transaction(async txprisma => {

            const getUserInfo = await txprisma.userInfo.findFirst({
                where: {
                    userId: userId
                }
            })

            if(!getUserInfo.latitude || !getUserInfo.longitude || !getUserInfo.address) {
                throw new BadRequestException('required information is missing')
            }

            const existingCart = await txprisma.cart.findFirst({
                where: {
                    userId: userId
                },
                include: {
                    cartItems: true
                }
            })

            const createOrder = await txprisma.order.create({
                data: {
                    userId: userId,
                    restaurandId: existingCart.restaurantId,
                    deliveryFee: deliveryFee,
                    totalAmount: totalPrice,
                    subTotal: itemPrice,
                    paymentMethod: paymentMethod.toString(),
                    paymentIntentId: paymentIntendId,
                    deliveryAddress: getUserInfo.address,
                    deliveryInstructions: deliveryInstructions,
                    latitude: getUserInfo.latitude,
                    longitude: getUserInfo.longitude,
                }
            })

            const orderToBeCreated = existingCart.cartItems.map((cartItem) => {
                return {
                    orderId: createOrder.id,
                    menuId: cartItem.menuId,
                    quantity: cartItem.quantity,
                    price: cartItem.price,
                }
            })

            //create CartItems
            const createOrderItems = await txprisma.orderItem.createManyAndReturn({
                data: orderToBeCreated
            })
            
            return {
                ...createOrder,
                orderItems: createOrderItems
            }
        })

        return newOrderTransaction
    }


    async createOrder({
        deliveryFee, paymentMethod, DeliveryInstructions
    }: CreateOrderDto, req: any) {

        const userId = req.user.sub;
        const itemPrice = await this.getTotalPrice(userId)
        const totalPrice = itemPrice + deliveryFee
        // if it's gcash, paymaya or card then don't make order yet let them finish paying
        if(paymentMethod === 'cash') {
            // make an order
            const newOrder = await this.CreateOrderTransaction({ 
                deliveryInstructions: DeliveryInstructions, 
                paymentMethod: paymentMethod.toString(),
                deliveryFee,
                userId, 
                itemPrice,
                totalPrice,
            })

            const deleteCart = await this.deleteCartTransaction(userId)
            
            // order being sent to the restaurant dashboard
            const restaurantSocketId = this.orderGateway.getSocketId(newOrder.restaurandId)
            this.orderGateway.io.to(restaurantSocketId).emit('updateOrders', {
                id: newOrder.id,
                userId: newOrder.userId,
                restaurantId: newOrder.restaurandId,
                status: newOrder.status,
                totalAmount: newOrder.totalAmount,
                subTotal: newOrder.subTotal,
                deliveryFee: newOrder.deliveryFee,
                paymentMethod: newOrder.paymentMethod,
                paymentStatus: newOrder.paymentStatus,
                paymentIntentId: newOrder.paymentIntentId || undefined,
                deliveryAddress: newOrder.deliveryAddress,
                latitude: newOrder.latitude,
                longitude: newOrder.longitude,
                deliveryTime: newOrder.deliveryTime,
                deliveryInstructions: newOrder.deliveryInstructions,
                createdAt: newOrder.createdAt
            })

            return {
                success: true,
                paymentMethod: 'cash',
                data: newOrder
            }
        } else {
            const newPaymentIntent = await this.paymongo.createPaymentIntent(totalPrice)
            const newPaymentMethod = await this.paymongo.createPaymentMethod(paymentMethod)
            const createPayment = await this.paymongo.attachPaymentIntent(newPaymentIntent.id, newPaymentMethod.id, newPaymentIntent?.attributes?.client_key)

            // creating an order
            const newOrderTransaction = await this.CreateOrderTransaction({ 
                deliveryInstructions: DeliveryInstructions, 
                paymentIntendId: newPaymentIntent.id,
                paymentMethod: paymentMethod.toString(),
                deliveryFee,
                userId, 
                itemPrice,
                totalPrice,
            })
            
            if(!newOrderTransaction) {
                throw new InternalServerErrorException('failed to create order')
            }
            // send order receipt in the email

            return {
                success: true,
                paymentMethod: paymentMethod,
                redirectPayment: createPayment.attributes.next_action.redirect.url,
            }
        }
    }

    async confirmPaymentOrder(paymentIntentId: string, req: any) {
        try {
            const retreivePayment = await this.paymongo.retrievePaymentIntent(paymentIntentId)
            const paymentStatus = retreivePayment.attributes.status
            const userId = req.user.sub

            if(paymentStatus === 'succeeded') {
                // add to dashboard of the restaurant
                const updateOrderPayment = await this.prisma.order.update({
                    where: {
                        paymentIntentId: retreivePayment.id
                    },
                    data: {
                        paymentStatus: PaymentStatus.Paid
                    }
                })

                if(!updateOrderPayment) {
                    throw new InternalServerErrorException('successfully payed but failed to update order please call support')
                }

                // socket
                const restaurantSocketId = this.orderGateway.getSocketId(updateOrderPayment.restaurandId)
                this.orderGateway.io.to(restaurantSocketId).emit('updateOrders', {
                    id: updateOrderPayment.id,
                    userId: updateOrderPayment.userId,
                    restaurantId: updateOrderPayment.restaurandId,
                    status: updateOrderPayment.status,
                    totalAmount: updateOrderPayment.totalAmount,
                    subTotal: updateOrderPayment.subTotal,
                    deliveryFee: updateOrderPayment.deliveryFee,
                    paymentMethod: updateOrderPayment.paymentMethod,
                    paymentStatus: updateOrderPayment.paymentStatus,
                    paymentIntentId: updateOrderPayment.paymentIntentId || undefined,
                    deliveryAddress: updateOrderPayment.deliveryAddress,
                    latitude: updateOrderPayment.latitude,
                    longitude: updateOrderPayment.longitude,
                    deliveryTime: updateOrderPayment.deliveryTime,
                    deliveryInstructions: updateOrderPayment.deliveryInstructions,
                    createdAt: updateOrderPayment.createdAt
                })

                // deleting a cart
                const deleteCartTransaction = await this.deleteCartTransaction(userId)

                // give the order to the rider here because the payment is confirm

                if(!deleteCartTransaction) throw new Error('failed to deleteCart please call support to help you!') 

                return {
                    success: true,
                    message: 'Payment success',
                    data: updateOrderPayment,
                    redirectUrl: undefined
                }

            } else {

                return {
                    success: false,
                    message: 'order is not yet paid',
                    redirectUrl: process.env.CLIENT_BASE_URL + '/'
                }

            }
        } catch (error) {
            throw new InternalServerErrorException('have an internal server error please call the support')
        }
    }

    async getCurrentOrder(orderId: string, req: any) {
        try {
            const userId = req.user.sub;

            // make sure to get user rider location // if there are already models for that            
            const getOrder = await this.prisma.order.findFirstOrThrow({
                where: {
                    AND: [
                        {id: orderId},
                        {userId: userId},
                        {status: {
                            not: OrderStatus.Delivered
                        }}
                    ]
                },
                include: {
                    restaurant: {
                        select: {
                            name: true,
                            id: true
                        }
                    },
                    orderItems: {
                        select: {
                            quantity: true,
                            price: true,
                            menu: {
                                select: {
                                    name: true,   
                                }
                            }
                        }
                    }
                }
            })

            return getOrder
        } catch (error) {
            if(error instanceof Prisma.PrismaClientKnownRequestError) {
                if(error.code === 'P2025') { // don'y evenn know if this is useful
                    throw new BadRequestException("order does not exist")
                }
            } 
            throw new InternalServerErrorException()
        }
    }
    
    // should only be avaiable for restaurants and riders
    async updateOrderStatus(orderId: string, { orderStatus }: OrderStatusDto) {
        try {
            
            const updateStatus = await this.prisma.order.update({
                where: {
                    id: orderId
                },
                data: {
                    status: orderStatus
                },
                select: {
                    status: true
                }
            })

            return {
                success: true,
                updateStatus: updateStatus.status
            }
        } catch (error) {
            if(error instanceof Prisma.PrismaClientKnownRequestError) {
                if(error.code === 'P2025') {
                    throw new BadRequestException('order not found')
                } else {
                    throw new InternalServerErrorException('failed to update order status')
                }
            } 
            throw new InternalServerErrorException('failed to update order status')
        }
    }

}   
