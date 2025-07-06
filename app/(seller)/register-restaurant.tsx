import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import { getFirestore, collection, addDoc, doc, GeoPoint } from 'firebase/firestore';
import { Category } from '@/types';
import { getAllCategories } from '@/api/modules/category';
import { router } from 'expo-router';
import { useAuth } from '@/providers/AuthenticatedProvider';
import { firestore } from '@/lib/firebase-config';
import { useTranslation } from 'react-i18next';

type RestaurantFormData = {
    name: string;
    imageUrl: string;
    rating: number;
    address: string;
    categories: string[]; // array of category IDs
};

const RestaurantRegisterScreen = () => {
    const { info } = useAuth();
    const [formData, setFormData] = useState<RestaurantFormData>({
        name: '',
        imageUrl: '',
        rating: 0,
        address: '',
        categories: [],
    });
    const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();

    const onLoad = async () => {
        const categories = await getAllCategories();

        if (categories && categories.length > 0) {
            setAvailableCategories(categories);
        }
    }

    useEffect(() => {
        onLoad();
    }, []);

    const toggleCategory = (category: Category) => {
        const categoryExists = formData.categories.includes(category.id);
        setFormData(prev => ({
            ...prev,
            categories: categoryExists
                ? prev.categories.filter(id => id !== category.id)
                : [...prev.categories, category.id]
        }));
    };

    const validateForm = () => {
        if (!formData.name.trim()) {
            Alert.alert(t("app.error"), t("app.store_may_not_be_empty"));
            return false;
        }
        if (formData.categories.length === 0) {
            Alert.alert(t("app.error"), t("app.at_least_one_category_choose"));
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            // Prepare restaurant data
            const restaurantData = {
                ...formData,
                imageUrl: "https://media.istockphoto.com/id/912819604/vector/storefront-flat-design-e-commerce-icon.jpg?s=612x612&w=0&k=20&c=_x_QQJKHw_B9Z2HcbA2d1FH1U1JVaErOAp2ywgmmoTI=",
                rating: 0,
                ratingCount: 0,
                userId: info?.id,
                categories: formData.categories.map(id => doc(firestore, 'categories', id)),
                location: new GeoPoint(0, 0)
            };

            await addDoc(collection(firestore, 'restaurants'), restaurantData);

            Alert.alert(
                t("app.success"),
                t("app.restaurant_registered"),
                [{
                    text: 'OK', onPress: () => {
                        resetForm();
                        router.push('/(seller-home)')
                    }
                }]
            );
        } catch (error) {
            console.error('Error registering restaurant:', error);
            Alert.alert(t("app.error"), t("app.error_in_registering_restaurant"));
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            imageUrl: '',
            rating: 0,
            address: '',
            categories: [],
        });
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{t("app.register_restaurant")}</Text>
                <Text style={styles.subtitle}>{t("app.add_your_restaurant_details")}</Text>
            </View>

            {/* Restaurant Name */}
            <View style={styles.section}>
                <Text style={styles.label}>{t("app.restaurant_name")} *</Text>
                <TextInput
                    style={styles.input}
                    value={formData.name}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                    placeholder={t("app.enter_restaurant_name")}
                    placeholderTextColor="#999"
                />
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>{t("app.address")} *</Text>
                <TextInput
                    style={[styles.input, { height: 120, textAlignVertical: 'top' }]}
                    value={formData.address}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, address: text }))}
                    placeholder={t("app.enter_address")}
                    placeholderTextColor="#999"
                    multiline
                    numberOfLines={4}
                />
            </View>

            {/* Categories */}
            <View style={styles.section}>
                <Text style={styles.label}>{t("app.category")} *</Text>
                <View style={styles.chipContainer}>
                    {availableCategories.map(category => (
                        <TouchableOpacity
                            key={category.id}
                            style={[
                                styles.chip,
                                formData.categories.includes(category.id) && styles.chipSelected
                            ]}
                            onPress={() => toggleCategory(category)}
                        >
                            <Text style={[
                                styles.chipText,
                                formData.categories.includes(category.id) && styles.chipTextSelected
                            ]}>
                                {category.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Display selected categories */}
                {formData.categories.length > 0 && (
                    <View style={styles.selectedContainer}>
                        <Text style={styles.selectedLabel}>{t("app.selected")}:</Text>
                        <Text style={styles.selectedText}>
                            {availableCategories
                                .filter(cat => formData.categories.includes(cat.id))
                                .map(cat => cat.name)
                                .join(', ')
                            }
                        </Text>
                    </View>
                )}
            </View>

            {/* Submit Button */}
            <TouchableOpacity
                style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.submitText}>{t("app.register_restaurant")}</Text>
                )}
            </TouchableOpacity>

            <View style={styles.bottomSpacing} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        paddingTop: 32
    },
    header: {
        padding: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        color: '#7f8c8d',
    },
    section: {
        backgroundColor: '#fff',
        margin: 15,
        padding: 20,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2c3e50',
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#dee2e6',
        borderRadius: 8,
        padding: 15,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    imageUpload: {
        borderWidth: 2,
        borderColor: '#dee2e6',
        borderStyle: 'dashed',
        borderRadius: 12,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
    },
    imagePlaceholder: {
        alignItems: 'center',
    },
    imageText: {
        marginTop: 10,
        color: '#666',
        fontSize: 16,
    },
    uploadedImage: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 15,
    },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#dee2e6',
        backgroundColor: '#fff',
    },
    chipSelected: {
        backgroundColor: '#007bff',
        borderColor: '#007bff',
    },
    chipText: {
        fontSize: 14,
        color: '#495057',
    },
    chipTextSelected: {
        color: '#fff',
    },
    addCustom: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 15,
    },
    customInput: {
        flex: 1,
        marginBottom: 0,
    },
    addButton: {
        backgroundColor: '#28a745',
        padding: 15,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedContainer: {
        backgroundColor: '#f8f9fa',
        padding: 12,
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: '#007bff',
    },
    selectedLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#007bff',
        marginBottom: 5,
    },
    selectedText: {
        fontSize: 14,
        color: '#495057',
    },
    submitButton: {
        margin: 15,
        backgroundColor: '#007bff',
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#007bff',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    submitButtonDisabled: {
        backgroundColor: '#6c757d',
        shadowOpacity: 0.1,
    },
    submitText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    bottomSpacing: {
        height: 30,
    },
});

export default RestaurantRegisterScreen;