import { Category } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Modal, TouchableOpacity, View, Text, ScrollView, TextInput, StyleSheet, Image, Alert, ActivityIndicator } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as ImagePicker from 'expo-image-picker';

type FoodFormData = {
    name: string;
    price: string;
    description: string;
    category: string;
    imageUrl?: string;
};

// Cloudinary upload function
const uploadToCloudinary = async (imageUri: string): Promise<string> => {
    const CLOUDINARY_CLOUD_NAME = process.env.EXPO_PUBLIC_CLOUDINARY_NAME as string;
    const CLOUDINARY_UPLOAD_PRESET = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET as string;

    const formData = new FormData();
    formData.append('file', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'image.jpg',
    } as any);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
            method: 'POST',
            body: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        if (!response.ok) {
            throw new Error('Upload failed');
        }

        const data = await response.json();
        return data.secure_url;
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw error;
    }
};

export const AddProductModal = ({
    showAddModal,
    handleCloseModal,
    editingProduct,
    handleUpdateProduct,
    handleAddProduct,
    formData,
    handleNameChange,
    handleDescriptionChange,
    handlePriceChange,
    categories,
    handleCategoryChange,
    handleImageUrlChange
}: {
    showAddModal: boolean,
    handleCloseModal: () => void,
    editingProduct: any,
    handleUpdateProduct: () => void,
    handleAddProduct: () => void,
    formData: FoodFormData,
    handleNameChange: (text: string) => void,
    handleDescriptionChange: (text: string) => void,
    handlePriceChange: (text: string) => void,
    categories?: Category[],
    handleCategoryChange: (categoryId: string) => void,
    handleImageUrlChange: (imageUrl: string) => void
}) => {
    const [isUploading, setIsUploading] = useState(false);

    const pickImage = async () => {
        // Request permissions
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission needed', 'We need camera roll permissions to select images.');
            return;
        }

        // Launch image picker
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            await uploadImage(result.assets[0].uri);
        }
    };

    const takePhoto = async () => {
        // Request permissions
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission needed', 'We need camera permissions to take photos.');
            return;
        }

        // Launch camera
        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            await uploadImage(result.assets[0].uri);
        }
    };

    const uploadImage = async (imageUri: string) => {
        setIsUploading(true);
        try {
            const cloudinaryUrl = await uploadToCloudinary(imageUri);
            handleImageUrlChange(cloudinaryUrl);
            Alert.alert('Success', 'Image uploaded successfully!');
        } catch (error) {
            Alert.alert('Error', 'Failed to upload image. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    const showImagePicker = () => {
        Alert.alert(
            'Select Image',
            'Choose how you want to select an image',
            [
                { text: 'Camera', onPress: takePhoto },
                { text: 'Gallery', onPress: pickImage },
                { text: 'Cancel', style: 'cancel' },
            ]
        );
    };

    const removeImage = () => {
        Alert.alert(
            'Remove Image',
            'Are you sure you want to remove this image?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Remove', onPress: () => handleImageUrlChange('') },
            ]
        );
    };

    return (
        <Modal
            visible={showAddModal}
            animationType="slide"
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                    <TouchableOpacity onPress={handleCloseModal}>
                        <Text style={styles.cancelButton}>Hủy</Text>
                    </TouchableOpacity>
                    <Text style={styles.modalTitle}>
                        {editingProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
                    </Text>
                    <TouchableOpacity
                        onPress={editingProduct ? handleUpdateProduct : handleAddProduct}
                        disabled={isUploading}
                    >
                        <Text style={[styles.saveButton, isUploading && styles.disabledButton]}>
                            {editingProduct ? 'Cập nhật' : 'Lưu'}
                        </Text>
                    </TouchableOpacity>
                </View>

                <KeyboardAwareScrollView
                    style={styles.modalContent}
                >
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Tên sản phẩm *</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.name}
                            onChangeText={handleNameChange}
                            placeholder="Nhập tên sản phẩm"
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Mô tả *</Text>
                        <TextInput
                            style={[styles.input, { height: 120, textAlignVertical: 'top' }]}
                            value={formData.description}
                            onChangeText={handleDescriptionChange}
                            placeholder="Nhập mô tả"
                            multiline
                            numberOfLines={4}
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Giá *</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.price}
                            onChangeText={handlePriceChange}
                            placeholder="0.00"
                            keyboardType="numeric"
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Danh mục</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <View style={styles.categorySelector}>
                                {categories && categories.map((category) => (
                                    <TouchableOpacity
                                        key={category.id}
                                        style={[
                                            styles.categoryOption,
                                            formData.category === category.id && styles.selectedCategory
                                        ]}
                                        onPress={() => handleCategoryChange(category.id)}
                                    >
                                        <Text style={[
                                            styles.categoryOptionText,
                                            formData.category === category.id && styles.selectedCategoryText
                                        ]}>
                                            {category.name}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Hình ảnh sản phẩm</Text>
                        {formData.imageUrl ? (
                            <View style={styles.imageContainer}>
                                <Image source={{ uri: formData.imageUrl }} style={styles.uploadedImage} />
                                <TouchableOpacity
                                    style={styles.removeImageButton}
                                    onPress={removeImage}
                                >
                                    <Ionicons name="close-circle" size={24} color="#EF4444" />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.changeImageButton}
                                    onPress={showImagePicker}
                                    disabled={isUploading}
                                >
                                    <Text style={styles.changeImageText}>Thay đổi ảnh</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <TouchableOpacity
                                style={styles.imageUpload}
                                onPress={showImagePicker}
                                disabled={isUploading}
                            >
                                {isUploading ? (
                                    <ActivityIndicator size="large" color="#2C7A7B" />
                                ) : (
                                    <Ionicons name="camera" size={24} color="#718096" />
                                )}
                                <Text style={styles.imageUploadText}>
                                    {isUploading ? 'Đang tải lên...' : 'Thêm hình ảnh'}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </KeyboardAwareScrollView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    modalHeader: {
        backgroundColor: 'white',
        paddingTop: 20,
        paddingBottom: 20,
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    cancelButton: {
        fontSize: 16,
        color: '#718096',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2D3748',
    },
    saveButton: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2C7A7B',
    },
    disabledButton: {
        color: '#A0AEC0',
    },
    modalContent: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    formGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2D3748',
        marginBottom: 8,
    },
    input: {
        backgroundColor: 'white',
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    categorySelector: {
        flexDirection: 'row',
        paddingVertical: 5,
    },
    categoryOption: {
        backgroundColor: 'white',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    selectedCategory: {
        backgroundColor: '#2C7A7B',
        borderColor: '#2C7A7B',
    },
    categoryOptionText: {
        fontSize: 14,
        color: '#718096',
        fontWeight: '500',
    },
    selectedCategoryText: {
        color: 'white',
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    imageUpload: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 40,
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 2,
        borderColor: '#E2E8F0',
        borderStyle: 'dashed',
    },
    imageUploadText: {
        fontSize: 16,
        color: '#718096',
        marginTop: 8,
    },
    imageContainer: {
        position: 'relative',
        alignItems: 'center',
    },
    uploadedImage: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        resizeMode: 'cover',
    },
    removeImageButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'white',
        borderRadius: 12,
    },
    changeImageButton: {
        marginTop: 10,
        backgroundColor: '#2C7A7B',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    changeImageText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
    },
});