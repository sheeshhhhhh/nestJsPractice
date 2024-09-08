import { BadRequestException, GoneException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { LocationDto } from './dto/location.dto';
import { prisma } from 'prisma/db';

@Injectable()
export class LocationService {

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

    async CalculateDistance(businessLocation: LocationDto, userLocation: LocationDto) {
        if(!userLocation.latitude || !userLocation.longitude) {
            throw new BadRequestException('user Location is missing')
        }

        if(!businessLocation.latitude || !userLocation.longitude) {
            throw new BadRequestException('business locaiton is missing')
        }

        const location1 = businessLocation;
        const location2 = userLocation;

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
