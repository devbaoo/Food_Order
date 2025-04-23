import assets from "@/assets";
import { auth } from "@/lib/firebase-config";
import screen from "@/utils/screen";
import { toast } from "@/utils/toast";
import { LinearGradient } from "expo-linear-gradient";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { Image, TextInput, TouchableOpacity, View, Text, StyleSheet, ActivityIndicator } from "react-native";

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorState, setErrorState] = useState<string | null>(null);

    const handleLogin = async () => {
        if (!email) {
            toast.error("Lỗi", "Email không được để trống");
            return;
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
            toast.error("Lỗi", "Email không hợp lệ");
            return;
        }

        if (!password) {
            toast.error("Lỗi", "Mật khẩu không được để trống");
            return;
        } else if (password.length < 6) {
            toast.error("Lỗi", "Mật khẩu phải có ít nhất 6 ký tự");
            return;
        }

        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error: any) {
            setErrorState(error.message);
            toast.error("Lỗi đăng nhập", "Vui lòng kiểm tra lại thông tin đăng nhập.");
        } finally {
            setLoading(false);
        }
    };

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
                    placeholder="Email"
                    style={styles.input}
                    placeholderTextColor="black"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />
                <View style={styles.passwordInputContainer}>
                    <TextInput
                        placeholder="Password"
                        secureTextEntry={true}
                        style={styles.input}
                        placeholderTextColor="black"
                        value={password}
                        onChangeText={setPassword}
                    />
                </View>
                <TouchableOpacity style={styles.forgotButton}>
                    <Text>Forgot password?</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.submit}
                    onPress={handleLogin}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#005457" />
                    ) : (
                        <Text style={styles.submitText}>Log in</Text>
                    )}
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