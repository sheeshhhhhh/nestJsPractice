import { PartialType } from '@nestjs/mapped-types';
import { createRestaurantDto } from 'src/restaurant/dto/CreateRestaurant.dto';

export class loginDTO {
  username: string;
  password: string;
}

export class UserCreateDto {
  username: string;
  name: string;
  password: string;
}

export class OwnerCreateDto extends UserCreateDto {
  restaurant: createRestaurantDto
}

export class UserUpdate extends PartialType(UserCreateDto) {}
