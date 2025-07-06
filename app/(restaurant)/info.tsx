import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import screen from '@/utils/screen';
import { router, useLocalSearchParams } from 'expo-router';
import { Restaurant } from '@/types';
import { useAuth } from '@/providers/AuthenticatedProvider';
import { toast } from '@/utils/toast';
import { useTranslation } from 'react-i18next';
import { updateFavourite } from '@/api/modules/favourite';

const RestaurantInfoPage: React.FC = () => {
    const { restaurantSF } = useLocalSearchParams();
    const { info } = useAuth();
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
    const [isFavourite, setIsFavourite] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        if (restaurantSF) {
            const parsedRestaurant = JSON.parse(restaurantSF as string) as Restaurant;
            setIsFavourite(parsedRestaurant.favourite);
            setRestaurant(parsedRestaurant);
        }
    }, [restaurantSF]);

    const renderStars = (rating: number) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            stars.push(
                <Ionicons
                    key={i}
                    name="star"
                    size={16}
                    color="#FFD700"
                />
            );
        }

        if (hasHalfStar) {
            stars.push(
                <Ionicons
                    key="half"
                    name="star-half"
                    size={16}
                    color="#FFD700"
                />
            );
        }

        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars.push(
                <Ionicons
                    key={`empty-${i}`}
                    name="star-outline"
                    size={16}
                    color="#FFD700"
                />
            );
        }

        return stars;
    };

    const handleUpdateFavourite = async () => {
        setIsFavourite(!isFavourite);
        if (!info || !restaurant) {
            toast.error(t('app.error'), t('app.unauthorized'));
            return;
        }
        try {
            await updateFavourite(info?.id, restaurant.id);
        } catch (error) {
            setIsFavourite(!isFavourite);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Header Image */}
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: restaurant?.imageUrl }}
                        style={styles.headerImage}
                        resizeMode="cover"
                    />
                    <View style={styles.favouriteContainer}>
                        <TouchableOpacity
                            style={styles.favouriteButton}
                            onPress={() => router.back()}
                        >
                            <Ionicons
                                name="arrow-back"
                                size={24}
                                color="#fff"
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.favouriteButton}
                            onPress={handleUpdateFavourite}
                        >
                            <Ionicons
                                name={isFavourite ? "heart" : "heart-outline"}
                                size={24}
                                color={isFavourite ? "#FF6B6B" : "#fff"}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Restaurant Info */}
                <View style={styles.infoContainer}>
                    {/* Name and Rating */}
                    <View style={styles.headerInfo}>
                        <Text style={styles.restaurantName}>{restaurant?.name}</Text>
                        <View style={styles.ratingContainer}>
                            <View style={styles.starsContainer}>
                                {renderStars(restaurant?.rating ?? 0)}
                            </View>
                            <Text style={styles.ratingText}>
                                {restaurant?.rating.toLocaleString(undefined, {
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 2
                                })} ({restaurant?.ratingCount} lượt đánh giá)
                            </Text>
                        </View>
                    </View>

                    {/* Categories */}
                    {restaurant?.categories && restaurant.categories.length > 0 && (
                        <View style={styles.categoriesContainer}>
                            {restaurant.categories.map((category) => (
                                <View
                                    key={category.id}
                                    style={[
                                        styles.categoryTag,
                                        { backgroundColor: '#E0E0E0' }
                                    ]}
                                >
                                    <Text style={styles.categoryText}>{category.name}</Text>
                                </View>
                            ))}
                        </View>
                    )}

                    {/* Address */}
                    <View style={styles.addressContainer}>
                        <Ionicons name="location-outline" size={20} color="#666" />
                        <Text style={styles.addressText}>{restaurant?.address}</Text>
                    </View>

                    {/* Action Buttons */}
                    {/* <View style={styles.actionButtons}>
                        <TouchableOpacity
                            style={[styles.actionButton, styles.callButton]}
                            onPress={handleCall}
                        >
                            <Ionicons name="call-outline" size={20} color="#fff" />
                            <Text style={styles.actionButtonText}>Gọi điện</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.actionButton, styles.shareButton]}
                            onPress={handleShare}
                        >
                            <Ionicons name="share-outline" size={20} color="#fff" />
                            <Text style={styles.actionButtonText}>Share</Text>
                        </TouchableOpacity>
                    </View> */}

                    {/* Additional Info Section */}
                    <View style={styles.additionalInfo}>
                        <Text style={styles.sectionTitle}>Chi tiết quán</Text>

                        <View style={styles.detailRow}>
                            <Ionicons name="time-outline" size={18} color="#666" />
                            <Text style={styles.detailText}>Mở cửa đến 10:00 PM</Text>
                        </View>

                        <View style={styles.detailRow}>
                            <Ionicons name="card-outline" size={18} color="#666" />
                            <Text style={styles.detailText}>Chấp nhận thanh toán online</Text>
                        </View>

                        <View style={styles.detailRow}>
                            <Ionicons name="wifi-outline" size={18} color="#666" />
                            <Text style={styles.detailText}>Wi-Fi miễn phí</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 32,
    },
    scrollView: {
        flex: 1,
    },
    imageContainer: {
        position: 'relative',
        height: 250,
        width: screen.width,
    },
    headerImage: {
        width: '100%',
        height: '100%',
    },
    favouriteContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'absolute',
        top: 16,
        right: 0,
        paddingHorizontal: 16
    },
    favouriteButton: {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderRadius: 20,
        padding: 8,
    },
    infoContainer: {
        padding: 20,
    },
    headerInfo: {
        marginBottom: 16,
    },
    restaurantName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    starsContainer: {
        flexDirection: 'row',
        marginRight: 8,
    },
    ratingText: {
        fontSize: 14,
        color: '#666',
    },
    categoriesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 16,
    },
    categoryTag: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginRight: 8,
        marginBottom: 8,
    },
    categoryText: {
        fontSize: 12,
        color: '#fff',
        fontWeight: '600',
    },
    addressContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 24,
    },
    addressText: {
        fontSize: 16,
        color: '#666',
        marginLeft: 8,
        flex: 1,
        lineHeight: 22,
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 8,
        marginHorizontal: 4,
    },
    directionsButton: {
        backgroundColor: '#4285F4',
    },
    callButton: {
        backgroundColor: '#34A853',
    },
    shareButton: {
        backgroundColor: '#FF6B6B',
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 6,
    },
    additionalInfo: {
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
        paddingTop: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    detailText: {
        fontSize: 16,
        color: '#666',
        marginLeft: 12,
    },
});

export default RestaurantInfoPage;