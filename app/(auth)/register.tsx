import assets from "@/assets";
import { auth } from "@/lib/firebase-config";
import { createUserProfile } from "@/api/modules/user";
import screen from "@/utils/screen";
import { toast } from "@/utils/toast";
import { LinearGradient } from "expo-linear-gradient";
import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { Image, TextInput, TouchableOpacity, View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { router } from "expo-router";

export default function RegisterScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorState, setErrorState] = useState<string | null>(null);

    const handleRegister = async () => {
        // Validate input
        if (!name) {
            toast.error("Lỗi", "Tên không được để trống");
            return;
        }

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

        if (password !== confirmPassword) {
            toast.error("Lỗi", "Mật khẩu xác nhận không khớp");
            return;
        }

        setLoading(true);
        try {
            // Create user with email and password
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Create user profile in Firestore using the API function
            const success = await createUserProfile(user.uid, {
                name,
                email
            });

            if (success) {
                toast.success("Thành công", "Đăng ký tài khoản thành công!");
                router.replace("/(auth)/login" as any);
            } else {
                toast.error("Lỗi", "Đã xảy ra lỗi khi tạo hồ sơ người dùng");
            }
        } catch (error: any) {
            setErrorState(error.message);
            if (error.code === 'auth/email-already-in-use') {
                toast.error("Lỗi đăng ký", "Email đã được sử dụng.");
            } else {
                toast.error("Lỗi đăng ký", "Đã xảy ra lỗi khi đăng ký.");
            }
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
                    placeholder="Họ tên"
                    style={styles.input}
                    placeholderTextColor="black"
                    value={name}
                    onChangeText={setName}
                />
                <TextInput
                    placeholder="Email"
                    style={styles.input}
                    placeholderTextColor="black"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />
                <TextInput
                    placeholder="Mật khẩu"
                    secureTextEntry={true}
                    style={styles.input}
                    placeholderTextColor="black"
                    value={password}
                    onChangeText={setPassword}
                />
                <TextInput
                    placeholder="Xác nhận mật khẩu"
                    secureTextEntry={true}
                    style={styles.input}
                    placeholderTextColor="black"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                />

                <TouchableOpacity
                    style={styles.submit}
                    onPress={handleRegister}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#005457" />
                    ) : (
                        <Text style={styles.submitText}>Đăng ký</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.loginLink}
                    onPress={() => router.push("/(auth)/login" as any)}
                >
                    <Text style={styles.loginLinkText}>Đã có tài khoản? Đăng nhập</Text>
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

    submit: {
        paddingBlock: 12,
        borderRadius: 40,
        backgroundColor: '#00C0E2',
        marginTop: 10
    },

    submitText: {
        fontSize: 20,
        textAlign: 'center',
        color: '#005457'
    },

    loginLink: {
        marginTop: 15,
        alignItems: 'center'
    },

    loginLinkText: {
        color: 'white',
        fontSize: 16
    }
}) 