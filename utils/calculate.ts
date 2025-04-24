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
            updatedItems = [...cart.cartItems, { foodId: item.id, quantity: 1, price: item.price }];
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