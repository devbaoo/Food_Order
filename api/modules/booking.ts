import { firestore } from "@/lib/firebase-config";
import { Booking, Cart, CartItem, Info } from "@/types";
import { addDoc, collection, deleteField, doc, getDoc, getDocs, orderBy, query, setDoc, updateDoc, where } from "@firebase/firestore";
import { getRestaurantById } from "./restaurant";

export const createBookingsFromCart = async (cart: Cart, totalPrice?: number) => {
  try {
    if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
      throw new Error("Giỏ hàng trống.");
    }
    const bookingData: Omit<Booking, "id"> = {
      userId: cart.userId,
      restaurantId: cart.restaurantId,
      items: cart.cartItems,
      totalPrice: totalPrice ?? cart.totalPrice,
      status: "Pending",
      createdAt: new Date().toISOString()
    };

    // Tạo booking mới trong Firestore
    const bookingRef = await addDoc(collection(firestore, "bookings"), bookingData);

    // Xóa các item trong giỏ hàng
    await setDoc(doc(firestore, "carts", cart.id), {
      ...cart,
      cartItems: [],
      totalPrice: 0,
      restaurantId: deleteField()
    }, { merge: true });

    return {
      bookingId: bookingRef.id,
      ...bookingData
    };
  } catch (err) {
    console.log(err);
  }
};

export const getBookingByRestaurantId = async (restaurantId: string) => {
  try {
    const q = query(
      collection(firestore, "bookings"),
      where("restaurantId", "==", restaurantId)
    );

    const querySnapshot = await getDocs(q);
    const bookings: Booking[] = [];

    for (const docSnap of querySnapshot.docs) {
      const data = docSnap.data();
      const userId = data.userId ?? "";

      // 🔹 Lấy thông tin user
      let user: Info | null = null;
      if (userId) {
        const userRef = doc(firestore, "users", userId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          user = {
            id: userSnap.id,
            ...(userSnap.data() as any),
          };
        }
      }

      // 🔹 Lấy thông tin từng món ăn trong booking
      const itemsWithFoodInfo = await Promise.all(
        (data.items ?? []).map(async (item: CartItem) => {
          const foodRef = doc(firestore, "foods", item.foodId);
          const foodSnap = await getDoc(foodRef);
          const food = foodSnap.data();

          return {
            ...item,
            name: food?.name ?? 'Unknown',
          };
        })
      );

      bookings.push({
        id: docSnap.id,
        userId,
        restaurantId: data.restaurantId ?? "",
        totalPrice: data.totalPrice ?? 0,
        status: data.status ?? "Pending",
        createdAt: data.createdAt ?? "",
        items: itemsWithFoodInfo,
        customer: {
          name: user?.name ?? "",
          phone: user?.phone ?? "",
          email: "",
          address: user?.address + " " + user?.provinceAddress
        },
      });
    }

    return bookings;
  } catch (error) {
    console.error("Error fetching booking by restaurantId:", error);
    return [];
  }
};

export const updateBookingStatus = async (id: string, status: 'Pending' | 'Processing' | 'Shipping' | 'Delivered' | 'Cancelled') => {
  try {
    await setDoc(doc(firestore, "bookings", id), {
      status
    }, { merge: true });

    if (status === 'Delivered') {
      const q = query(
        collection(firestore, 'payments'),
        where('bookingId', '==', id)
      );

      const snapshot = await getDocs(q);
      snapshot.forEach(async (docSnap) => {
        const payment = docSnap.data();
        if (payment.status === 'pending') {
          await updateDoc(doc(firestore, 'payments', docSnap.id), {
            status: 'paid'
          });
        }
      });
    }
    return true;
  } catch (error) {
    console.error("Lỗi khi cập nhật đơn hàng: ", error);
    return false;
  }
}

