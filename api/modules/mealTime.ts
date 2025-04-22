import { firestore } from "@/lib/firebase-config";
import { MealTime } from "@/types";
import { collection, getDocs, orderBy, query } from "@firebase/firestore";

export const getAllMealTimes = async () => {
    try {
        const q = query(collection(firestore, "mealTimes"), orderBy("sortOrder", "asc"));
        const querySnapshot = await getDocs(q);

        const mealTimes: MealTime[] = [];
        querySnapshot.forEach((doc) => {
            mealTimes.push({
                id: doc?.id ?? '',
                name: doc.data()?.name ?? '',
                image: doc.data()?.image ?? '',
                sortOrder: doc.data()?.sortOrder ?? 0
            });
        });

        return mealTimes;
    } catch (error) {
        console.error("An error occured while fetching mealTimes: ", error);
        return [];
    }
};