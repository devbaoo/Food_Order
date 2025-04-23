export interface Cart {
    id: string;
    userId: string;
    cartItems: CartItem[];
    totalPrice: number;
}

export interface CartItem {
    foodId: string;
    quantity: number;
    price: number;
}