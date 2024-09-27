import { GoneException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { RiderStatus } from '@prisma/client';
import { LocationService } from 'src/location/location.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RiderService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly locationService: LocationService
    ) {}

    async getRiderInfo(riderId: string) {
        try {
            
            const getRider = await this.prisma.rider.findFirst({
                where: {
                    id: riderId
                },
                include: {
                    user: true
                }
            })

            return getRider
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }

    async assignRider(latitude: number, longitude: number) {
        try {
            
            const nearByRiders = await this.locationService.getNearbyRiders(latitude, longitude)

            // DO LATER!!!!
            // handle this so that the order will wait
            if(!nearByRiders) {
                throw new GoneException('no riders found try again')
            }

            const updateRiderStatus = this.updateRiderStatus(nearByRiders.id, RiderStatus.OnDelivery)

            return nearByRiders
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }

    async updateRiderStatus(riderId: string, status: RiderStatus) {
        try {
            
            const updateStatusRider = await this.prisma.rider.update({
                where: {
                    id: riderId
                },
                data: {
                    status: status
                }
            })

            return updateStatusRider
        } catch (error) {
            console.log(error)
            throw new InternalServerErrorException()
        }
    }
}
