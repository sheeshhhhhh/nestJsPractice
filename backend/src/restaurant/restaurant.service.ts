import { Injectable, InternalServerErrorException, NotImplementedException, UnauthorizedException } from '@nestjs/common';
import { createRestaurantDto } from './dto/CreateRestaurant.dto';
import { prisma } from 'prisma/db';
import { Prisma, Restaurant } from '@prisma/client';
import { updateRestaurantDto } from './dto/UpdateRestaurant.dto';

@Injectable()
export class RestaurantService {

    //util
    serializephoneNumber(body: Restaurant, phoneNumber: bigint) {
        return {
            ...body,
            phoneNumber: Number(phoneNumber)
        }
    }

    async getManyRestaurant(search?: string) {
        try {
            const query: Prisma.RestaurantFindManyArgs = {
                take: 12,
            };
            
            if(search) { // for handling search and when there is no search because // it bugs
                // when not done this way
                query.where = {
                    name: {
                        contains: search,
                        mode: Prisma.QueryMode.insensitive,
                    },
                }
    
            }

            const restaurants = await prisma.restaurant.findMany({
                ...query,
                take: 12
            })
            
            const Restaurants = restaurants?.map((item) => ({
                ...item,
                phoneNumber: Number(item.phoneNumber)
            })) || []

            return Restaurants
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }

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

        return this.serializephoneNumber(getRestaurantInfo, getRestaurantInfo.phoneNumber)
    }

    async createRestaurant(req: any, { name, address, description, email,
    phoneNumber, latitude, longitude, openingHours, cuisineType, DeliveryRange 
    }: createRestaurantDto) {
        try {
            if(req.user.role !== 'Business') {
                console.log('is not business owner')
                throw new UnauthorizedException("only business owner can create restaurant")
            }

            const userId = req.user.sub
            const DeliveriRange = DeliveryRange || "3km"
            const openinghours = openingHours || {
                open : "8am",
                closed : "9pm"
            } as Prisma.JsonObject

            const createPrismaRestaurant = await prisma.restaurant.create({
                data: {
                    ownerId: userId,
                    name: name,
                    address: address,
                    description: description,
                    email: email,
                    phoneNumber: phoneNumber || 8312313254,
                    //location
                    latitude: latitude,
                    longitude: longitude,
                    // delivery info
                    openingHours: openinghours,
                    cuisineType: cuisineType || '',
                    DeliveryRange: DeliveriRange
                }
            }) 


            return {
                success: true,
                message: "successfully created restaurant",
                newRestaurant: this.serializephoneNumber(createPrismaRestaurant, createPrismaRestaurant.phoneNumber)
            }
        } catch (error) {
            console.log(error)
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
            const userId = req.user.sub

            // only one exist as to why i can use both without AND operator but always be careful when
            // doing this
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
            const userId = req.user.sub

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
                newRestaurant: this.serializephoneNumber(updatePrismaRestaurant, updatePrismaRestaurant.phoneNumber)
            }   
        } catch (error) {
            console.log(error)
        }
    }
}
