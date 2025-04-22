import { firestore } from "@/lib/firebase-config";
import { Restaurant } from "@/types";
import { collection, getDocs, query, where } from "@firebase/firestore";

export const getAllRestaurants = async (category?: string | null) => {
    try {
        let q;

        if (category) {
            // Nếu có categoryId thì lọc theo
            q = query(
                collection(firestore, "restaurants"),
                where("categories", "array-contains", category)
            );
        } else {
            // Nếu không có categoryId thì lấy tất cả restaurants
            q = query(collection(firestore, "restaurants"));
        }
        const querySnapshot = await getDocs(q);

        const restaurants: Restaurant[] = [];
        querySnapshot.forEach((doc) => {
            restaurants.push({
                id: doc?.id ?? '',
                name: doc.data()?.name ?? '',
                image: doc.data()?.image ?? '',
                rating: doc.data()?.rating ?? 0,
                categories: doc.data()?.categories ?? [],
                mealTimes: doc.data()?.mealTimes ?? []
            });
        });

        return restaurants;
    } catch (error) {
        console.error("An error occured while fetching restaurants: ", error);
        return [];
    }
};