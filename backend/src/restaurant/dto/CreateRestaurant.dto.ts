

export class createRestaurantDto {
    name: string;
    address: string;
    description?: string;
    email: string;
    phoneNumber: number;
    latitude?: number;
    longitude?: number;
    openingHours: any;

    cuisineType?: string;
    DeliveryRange: string;

}