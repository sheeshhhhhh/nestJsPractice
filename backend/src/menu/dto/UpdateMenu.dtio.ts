import { PartialType } from "@nestjs/mapped-types";
import { CreateMenuDto } from "./CreateMenu.dto";

export class UpdateMenuDto {
        name: string;
        description?: string;
        price: number;
    
        availability: boolean;
    
        restaurantId: string;
}