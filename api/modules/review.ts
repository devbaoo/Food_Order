import { firestore } from "@/lib/firebase-config";
import { Review } from "@/types";
import { addDoc, collection, doc, getDoc, getDocs, query, where } from "@firebase/firestore";

export const saveReviewToFirestore = async (reviewData: any) => {
    try {
        const reviewsCollection = collection(firestore, 'reviews');
        const docRef = await addDoc(reviewsCollection, reviewData);
        return docRef.id;
    } catch (error) {
        console.error('Error saving review:', error);
        throw error;
    }
};

export const getReviewByBookingId = async (bookingId: string) => {
    try {
        const q = query(
            collection(firestore, "reviews"),
            where("bookingId", "==", bookingId)
        );

        const querySnapshot = await getDocs(q);
        if (querySnapshot.docs.length === 0) return null;

        const docSnap = querySnapshot.docs[0];
        const data = docSnap.data();

        return data as Review;
    } catch (error) {
        console.error("Error fetching restaurant by userId:", error);
        return null;
    }
};

export const getFullReviewsDetail = async (restaurantId: string) => {
    const q = query(collection(firestore, 'reviews'), where("restaurantId", "==", restaurantId));
    const reviewSnap = await getDocs(q);
    if (reviewSnap.empty) throw new Error("Review not found");

    const reviews = await Promise.all(
        reviewSnap.docs.map(async reviewDoc => {
            const review = reviewDoc.data();

            const userRef = doc(firestore, "users", review.userId);
            const userSnap = await getDoc(userRef);
            const user = userSnap.exists() ? userSnap.data() : { name: "Unknown" };

            return {
                comment: review.comment,
                rating: review.rating,
                selectedOptions: review.selectedOptions,
                images: review.images,
                createdAt: review.createdAt,
                userName: user.name,
            };
        })
    );

    return reviews;
};