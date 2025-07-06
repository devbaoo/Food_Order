export interface Cart {
    id: string;
    userId: string;
    cartItems: CartItem[];
    totalPrice: number;
    restaurantId: string;
}

export interface CartItem {
    name?: string;
    foodId: string;
    quantity: number;
    price: number;
}