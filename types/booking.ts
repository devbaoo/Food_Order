import { CartItem } from "./cart";

export interface Booking {
    id: string;
    userId: string;
    restaurantId: string;
    items: CartItem[];
    totalPrice: number;
    status: 'Pending' | 'Processing' | 'Shipping' | 'Delivered' | 'Cancelled';
    createdAt: string;
    restaurantName?: string | null;
    customer?: Customer;
};

interface Customer {
    name: string;
    phone: string;
    email: string;
    address: string;
}