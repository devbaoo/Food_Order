import { Timestamp } from "@firebase/firestore";

export interface Commission {
    bookingId: string;
    restaurantId: string;
    amount: number;
    createdAt: Timestamp;
}