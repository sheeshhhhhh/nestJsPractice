import { Injectable, InternalServerErrorException, NotAcceptableException, NotImplementedException, UnauthorizedException } from '@nestjs/common';
import { Prisma, Restaurant } from '@prisma/client';
import { prisma } from 'prisma/db';
import { createRestaurantDto } from './dto/CreateRestaurant.dto';
import { updateRestaurantDto } from './dto/UpdateRestaurant.dto';
import { LocationService } from 'src/location/location.service';
import { truncateByDomain } from 'recharts/types/util/ChartUtils';

@Injectable()
export class RestaurantService {
    constructor(private locationService: LocationService) {}

    //util
    serializephoneNumber(body: any, phoneNumber: bigint) {
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
        const userId = req.user.sub
        const getRestaurantInfo = await prisma.restaurant.findFirst({
            where: {
                id: id
            },
            include: {
                categories: {
                    include: {
                        menu: {
                            where: {
                                availability: true
                            }
                        }
                    }
                }
            }
        })
        // if owner is asking for it to edit most likely
        if(userId === getRestaurantInfo.ownerId) {
            return this.serializephoneNumber(getRestaurantInfo, getRestaurantInfo.phoneNumber)
        }

        const getUserLocation = await prisma.userInfo.findFirst({
            where: {
                userId: userId  
            },
            select: {
                latitude: true,
                longitude: true
            }
        })
    
        // get distance from his location
        const distanceOfRestaurant = 
        await this.locationService.CalculateDistance({
            latitude: getRestaurantInfo.latitude,
            longitude: getRestaurantInfo.longitude
        }, {
            latitude: getUserLocation.latitude,
            longitude: getUserLocation.longitude
        })


        return this.serializephoneNumber({
            ...getRestaurantInfo,
            restaurantDistance: distanceOfRestaurant
        }, getRestaurantInfo.phoneNumber)
    }

    async createRestaurant(req: any, { name, address, description, email,
    phoneNumber, latitude, longitude, openingHours, cuisineType, DeliveryRange 
    }: createRestaurantDto, file: Express.Multer.File) {
        try {
            if(req.user.role !== 'Business') {
                console.log('is not business owner')
                throw new UnauthorizedException("only business owner can create restaurant")
            }

            const userId = req.user.sub
            const DeliveriRange = DeliveryRange || "3km"
            const headerPhotoFile = process.env.BASE_URL + '/HeaderPhoto/' + file.filename
            const openinghours = openingHours || {
                open : "8am",
                closed : "9pm"
            } as Prisma.JsonObject

            const createPrismaRestaurant = await prisma.restaurant.create({
                data: {
                    ownerId: userId,
                    name: name,
                    address: address,
                    HeaderPhoto: headerPhotoFile,
                    description: description,
                    email: email,
                    phoneNumber: Number(phoneNumber) || 8312313254,
                    //location
                    latitude: parseFloat(latitude),
                    longitude: parseFloat(longitude),
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

    async updateRestaurant(req: any, id: string, {
        name, description, email, phoneNumber, latitude, longitude,
        openingHours,cuisineType, DeliveryRange, address
    }: updateRestaurantDto, file: Express.Multer.File) {
        try {
            const userId = req.user.sub
            
            if(!phoneNumber || !latitude || !longitude) {
                throw new NotAcceptableException("something required is missing")
            }

            const phonenumber = parseInt(phoneNumber)
            const updatedLatitude =parseFloat(latitude)
            const updatedLongitude = parseFloat(longitude)

            //handling change of Headerphoto
            let headerPhoto; 
            if(file) {
                headerPhoto = file.filename ? {
                    HeaderPhoto: process.env.BASE_URL + '/HeaderPhoto/' + file.filename
                } : {}
            }

            const updatePrismaRestaurant = await prisma.restaurant.update({
                where: {
                    id: id
                },
                data: {
                    name,
                    description: description || '',
                    email,
                    address,
                    ...headerPhoto,
                    phoneNumber: phonenumber,
                    latitude: updatedLatitude,
                    longitude: updatedLongitude,
                    openingHours: openingHours,
                    cuisineType,
                    DeliveryRange
                }
            })
            
            return {
                success: true,
                message: 'successfully changed restau info',
                newRestaurant: this.serializephoneNumber(updatePrismaRestaurant, updatePrismaRestaurant.phoneNumber)
            }   
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }
}
