

export class CreateMenuDto {
    name: string;
    description?: string;
    price: number;

    categoryId?: string;
    availability?: boolean;

    restaurantId: string;
}