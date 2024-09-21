import { OrderStatus } from "@prisma/client";
import { IsEnum } from "class-validator";


export class OrderStatusDto {
    @IsEnum(OrderStatus)
    orderStatus: OrderStatus
}