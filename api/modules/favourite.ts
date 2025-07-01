import { firestore } from "@/lib/firebase-config";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, where } from "@firebase/firestore";

export const updateFavourite = async (userId: string, restaurantId: string) => {
    const favouriteQuery = query(
        collection(firestore, "favourites"),
        where("userId", "==", userId),
        where("restaurantId", "==", restaurantId)
    );

    try {
        const favouriteDocs = await getDocs(favouriteQuery);

        if (!favouriteDocs.empty) {  
            // Delete the first matching favourite document
            const docRef = favouriteDocs.docs[0].ref;
            await deleteDoc(docRef);
        } else {
            // Nếu document chưa tồn tại, tạo mới và lưu danh sách món ăn
            await addDoc(collection(firestore, "favourites"), {
                userId,
                restaurantId
            });
        }
    } catch (error) {
        console.error("Error saving recommendations: ", error);
    }
};