import assets from '@/assets';
import { auth, firestore } from '@/lib/firebase-config';
import { useAuth } from '@/providers/AuthenticatedProvider';
import { Cart, Info } from '@/types';
import { toast } from '@/utils/toast';
import { collection, doc, getDoc, getDocs, query, setDoc, where } from '@firebase/firestore';
import { router } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import React from 'react';
import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ImageBackground, ActivityIndicator } from 'react-native';

export default () => {
    const { setUser, setCart, setInfo } = useAuth();
    const [loading, setLoading] = useState(true);

    const checkIsCartExists = async (id: string): Promise<Cart | null> => {
        const q = query(collection(firestore, "carts"), where("userId", "==", id));
        const querySnap = await getDocs(q);

        if (!querySnap.empty) {
            const cartDoc = querySnap.docs[0];
            return {
                id: cartDoc.id,
                userId: cartDoc.data()?.userId ?? '',
                cartItems: cartDoc.data()?.cartItems ?? [],
                totalPrice: cartDoc.data()?.totalPrice ?? 0
            };
        }

        const newCartRef = doc(collection(firestore, "carts"));
        await setDoc(newCartRef, { userId: id });
      
        return {
          id: newCartRef.id,
          userId: id,
          cartItems: [],
          totalPrice: 0
        };
    };

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
                provinceAddress: docSnap.data()?.provinceAddress ?? ''
            }; // Trả về dữ liệu document
        } else {
            return null;
        }
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (authenticatedUser) => {
            setTimeout(async () => {
                if (authenticatedUser) {
                    setUser(authenticatedUser);
                    const [cart, userInfo] = await Promise.all([
                        checkIsCartExists(
                            authenticatedUser.uid
                        ),
                        checkIsInformationExists(
                            authenticatedUser.uid
                        )
                    ]);

                    if (cart && userInfo) {
                        setInfo(userInfo);
                        setCart(cart);
                        router.push("/(home)");
                    }
                    else {
                        toast.error("Alert", "Something went wrong with your information, please re-authorize!");
                        router.replace('/(auth)/login');
                        return;
                    }
                } else {
                    setUser(null);
                    setCart(null);
                    router.push("/(auth)/login");
                }
                setLoading(false);
            }, 500);
        });

        return unsubscribe;
    }, []);


    return (
        <ImageBackground source={assets.splash} style={styles.container}>
            {
                loading &&
                <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                    <ActivityIndicator size="small" color="#f6f6f6" />
                    <Text style={styles.text}>Fetching information, please wait!</Text>
                </View>
            }
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
        backgroundColor: "white",
        padding: 10,
        paddingBottom: 30
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
});