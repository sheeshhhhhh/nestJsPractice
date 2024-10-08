import { IsEnum, IsNumber, IsOptional, IsString} from "class-validator"
import { paymentMethod } from "../entities/paymentMethods.entities";


export class CreateOrderDto {
    @IsString()
    @IsEnum(paymentMethod)
    paymentMethod: string;

    @IsNumber()
    deliveryFee: number;

    @IsString()
    @IsOptional()
    DeliveryInstructions: string;
}