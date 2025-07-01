import { firestore } from "@/lib/firebase-config";
import { Info } from "@/types";
import {
  collection,
  doc,
  GeoPoint,
  getDocs,
  query,
  setDoc,
  where,
} from "@firebase/firestore";

export const getAllUserInfos = async (excludeUserId: string) => {
  try {
    const snapshot = await getDocs(collection(firestore, "users"));
    const userInfos: Info[] = [];

    snapshot.forEach((doc) => {
      if (doc.id !== excludeUserId) {
        userInfos.push({
          id: doc.id,
          name: doc.data()?.name ?? "",
          avatar: doc.data()?.avatar ?? "",
          phone: doc.data()?.phone ?? "",
          address: doc.data()?.address ?? "",
          provinceAddress: doc.data()?.provinceAddress ?? "",
          location: doc.data()?.location ?? { latitude: 0, longitude: 0 }
        });
      }
    });

    return userInfos;
  } catch (error) {
    console.error("Lỗi khi fetch userInfos: ", error);
    return [];
  }
};

export const updateUser = async (data: Info) => {
  return await setDoc(doc(firestore, "users", data.id), {
    ...data,
  });
};

export const createUserProfile = async (
  userId: string,
  userData: {
    name: string;
    email: string;
    avatar?: string;
    phone?: string;
    address?: string;
    provinceAddress?: string;
    role: string;
  }
) => {
  try {
    await setDoc(doc(firestore, "users", userId), {
      name: userData.name,
      email: userData.email,
      avatar: userData.avatar || "",
      phone: userData.phone || "",
      address: userData.address || "",
      provinceAddress: userData.provinceAddress || "",
      role: userData.role,
      id: userId,
      location: new GeoPoint(0, 0)
    });
    return true;
  } catch (error) {
    console.error("Lỗi khi tạo profile người dùng: ", error);
    return false;
  }
};
