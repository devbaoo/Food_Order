import { firestore } from "@/lib/firebase-config";
import { Booking, Cart, CartItem } from "@/types";
import { addDoc, collection, deleteDoc, deleteField, doc, getDocs, query, setDoc, where } from "@firebase/firestore";
import { getRestaurantById } from "./restaurant";

export const createBookingsFromCart = async (cart: Cart) => {
  try {
    if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
      throw new Error("Giỏ hàng trống.");
    }
    const bookingData: Omit<Booking, "id"> = {
      userId: cart.userId,
      restaurantId: cart.restaurantId,
      items: cart.cartItems,
      totalPrice: cart.totalPrice,
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
    querySnapshot.docs.map(doc => {
      bookings.push({
        id: doc.id,
        userId: doc.data()?.userId ?? '',
        restaurantId: doc.data()?.restaurantId ?? '',
        totalPrice: doc.data()?.totalPrice ?? 0,
        status: doc.data()?.status ?? 'Pending',
        createdAt: doc.data()?.createdAt ?? '',
        items: doc.data()?.items ?? []
      })
    })

    return bookings;
  } catch (error) {
    console.error("Error fetching booking by restaurantId:", error);
    return [];
  }
};

export const updateBookingStatus = async (id: string, status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled') => {
  try {
    await setDoc(doc(firestore, "bookings", id), {
      status
    }, { merge: true });
    return true;
  } catch (error) {
    console.error("Lỗi khi cập nhật đơn hàng: ", error);
    return false;
  }
}

export const getAllBookings = async (userId: string) => {
  try {
    const q = query(
      collection(firestore, "bookings"),
      where("userId", "==", userId)
    );

    const querySnapshot = await getDocs(q);
    const bookings: Booking[] = [];
    for (const doc of querySnapshot.docs) {
      const data = doc.data();
      const restaurantId = data?.restaurantId ?? '';
      const restaurant = restaurantId ? await getRestaurantById(restaurantId) : null;

      bookings.push({
        id: doc.id,
        userId: data?.userId ?? '',
        restaurantId,
        restaurantName: restaurant?.name,
        totalPrice: data?.totalPrice ?? 0,
        status: data?.status ?? 'Pending',
        createdAt: data?.createdAt ?? '',
        items: data?.items ?? []
      });
    }

    return bookings;
  } catch (error) {
    console.error("Error fetching booking by userId:", error);
    return [];
  }
};