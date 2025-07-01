import { firestore } from "@/lib/firebase-config";
import { Restaurant } from "@/types";
import { collection, doc, DocumentReference, getDoc, getDocs, query, where } from "@firebase/firestore";

export const getAllRestaurants = async (category?: string | null, userId?: string) => {
  try {
    let q;

    if (category) {
      // Nếu có categoryId thì lọc theo
      q = query(
        collection(firestore, "restaurants"),
        where("categories", "array-contains", category)
      );
    } else {
      // Nếu không có categoryId thì lấy tất cả restaurants
      q = query(collection(firestore, "restaurants"));
    }
    const querySnapshot = await getDocs(q);

    let favouriteIds = new Set<string>();
    if (userId) {
      const favQuery = query(
        collection(firestore, "favourites"),
        where("userId", "==", userId)
      );
      const favSnapshot = await getDocs(favQuery);
      favSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data?.restaurantId) {
          favouriteIds.add(data.restaurantId);
        }
      });
    }

    const restaurants: Restaurant[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      restaurants.push({
        id: doc.id ?? '',
        name: data?.name ?? '',
        imageUrl: data?.imageUrl ?? '',
        rating: data?.rating ?? 0,
        ratingCount: data?.ratingCount ?? 0,
        address: data?.address ?? '',
        favourite: favouriteIds.has(doc.id),
        location: data?.location ?? { latitude: 0, longitude: 0 }
      });
    });

    return restaurants;
  } catch (error) {
    console.error("An error occured while fetching restaurants: ", error);
    return [];
  }
};

export const getRestaurantByUserId = async (userId: string) => {
  try {
    const q = query(
      collection(firestore, "restaurants"),
      where("userId", "==", userId)
    );

    const querySnapshot = await getDocs(q);
    if (querySnapshot.docs.length === 0) return null;

    const docSnap = querySnapshot.docs[0];
    const data = docSnap.data();

    // Nếu có categories là reference
    const categoryRefs = (data.categories ?? []) as DocumentReference[];

    const categoryDocs = await Promise.all(
      categoryRefs.map((ref) => getDoc(ref))
    );

    const categories = categoryDocs
      .filter((catSnap) => catSnap.exists())
      .map((catSnap) => ({
        id: catSnap.id,
        name: catSnap.data()?.name ?? "",
        icon: catSnap.data()?.icon ?? "",
      }));

    return {
      id: docSnap.id,
      name: data.name ?? "",
      imageUrl: data.imageUrl ?? "",
      rating: data.rating ?? 0,
      ratingCount: data.ratingCount ?? 0,
      categories,
      address: data.address ?? "",
      favourite: false,
      location: data.location ?? { latitude: 0, longitude: 0 }
    } as Restaurant;
  } catch (error) {
    console.error("Error fetching restaurant by userId:", error);
    return null;
  }
};

export const getRestaurantById = async (restaurantId: string) => {
  try {
    const docRef = doc(firestore, "restaurants", restaurantId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return null;

    const data = docSnap.data();

    // Resolve category references
    const categoryRefs = (data.categories ?? []) as DocumentReference[];

    const categoryDocs = await Promise.all(
      categoryRefs.map((ref) => getDoc(ref))
    );

    const categories = categoryDocs
      .filter((catSnap) => catSnap.exists())
      .map((catSnap) => ({
        id: catSnap.id,
        name: catSnap.data()?.name ?? "",
      }));

    return {
      id: docSnap.id,
      name: data.name ?? "",
      imageUrl: data.imageUrl ?? "",
      rating: data.rating ?? 0,
      ratingCount: data.ratingCount ?? 0,
      categories,
    } as Restaurant;
  } catch (error) {
    console.error("Error fetching restaurant by userId:", error);
    return null;
  }
};

export async function getRestaurantsFromCart(userId: string) {
  // 1. Lấy danh sách cart của user
  const cartQuery = query(
    collection(firestore, "carts"),
    where("userId", "==", userId)
  );

  const cartSnapshot = await getDocs(cartQuery);

  const restaurantIdSet = new Set();

  cartSnapshot.forEach((doc) => {
    const data = doc.data();
    if (data.restaurantId) {
      restaurantIdSet.add(data.restaurantId);
    }
  });

  // 2. Truy vấn thông tin từ collection "restaurants"
  const restaurantList = [];

  for (const restaurantId of restaurantIdSet) {
    const resRef = doc(firestore, "restaurants", restaurantId as string);
    const resSnap = await getDoc(resRef);

    if (resSnap.exists()) {
      restaurantList.push({
        id: restaurantId,
        ...resSnap.data()
      } as Restaurant);
    }
  }

  return restaurantList;
}

export async function getFavouriteRestaurants(userId: string) {
  // 1. Lấy danh sách favourite của user
  const cartQuery = query(
    collection(firestore, "favourites"),
    where("userId", "==", userId)
  );

  const cartSnapshot = await getDocs(cartQuery);

  const restaurantIdSet = new Set();

  cartSnapshot.forEach((doc) => {
    const data = doc.data();
    if (data.restaurantId) {
      restaurantIdSet.add(data.restaurantId);
    }
  });

  // 2. Truy vấn thông tin từ collection "restaurants"
  const restaurantList = [];

  for (const restaurantId of restaurantIdSet) {
    const resRef = doc(firestore, "restaurants", restaurantId as string);
    const resSnap = await getDoc(resRef);

    if (resSnap.exists()) {
      restaurantList.push({
        id: restaurantId,
        ...resSnap.data()
      } as Restaurant);
    }
  }

  return restaurantList;
}