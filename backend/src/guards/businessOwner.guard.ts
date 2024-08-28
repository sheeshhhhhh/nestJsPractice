import { CanActivate, ExecutionContext, GoneException, Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { prisma } from "prisma/db";
import { Observable } from "rxjs";

// this is use for verifying the owner of the restaurent and only use
// when the owner is modifying the restaurant
@Injectable()
export class isBusinessOwner implements CanActivate {
    async canActivate(
        context: ExecutionContext
    ): Promise<boolean> {

        try {
            const req = context.switchToHttp().getRequest();
            if(!req.user) {
                throw new Error("jwtAuthGuard is required to use this")
            }
            
            if(req.user.role !== 'Business') {
                return false
            }
            
            const userId = req.user.sub
            const businessId = req.params.id
            
            const getRestaurant = await prisma.restaurant.findUniqueOrThrow({
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
        } catch (error) {
            if(error instanceof Prisma.PrismaClientKnownRequestError) {
                if(error.code === 'P2025') {
                    throw new GoneException("you did not provide restaurant id")
                }
            } else {    
                throw new InternalServerErrorException("internal server error")
            }
        }
    }
}