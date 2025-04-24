import { firestore } from "@/lib/firebase-config";
import { Info } from "@/types";
import { collection, getDocs, query, where } from "@firebase/firestore";

export const getAllUserInfos = async (excludeUserId: string) => {
    try {
      const snapshot = await getDocs(collection(firestore, "users"));
    const userInfos: Info[] = [];

    snapshot.forEach((doc) => {
      if (doc.id !== excludeUserId) {
        userInfos.push({
          id: doc.id,
          name: doc.data()?.name ?? '',
          avatar: doc.data()?.avatar ?? ''
        });
      }
    });

    return userInfos;
    } catch (error) {
      console.error("Lỗi khi fetch userInfos: ", error);
      return [];
    }
  };