export const getAllBookings = async (userId?: string) => {
  try {
    const q = userId
      ? query(collection(firestore, "bookings"), where("userId", "==", userId))
      : query(collection(firestore, "bookings"));

    const querySnapshot = await getDocs(q);
    const bookings: Booking[] = [];

    for (const docSnap of querySnapshot.docs) {
      const data = docSnap.data();
      const userId = data.userId ?? "";

      const restaurantId = data?.restaurantId ?? "";
      const restaurant = restaurantId
        ? await getRestaurantById(restaurantId)
        : null;

      let user: Info | null = null;
      if (userId) {
        const userRef = doc(firestore, "users", userId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          user = {
            id: userSnap.id,
            ...(userSnap.data() as any),
          };
        }
      }

      // 🔹 Enrich từng món ăn trong items
      const itemsWithFoodInfo = await Promise.all(
        (data.items ?? []).map(async (item: CartItem) => {
          const foodRef = doc(firestore, "foods", item.foodId);
          const foodSnap = await getDoc(foodRef);
          const food = foodSnap.data();

          return {
            ...item,
            name: food?.name ?? "Unknown"
          };
        })
      );

      bookings.push({
        id: docSnap.id,
        userId: data?.userId ?? "",
        restaurantId,
        restaurantName: restaurant?.name ?? "Unknown",
        totalPrice: data?.totalPrice ?? 0,
        status: data?.status ?? "Pending",
        createdAt: data?.createdAt ?? "",
        items: itemsWithFoodInfo,
        customer: {
          name: user?.name ?? "",
          phone: user?.phone ?? "",
          email: "",
          address: user?.address + " " + user?.provinceAddress
        }
      });
    }

    return bookings;
  } catch (error) {
    console.error("Error fetching booking(s):", error);
    return [];
  }
};

export const getAllBookingsForShipper = async () => {
  try {
    const q = query(collection(firestore, "bookings"),
      where("status", "not-in", ["Delivered", "Cancelled"]),
    );

    const querySnapshot = await getDocs(q);
    const bookings: Booking[] = [];

    for (const docSnap of querySnapshot.docs) {
      const data = docSnap.data();
      const userId = data.userId ?? "";

      const restaurantId = data?.restaurantId ?? "";
      const restaurant = restaurantId
        ? await getRestaurantById(restaurantId)
        : null;

      let user: Info | null = null;
      if (userId) {
        const userRef = doc(firestore, "users", userId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          user = {
            id: userSnap.id,
            ...(userSnap.data() as any),
          };
        }
      }

      // 🔹 Enrich từng món ăn trong items
      const itemsWithFoodInfo = await Promise.all(
        (data.items ?? []).map(async (item: CartItem) => {
          const foodRef = doc(firestore, "foods", item.foodId);
          const foodSnap = await getDoc(foodRef);
          const food = foodSnap.data();

          return {
            ...item,
            name: food?.name ?? "Unknown"
          };
        })
      );

      bookings.push({
        id: docSnap.id,
        userId: data?.userId ?? "",
        restaurantId,
        restaurantName: restaurant?.name ?? "Unknown",
        totalPrice: data?.totalPrice ?? 0,
        status: data?.status ?? "Pending",
        createdAt: data?.createdAt ?? "",
        items: itemsWithFoodInfo,
        customer: {
          name: user?.name ?? "",
          phone: user?.phone ?? "",
          email: "",
          address: user?.address + " " + user?.provinceAddress
        }
      });
    }

    return bookings;
  } catch (error) {
    console.error("Error fetching booking(s):", error);
    return [];
  }
};

export const getBookingById = async (id: string) => {
  try {
    const docRef = doc(firestore, "bookings", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      console.warn(`Booking with id ${id} not found`);
      return null;
    }

    const data = docSnap.data();
    const userId = data.userId ?? "";
    const restaurantId = data?.restaurantId ?? "";
    const restaurant = restaurantId
      ? await getRestaurantById(restaurantId)
      : null;

    let user: Info | null = null;
    if (userId) {
      const userRef = doc(firestore, "users", userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        user = {
          id: userSnap.id,
          ...(userSnap.data() as any),
        };
      }
    }

    // 🔹 Enrich items
    const itemsWithFoodInfo = await Promise.all(
      (data.items ?? []).map(async (item: CartItem) => {
        const foodRef = doc(firestore, "foods", item.foodId);
        const foodSnap = await getDoc(foodRef);
        const food = foodSnap.data();

        return {
          ...item,
          name: food?.name ?? "Unknown"
        };
      })
    );

    const booking: Booking = {
      id: docSnap.id,
      userId: data?.userId ?? "",
      restaurantId,
      restaurantName: restaurant?.name ?? "Unknown",
      totalPrice: data?.totalPrice ?? 0,
      status: data?.status ?? "Pending",
      createdAt: data?.createdAt ?? "",
      items: itemsWithFoodInfo,
      customer: {
        name: user?.name ?? "",
        phone: user?.phone ?? "",
        email: "",
        address: user?.address + " " + user?.provinceAddress
      }
    };

    return booking;
  } catch (error) {
    console.error("Error getting booking by ID:", error);
    return null;
  }
};