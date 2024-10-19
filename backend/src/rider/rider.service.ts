import { GoneException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { RiderStatus } from '@prisma/client';
import { LocationService } from 'src/location/location.service';
import { OrderGatewayGateway } from 'src/order-gateway/order-gateway.gateway';
import { PrismaService } from 'src/prisma/prisma.service';
import { RiderLocationDto } from './dto/RiderLocation.dto';

@Injectable()
export class RiderService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly locationService: LocationService,
        private readonly orderGateway: OrderGatewayGateway
    ) {}

    async getCurrentOrderForRiders(req: any) {
            const userId = req.user.sub

            const getRiderInfo = await this.getRiderInfo(userId)

            const getCurrentOrder = await this.prisma.order.findFirst({
                where: {
                    riderId: getRiderInfo.id
                },
                include: {
                    restaurant: {
                        select: {
                            name: true,
                            id: true,
                            address: true,
                            latitude: true,
                            longitude: true,
                        }
                    },
                    orderItems: {
                        include: {
                            menu: true
                        }
                    },
                    user: {
                        select: {
                            name: true,
                            id: true
                        }
                    }
                }
            })
            if(!getCurrentOrder) {
                throw new GoneException('No order found')
            }

            return getCurrentOrder
    }

    async getRiderInfo(userId: string) {
        try {
            
            const getRider = await this.prisma.rider.findFirst({
                where: {
                    userId: userId
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
                throw new Error('no riders found try again')
            }
            
            const updateRiderStatus = this.updateRiderStatus(nearByRiders.id, RiderStatus.OnDelivery)
            
            // socket for rider notificaiton and real time updates
            const riderSocketId = this.orderGateway.getSocketId(nearByRiders.userId)
            this.orderGateway.io.to(riderSocketId).emit('newOrder', 'new order is here')

            return nearByRiders
        } catch (error) {
            throw new InternalServerErrorException(error.message)
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

    async updateRiderLocation(userId: string, body: RiderLocationDto) {
        try {
            const updateRiderLocation = await this.prisma.rider.update({
                where: {
                    userId: userId
                },
                data: {
                    latitude: body.latitude,
                    longitude: body.longitude
                }
            })

            return "Location updated"
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }
}
