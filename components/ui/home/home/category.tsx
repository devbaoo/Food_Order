import { TouchableOpacity, View, Image, Text, StyleSheet } from "react-native"

interface HomeCategoryProps {
    categories: { id: number, name: string, icon: any }[];
}

const HomeCategory: React.FC<HomeCategoryProps> = ({ ...props }) => {
    const { categories } = props;

    return (
        <View style={styles.categoriesContainer}>
            {categories.map(category => (
                <TouchableOpacity key={category.id} style={styles.categoryItem}>
                    <View style={styles.categoryIconContainer}>
                        <Image
                            source={category.icon}
                            style={styles.categoryIcon}
                            resizeMode="contain"
                        />
                    </View>
                    <Text style={styles.categoryName}>{category.name}</Text>
                </TouchableOpacity>
            ))}
        </View>
    )
}

export default HomeCategory;

const styles = StyleSheet.create({
    categoriesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    categoryItem: {
        alignItems: 'center',
        gap: 10
    },
    categoryIconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#fff',
        justifyContent: 'center',
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
    categoryIcon: {
        width: 43,
        height: 43,
    },
    categoryName: {
        marginTop: 8,
        fontSize: 12,
        color: '#5A5555'
    },
})