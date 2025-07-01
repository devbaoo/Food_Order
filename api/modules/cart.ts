import { firestore } from "@/lib/firebase-config";
import { Cart } from "@/types";
import { toast } from "@/utils/toast";
import { doc, getDoc, setDoc } from "@firebase/firestore";

export async function updateCartItem(
    userId: string,
    foodId: string,
    delta: number,
    price?: number,
    restaurantId?: string
) {
    try {
        const cartRef = doc(firestore, 'carts', userId);
        const cartSnap = await getDoc(cartRef);

        let updatedItems: any[] = [];
        let existingItem: any = null;
        let finalRestaurantId: string | null = restaurantId || null;

        if (cartSnap.exists()) {
            const cartData = cartSnap.data();

            const currentRestaurantId = cartData.restaurantId;

            // Nếu món mới đến từ nhà hàng khác → reset giỏ hàng
            if (currentRestaurantId && restaurantId && currentRestaurantId !== restaurantId) {
                toast.info('Đã chọn món từ nhà hàng khác. Reset giỏ hàng.');
                // Tạo giỏ hàng mới với món mới duy nhất
                if (delta > 0 && price !== undefined && restaurantId) {
                    updatedItems = [{ foodId, price, quantity: delta, restaurantId }];
                    finalRestaurantId = restaurantId;
                } else {
                    toast.error("Error", "không đủ info để thêm món mới");
                    return; // không đủ info để thêm món mới
                }
            } else {
                // Cùng nhà hàng → cập nhật bình thường
                existingItem = cartData.cartItems.find((item: any) => item.foodId === foodId);

                if (existingItem) {
                    updatedItems = cartData.cartItems.map((item: any) =>
                        item.foodId === foodId
                            ? { ...item, quantity: item.quantity + delta }
                            : item
                    );
                } else {
                    if (delta > 0 && price !== undefined && restaurantId) {
                        updatedItems = [...cartData.cartItems, { foodId, price, quantity: delta, restaurantId }];
                    } else {
                        updatedItems = [...cartData.cartItems];

                    }
                }

                finalRestaurantId = currentRestaurantId ?? restaurantId ?? null;
            }
        } else {
            // Cart chưa tồn tại
            if (delta > 0 && price !== undefined && restaurantId) {
                updatedItems = [{ foodId, price, quantity: delta, restaurantId }];
                finalRestaurantId = restaurantId;
            } else {
                toast.error("Error", "Lỗi tạo giỏ hàng");
                return;
            }
        }

        // Lọc item số lượng > 0
        updatedItems = updatedItems.filter((item: any) => item.quantity > 0);

        // Nếu giỏ hàng rỗng sau khi cập nhật → reset restaurantId
        if (updatedItems.length === 0) {
            finalRestaurantId = null;
        }

        const totalPrice = updatedItems.reduce(
            (sum: number, item: any) => sum + item.price * item.quantity,
            0
        );

        await setDoc(cartRef, {
            userId,
            restaurantId: finalRestaurantId,
            cartItems: updatedItems,
            totalPrice
        });
    } catch (error) {
        console.log(error);
    }
}


export async function getCart(userId: string) {
    const cartRef = doc(firestore, 'carts', userId);
    const cartSnap = await getDoc(cartRef);
    if (cartSnap.exists()) {
        return {
            id: cartSnap.id,
            userId: cartSnap.data()?.userId ?? "",
            totalPrice: cartSnap.data()?.totalPrice ?? 0,
            cartItems: cartSnap.data()?.cartItems ?? [],
            restaurantId: cartSnap.data()?.restaurantId ?? ""
        } as Cart; // trả về { id, userId, items, totalPrice, restaurantId }
    } else {
        return null;
    }
}