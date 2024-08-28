

export class CreateMenuDto {
    name: string;
    description?: string;
    price: number;

    category?: string;
    availability?: boolean;

    restaurantId: string;
}