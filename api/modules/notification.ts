import { firestore } from "@/lib/firebase-config";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, where } from "@firebase/firestore";

export async function sendPushNotification(expoPushToken: string, title: string, content: string) {
    const message = {
        to: expoPushToken,
        sound: 'default',
        title,
        body: content,
        data: { someData: 'goes here' },
        priority: "high"
    };

    try {
        const response = await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Accept-encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        });

        const data = await response.json();

        console.log("Expo push response:", {
            status: response.status,
            ok: response.ok,
            data,
        });
    } catch (error) {
        console.error("Failed to send push notification:", error);
    }
}

export async function checkAndSendNotify(restaurantId?: string | null, title: string = '', content: string = '') {
    if (!restaurantId) return;

    // B1: Lấy userId từ document "restaurants/{restaurantId}"
    const restaurantDocRef = doc(firestore, "restaurants", restaurantId);
    const restaurantSnap = await getDoc(restaurantDocRef);

    if (!restaurantSnap.exists()) return;

    const userId = restaurantSnap.data()?.userId;
    if (!userId) return;

    // B2: Tìm token theo userId
    const tokenQuery = query(
        collection(firestore, "tokens"),
        where("userId", "==", userId)
    );

    const tokenSnapshot = await getDocs(tokenQuery);

    if (!tokenSnapshot.empty) {
        const promises = tokenSnapshot.docs
            .map((doc) => {
                const data = doc.data();
                console.log(data);
                if (data.key) {
                    return sendPushNotification(data.key, title, content);
                }
            })
            .filter(Boolean);

        await Promise.all(promises);
    }
}

export async function checkAndSaveTokenForUser(userId: string, token: string) {
    const tokenQuery = query(
        collection(firestore, "tokens"),
        where("userId", "==", userId),
        where("key", "==", token)
    );

    const tokenSnapshot = await getDocs(tokenQuery);

    if (tokenSnapshot.empty) {
        await addDoc(collection(firestore, "tokens"), {
            userId,
            key: token,
            createdAt: new Date()
        });
    }
}

export async function checkAndDeleteTokenForUser(userId: string, token: string) {
    const tokenQuery = query(
        collection(firestore, "tokens"),
        where("userId", "==", userId),
        where("key", "==", token)
    );

    const tokenSnapshot = await getDocs(tokenQuery);

    if (!tokenSnapshot.empty) {
        const deletePromises = tokenSnapshot.docs.map(doc => deleteDoc(doc.ref));
        await Promise.all(deletePromises);
    }
}