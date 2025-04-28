import { firestore } from "@/lib/firebase-config";
import { Category } from "@/types";
import { collection, doc, getDocs, setDoc } from "@firebase/firestore";

export async function getUserRecommendations(userId: string, userAnswers: string[]): Promise<string[]> {
    try {
        // 1. Tính toán recommendation

        // 1.1. Fetch tất cả các categories
        const categoriesSnapshot = await getDocs(collection(firestore, "categories"));

        const userTags = userAnswers; // Câu trả lời dạng tags từ người dùng

        const scoredCategories = categoriesSnapshot.docs.map(docSnap => {
            const data = docSnap.data();
            let score = 0;

            // Cộng điểm theo tag match
            score += data.tags.filter((tag: string) => userTags.includes(tag)).length;

            // Cộng thêm 1 điểm nếu gender match
            if (data.genders && data.genders.includes(userAnswers[0])) {
                score += 1;
            }

            return { id: docSnap.id, score };
        });

        // Sort giảm dần theo điểm
        const sortedCategories = scoredCategories.sort((a, b) => b.score - a.score);

        // Lấy 5 cái tốt nhất
        const top5Categories = sortedCategories.slice(0, 5);

        const recommendedCategories: string[] = top5Categories.map(cat => cat.id);

        // 2. Lưu recommendation vào Firestore
        const newReco = {
            categories: recommendedCategories,
            createdAt: new Date()
        };

        await setDoc(doc(firestore, "user_recommendations", userId), newReco, { merge: true });

        console.log('Recommendation calculated and saved');

        // 3. Trả về cho user
        return recommendedCategories;

    } catch (error) {
        console.error('Failed to get user recommendation', error);
        throw error;
    }
}