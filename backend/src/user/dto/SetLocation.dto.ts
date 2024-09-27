import { IsString, IsNumber, IsNotEmpty } from "class-validator";

export class SetLocationDto {
    @IsNumber()
    latitude: number;
    
    @IsNumber()
    longitude: number;

    @IsString()
    address: string;
}