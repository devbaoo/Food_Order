export interface Review {
    id: string;
    bookingId: string;
    rating: number;
    selectedOptions: string[];
    comment: string;
    images: string[];
    userId?: string;
    createdAt: any;
}