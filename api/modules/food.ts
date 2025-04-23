import { firestore } from "@/lib/firebase-config";
import { Food } from "@/types";
import { collection, doc, getDoc, getDocs, query, where } from "@firebase/firestore";

export const getAllFoods = async (restaurant?: string | null) => {
    try {
        let q;

        if (restaurant) {
            q = query(
                collection(firestore, "foods"),
                where("restaurant", "==", restaurant)
            );
        } else {
            q = query(collection(firestore, "foods"));
        }

        const querySnapshot = await getDocs(q);

        const foods: Food[] = [];
        querySnapshot.forEach((doc) => {
            foods.push({
                id: doc?.id ?? '',
                name: doc.data()?.name ?? '',
                image: doc.data()?.image ?? '',
                restaurant: doc.data()?.restaurant ?? '',
                price: doc.data()?.price ?? 0,
            });
        });

        return foods;
    } catch (error) {
        console.error("An error occured while fetching foods: ", error);
        return [];
    }
};

export const getFoodById = async (id: string) => {
    try {
        const docRef = doc(firestore, "foods", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            return {
                id: docSnap.id,
                name: data?.name ?? '',
                image: data?.image ?? '',
                restaurant: data?.restaurant ?? '',
                price: data?.price ?? 0,
            };
        } else {
            console.warn(`Food with id ${id} not found`);
            return null;
        }
    } catch (error) {
        console.error("Error getting food by ID:", error);
        return null;
    }
};