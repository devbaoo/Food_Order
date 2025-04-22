import { firestore } from "@/lib/firebase-config";
import { Category } from "@/types";
import { collection, getDocs, query, where } from "@firebase/firestore";

export const getAllCategories = async (time?: string | null) => {
    try {
        let q;

        if (time) {
            // Nếu có mealTimeId thì lọc theo
            console.log(time);
            q = query(
                collection(firestore, "categories"),
                where("mealTimes", "array-contains", time)
            );
        } else {
            // Nếu không có mealTimeId thì lấy tất cả categories
            q = query(collection(firestore, "categories"));
        }

        const querySnapshot = await getDocs(q);

        const categories: Category[] = [];
        querySnapshot.forEach((doc) => {
            categories.push({
                id: doc?.id ?? '',
                name: doc.data()?.name ?? '',
                image: doc.data()?.image ?? '',
                mealTimes: doc.data()?.mealTimes ?? []
            });
        });

        return categories;
    } catch (error) {
        console.error("An error occured while fetching categories: ", error);
        return [];
    }
};