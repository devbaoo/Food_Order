import { Stack } from "expo-router";

const HintStack = () => {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index"  />
            <Stack.Screen name="gender"  />
            <Stack.Screen name="selection"  />
            <Stack.Screen name="result"  />
        </Stack>
    );
}

export default HintStack;