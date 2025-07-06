import { getAllRestaurants } from '@/api/modules/restaurant';
import { getFullReviewsDetail } from '@/api/modules/review';
import { Restaurant } from '@/types';
import screen from '@/utils/screen';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, ScrollView, Image, RefreshControl } from 'react-native';

const RestaurantReviewsApp = () => {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
    const [loading, setLoading] = useState(true);

    const onLoad = async () => {
        setLoading(true);
        try {
            const restaurants = await getAllRestaurants();
            setRestaurants(restaurants);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        onLoad();
    }, []);

    const renderStars = (rating: number) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            stars.push(<MaterialIcons name="star" key={i} size={16} fill="#FFD700" color="#FFD700" />);
        }

        if (hasHalfStar) {
            stars.push(<MaterialIcons key="half" name="star-half" size={16} fill="#FFD700" color="#FFD700" style={{ opacity: 0.5 }} />);
        }

        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<MaterialIcons key={`empty-${i}`} name="star-outline" size={16} color="#D1D5DB" />);
        }

        return stars;
    };

    const renderReviewStars = (rating: number) => {
        const stars = [];
        for (let i = 0; i < 5; i++) {
            stars.push(
                <MaterialIcons
                    name="star"
                    key={i}
                    size={14}
                    fill={i < rating ? "#FFD700" : "transparent"}
                    color={i < rating ? "#FFD700" : "#D1D5DB"}
                />
            );
        }
        return stars;
    };

    const RestaurantItem = ({ item }: { item: Restaurant }) => (
        <TouchableOpacity
            style={styles.restaurantCard}
            onPress={() => setSelectedRestaurant(item)}
        >
            <View style={styles.restaurantHeader}>
                <Text style={styles.restaurantName}>{item.name}</Text>
                <View style={styles.ratingContainer}>
                    {renderStars(item.rating)}
                    <Text style={styles.ratingText}>{item.rating.toLocaleString(undefined, {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2
                    })}</Text>
                </View>
            </View>
            <Text style={styles.cuisine}>{item.categories?.map(item => item.name).join(', ')}</Text>
            <View style={styles.addressContainer}>
                <MaterialIcons name="map" size={14} color="#666" />
                <Text style={styles.address}>{item.address}</Text>
            </View>
            <View style={styles.reviewsInfo}>
                <MaterialIcons name="person" size={14} color="#666" />
                <Text style={styles.reviewCount}>{item.ratingCount} lượt đánh giá</Text>
            </View>
        </TouchableOpacity>
    );

    const ReviewItem = ({ review }: any) => (
        <View style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
                <View>
                    <Text style={styles.reviewUser}>{review.userName}</Text>

                    {review.images && review.images.length > 0 && (
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={styles.imageScrollView}
                            contentContainerStyle={styles.imageContainer}
                        >
                            {review.images && review.images.length > 0 && review.images.map((imageUri: string, index: number) => (
                                <Image
                                    key={index}
                                    source={{ uri: imageUri }}
                                    style={styles.reviewImage}
                                    resizeMode="cover"
                                />
                            ))}
                        </ScrollView>
                    )}

                    <View style={styles.reviewRating}>
                        {renderReviewStars(review.rating)}
                    </View>
                </View>
                <Text style={styles.reviewDate}>{review.createdAt.toDate().toLocaleString()}</Text>
            </View>
            <Text style={styles.reviewComment}>{review.comment}</Text>
        </View>
    );

    const RestaurantList = () => (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <View style={styles.header}>
                <View style={{
                    flexDirection: 'row',
                    gap: 10,
                    alignItems: 'center'
                }}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <MaterialIcons name="chevron-left" size={30} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Nhà hàng</Text>
                </View>
                <Text style={styles.headerSubtitle}>Khám phá những nơi tuyệt vời để ăn</Text>
            </View>
            {
                loading ?
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Text>Đang tải...</Text>
                    </View>
                    :
                    <FlatList
                        data={restaurants}
                        renderItem={({ item }) => <RestaurantItem item={item} />}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.listContainer}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl refreshing={false} onRefresh={onLoad} />
                        }
                    />
            }
        </SafeAreaView>
    );

    const RestaurantReviews = () => {
        const [reviews, setReviews] = useState<any[]>([]);
        const [loading, setLoading] = useState(false);

        const onLoad = async () => {
            setLoading(true);
            try {
                const reviews = await getFullReviewsDetail(selectedRestaurant?.id ?? "");
                setReviews(reviews);
            } finally {
                setLoading(false);
            }
        }

        useEffect(() => {
            if (selectedRestaurant) onLoad();
        }, [selectedRestaurant]);

        return (
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor="#fff" />
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => setSelectedRestaurant(null)}
                    >
                        <Text style={styles.backButtonText}>← Quay lại</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{selectedRestaurant?.name}</Text>
                </View>

                <ScrollView
                    style={styles.reviewsContainer}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={false} onRefresh={onLoad} />
                    }
                >
                    <View style={styles.restaurantDetails}>
                        <Image
                            source={{ uri: selectedRestaurant?.imageUrl ?? "" }}
                            style={{
                                width: '100%',
                                height: screen.height * 0.2,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 12,
                                marginBottom: 16
                            }}
                        />
                        <View style={styles.detailsHeader}>
                            <View style={styles.ratingContainer}>
                                {renderStars(selectedRestaurant?.rating ?? 0)}
                                <Text style={styles.ratingText}>{selectedRestaurant?.rating?.toLocaleString(undefined, {
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 2
                                })}</Text>
                            </View>
                            <Text style={styles.reviewsCount}>
                                {selectedRestaurant?.ratingCount} lượt đánh giá
                            </Text>
                        </View>
                        <Text style={styles.cuisine}>{selectedRestaurant?.categories?.map(item => item.name).join(', ')}</Text>
                        <View style={styles.addressContainer}>
                            <MaterialIcons name="map" size={14} color="#666" />
                            <Text style={styles.address}>{selectedRestaurant?.address}</Text>
                        </View>
                    </View>

                    <View style={styles.reviewsSection}>
                        <Text style={styles.sectionTitle}>Khách hàng đánh giá</Text>
                        {
                            loading ?
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text>Đang tải...</Text>
                                </View>
                                :
                                reviews.map((review: any, index: number) => (
                                    <ReviewItem key={index} review={review} />
                                ))
                        }
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    };

    return selectedRestaurant ? <RestaurantReviews /> : <RestaurantList />;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 32
    },
    header: {
        backgroundColor: '#fff',
        padding: 20,
        paddingTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef'
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#212529',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#6c757d',
    },
    backButton: {
        marginBottom: 10,
    },
    backButtonText: {
        fontSize: 16,
        color: '#007bff',
        fontWeight: '600',
    },
    listContainer: {
        padding: 16,
    },
    restaurantCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    restaurantHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    restaurantName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#212529',
        flex: 1,
        marginRight: 8,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    ratingText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#495057',
        marginLeft: 4,
    },
    cuisine: {
        fontSize: 14,
        color: '#6c757d',
        marginBottom: 8,
    },
    addressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    address: {
        fontSize: 14,
        color: '#6c757d',
        marginLeft: 4,
        flex: 1,
    },
    reviewsInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    reviewCount: {
        fontSize: 14,
        color: '#6c757d',
        marginLeft: 4,
    },
    reviewsContainer: {
        flex: 1,
    },
    restaurantDetails: {
        backgroundColor: '#fff',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
    },
    detailsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    reviewsCount: {
        fontSize: 14,
        color: '#6c757d',
    },
    reviewsSection: {
        padding: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#212529',
        marginBottom: 16,
    },
    reviewCard: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    reviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    reviewUser: {
        fontSize: 16,
        fontWeight: '600',
        color: '#212529',
        marginBottom: 4,
    },
    reviewRating: {
        flexDirection: 'row',
        gap: 2,
    },
    reviewDate: {
        fontSize: 12,
        color: '#6c757d',
    },
    reviewComment: {
        fontSize: 14,
        color: '#495057',
        lineHeight: 20,
    },
    imageScrollView: {
        marginBottom: 8,
    },
    imageContainer: {
        paddingRight: 8,
    },
    reviewImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 8,
        backgroundColor: '#f0f0f0',
    },
});

export default RestaurantReviewsApp;