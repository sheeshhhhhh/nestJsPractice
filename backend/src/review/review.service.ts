import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddReviewDto } from './dto/AddReview.dto';
import { updateReviewDto } from './dto/UpdateReview.dto';


@Injectable()
export class ReviewService {
    constructor(
        private readonly prisma: PrismaService,
    ) {}
    
    
    async getReviews(restaurantId: string) {
        try {
            
            // put automatic pagination in the frontned then handle this later
            const getrReviews = await this.prisma.review.findMany({
                where: {
                    restaurantId: restaurantId
                }
            })

            return getrReviews
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }

    async getReviewById(id: string) {
        try {
            // find out if he's the author
            
            const getReview = await this.prisma.review.findUniqueOrThrow({
                where: {
                    id: id
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            userInfo: {
                                select: {
                                    profile: true
                                }
                            }
                        }
                    }
                }
            }) 
            
            return getReview
        } catch (error) {
            if(error instanceof Prisma.PrismaClientKnownRequestError) {
                if(error.code === 'P2025') {
                    throw new NotFoundException('Review not found')
                }
            }
            throw new InternalServerErrorException()
        }
    }

    async addReview(body: AddReviewDto, req: any) {
        try {
            const userId = req.user.sub;
            
            const addReview = await this.prisma.review.create({
                data: {
                    rating: body.rating,
                    comment: body.comment,
                    restaurantId: body.restaurantId,
                    userId: userId
                }
            })

            return addReview                
        } catch (error) {
            if(error instanceof Prisma.PrismaClientKnownRequestError) {
                if(error.code === 'P2002') {
                    throw new NotFoundException('Restaurant not found')
                }
            }    
            throw new InternalServerErrorException()
        }
    }    

    async updateReview(reviewId: string, body: updateReviewDto, req: any) {
        try {
            const userId = req.user.sub;

            const updateReview = await this.prisma.review.update({
                where: {
                    userId_id: {
                        userId: userId,
                        id: reviewId
                    }
                },
                data: {
                    ...body
                }
            })

            return updateReview
        } catch (error) {
            if(error instanceof Prisma.PrismaClientKnownRequestError) {
                if(error.code === 'P2025') {
                    throw new NotFoundException('Review not found')
                }
            }    
            throw new InternalServerErrorException()
        }
    }

    async deleteReview(id: string, req: any) {
        try {
            const userId = req.user.sub;

            const deleteReview = await this.prisma.review.delete({
                where: {
                    userId_id: {
                        userId: userId,
                        id: id
                    }
                }
            })

            return deleteReview
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }
}
