import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import PagerView from 'react-native-pager-view';
import { Cart, Restaurant } from '@/types';
import { getCart } from '@/api/modules/cart';
import { useAuth } from '@/providers/AuthenticatedProvider';
import { ReviewOrderScreen } from '@/components/ui/cart/cart/review';
import { CookingCartScreen } from '@/components/ui/cart/cart/cooking';
import { DeliveryMapScreen } from '@/components/ui/cart/cart/delivery';
import { CartScreen } from '@/components/ui/cart/cart/cart';
import { RateOrderScreen } from '@/components/ui/cart/cart/rating';
import { getRestaurantById } from '@/api/modules/restaurant';
import { EmptyCart } from '@/components/ui/cart/empty';
import { useTranslation } from 'react-i18next';

const FoodDeliveryApp = () => {
    const [cart, setCart] = useState<Cart | null>(null);
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
    const { info } = useAuth();
    const [loading, setLoading] = useState(true);
    const pagerRef = useRef<PagerView>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [bookingId, setBookingId] = useState<string | null>(null);
    const [star, setStar] = useState(0);
    const {t} = useTranslation();

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
                                t={t}
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <CookingCartScreen
                                key="2"
                                loading={loading}
                                restaurant={restaurant}
                                pagerRef={pagerRef}
                                cart={cart}
                                currentPage={currentPage}
                                setBookingId={setBookingId}
                                t={t}
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <DeliveryMapScreen
                                key="3"
                                pagerRef={pagerRef}
                                currentPage={currentPage}
                                info={info}
                                bookingId={bookingId}
                                t={t}
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <RateOrderScreen
                                key="4"
                                loading={loading}
                                restaurant={restaurant}
                                pagerRef={pagerRef}
                                setStar={setStar}
                                star={star}
                                t={t}
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <ReviewOrderScreen
                                key="5"
                                loading={loading}
                                restaurant={restaurant}
                                pagerRef={pagerRef}
                                star={star}
                                bookingId={bookingId}
                                info={info}
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