import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    TextInput,
    Image,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Modal from '@/components/modal';
import { updateCartItem } from '@/api/modules/cart';
import { useAuth } from '@/providers/AuthenticatedProvider';
import { Food } from '@/types';
import { toast } from '@/utils/toast';
import { TFunction } from 'i18next';

const FoodOrderPageModal = ({ visible, onClose, selectedFood, t }: {
    visible: boolean,
    onClose: () => void,
    selectedFood: Food | null,
    t: TFunction<"translation", undefined>
}) => {
    const [selectedSize, setSelectedSize] = useState('Thường');
    const [quantity, setQuantity] = useState(1);
    const { info } = useAuth();
    const [specialRequirements, setSpecialRequirements] = useState('');
    const [loading, setLoading] = useState(false);

    const productOptions = [
        t("app.remove_from_cart"),
    ];

    const getCurrentPrice = () => {
        const option = selectedFood?.variants.find(opt => opt.label === selectedSize);
        return option ? option.price : selectedFood?.basePrice ?? 0;
    };

    const getOriginalPrice = () => {
        const option = selectedFood?.variants.find(opt => opt.label === selectedSize);
        return option ? option.price : selectedFood?.basePrice ?? 0;
    };

    const increaseQuantity = () => {
        setQuantity(prev => prev + 1);
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    const handleAddToCart = async () => {
        if (!info || !selectedFood) {
            toast.error(t("app.error"), t("app.something_went_wrong"));
            return;
        }
        setLoading(true);
        await updateCartItem(info?.id, selectedFood.id, quantity, selectedFood.basePrice, selectedFood.restaurantId);
        setTimeout(() => {
            setLoading(false);
            toast.success(t("app.success"), t("app.added_to_cart"));
        }, 1000);
    };

    const formatPrice = (price: number) => {
        return price.toLocaleString('vi-VN') + ' VNĐ';
    };

    return (
        <Modal visible={visible} containerStyle={styles.container} onCancel={onClose}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={onClose}>
                    <Ionicons name="close-circle-outline" size={24} color="#666" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t("app.custom")}</Text>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
            >
                <ScrollView
                    style={styles.content}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    nestedScrollEnabled={true}
                >
                    {/* Product Image */}
                    <View style={styles.imageContainer}>
                        {/* Replace this View with your actual Image component */}
                        <Image source={{ uri: selectedFood?.imageUrl }} style={styles.placeholderImage} />
                    </View>

                    {/* Product Info */}
                    <View style={styles.productInfo}>
                        <Text style={styles.productName}>{selectedFood?.name}</Text>
                        <View style={styles.priceContainer}>
                            <Text style={styles.discountedPrice}>
                                {t("app.from")} {formatPrice(getCurrentPrice())}
                            </Text>
                            <Text style={styles.originalPrice}>
                                {formatPrice(getOriginalPrice())}
                            </Text>
                        </View>
                        <Text style={styles.description}>{selectedFood?.description}</Text>
                    </View>

                    {/* Size Selection */}
                    <View style={styles.optionsContainer}>
                        <View style={styles.optionHeader}>
                            <Text style={styles.optionTitle}>{t("app.selection")}</Text>
                            <View style={styles.requiredBadge}>
                                <Text style={styles.requiredText}>{t("app.requirement")}</Text>
                            </View>
                        </View>
                        <Text style={styles.optionSubtitle}>{t("app.choose")} 1</Text>

                        {selectedFood?.variants.map((option, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.optionItem}
                                onPress={() => setSelectedSize(option.label)}
                            >
                                <View style={styles.optionLeft}>
                                    <View style={styles.radioButton}>
                                        {selectedSize === option.label && (
                                            <View style={styles.radioButtonSelected} />
                                        )}
                                    </View>
                                    <Text style={styles.optionName}>{option.label}</Text>
                                </View>
                                <View style={styles.optionPrices}>
                                    <Text style={styles.optionDiscountPrice}>
                                        {formatPrice(option.price)}
                                    </Text>
                                    <Text style={styles.optionOriginalPrice}>
                                        {formatPrice(option.price)}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{t("app.special_request")}</Text>
                        <Text style={styles.sectionSubtitle}>
                            {t("app.notice")}
                        </Text>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>{t("app.request")}</Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder={t("app.example_food")}
                                value={specialRequirements}
                                onChangeText={setSpecialRequirements}
                                multiline
                                numberOfLines={4}
                                textAlignVertical="top"
                            />
                        </View>
                    </View>

                    {/* Product Availability Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{t("app.food_is_not_available")}</Text>

                        {productOptions.map((product, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.productItem}
                                onPress={() => { }}
                            >
                                <View style={styles.productContent}>
                                    <Text style={styles.productText}>{product}</Text>
                                    <Ionicons
                                        name="chevron-forward"
                                        size={20}
                                        color="#666"
                                    />
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Bottom Section */}
            <View style={styles.bottomSection}>
                {/* Quantity Selector */}
                <View style={styles.quantityContainer}>
                    <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={decreaseQuantity}
                    >
                        <Ionicons name="remove" size={20} color="#666" />
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{quantity}</Text>
                    <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={increaseQuantity}
                    >
                        <Ionicons name="add" size={20} color="#666" />
                    </TouchableOpacity>
                </View>

                {/* Add to Cart Button */}
                <TouchableOpacity
                    style={styles.addToCartButton}
                    onPress={handleAddToCart}
                    disabled={loading}
                >
                    {loading && <ActivityIndicator size="small" color="white" />}
                    <Text style={styles.addToCartText}>{t("app.add_to_cart")}</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        pointerEvents: "auto"
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    content: {
        flex: 1,
    },
    imageContainer: {
        height: 200,
        backgroundColor: '#f5f5f5',
    },
    placeholderImage: {
        flex: 1,
        backgroundColor: '#9BB0C1',
    },
    productInfo: {
        padding: 16,
    },
    productName: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    discountedPrice: {
        fontSize: 16,
        fontWeight: '600',
        color: '#4ECDC4',
        marginRight: 8,
    },
    originalPrice: {
        fontSize: 14,
        color: '#999',
        textDecorationLine: 'line-through',
    },
    description: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    optionsContainer: {
        backgroundColor: '#E8F4F3',
        margin: 16,
        borderRadius: 12,
        padding: 16,
    },
    optionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    optionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginRight: 8,
    },
    requiredBadge: {
        backgroundColor: '#FF6B6B',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
    },
    requiredText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '500',
    },
    optionSubtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 16,
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
    },
    optionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    radioButton: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#4ECDC4',
        marginRight: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioButtonSelected: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#4ECDC4',
    },
    optionName: {
        fontSize: 16,
        color: '#333',
    },
    optionPrices: {
        alignItems: 'flex-end',
    },
    optionDiscountPrice: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4ECDC4',
    },
    optionOriginalPrice: {
        fontSize: 12,
        color: '#999',
        textDecorationLine: 'line-through',
    },
    bottomSection: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        backgroundColor: '#fff',
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
    },
    quantityButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    quantityText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginHorizontal: 16,
        minWidth: 20,
        textAlign: 'center',
    },
    addToCartButton: {
        flex: 1,
        backgroundColor: '#ED4828',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 6
    },
    addToCartText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    section: {
        marginBottom: 30,
        paddingHorizontal: 16
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    sectionSubtitle: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
        marginBottom: 20,
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    textInput: {
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: '#333',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        minHeight: 100,
    },

    productItem: {
        borderWidth: 1,
        borderColor: '#D9D9D9',
        borderRadius: 8
    },
    productContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    productText: {
        fontSize: 16,
        color: '#A4A4A4',
        flex: 1,
    },
});

export default FoodOrderPageModal;