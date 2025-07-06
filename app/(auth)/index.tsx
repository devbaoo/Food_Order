import assets from '@/assets';
import { auth, firestore } from '@/lib/firebase-config';
import { useAuth } from '@/providers/AuthenticatedProvider';
import { Info } from '@/types';
import screen from '@/utils/screen';
import { doc, getDoc } from '@firebase/firestore';
import { router } from 'expo-router';
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import React from 'react';
import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ImageBackground, Image, TouchableOpacity, Modal, ScrollView, Alert } from 'react-native';
import i18next, { languageResources } from '../../services/i18next';
import { useTranslation } from 'react-i18next';
import languagesList from '../../data/list.json';
import { socialsAuth } from '../../data/social';
import BackgroundLoading2 from '@/components/loading/background_2';
import { getLanguage, saveLanguage } from '@/utils/language';

// Import Google Sign-In
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { toast } from '@/utils/toast';

// Configure Google Sign-In
GoogleSignin.configure({
    webClientId: '41177389907-fr6hv5tafpegv834h62t7svalfe0e2d4.apps.googleusercontent.com',
    offlineAccess: true,
    scopes: ['profile', 'email'],
});

export default () => {
    const { setUser, setCart, setInfo, user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [googleLoading, setGoogleLoading] = useState(false);
    const { t } = useTranslation();

    const changeLng = async (lng: string) => {
        i18next.changeLanguage(lng);
        await saveLanguage(lng);
    };

    const currentLang = i18next.language;
    const [isVisible, setIsVisible] = useState(false);

    const checkIsInformationExists = async (id: string): Promise<Info | null> => {
        const docRef = doc(firestore, 'users', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return {
                id: docSnap.id,
                name: docSnap.data()?.name ?? '',
                avatar: docSnap.data()?.avatar ?? '',
                phone: docSnap.data()?.phone ?? '',
                address: docSnap.data()?.address ?? '',
                provinceAddress: docSnap.data()?.provinceAddress ?? '',
                role: docSnap.data()?.role ?? 'user',
                location: docSnap.data()?.location ?? { latitude: 0, longitude: 0 }
            };
        } else {
            return null;
        }
    }

    useEffect(() => {
        const getLng = async () => {
            const lng = await getLanguage();
            if (lng) await changeLng(lng);
        };

        getLng();
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (authenticatedUser) => {
            setTimeout(async () => {
                if (authenticatedUser) {
                    const isGoogleLogin = authenticatedUser.providerData.some(
                        (provider) => provider.providerId === 'google.com'
                    );

                    setUser(authenticatedUser);
                    const userInfo = await checkIsInformationExists(authenticatedUser.uid);
                    if (userInfo) {
                        setInfo(userInfo);
                        router.push(userInfo.role === "seller" ? "/(seller-home)" : userInfo.role === "shipper" ? "/(shipper-home)" : "/(home)");
                    }
                    else {
                        router.push({
                            pathname: '/(auth)/register',
                            params: {
                                isGoogleLogin: isGoogleLogin ? 'true' : 'false',
                                uid: authenticatedUser.uid,
                            },
                        });
                        return;
                    }
                } else {
                    setUser(null);
                    setCart(null);
                    router.push("/(auth)");
                }
                setLoading(false);
            }, 500);
        });

        return unsubscribe;
    }, []);

    const googleLogin = async () => {
        try {
            setGoogleLoading(true);

            // Check if device supports Google Play Services
            await GoogleSignin.hasPlayServices({
                showPlayServicesUpdateDialog: true,
            });

            // Sign in with Google
            const userInfo = await GoogleSignin.signIn();

            // Get the ID token
            const idToken = userInfo.data?.idToken;

            if (!idToken) {
                throw new Error('Google sign-in failed: No idToken returned.');
            }

            // Create Firebase credential with the Google ID token
            const googleCredential = GoogleAuthProvider.credential(idToken);

            // Sign in to Firebase with the Google credential
            await signInWithCredential(auth, googleCredential);

            toast.success(t("app.success"), t("app.login_successfully"));

        } catch (error: any) {
            console.error('Google login error:', error);

            // Handle specific error codes
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                Alert.alert('Cancelled', 'Google sign-in was cancelled');
            } else if (error.code === statusCodes.IN_PROGRESS) {
                Alert.alert('In Progress', 'Google sign-in is already in progress');
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                Alert.alert('Error', 'Google Play Services not available');
            } else {
                Alert.alert('Error', 'Failed to sign in with Google. Please try again.');
            }
        } finally {
            setGoogleLoading(false);
        }
    }

    const handleSocialLogin = (item: any) => {
        if (item.name === 'auth.login.google' || item.id === 2) {
            // Assuming Google login button has this name or id
            googleLogin();
        } else {
            signInWithEmailAndPassword(auth, "abc@gmail.com", "123456");
        }
    };

    return (
        <ImageBackground source={assets.background.background} style={styles.container}>
            <ScrollView
                style={{ flex: 1, width: '100%', height: '100%' }}
                contentContainerStyle={{ gap: 30, alignItems: 'center', paddingBottom: 64 }}
                showsVerticalScrollIndicator={false}
            >
                <Image source={assets.logo} style={styles.logo} />
                <View style={{ flexDirection: 'row', gap: 5 }}>
                    {Object.keys(languageResources).map((item, index, array) => {
                        const lang = languagesList[item as keyof typeof languagesList];
                        if (!lang) return null;

                        return (
                            <React.Fragment key={index}>
                                <TouchableOpacity
                                    onPress={() => changeLng(item)}
                                    style={currentLang === item && { borderBottomWidth: 1, borderColor: 'white' }}
                                >
                                    <Text style={{ color: 'white' }}>{lang.nativeName}</Text>
                                </TouchableOpacity>

                                {index < array.length - 1 && (
                                    <Text style={{ color: 'white', marginHorizontal: 2 }}>|</Text>
                                )}
                            </React.Fragment>
                        );
                    })}
                </View>
                <Image source={currentLang === "en" ? assets.text.text_en : assets.text.text} style={{ alignSelf: 'flex-start' }} />

                <View style={{ width: '100%', gap: 12, marginTop: 'auto' }}>
                    {
                        socialsAuth.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                style={[
                                    styles.button,
                                    { backgroundColor: item.background },
                                    googleLoading && (item.name === 'auth.login.google' || item.id === 2) && { opacity: 0.6 }
                                ]}
                                onPress={() => handleSocialLogin(item)}
                                disabled={googleLoading && (item.name === 'auth.login.google' || item.id === 2)}
                            >
                                <Image source={item.icon} />
                                <Text style={{ color: 'white', textAlign: 'center' }}>
                                    {googleLoading && (item.name === 'auth.login.google' || item.id === 2)
                                        ? 'Signing in...'
                                        : t(item.name)
                                    }
                                </Text>
                            </TouchableOpacity>
                        ))
                    }
                    <View style={styles.lineContainer}>
                        <View style={styles.line} />
                        <Text style={styles.lineText}>{t('global.or')}</Text>
                        <View style={styles.line} />
                    </View>
                    <TouchableOpacity
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingBlock: 15,
                            borderRadius: 20,
                            gap: 12,
                            backgroundColor: "#800ab5"
                        }}
                        onPress={() => setIsVisible(true)}
                    >
                        <Image source={assets.icon.phone} />
                        <Text style={{ color: "#fff" }}>{t('auth.login.email')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingBlock: 15,
                            borderRadius: 20,
                            gap: 12,
                            borderColor: "#800ab5",
                            borderWidth: 2
                        }}
                        onPress={() => router.push('/(auth)/register')}
                    >
                        <Image style={{ tintColor: "#800ab5" }} source={assets.icon.register_mail} />
                        <Text style={{ color: "#fff" }}>{t('auth.register')}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <Modal
                visible={isVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setIsVisible(false)}
            >
                <ImageBackground source={assets.background.background_full} style={styles.modalOverlay}>
                    <View style={styles.dialogContainer}>
                        <View style={styles.dialogContent}>
                            <Text style={styles.dialogTitle}>
                                {t('app.navigate_to')}
                            </Text>
                        </View>

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setIsVisible(false)}
                            >
                                <Text style={styles.cancelButtonText}>{t('app.no')}</Text>
                            </TouchableOpacity>

                            <View style={styles.buttonDivider} />

                            <TouchableOpacity
                                style={[styles.modalButton, styles.confirmButton]}
                                onPress={() => {
                                    setIsVisible(false);
                                    router.push('/(auth)/phone');
                                }}
                            >
                                <Text style={styles.confirmButtonText}>{t('app.yes')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ImageBackground>
            </Modal>

            {(loading || googleLoading) && <BackgroundLoading2 style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }} />}
        </ImageBackground>
    );
};

