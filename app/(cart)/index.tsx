import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import PagerView from 'react-native-pager-view';
import { Cart, Restaurant } from '@/types';
import { getCart } from '@/api/modules/cart';
import { useAuth } from '@/providers/AuthenticatedProvider';
import { CookingCartScreen } from '@/components/ui/cart/cart/cooking';
import { CartScreen } from '@/components/ui/cart/cart/cart';
import { getRestaurantById } from '@/api/modules/restaurant';
import { EmptyCart } from '@/components/ui/cart/empty';
import { useTranslation } from 'react-i18next';
import CheckoutScreen from '@/components/ui/cart/cart/checkout';

const FoodDeliveryApp = () => {
    const [cart, setCart] = useState<Cart | null>(null);
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
    const { info } = useAuth();
    const [loading, setLoading] = useState(true);
    const pagerRef = useRef<PagerView>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [bookingId, setBookingId] = useState<string | null>(null);
    const [currentStep, setCurrentStep] = useState(1);
    const { t } = useTranslation();

    const onLoad = async () => {
        setLoading(true);
        const cart = await getCart(info?.id ?? "");
        if (cart) {
            setCart(cart);
            if (cart.restaurantId) {
                await onLoadRestaurant(cart.restaurantId);
            }
        };
        setLoading(false);
    }

    const onLoadRestaurant = async (restaurantId: string) => {
        const restaurant = await getRestaurantById(restaurantId);
        if (restaurant) setRestaurant(restaurant);
    }

    useEffect(() => {
        onLoad();
    }, [info]);

    return (
        <View style={styles.appContainer}>
            {
                !cart?.cartItems || cart.cartItems.length <= 0 ?
                    <EmptyCart t={t} />
                    :
                    <PagerView
                        style={{ flex: 1 }}
                        initialPage={0}
                        ref={pagerRef}
                        onPageSelected={e => setCurrentPage(e.nativeEvent.position)}
                        scrollEnabled={false}
                    >
                        <View style={{ flex: 1 }}>
                            <CartScreen
                                key="1"
                                onLoad={onLoad}
                                cart={cart}
                                restaurant={restaurant}
                                info={info}
                                pagerRef={pagerRef}
                                loading={loading}
                                currentStep={currentStep}
                                setCurrentStep={setCurrentStep}
                                t={t}
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <CheckoutScreen
                                key="2"
                                loading={loading}
                                restaurant={restaurant}
                                pagerRef={pagerRef}
                                cart={cart}
                                currentPage={currentPage}
                                setBookingId={setBookingId}
                                currentStep={currentStep}
                                setCurrentStep={setCurrentStep}
                                info={info}
                                t={t}
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <CookingCartScreen
                                key="3"
                                loading={loading}
                                restaurant={restaurant}
                                pagerRef={pagerRef}
                                cart={cart}
                                currentPage={currentPage}
                                bookingId={bookingId}
                                t={t}
                            />
                        </View>
                    </PagerView>
            }
        </View>
    );
};

const styles = StyleSheet.create({
    // App container
    appContainer: {
        flex: 1,
        backgroundColor: 'white',
        paddingTop: 32
    },

    flex1BgGray50: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
});

export default FoodDeliveryApp;