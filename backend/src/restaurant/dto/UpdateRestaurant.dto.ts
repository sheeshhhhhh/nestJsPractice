import { PartialType } from "@nestjs/mapped-types";
import { createRestaurantDto } from "./CreateRestaurant.dto";

export class updateRestaurantDto extends PartialType(createRestaurantDto) {}