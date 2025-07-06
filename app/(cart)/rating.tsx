import { getBookingById } from "@/api/modules/booking"
import { getReviewByBookingId } from "@/api/modules/review"
import BackgroundLoading2 from "@/components/loading/background_2"
import { RateOrderScreen } from "@/components/ui/cart/cart/rating"
import { ReviewOrderScreen } from "@/components/ui/cart/cart/review"
import { useAuth } from "@/providers/AuthenticatedProvider"
import { Booking, Review } from "@/types"
import { useLocalSearchParams } from "expo-router"
import React, { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { StyleSheet, View } from "react-native"
import PagerView from "react-native-pager-view"

export default function RatingScreen() {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const pagerRef = useRef<PagerView>(null);
    const [star, setStar] = useState(0);
    const [booking, setBooking] = useState<Booking | null>(null);
    const [review, setReview] = useState<Review | null>(null);
    const { info } = useAuth();
    const params = useLocalSearchParams();

    const onLoad = async () => {
        try {
            const [booking, review] = await Promise.all([
                getBookingById(params?.bookingId as string),
                getReviewByBookingId(params?.bookingId as string)
            ])

            setBooking(booking);
            if (review) {
                setStar(review.rating);
                setReview(review);
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (params && params.bookingId) {
            setReview(null);
            setLoading(true);
            onLoad();
        }
    }, [params?.bookingId]);

    return (
        <View style={styles.appContainer}>
            {
                loading ?
                    <BackgroundLoading2 />
                    :
                    <PagerView
                        style={{ flex: 1 }}
                        initialPage={0}
                        ref={pagerRef}
                        scrollEnabled={false}
                    >
                        <View
                            style={{ flex: 1 }}
                            key="1"
                        >
                            <RateOrderScreen
                                loading={loading}
                                restaurantName={booking?.restaurantName}
                                pagerRef={pagerRef}
                                setStar={setStar}
                                star={star}
                                review={review}
                                t={t}
                            />
                        </View>
                        <View
                            style={{ flex: 1 }}
                            key="2"
                        >
                            <ReviewOrderScreen
                                loading={loading}
                                pagerRef={pagerRef}
                                star={star}
                                booking={booking}
                                info={info}
                                review={review}
                                t={t}
                            />
                        </View>
                    </PagerView>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    appContainer: {
        flex: 1,
        backgroundColor: 'white',
        paddingTop: 32
    },
})