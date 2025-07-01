import assets from "@/assets";
import { auth } from "@/lib/firebase-config";
import screen from "@/utils/screen";
import { toast } from "@/utils/toast";
import { LinearGradient } from "expo-linear-gradient";
import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { Image, TextInput, TouchableOpacity, View, Text, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { router } from "expo-router";
import { createUserProfile } from "@/api/modules/user";

export default function SellerRegisterScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [storeName, setStoreName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorState, setErrorState] = useState<string | null>(null);

    const handleRegister = async () => {
        // Validate input
        if (!name) {
            toast.error("Lỗi", "Tên chủ cửa hàng không được để trống");
            return;
        }

        if (!storeName) {
            toast.error("Lỗi", "Tên cửa hàng không được để trống");
            return;
        }

        if (!email) {
            toast.error("Lỗi", "Email không được để trống");
            return;
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
            toast.error("Lỗi", "Email không hợp lệ");
            return;
        }

        if (!phoneNumber) {
            toast.error("Lỗi", "Số điện thoại không được để trống");
            return;
        } else if (!/^[0-9]{10,11}$/.test(phoneNumber)) {
            toast.error("Lỗi", "Số điện thoại không hợp lệ");
            return;
        }

        if (!address) {
            toast.error("Lỗi", "Địa chỉ cửa hàng không được để trống");
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

            // Create store owner profile in Firestore using the API function
            const success = await createUserProfile(user.uid, {
                name,
                email,
                role: "seller",
                phone: phoneNumber,
                address,
                avatar: "https://preview.redd.it/turned-my-avatar-into-a-2010-inspired-profile-picture-yes-i-v0-ergti3sxlrae1.png?width=640&crop=smart&auto=webp&s=9ae5f2ad8f385489fd4dc035da097cc7cb3f515a"
            });

            if (success) {
                toast.success("Thành công", "Đăng ký cửa hàng thành công! Vui lòng chờ phê duyệt.");
                router.replace("/(auth)/login" as any);
            } else {
                toast.error("Lỗi", "Đã xảy ra lỗi khi tạo hồ sơ cửa hàng");
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
            <ScrollView 
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                <Image source={assets.logo} style={styles.logo} />
                <Text style={styles.title}>Đăng ký cửa hàng</Text>
                
                <View style={styles.form}>
                    <TextInput
                        placeholder="Tên chủ cửa hàng"
                        style={styles.input}
                        placeholderTextColor="rgba(0,0,0,0.6)"
                        value={name}
                        onChangeText={setName}
                    />
                    
                    <TextInput
                        placeholder="Tên cửa hàng"
                        style={styles.input}
                        placeholderTextColor="rgba(0,0,0,0.6)"
                        value={storeName}
                        onChangeText={setStoreName}
                    />
                    
                    <TextInput
                        placeholder="Email"
                        style={styles.input}
                        placeholderTextColor="rgba(0,0,0,0.6)"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                    
                    <TextInput
                        placeholder="Số điện thoại"
                        style={styles.input}
                        placeholderTextColor="rgba(0,0,0,0.6)"
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        keyboardType="phone-pad"
                    />
                    
                    <TextInput
                        placeholder="Địa chỉ cửa hàng"
                        style={styles.input}
                        placeholderTextColor="rgba(0,0,0,0.6)"
                        value={address}
                        onChangeText={setAddress}
                        multiline={true}
                        numberOfLines={2}
                    />
                    
                    <TextInput
                        placeholder="Mật khẩu"
                        secureTextEntry={true}
                        style={styles.input}
                        placeholderTextColor="rgba(0,0,0,0.6)"
                        value={password}
                        onChangeText={setPassword}
                    />
                    
                    <TextInput
                        placeholder="Xác nhận mật khẩu"
                        secureTextEntry={true}
                        style={styles.input}
                        placeholderTextColor="rgba(0,0,0,0.6)"
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
                            <Text style={styles.submitText}>Đăng ký cửa hàng</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.loginLink}
                        onPress={() => router.push("/(auth)/login" as any)}
                    >
                        <Text style={styles.loginLinkText}>Đã có tài khoản? Đăng nhập</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },

    logo: {
        width: screen.width / 4,
        height: screen.width / 4,
        marginBottom: 10,
    },

    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 20,
        textAlign: 'center',
    },

    form: {
        paddingBlock: 20,
        gap: 15,
        width: '100%',
        paddingHorizontal: 34
    },

    input: {
        height: 55,
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        borderRadius: 28,
        paddingHorizontal: 20,
        fontSize: 16,
    },

    textArea: {
        height: 100,
        paddingTop: 15,
    },

    submit: {
        paddingVertical: 15,
        borderRadius: 28,
        backgroundColor: '#00C0E2',
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },

    submitText: {
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
        color: '#005457'
    },

    loginLink: {
        marginTop: 20,
        alignItems: 'center'
    },

    loginLinkText: {
        color: 'white',
        fontSize: 16,
        textDecorationLine: 'underline',
    }
});