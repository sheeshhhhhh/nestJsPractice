import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateOrderDto } from './dto/createOrder.dto';
import { PaymongoService } from 'src/paymongo/paymongo.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaymentStatus, Prisma } from '@prisma/client';
import { paymentMethod as paymentMethodenum} from './entities/paymentMethods.entities';

@Injectable()
export class OrderService {
    constructor(
        private paymongo: PaymongoService,
        private prisma: PrismaService
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

    async createOrder({
        deliveryFee, paymentMethod, DeliveryInstructions
    }: CreateOrderDto, req: any) {
        const userId = req.user.sub;
        const itemPrice = await this.getTotalPrice(userId)
        const totalPrice = itemPrice + deliveryFee

        // if it's gcash, paymaya or card then don't make order yet let them finish paying
        // if it's cash then just make sure to take paymentstaus as notPaid
        if(paymentMethod === paymentMethodenum.cash) {
            // make an order
        } else {
            const newPaymentIntent = await this.paymongo.createPaymentIntent(totalPrice)
            const newPaymentMethod = await this.paymongo.createPaymentMethod(paymentMethod)
            const createPayment = await this.paymongo.attachPaymentIntent(newPaymentIntent.id, newPaymentMethod.id, newPaymentIntent?.attributes?.client_key)
            // creating an order
            const createOrderTransaction = await this.prisma.$transaction(async txprisma => {

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
                        totalAmount: totalPrice,
                        paymentMethod: paymentMethod.toString(),
                        paymentIntentId: newPaymentIntent.id,
                        deliveryAddress: getUserInfo.address,
                        latitude: getUserInfo.latitude,
                        longitude: getUserInfo.longitude
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
                // delete in the database later the cart and cartitems
            })
            
            if(!createOrderTransaction) {
                throw new InternalServerErrorException('failed to create order')
            }

            return {
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

                // deleting a cart
                const deleteCartTransaction = await this.prisma.$transaction(async txprisma => {
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

}   
