import assets from '@/assets';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, View, Image, ImageBackground } from 'react-native';

export default () => {
    // const [loading, setLoading] = useState<boolean>(false);
    // const token = store.getState().global?.token;

    // useEffect(() => {
    //     setTimeout(() => {
    //         if (token) {
    //             fetchUserInformation();
    //             return;
    //         }
    //         router.push('/(auth)/welcome');
    //     }, 300);
    // }, [token]);

    useEffect(() => {
        setTimeout(() => router.push("/(home)"), 1000);
    }, []);

    // const fetchUserInformation = async () => {
    //     try {
    //         setLoading(true);
    //         const { data } = await getProfile();
    //         if (data) {
    //             store.dispatch(setUserInfo(data));
    //             router.push('/(home)');
    //             chatService.connectSocket(token, data.userId);
    //         }
    //         else {
    //             toast.error("Something went wrong", "User data null, please re-authorize!");
    //             router.replace('/(auth)/login');
    //         }
    //     }
    //     finally {
    //         setLoading(false);
    //     }
    // }

    return (
        <ImageBackground source={assets.splash} style={styles.container}>
            {/* {
                loading &&
                <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                    <ActivityIndicator size="small" color={colors.defaultBorder} />
                    <Text style={styles.text}>Fetching information, please wait!</Text>
                </View>
            } */}
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        padding: 10
    },

    splash: {
        flex: 1,
        resizeMode: "contain"
    },

    text: {
        fontSize: 16,
        fontWeight: "bold",
        // color: colors.defaultBorder,
    },
});