import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateCartMenuDto {

    @IsString()
    @IsOptional()
    instruction?: string;

    @IsString()
    ifProductDoesnotExist: string;
    
    @IsString()
    menuId: string;
    
    @IsString()
    restaurantId: string;
    
    @IsNumber()
    quantity: number;

    @IsNumber()
    price: number;
}