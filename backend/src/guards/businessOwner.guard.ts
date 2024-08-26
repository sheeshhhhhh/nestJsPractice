import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { prisma } from "prisma/db";
import { Observable } from "rxjs";

@Injectable()
export class isBusinessOwner implements CanActivate {
    async canActivate(
        context: ExecutionContext
    ): Promise<boolean> {

        const req = context.switchToHttp().getRequest();
        if(!req.user) {
            throw new Error("jwtAuthGuard is required to use this")
        }
        
        if(req.user.role !== 'Business') {
            return false
        }
        
        const userId = req.user.sub
        const businessId = req.params.id

        const getRestaurant = await prisma.restaurant.findFirst({
            where: {
                id: businessId
            },
            select: {
                ownerId: true
            }
        })
        
        if(!getRestaurant?.ownerId) {
            return false
        }

        if(userId !== getRestaurant.ownerId) {
            return false
        }
        
        return true  
    }
}