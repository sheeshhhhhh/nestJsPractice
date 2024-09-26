import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { ReviewService } from './review.service';
import { AddReviewDto } from './dto/AddReview.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { updateReviewDto } from './dto/UpdateReview.dto';

@UseGuards(JwtAuthGuard)
@Controller('review')
export class ReviewController {
    constructor(
        private readonly reviewService: ReviewService,
    ) {}

    // also add in getreiews

    @Get(':reviewId')
    async GetReview(@Param('reviewId') reviewId: string) {
        return this.reviewService.getReviewById(reviewId)
    }    

    @Post()
    async AddReview(@Body() body: AddReviewDto, @Request() req: any) {
        return this.reviewService.addReview(body, req)
    }

    // restaurantId and userId is the basis here 
    // because the user can only have one review per restaurant
    @Patch(':reviewId')
    async UpdateReview(@Param('reviewId') reviewId: string, @Body() body: updateReviewDto, @Request() req: any) { 
        return this.reviewService.updateReview(reviewId, body, req)
    }

    @Delete(':reviewId')
    async DeleteReview(@Param('reviewId') reviewId: string, @Request() req: any) {
        return this.reviewService.deleteReview(reviewId, req)
    }    
}
