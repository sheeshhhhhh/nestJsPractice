import { BadRequestException, GoneException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { LocationDto } from './dto/location.dto';
import { prisma } from 'prisma/db';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, RiderStatus } from '@prisma/client';
import { RiderWithLastOrder } from './dto/Riders.dto';

@Injectable()
export class LocationService {
    constructor(
        private readonly prisma: PrismaService
    ) {}

    // utility
    async deg2rad(deg: number): Promise<number> {
        return deg * (Math.PI / 180)
    }

    async AddUserLocation(location: LocationDto, userId: string) {
        try {
            
            if(!location.latitude || !location.longitude) {
                throw new BadRequestException('latitude and longitude is required')
            }

            if(!userId) {
                throw new BadRequestException('userId is required')
            }

            const createUserLocation = await prisma.userInfo.update({
                where: {
                    userId: userId
                },
                data: {
                    latitude: location.latitude,
                    longitude: location.longitude
                }
            })

            return {
                latitude: createUserLocation.latitude,
                longitude: createUserLocation.longitude
            }
        } catch (error) {
            throw new InternalServerErrorException(" error in the addUserLocation")
        }
    }

    async getNearbyRiders(userLatitude: number, userLongitude: number, radiusKm?: number) {
        try {
            if(!radiusKm) {
                radiusKm = 5 // default
            }
            console.log(radiusKm)
            console.log(RiderStatus.Available)

            const getRiders = await this.prisma.$queryRaw<RiderWithLastOrder[]>`
                SELECT "Rider".id, "Rider".latitude, "Rider".longitude, 
                COALESCE(MAX("Order"."createdAt"), '1970-01-01') AS lastOrderTime,
                (
                    ${radiusKm} * acos(
                        cos(radians(${userLatitude})) * 
                        cos(radians("Rider".latitude)) *
                        cos(radians("Rider".longitude) - radians(${userLongitude})) +
                        sin(radians(${userLatitude})) * 
                        sin(radians("Rider".latitude))
                    )
                ) AS distance
                FROM "Rider"
                LEFT JOIN "Order" ON "Rider".id = "Order"."riderId"
                WHERE "Rider".status = 'Available'
                GROUP BY "Rider".id, "Rider".latitude, "Rider".longitude
                HAVING (
                    ${radiusKm} * acos(
                        cos(radians(${userLatitude})) * 
                        cos(radians("Rider".latitude)) *
                        cos(radians("Rider".longitude) - radians(${userLongitude})) +
                        sin(radians(${userLatitude})) * 
                        sin(radians("Rider".latitude))
                    )
                ) <= ${radiusKm}
                ORDER BY lastOrderTime ASC, distance ASC
                LIMIT 1`;

            return getRiders[0]
        } catch (error) {
            console.log(error.message)
            throw new InternalServerErrorException()
        }
    }

    async CalculateDistance(Location1: LocationDto, Location2: LocationDto) {
        if(!Location2.latitude || !Location2.longitude) {
            throw new BadRequestException('user Location is missing')
        }

        if(!Location1.latitude || !Location1.longitude) {
            throw new BadRequestException('business location is missing')
        }

        const location1 = Location1;
        const location2 = Location2;

        const R = 6371
        const dLat = await this.deg2rad(location2.latitude - location1.latitude);
        const dlon = await this.deg2rad(location2.longitude - location1.longitude);

        const deg2radLat1 = await this.deg2rad(location1.latitude)
        const deg2radLat2 = await this.deg2rad(location2.latitude)

        const a =  
            Math.sin(dLat/2) * Math.sin(dLat/2) + 
            Math.sin(dlon/2) * Math.sin(dlon/2) * 
            Math.cos(deg2radLat1) * Math.cos(deg2radLat2) 

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distanceKm = R * c;
        return distanceKm
    }

}
