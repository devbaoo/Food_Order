import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Image,
    Switch,
    Alert,
    RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Food } from '@/types';
import { createProduct, deleteProduct, getAllFoodsByRestaurantId, updateProduct } from '@/api/modules/food';
import { useAuth } from '@/providers/AuthenticatedProvider';
import BackgroundLoading from '@/components/loading/background';
import { useTranslation } from 'react-i18next';
import { doc } from '@firebase/firestore';
import { firestore } from '@/lib/firebase-config';
import { formatCurrency } from '@/utils/currency';
import { AddProductModal } from '@/components/modal/product/add';

type FoodFormData = {
    name: string;
    price: string;
    description: string;
    category: string;
    imageUrl?: string;
};

export default function ProductScreen() {
    const { restaurant } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { t } = useTranslation();
    const [formData, setFormData] = useState<FoodFormData>({
        name: '',
        price: '',
        description: '',
        category: '',
        imageUrl: ''
    });

    const [products, setProducts] = useState<Food[]>([]);

    const onLoad = async () => {
        setLoading(true);
        try {
            const foods = await getAllFoodsByRestaurantId(restaurant?.id ?? "");

            if (foods && foods.length > 0) {
                setProducts(foods);
            }
        } catch (err) {

        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (restaurant) {
            onLoad();
        }
    }, []);

    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [products, searchQuery, selectedCategory]);

    const resetForm = () => {
        setFormData({
            name: '',
            price: '',
            description: '',
            category: '',
            imageUrl: ''
        });
    }

    const handleAddProduct = useCallback(async () => {
        if (!formData.name || !formData.price) {
            Alert.alert(t('app.error'), t('app.fill_all_required_fields'));
            return;
        }

        const product = {
            ...formData,
            basePrice: Number(formData.price ?? 0),
            restaurantId: restaurant?.id,
            category: doc(firestore, 'categories', formData.category)
        };

        await createProduct(product)

        setShowAddModal(false);
        resetForm();
        onLoad();
        Alert.alert(t("app.success"), 'Product added successfully!');
    }, [formData, restaurant?.id, resetForm]);

    const handleEditProduct = useCallback((product: Food) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            price: product.basePrice.toString(),
            description: product.description,
            category: product.category,
            imageUrl: product.imageUrl
        });
        setShowAddModal(true);
    }, []);

    const handleUpdateProduct = useCallback(async () => {
        if (!formData.name || !formData.price) {
            Alert.alert(t("app.error"), t("app.fill_all_required_fields"));
            return;
        }

        const product = {
            ...formData,
            basePrice: Number(formData.price ?? 0),
            restaurantId: restaurant?.id,
            category: doc(firestore, 'categories', formData.category)
        };

        await updateProduct(product, editingProduct.id);

        setEditingProduct(null);
        setShowAddModal(false);
        resetForm();
        onLoad();
        Alert.alert(t('success'), 'Product updated successfully!');
    }, [formData, resetForm]);

    const handleDeleteProduct = useCallback(async (productId: string) => {
        Alert.alert(
            t("app.delete_food"),
            t("app.sure_to_delete_food"),
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        await deleteProduct(productId);
                        onLoad();
                        Alert.alert(t("app.success"), 'Product deleted successfully!');
                    },
                },
            ]
        );
    }, []);

    const toggleProductAvailability = useCallback((productId: string) => {
        setProducts(prevProducts =>
            prevProducts.map(product => {
                if (product.id === productId) {
                    return { ...product };
                }
                return product;
            })
        );
    }, []);

    const handleCloseModal = () => {
        setShowAddModal(false);
        setEditingProduct(null);
        resetForm();
    };

    const ProductCard = React.memo(({ product }: any) => (
        <View style={styles.productCard}>
            <Image source={{ uri: product.imageUrl }} style={styles.productImage} />

            <View style={styles.productInfo}>
                <View style={styles.productHeader}>
                    <Text style={styles.productName}>{product.name}</Text>
                    <View style={styles.productActions}>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => handleEditProduct(product)}
                        >
                            <Ionicons name="pencil" size={16} color="#45B7D1" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => handleDeleteProduct(product.id)}
                        >
                            <Ionicons name="trash" size={16} color="#FF6B6B" />
                        </TouchableOpacity>
                    </View>
                </View>

                <Text style={styles.productDescription} numberOfLines={2}>
                    {product.tag}
                </Text>

                <View style={styles.productDetails}>
                    <View style={styles.priceContainer}>
                        <Text style={styles.productPrice}>{formatCurrency(product.basePrice)}</Text>
                        <View style={styles.categoryBadge}>
                            <Text style={styles.categoryText}>{t("app.food")}</Text>
                        </View>
                    </View>

                    <View style={styles.productStats}>
                        <View style={styles.statItem}>
                            <Ionicons name="cube" size={14} color="#718096" />
                            <Text style={styles.statText}>{10}</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Ionicons name="trending-up" size={14} color="#718096" />
                            <Text style={styles.statText}>{20}</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Ionicons name="star" size={14} color="#FECA57" />
                            <Text style={styles.statText}>{5}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.productFooter}>
                    <View style={[
                        styles.availabilityBadge,
                        { backgroundColor: product ? '#E6FFFA' : '#FED7D7' }
                    ]}>
                        <Ionicons
                            name={product ? 'checkmark-circle' : 'close-circle'}
                            size={14}
                            color={product ? '#38A169' : '#E53E3E'}
                        />
                        <Text style={[
                            styles.availabilityText,
                            { color: product ? '#38A169' : '#E53E3E' }
                        ]}>
                            {product ? 'Có sẵn' : 'Không có sẵn'}
                        </Text>
                    </View>

                    <Switch
                        value={product.isAvailable}
                        onValueChange={() => toggleProductAvailability(product.id)}
                        trackColor={{ false: '#E2E8F0', true: '#4ECDC4' }}
                        thumbColor={product.isAvailable ? '#2C7A7B' : '#CBD5E0'}
                    />
                </View>
            </View>
        </View>
    ));

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton}>

                </TouchableOpacity>
                <Text style={styles.headerTitle}>Sản phẩm</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setShowAddModal(true)}
                >
                    <Ionicons name="add" size={24} color="white" />
                </TouchableOpacity>
            </View>

            {/* Search and Filter */}
            <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={20} color="#718096" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Tìm kiếm món ăn..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            {/* Category Filter */}
            <View style={{ paddingBlock: 8 }}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.categoryFilter}
                    contentContainerStyle={{ alignItems: "center" }}
                >
                    {restaurant?.categories?.map((category) => (
                        <TouchableOpacity
                            key={category.id}
                            style={[
                                styles.categoryChip,
                                selectedCategory === category.id && styles.activeCategoryChip
                            ]}
                            onPress={() => {
                                if (selectedCategory === category.id) {
                                    setSelectedCategory('All')
                                }
                                else {
                                    setSelectedCategory(category.id)
                                }
                            }}
                        >
                            <Text
                                numberOfLines={1}
                                ellipsizeMode="tail"
                                style={[
                                    styles.categoryChipText,
                                    selectedCategory === category.id && styles.activeCategoryChipText
                                ]}>
                                {category.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Products List */}
            <ScrollView
                style={styles.productsList}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl onRefresh={onLoad} refreshing={loading} />
                }
            >
                <View style={styles.productsHeader}>
                    <Text style={styles.productsCount}>
                        {filteredProducts.length} sản phẩm
                    </Text>
                    <TouchableOpacity style={styles.sortButton}>
                        <Ionicons name="funnel" size={16} color="#718096" />
                        <Text style={styles.sortText}>Sắp xếp</Text>
                    </TouchableOpacity>
                </View>

                {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}

                {filteredProducts.length === 0 && (
                    <View style={styles.emptyState}>
                        <Ionicons name="cube-outline" size={64} color="#CBD5E0" />
                        <Text style={styles.emptyStateText}>Không có sản phẩm nào</Text>
                        <Text style={styles.emptyStateSubtext}>
                            Hãy thử điều chỉnh tìm kiếm hoặc bộ lọc của bạn
                        </Text>
                    </View>
                )}
            </ScrollView>

            <AddProductModal
                showAddModal={showAddModal}
                handleCloseModal={handleCloseModal}
                editingProduct={editingProduct}
                handleUpdateProduct={handleUpdateProduct}
                handleAddProduct={handleAddProduct}
                formData={formData}
                handleNameChange={(text) => setFormData(prev => ({ ...prev, name: text }))}
                handleDescriptionChange={(text) => setFormData(prev => ({ ...prev, description: text }))}
                handlePriceChange={(text) => setFormData(prev => ({ ...prev, price: text }))}
                categories={restaurant?.categories}
                handleCategoryChange={(text) => setFormData(prev => ({ ...prev, category: text }))}
                handleImageUrlChange={(text) => setFormData(prev => ({ ...prev, imageUrl: text }))}
            />

            {loading && <BackgroundLoading />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        backgroundColor: '#2C7A7B',
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    addButton: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 20,
        padding: 8,
    },
    searchContainer: {
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 25,
        paddingHorizontal: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
        color: '#2D3748',
        height: 40
    },
    categoryFilter: {
        paddingHorizontal: 15,
        marginBottom: 10,
        flexDirection: 'row',
    },
    categoryChip: {
        backgroundColor: 'white',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginHorizontal: 5,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        maxWidth: 100,
        flexShrink: 1,
        width: 90,
        alignSelf: 'center',
    },
    activeCategoryChip: {
        backgroundColor: '#2C7A7B',
        borderColor: '#2C7A7B',
    },
    categoryChipText: {
        fontSize: 14,
        color: '#718096',
        fontWeight: '500',
    },
    activeCategoryChipText: {
        color: 'white',
    },
    productsList: {
        flex: 1,
        paddingHorizontal: 20,
    },
    productsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    productsCount: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2D3748',
    },
    sortButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: 'white',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    sortText: {
        fontSize: 14,
        color: '#718096',
        marginLeft: 5,
    },
    productCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        overflow: 'hidden',
    },
    productImage: {
        width: '100%',
        height: 150,
        backgroundColor: '#E2E8F0',
    },
    productInfo: {
        padding: 15,
    },
    productHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    productName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2D3748',
        flex: 1,
    },
    productActions: {
        flexDirection: 'row',
        marginLeft: 10,
    },
    actionButton: {
        padding: 8,
        marginLeft: 5,
    },
    productDescription: {
        fontSize: 14,
        color: '#718096',
        lineHeight: 20,
        marginBottom: 12,
    },
    productDetails: {
        marginBottom: 12,
    },
    priceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    productPrice: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2C7A7B',
    },
    categoryBadge: {
        backgroundColor: '#E6FFFA',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    categoryText: {
        fontSize: 12,
        color: '#2C7A7B',
        fontWeight: '600',
    },
    productStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    statText: {
        fontSize: 12,
        color: '#718096',
        marginLeft: 4,
    },
    productFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    availabilityBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    availabilityText: {
        fontSize: 12,
        fontWeight: '600',
        marginLeft: 4,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyStateText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#4A5568',
        marginTop: 16,
    },
    emptyStateSubtext: {
        fontSize: 14,
        color: '#718096',
        marginTop: 4,
    },

});