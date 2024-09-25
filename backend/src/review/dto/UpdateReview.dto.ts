import { IsString, IsNumber } from "class-validator";

export class updateReviewDto {
    @IsString()
    comment: string;

    @IsNumber()
    rating: number; 
}