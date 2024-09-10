import { IsString, IsNumberString, IsOptional, IsBooleanString } from "class-validator";

export class CreateMenuDto {
    @IsString()
    name: string;

    @IsString()
    @IsOptional()
    description?: string;
    
    @IsNumberString()
    price: string;

    @IsString()
    categoryId?: string;
    
    @IsBooleanString()
    availability?: string;

    @IsString()
    restaurantId: string;
}