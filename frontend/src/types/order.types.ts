import { MenuInfo } from "./menu.types";
import { Restaurant } from "./restaurant.types";

enum OrderStatus {
    Processing,
    Delivered
}

enum PaymentStatus {
    NotPaid,
    Paid
}

export type OrderItem = {
    id: string;
    orderId: string;
    menuId: string;
    quantity: number;
    price: number;
    menu: MenuInfo;
};

export type OrderInfo = {
    id: string;
    userId: string;
    restaurantId: string;
    status: OrderStatus;
    createdAt: Date;
};

export type OrderPaymentInfo = {
    totalAmount: number; // sum of sub total and delivery Fee and tax(if there are any)
    subTotal: number; // total price of items
    deliveryFee: number; 
    paymentMethod: string;
    paymentStatus: PaymentStatus;
    paymentIntentId?: string;
}

export type OrderDeliveryInfo = {
    deliveryAddress: string;
    latitude: number;
    longtitude: number;
    deliveryTime?: string;
    deliveryInstructions?: string;
};

type User = { 
    user: any; // Attach user type when it's created 
}; 

type RestaurantInfo = { 
    restaurant: Restaurant; 
};

export type Order = {
    orderItems: OrderItem[];
} & OrderInfo & OrderDeliveryInfo & OrderPaymentInfo & Partial<User> & Partial<RestaurantInfo>;

export type OrderBasicInformation = {} & OrderInfo & OrderPaymentInfo & OrderDeliveryInfo;

