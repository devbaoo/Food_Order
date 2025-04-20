import { Stack } from "expo-router";

const CartStack = () => {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index"  />
            <Stack.Screen name="checkout"  />
        </Stack>
    );
}

export default CartStack;