// ... rest of your styles remain the same
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor: "white",
        paddingInline: screen.width * 0.1,
        paddingTop: 64
    },
    splash: {
        flex: 1,
        resizeMode: "contain"
    },
    text: {
        fontSize: 16,
        fontWeight: "bold",
        color: "white"
    },
    logo: {
        height: screen.height * 0.09,
        objectFit: 'contain',
        alignSelf: 'center'
    },
    button: {
        width: '100%',
        paddingBlock: 15,
        textAlign: 'center',
        borderRadius: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5
    },
    lineContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: 'black',
    },
    lineText: {
        marginHorizontal: 12,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(135, 206, 235, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    dialogContainer: {
        backgroundColor: '#F5F5DC',
        borderRadius: 16,
        width: '100%',
        maxWidth: 320,
        overflow: 'hidden',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    dialogContent: {
        paddingHorizontal: 24,
        paddingVertical: 32,
    },
    dialogTitle: {
        fontSize: 18,
        fontWeight: '500',
        color: '#333',
        textAlign: 'center',
        lineHeight: 26,
    },
    buttonContainer: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: '#ddd',
    },
    modalButton: {
        flex: 1,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonDivider: {
        width: 1,
        backgroundColor: '#ddd',
    },
    cancelButton: {
        backgroundColor: 'transparent',
    },
    confirmButton: {
        backgroundColor: 'transparent',
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    confirmButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FF4444',
    },
});