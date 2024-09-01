

export class createRestaurantDto {
    name: string;
    address: string;
    description?: string;
    email: string;
    phoneNumber: string; // supposed to be number
    latitude?: string; // supposed to be number
    longitude?: string;
    openingHours: any;

    cuisineType?: string;
    DeliveryRange: string;
}