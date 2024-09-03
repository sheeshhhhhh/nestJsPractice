
export enum  businessStatus {
    Open = "Open",
    Closed ="Closed"
}

export type openingHours = {
    open: string,
    closed: string
}

export type RestaurantLocation = {
    latitude: number,
    longitude: number
}

export type RestaurantInfo = {
    id: string,
    ownerId: string,
    HeaderPhoto: string
    name: string,
    address: string,
    description?: string,
    email: string,
    phoneNumber: number,
    status: businessStatus,

    cuisineType?: string,
    DeliveryRange: string,

    createdAt: Date,
    updatedAt: Date
}

export type category = {
    id: string,
    CategoryName: string,
    restaurantId?: string 
}

export type RestaurantOpeningHours = {
    closed: string,
    open: string
}

export type Restaurant = {
    openingHours: RestaurantOpeningHours
} & RestaurantInfo & RestaurantLocation 

export type FormRestaurant = {
    name: string,
    address: string,
    description?: string,
    email: string,
    phoneNumber: number,

    cuisineType?: string,
    DeliveryRange: string,
} 