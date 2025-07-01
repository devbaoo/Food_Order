import { Cart, Food } from "@/types";

type UpdateType = 'add' | 'remove';

export function calculateCart(cart: Cart, item: Food, type: UpdateType): Cart {
    if (!cart) return cart;

    const existingItem = cart.cartItems.find(x => x.foodId === item.id);
    let updatedItems;

    if (type === 'add') {
        if (existingItem) {
            updatedItems = cart.cartItems.map(x =>
                x.foodId === item.id ? { ...x, quantity: x.quantity + 1 } : x
            );
        } else {
            updatedItems = [...cart.cartItems, { foodId: item.id, quantity: 1, price: item.basePrice }];
        }
    } else if (type === 'remove' && existingItem) {
        if (existingItem.quantity === 1) {
            updatedItems = cart.cartItems.filter(x => x.foodId !== item.id);
        } else {
            updatedItems = cart.cartItems.map(x =>
                x.foodId === item.id ? { ...x, quantity: x.quantity - 1 } : x
            );
        }
    } else {
        updatedItems = cart.cartItems;
    }

    const totalPrice = updatedItems.reduce(
        (total, current) => total + current.quantity * current.price,
        0
    );

    return {
        ...cart,
        cartItems: updatedItems,
        totalPrice,
    };
}

export function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (x: number) => x * Math.PI / 180;
  const R = 6371; // km

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}