export interface Food {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    isAvailable: boolean;
    requiredChoices: string[];
    basePrice: number;
    customNote: boolean;
    variants: Variants[];
    restaurantId: string;
    category: string;
}

interface Variants {
    label: string,
    price: number
}