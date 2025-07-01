import { GeoPoint } from "@firebase/firestore";

export interface Info {
    id: string;
    name: string;
    avatar: string;
    phone: string;
    address?: string;
    provinceAddress?: string;
    role?: string;
    location: GeoPoint;
}