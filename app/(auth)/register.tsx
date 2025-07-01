import assets from "@/assets";
import { auth } from "@/lib/firebase-config";
import { createUserProfile } from "@/api/modules/user";
import screen from "@/utils/screen";
import { toast } from "@/utils/toast";
import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { Image, TextInput, TouchableOpacity, View, Text, StyleSheet, ImageBackground, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import Checkbox from "@/components/checkbox";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function RegisterScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();

    const handleRegister = async () => {
        // Validate input
        if (!name) {
            toast.error(t("app.error"), t("app.name_not_be_empty"));
            return;
        }

        if (!email) {
            toast.error(t("app.error"), t("app.email_not_be_empty"));
            return;
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
            toast.error(t("app.error"), t("app.invalid_email"));
            return;
        }

        if (!phone) {
            toast.error(t("app.error"), t("app.phone_not_be_empty"));
            return;
        }

        if (!password) {
            toast.error(t("app.error"), t("app.password_not_be_empty"));
            return;
        } else if (password.length < 6) {
            toast.error(t("app.error"), t("app.password_length_must_has_at_least_6_characters"));
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
                email,
                role: "user",
                phone,
                avatar: "https://preview.redd.it/turned-my-avatar-into-a-2010-inspired-profile-picture-yes-i-v0-ergti3sxlrae1.png?width=640&crop=smart&auto=webp&s=9ae5f2ad8f385489fd4dc035da097cc7cb3f515a"
            });

            if (success) {
                toast.success(t('app.success'), t('app.register_successfully'));
                router.replace("/(auth)" as any);
            } else {
                toast.error(t('app.error'), t('app.an_error_occured_when_creating_user'));
            }
        } catch (error: any) {
            if (error.code === 'auth/email-already-in-use') {
                toast.error(t('app.register_error'), t('app.email_was_used'));
            } else {
                toast.error(t('app.register_error'), t('app.an_error_occured_when_creating_user'));
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAwareScrollView>
            <ImageBackground source={assets.background.background} style={styles.container}>
                <Image source={assets.logo} style={styles.logo} />
                <Text style={{ fontSize: 20 }}>{t('app.your_information_is_useful')}</Text>
                <View style={styles.inputContainer}>
                    <View style={styles.inputWrapper}>
                        <Image source={assets.icon.register_user} style={styles.icon} />
                        <TextInput
                            placeholder={t('app.full_name')}
                            style={styles.input}
                            onChangeText={(text) => setName(text)}
                            value={name}
                        />
                    </View>
                    <View>
                        <Image source={assets.icon.register_lock} style={styles.icon} />
                        <TextInput
                            placeholder={t('app.password')}
                            style={styles.input}
                            onChangeText={(text) => setPassword(text)}
                            value={password}
                            secureTextEntry
                        />
                    </View>
                    <View>
                        <Image source={assets.icon.register_mail} style={styles.icon} />
                        <TextInput
                            placeholder="Email"
                            style={styles.input}
                            onChangeText={(text) => setEmail(text)}
                            keyboardType="email-address"
                            value={email}
                        />
                    </View>
                    <View>
                        <Image source={assets.icon.register_phone} style={styles.icon} />
                        <TextInput
                            placeholder={t('app.phone')}
                            style={styles.input}
                            onChangeText={(text) => setPhone(text)}
                            value={phone}
                        />
                    </View>

                    <View style={{ width: '100%', marginTop: 5, flexDirection: 'row', gap: 5, alignItems: 'center' }}>
                        <Checkbox
                            checked={true}
                            onChange={() => { }}
                        />
                        <Text style={{ fontSize: 16 }}>{t('app.i_aggree_with_privacy')}</Text>
                    </View>
                </View>
                <View style={{ marginTop: 'auto', width: '100%' }}>
                    <TouchableOpacity style={{
                        width: '100%',
                        paddingBlock: 6,
                        backgroundColor: 'white',
                        borderRadius: 20,
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 8,
                        justifyContent: 'center'
                    }}
                        disabled={loading}
                        onPress={handleRegister}
                    >
                        {loading && <ActivityIndicator style={{ zIndex: 10 }} color="#347433" size={18} />}
                        <Text style={{ color: 'red', textAlign: 'center', fontSize: 24, textTransform: 'uppercase' }}>{t('app.continue')}</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        paddingBlock: 90,
        paddingInline: 40,
        gap: 10
    },

    logo: {
        height: screen.height * 0.12,
        objectFit: 'contain',
        alignSelf: 'center'
    },

    inputContainer: {
        flex: 1,
        marginTop: '10%',
        gap: 20
    },

    input: {
        backgroundColor: 'white',
        width: '100%',
        borderRadius: 8,
        paddingLeft: 50,
        height: 50
    },

    inputWrapper: {
        position: 'relative',
    },

    icon: {
        position: 'absolute',
        top: '50%',
        left: '5%',
        transform: [
            {
                translateY: '-50%'
            }
        ],
        zIndex: 10
    }
}) 