import { Injectable } from '@nestjs/common';
import { CreateCartMenuDto } from './dto/CreateCartMenu.dto';
import { UpdateCartMenuDto } from './dto/UpdateCartMenu.Dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CartService {
    constructor(private prisma: PrismaService) {}

    async addCart(body: CreateCartMenuDto, req: any) {
        const userId = req.user.sub

        let checkCart = await this.prisma.cart.findFirst({
            where: {
                userId: userId
            }
        })

        if(!checkCart) {
            checkCart = await this.prisma.cart.create({
                data: {
                    restaurantId: body.restaurantId,
                    userId: userId,
                }
            })

        } else {
            if(checkCart.restaurantId !== body.restaurantId) {
                // if different restaurant Id remove current cart and 
                // make a new one
                await this.prisma.cart.delete({
                    where: {
                        userId: userId
                    }
                })
                checkCart = await this.prisma.cart.create({
                    data: {
                        restaurantId: body.restaurantId,
                        userId: userId
                    }
                })
            }
        }

        // test if cart already exist and just add it
        // but also look if different then make a new one

        const createMenu = await this.prisma.cartItem.create({
            data: {
                cartId: checkCart.id,
                menuId: body.menuId,
                quantity: body.quantity,
                price: body.price,
                ifProductDoesnotExist: body.ifProductDoesnotExist
                // instruction: body.instruction
            },
            include: {
                menu: true
            }
        })

        return {
            ...checkCart,
            cartItems: [
                createMenu
            ]
        }
    }

    async getCurrentCart(req: any) {
        try {
            const userId = req.user.sub

            const getCart = await this.prisma.cart.findFirst({
                where: {
                    userId: userId
                },
                include: {
                    cartItems: {
                        include: {
                            menu: true
                        }
                    },
                    restaurant: {
                        select: {
                            name: true,
                            address: true,
                            HeaderPhoto: true,
                            email: true,
                            latitude: true,
                            longitude: true
                        }
                    }
                }
            })
            
            return getCart
        } catch (error) {
            console.log(error)
        }
    }

    async updateCart(body: UpdateCartMenuDto, id: string) {
        let updateCart;
        if(body.quantity == 0) {
            updateCart = await this.deleteMenuCart(id)
            return updateCart
        }

        updateCart = await this.prisma.cartItem.update({
            where: {
                id: id
            },
            data: {
                ...body
            },
            include: {
                menu: true
            }
        })
        
        return updateCart
    }

    async deleteMenuCart(id: string) {
        
        const deleteCartItem = await this.prisma.cartItem.delete({
            where: {
                id
            }
        })
        
        return deleteCartItem
    }
}
