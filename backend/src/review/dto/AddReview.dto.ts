import { IsString, IsNumber } from "class-validator";

export class AddReviewDto {
    @IsNumber()
    rating: number;

    @IsString()
    restaurantId: string;

    @IsString()
    comment: string;
}

