import { firestore } from "@/lib/firebase-config";
import { Food } from "@/types";
import { addDoc, collection, deleteDoc, doc, GeoPoint, getDoc, getDocs, query, setDoc, where } from "@firebase/firestore";

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
        // querySnapshot.forEach((doc) => {
        //     foods.push({
        //         id: doc?.id ?? '',
        //         name: doc.data()?.name ?? '',
        //         image: doc.data()?.image ?? '',
        //         restaurant: doc.data()?.restaurant ?? '',
        //         price: doc.data()?.price ?? 0,
        //     });
        // });

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
                description: data?.description ?? '',
                imageUrl: data?.imageUrl ?? '',
                isAvailable: data?.isAvailable ?? false,
                requiredChoices: data?.requiredChoices ?? [],
                basePrice: data?.basePrice ?? 0,
                customNote: data?.customNote ?? "",
                variants: data?.variants ?? [],
                restaurantId: data?.restaurantId ?? ""
            } as Food;
        } else {
            console.warn(`Food with id ${id} not found`);
            return null;
        }
    } catch (error) {
        console.error("Error getting food by ID:", error);
        return null;
    }
};

export const getAllFoodsByPrice = async (price: number) => {
    try {
        let q;

        q = query(
            collection(firestore, "foods"),
            where("price", "<=", price)
        );

        const querySnapshot = await getDocs(q);

        const foods: Food[] = [];
        // querySnapshot.forEach((doc) => {
        //     foods.push({
        //         id: doc?.id ?? '',
        //         name: doc.data()?.name ?? '',
        //         image: doc.data()?.image ?? '',
        //         restaurant: doc.data()?.restaurant ?? '',
        //         price: doc.data()?.price ?? 0,
        //     });
        // });

        return foods;
    } catch (error) {
        console.error("An error occured while fetching foods: ", error);
        return [];
    }
};

export const getAllFoodsByRestaurantId = async (restaurantId: string) => {
    try {
        const q = query(
            collection(firestore, "foods"),
            where("restaurantId", "==", restaurantId)
        );

        const querySnapshot = await getDocs(q);
        const foods: Food[] = [];
        querySnapshot.forEach((doc) => {
            foods.push({
                id: doc.id,
                name: doc.data()?.name ?? '',
                imageUrl: doc.data()?.imageUrl ?? '',
                restaurantId: doc.data()?.restaurantId ?? "",
                basePrice: doc.data()?.basePrice ?? 0,
                customNote: doc.data()?.customNote ?? false,
                description: doc.data()?.description ?? '',
                isAvailable: doc.data()?.isAvailable ?? false,
                requiredChoices: doc.data()?.requiredChoices ?? [],
                variants: doc.data()?.variants ?? [],
                category: doc.data()?.category?.id
            })
        });

        return foods;
    } catch (error) {
        console.error("Error fetching food by restaurantId:", error);
        return [];
    }
};

export const getAllFoodsByRestaurantIdAndCategory = async (restaurantId: string, categoryId: string) => {
    try {
        const categoryRef = doc(firestore, "categories", categoryId);

        const menuItemsRef = collection(firestore, "foods");

        const q = query(
            menuItemsRef,
            where("category", "==", categoryRef),
            where("restaurantId", "==", restaurantId)
        );

        const querySnapshot = await getDocs(q);

        const foods = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data
            };
        }) as Food[];

        return foods;
    } catch (error) {
        console.error("Error fetching food by restaurantId:", error);
        return [];
    }
};

export const createProduct = async (data: any) => {
    try {
        await addDoc(collection(firestore, "foods"), {
            name: data.name,
            description: data.description,
            basePrice: data.basePrice,
            imageUrl: 'https://t3.ftcdn.net/jpg/02/52/38/80/360_F_252388016_KjPnB9vglSCuUJAumCDNbmMzGdzPAucK.jpg',
            restaurantId: data.restaurantId,
            customNote: true,
            isAvailable: true,
            location: new GeoPoint(0, 0),
            requiredChoices: ["size"],
            variants: [],
            category: data.category
        });
        return true;
    } catch (error) {
        console.error("Lỗi khi tạo thức ăn: ", error);
        return false;
    }
}

export const updateProduct = async (data: any, id: string) => {
    try {
        await setDoc(doc(firestore, "foods", id), {
            name: data.name,
            description: data.description,
            basePrice: data.basePrice,
            imageUrl: 'https://t3.ftcdn.net/jpg/02/52/38/80/360_F_252388016_KjPnB9vglSCuUJAumCDNbmMzGdzPAucK.jpg',
            restaurantId: data.restaurantId,
            customNote: true,
            isAvailable: true,
            location: new GeoPoint(0, 0),
            requiredChoices: ["size"],
            variants: [],
            category: data.category
        });
        return true;
    } catch (error) {
        console.error("Lỗi khi cập nhật thức ăn: ", error);
        return false;
    }
}

export const deleteProduct = async (id: string) => {
    try {
        await deleteDoc(doc(firestore, "foods", id));
        return true;
    } catch (error) {
        console.error("Lỗi khi xóa thức ăn: ", error);
        return false;
    }
}