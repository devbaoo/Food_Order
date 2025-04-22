import { firestore } from "@/lib/firebase-config";
import { Question } from "@/types";
import { collection, getDocs, orderBy, query } from "@firebase/firestore";

export const getAllQuestions = async () => {
    try {
        const q = query(collection(firestore, "questions"), orderBy("order", "asc"));
        const querySnapshot = await getDocs(q);

        const questions: Question[] = [];
        querySnapshot.forEach((doc) => {
            questions.push({
                order: doc.data()?.order ?? 0,
                text: doc.data()?.text ?? '',
                options: doc.data()?.options ?? []
            });
        });

        return questions;
    } catch (error) {
        console.error("An error occured while fetching questions: ", error);
        return [];
    }
};