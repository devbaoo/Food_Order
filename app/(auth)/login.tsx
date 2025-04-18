import assets from "@/assets";
import screen from "@/utils/screen";
import { LinearGradient } from "expo-linear-gradient";
import { Image, TextInput, TouchableOpacity, View, Text, StyleSheet } from "react-native";

export default function LoginScreen() {
    return (
        <LinearGradient
            colors={['#00696C', '#00CBD2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.container}
        >
            <Image source={assets.logo} style={styles.logo} />
            <View style={styles.form}>
                <TextInput
                    placeholder="Phone number, username or email"
                    style={styles.input}
                    placeholderTextColor="black"
                />
                <View style={styles.passwordInputContainer}>
                    <TextInput
                        placeholder="Password"
                        secureTextEntry={true}
                        style={styles.input}
                        placeholderTextColor="black"
                    />
                </View>
                <TouchableOpacity style={styles.forgotButton}>
                    <Text>Forgot password?</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.submit}>
                    <Text style={styles.submitText}>Log in</Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    logo: {
        width: screen.width / 3.13,
        height: screen.width / 3.13
    },

    form: {
        paddingBlock: screen.width * 0.12,
        gap: 15,
        width: '100%',
        paddingHorizontal: 34
    },

    input: {
        height: 63.81,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderRadius: 40,
        paddingHorizontal: 20
    },

    passwordInputContainer: {
        position: 'relative'
    },

    forgotButton: {
        alignSelf: 'flex-end'
    },

    submit: {
        paddingBlock: 12,
        borderRadius: 40,
        backgroundColor: '#00C0E2'
    },

    submitText: {
        fontSize: 20,
        textAlign: 'center',
        color: '#005457'
    }
})