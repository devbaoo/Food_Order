import { GeoPoint } from "@firebase/firestore";
import { Category } from "./category";

export interface Restaurant {
    id: string;
    name: string;
    imageUrl: string;
    rating: number;
    ratingCount: number;
    categories?: Category[];
    address: string;
    favourite: boolean;
    location: GeoPoint;
}