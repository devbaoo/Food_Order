import { CartItem } from "./cart";

export interface Booking {
    id: string;
    userId: string;
    restaurantId: string;
    items: CartItem[];
    totalPrice: number;
    status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
    createdAt: string;
    restaurantName?: string | null;
};