import assets from "@/assets";
import screen from "@/utils/screen";
import { Feather } from "@expo/vector-icons"
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet } from "react-native"

interface HomeReviewProps {
    reviews: { id: number, name: string, rating: number, image: any }[];
}

const HomeReview: React.FC<HomeReviewProps> = ({ ...props }) => {
    const { reviews } = props;

    return (
        <View style={styles.reviewsContainer}>
            <View style={styles.reviewsHeader}>
                <Text style={styles.reviewsTitle}>Buyer Reviews</Text>
                <TouchableOpacity>
                    <Text style={styles.seeAllText}>See all</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16, gap: 16 }}
            >
                {reviews.map(review => (
                    <View key={review.id} style={styles.reviewCard}>
                        <View style={styles.reviewerImageContainer}>
                            <Image
                                source={review.image}
                                style={styles.reviewerImage}
                                resizeMode="cover"
                            />
                        </View>
                        <Text style={styles.reviewerName}>{review.name}</Text>
                        <View style={styles.ratingContainer}>
                            <Image source={assets.icon.star} style={{ width: 16, height: 16 }} />
                            <Text style={styles.ratingText}>Ratings</Text>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>
    )
}

export default HomeReview;

const styles = StyleSheet.create({
    reviewsContainer: {

    },
    reviewsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        backgroundColor: 'white',
        padding: 16
    },
    reviewsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    seeAllText: {
        fontSize: 14,
        color: '#1E88E5',
    },
    reviewCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 10,
        width: screen.width / 2.5,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    reviewerImageContainer: {
        width: '100%',
        height: screen.height / 5.3,
        backgroundColor: '#F6F6F6',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        marginBottom: 12,
    },
    reviewerImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    reviewerName: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 4,
        textAlign: 'left',
        width: '100%'
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%'
    },
    ratingText: {
        fontSize: 14,
        color: '#555',
        marginLeft: 4,
    },
    bottomNav: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        paddingBottom: 20, // Adjust for safe area
    },
    navItem: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 8,
    },
    navText: {
        fontSize: 12,
        marginTop: 4,
        color: '#999',
    },
    activeNavText: {
        color: '#1E88E5',
    },
})