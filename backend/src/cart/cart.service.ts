import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartMenuDto } from './dto/CreateCartMenu.dto';
import { UpdateCartMenuDto } from './dto/UpdateCartMenu.Dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CartService {
    constructor(private prisma: PrismaService) {}

    async getCartItem(cartItemId: string) {

        if(!cartItemId) {
            throw new BadRequestException('cartItemId is empty')
        }

        const getcartItem = await this.prisma.cartItem.findFirst({
            where: {
                id: cartItemId
            },
            include: {
                menu: true
            }
        })
        
        if (!getcartItem) {
            throw new NotFoundException('Cart item not found');
        }    

        return getcartItem
    }

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

        // find if the cartItem being added already exist 
        // if instrunction and ifProductDoesnotExist the same then just add into quantity
        
        ///finding if same cart and order menu
        const createCartItem = await this.prisma.$transaction(async txprisma => {
            const existingCartItem = await this.prisma.cartItem.findFirst({
                where: {
                    AND: [
                        {menuId: body.menuId},
                        {cartId: checkCart.id},
                        {instruction: body.instruction},
                        {ifProductDoesnotExist: body.ifProductDoesnotExist}
                    ]
                }
            })
    
            // if all the three condition is the same then just update the quantity of the existing 
            // cartItem
            if(existingCartItem) {

                return await this.prisma.cartItem.update({
                    where: {
                        id: existingCartItem.id
                    },
                    data: {
                        quantity: {
                            increment: body.quantity // just adding this quantity
                        }
                    },
                    include: {
                        menu: true
                    }
                })

            } else {
                return await this.prisma.cartItem.create({
                    data: {
                        cartId: checkCart.id,
                        menuId: body.menuId,
                        quantity: body.quantity,
                        price: body.price,
                        ifProductDoesnotExist: body.ifProductDoesnotExist,
                        instruction: body.instruction 
                    },
                    include: {
                        menu: true
                    }
                })
            }
        })

        return {
            ...checkCart,
            cartItems: [
                createCartItem
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
