

export class CreateorderTransactionDto {
    userId: string;
    deliveryFee: number;
    itemPrice?: number;
    totalPrice?: number;
    paymentMethod: string;
    paymentIntendId?: string;
    deliveryInstructions?: string;
}