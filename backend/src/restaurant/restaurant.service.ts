import { Injectable, InternalServerErrorException, NotImplementedException, UnauthorizedException } from '@nestjs/common';
import { createRestaurantDto } from './dto/CreateRestaurant.dto';
import { prisma } from 'prisma/db';
import { Prisma } from '@prisma/client';
import { updateRestaurantDto } from './dto/UpdateRestaurant.dto';

@Injectable()
export class RestaurantService {
    // not tested yet
    async getRestaurant(req: any, id: string) {
        // get other info of restarant later like if following or not and 
        // also the purchase history from restaurant
        const getRestaurantInfo = await prisma.restaurant.findFirst({
            where: {
                id: id
            },
            include: {
                menus: true
            }
        })

        return getRestaurantInfo
    }

    async createRestaurant(req: any, { name, address, description, email,
    phoneNumber, latitude, longitude, openingHours, cuisineType, DeliveryRange 
    }: createRestaurantDto) {
        try {
            const userId = req.user.sub
            const DeliveriRange = DeliveryRange || "3km"
            const openinghours = openingHours || {
                "open" : "8am",
                "closed" : "9pm"
            }

            const createPrismaRestaurant = await prisma.restaurant.create({
                data: {
                    ownerId: userId,
                    name: name,
                    address: address,
                    description: description,
                    email: email,
                    phoneNumber: phoneNumber,
                    //location
                    latitude: latitude,
                    longitude: longitude,
                    openingHours: openinghours,
                    cuisineType: cuisineType || '',
                    DeliveryRange: DeliveriRange
                }
            }) 

            return createPrismaRestaurant
        } catch (error) {
            if(error instanceof Prisma.PrismaClientKnownRequestError) {
                if(error.code === 'P2002') {
                    // if user already have a restaurant
                    throw new NotImplementedException("you already have a restaurant!")
                }
            }
        }
    }

    async deleteRestaurant(req: any, id: string) {
        try {
            // if we delete restaurant does the user also need to be deleted?
            
            if(req.user.role !== 'Business') {
                throw new UnauthorizedException("only business owner can access")
            }

            const userId = req.user.sub
            const getRestaurant = await prisma.restaurant.findUnique({
                where: {
                    id: id
                },
                select: {
                    ownerId: true
                }
            })

            if(userId !== getRestaurant.ownerId) {
                throw new Error("you are not the owner of the restaurant")
            }

            const deletePrismaRestaurant = await prisma.restaurant.delete({
                where: {
                    id: id,
                    ownerId: userId
                }
            })

            return {
                success: true,
                message: "restaurant deleted"
            }
        } catch (error) {
            console.log(error)
        }
    }

    async updateRestaurant(req: any, id: string, body: updateRestaurantDto) {
        try {
            if(req.user.role !== 'Business') {
                throw new UnauthorizedException("only business owner can access")
            }
            // verifications 
            const userId = req.user.sub
            const getRestaurant = await prisma.restaurant.findUnique({
                where: {
                    id: id
                },
                select: {
                    ownerId: true
                }
            })

            if(userId !== getRestaurant.ownerId) {
                throw new Error("you are not the owner of the restaurant")
            }

            // updating the restaurant // just updating what is needed
            const updatePrismaRestaurant = await prisma.restaurant.update({
                where: {
                    id: id
                },
                data: {
                    ...body
                }
            })
            
            return {
                success: true,
                message: 'successfully changed restau info',
                newRestaurant: updatePrismaRestaurant
            }
        } catch (error) {
            console.log(error)
        }
    }
}
