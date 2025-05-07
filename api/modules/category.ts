import { firestore } from "@/lib/firebase-config";
import { Category } from "@/types";
import { collection, doc, getDoc, getDocs, query, where } from "@firebase/firestore";

export const getAllCategories = async (time?: string | null) => {
    try {
        let q;

        if (time) {
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
                mealTimes: doc.data()?.mealTimes ?? [],
                tags: doc.data()?.tags ?? [],
                genders: doc.data()?.genders ?? []
            });
        });

        return categories;
    } catch (error) {
        console.error("An error occured while fetching categories: ", error);
        return [];
    }
};

export const getCategoriesByIds = async (ids: string[]): Promise<Category[]> => {
    try {
        const q = query(
            collection(firestore, "categories"),
            where('__name__', 'in', ids)
        );

        const querySnapshot = await getDocs(q);
        const categories = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
        return categories ?? [];
    } catch (error) {
        console.error("An error occured while fetching categories: ", error);
        return [];
    }
}

export async function getRecommendationByUserId(userId: string) {
    try {
        const recoDocRef = doc(firestore, "user_recommendations", userId);
        const recoDocSnap = await getDoc(recoDocRef);

        if (recoDocSnap.exists()) {
            const recommendation = recoDocSnap.data();
            return recommendation.recommendations; // Hoặc return nguyên recommendation nếu muốn
        } else {
            return null; // Không có recommendation cho user này
        }
    } catch (error) {
        console.error('Failed to fetch recommendation:', error);
        throw error;
    }
}