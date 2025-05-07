import { firestore } from "@/lib/firebase-config";
import { Category, Food } from "@/types";
import { collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from "@firebase/firestore";

const saveRecommendations = async (userId: string, foods: Food[]) => {
    const userRef = doc(firestore, "user_recommendations", userId);

    try {
        // Lấy thông tin hiện tại của document người dùng (nếu có)
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            // Nếu document đã tồn tại, kiểm tra các món ăn đã recommend
            const currentRecommendations = userDoc.data()?.recommendations || [];

            // Thêm các món ăn mới vào mảng recommendations nếu chưa tồn tại
            foods.forEach((food) => {
                const isAlreadyRecommended = currentRecommendations.some((rec: { id: string }) => rec.id === food.id);
                if (!isAlreadyRecommended) {
                    currentRecommendations.push(food);
                }
            });

            // Cập nhật document với danh sách mới
            await updateDoc(userRef, {
                recommendations: currentRecommendations
            });
        } else {
            // Nếu document chưa tồn tại, tạo mới và lưu danh sách món ăn
            await setDoc(userRef, {
                recommendations: foods,
                createdAt: new Date().toISOString()
            });
        }
    } catch (error) {
        console.error("Error saving recommendations: ", error);
    }
};

const fetchFoodDataByTags = async (tags: string[]): Promise<Food[]> => {
    try {
        const foodRef = collection(firestore, "foods");

        // Danh sách các thực phẩm phù hợp
        let matchingFoods: Food[] = [];

        // Lặp qua từng tag trong mảng tags và thực hiện truy vấn
        for (const tag of tags) {
            const foodQuery = query(foodRef, where("tag", "==", tag)); // Truy vấn theo từng tag
            const querySnapshot = await getDocs(foodQuery);

            // Nếu truy vấn có kết quả, thêm vào danh sách thực phẩm
            querySnapshot.docs.forEach((doc) => {
                const foodData = doc.data() as Food;
                const foodItem = {
                    id: doc.id,
                    name: foodData.name ?? "",
                    image: foodData.image ?? "",
                    restaurant: foodData.restaurant ?? "",
                    price: foodData.price ?? 0,
                };

                // Kiểm tra xem thực phẩm này đã có trong danh sách chưa
                if (!matchingFoods.find(food => food.id === foodItem.id)) {
                    matchingFoods.push(foodItem);
                }
            });
        }

        return matchingFoods;
    } catch (error) {
        console.error("Error fetching food data from Firebase:", error);
        return [];
    }
};

export async function getResultFromAI(userId: string, selections: string[]): Promise<Food[]> {
    try {
        const response = await fetch('https://foodorderk16.somee.com/api/Recommendation/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                diet: selections[1],
                allergies: selections[2],
                flavors: selections[3],
                cuisine: selections[4],
            }),
        });

        const data = await response.json();

        if (response.ok) {
            const recommendations = await fetchFoodDataByTags(data.suggestedFoods);
            if(recommendations.length > 0) {
                await saveRecommendations(userId, recommendations); // Lưu vào Firestore
            }
            return recommendations;
        }
        return [];
    } catch (error) {
        console.error('Failed to get user recommendation', error);
        throw error;
    }
}