import assets from '@/assets';
import { auth, firestore } from '@/lib/firebase-config';
import { useAuth } from '@/providers/AuthenticatedProvider';
import { Info } from '@/types';
import screen from '@/utils/screen';
import { toast } from '@/utils/toast';
import { doc, getDoc } from '@firebase/firestore';
import { router } from 'expo-router';
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithCredential, signInWithEmailAndPassword } from 'firebase/auth';
import React from 'react';
import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ImageBackground, Image, TouchableOpacity, Modal } from 'react-native';
import i18next, { languageResources } from '../../services/i18next';
import { useTranslation } from 'react-i18next';
import languagesList from '../../data/list.json';
import { socialsAuth } from '../../data/social';
import BackgroundLoading2 from '@/components/loading/background_2';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { getLanguage, saveLanguage } from '@/utils/language';

// GoogleSignin.configure({
//     webClientId: '41177389907-05b5p59bopg7evhc938m1fee8fuca47e.apps.googleusercontent.com',
//     offlineAccess: true,
// });

export default () => {
    const { setUser, setCart, setInfo, user } = useAuth();
    const [loading, setLoading] = useState(true);
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
            if(lng) await changeLng(lng);
        };

        getLng();
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (authenticatedUser) => {
            setTimeout(async () => {
                if (authenticatedUser) {
                    setUser(authenticatedUser);
                    const userInfo = await checkIsInformationExists(authenticatedUser.uid);

                    if (userInfo) {
                        setInfo(userInfo);
                        router.push(userInfo.role === "seller" ? "/(seller-home)" : "/(home)");
                    }
                    else {
                        router.push('/(auth)/register');
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

    const login = async () => {
        // await createUserWithEmailAndPassword(auth, "lag1@gmail.com", "123456");
    }

    const sellerLogin = async () => {
        await signInWithEmailAndPassword(auth, "adad@gmail.com", "123456");
    }

    const googleLogin = async () => {
        try {
            // await GoogleSignin.hasPlayServices();
            // const userInfo = await GoogleSignin.signIn();

            // const idToken = userInfo.data?.idToken;
            // if (!idToken) throw new Error('Google sign-in failed: No idToken returned.');

            // const googleCredential = GoogleAuthProvider.credential(idToken);
            // return await signInWithCredential(auth, googleCredential);
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <ImageBackground source={assets.background.background} style={styles.container}>
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
                            style={[styles.button, { backgroundColor: item.background }]}
                            onPress={() => {
                                if (item.id === 2) sellerLogin();
                                else if (item.id === 1) login();
                                else {
                                    signInWithEmailAndPassword(auth,"abc@gmail.com", "123456")
                                }
                            }}
                        >
                            <Image source={item.icon} />
                            <Text style={{ color: 'white', textAlign: 'center' }}>{t(item.name)}</Text>
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
                    <Text style={{ color: "#fff" }}>{t('auth.login.phone')}</Text>
                </TouchableOpacity>
            </View>

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

            {loading && <BackgroundLoading2 style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }} />}
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor: "white",
        paddingBlock: 90,
        paddingInline: 50,
        gap: 30
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
        objectFit: 'contain'
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