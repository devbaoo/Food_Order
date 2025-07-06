import { createVoucher } from "@/api/modules/voucher";
import { toast } from "@/utils/toast";
import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, View, Text, TouchableOpacity, TextInput, Modal, StyleSheet, Image, ActivityIndicator, TouchableWithoutFeedback, Alert } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { serverTimestamp } from "firebase/firestore";
import { saveReviewToFirestore } from "@/api/modules/review";
import { updateRestaurantRating } from "@/api/modules/restaurant";
import { generateRandomVoucher } from "@/utils/voucher";

// Cloudinary configuration
const CLOUDINARY_CLOUD_NAME = process.env.EXPO_PUBLIC_CLOUDINARY_NAME as string;
const CLOUDINARY_UPLOAD_PRESET = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET as string;

export const ReviewOrderScreen = ({ ...props }) => {
    const { loading, booking, info, star, review, t } = props;
    const [content, setContent] = useState("");
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [isVisible, setIsVisible] = useState(false);
    const [isCollecting, setIsCollecting] = useState(false);
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [isUploadingImages, setIsUploadingImages] = useState(false);
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);
    const voucher = generateRandomVoucher(info?.id ?? "");

    useEffect(() => {
        if (review) {
            setSelectedOptions(review.selectedOptions);
            setContent(review.comment);
            setSelectedImages(review.images);
        }
    }, [review]);

    const toggleOption = (option: string) => {
        setSelectedOptions(prev =>
            prev.includes(option)
                ? prev.filter(o => o !== option)
                : [...prev, option]
        );
    };

    const onCollect = async () => {
        setIsCollecting(true);
        try {
            await createVoucher(voucher);
            toast.success(t("app.success"), t("app.save_success"));
            setTimeout(() => {
                setIsVisible(false);
                router.replace("/(home)");
            }, 500);
        } catch (error) {
            toast.error(t("app.error"), t("app.error_message"));
        } finally {
            setIsCollecting(false);
        }
    };

    // Function to upload image to Cloudinary
    const uploadImageToCloudinary = async (imageUri: string): Promise<string> => {
        const formData = new FormData();
        formData.append('file', {
            uri: imageUri,
            type: 'image/jpeg',
            name: 'review_image.jpg',
        } as any);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
            {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error?.message || 'Failed to upload image');
        }
        return data.secure_url;
    };

    // Function to pick images from gallery
    const pickImages = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert(
                    t("app.permission_required"),
                    t("app.camera_permission_message")
                );
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsMultipleSelection: true,
                quality: 0.8,
                selectionLimit: 5 - selectedImages.length, // Limit to 5 images total
            });

            if (!result.canceled) {
                const newImages = result.assets.map(asset => asset.uri);
                setSelectedImages(prev => [...prev, ...newImages]);
            }
        } catch (error) {
            console.error('Error picking images:', error);
            Alert.alert(t("app.error"), t("app.image_pick_error"));
        }
    };

    // Function to take photo with camera
    const takePhoto = async () => {
        try {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert(
                    t("app.permission_required"),
                    t("app.camera_permission_message")
                );
                return;
            }

            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 0.8,
            });

            if (!result.canceled) {
                setSelectedImages(prev => [...prev, result.assets[0].uri]);
            }
        } catch (error) {
            console.error('Error taking photo:', error);
            Alert.alert(t("app.error"), t("app.camera_error"));
        }
    };

    // Function to show image options
    const showImageOptions = () => {
        Alert.alert(
            t("app.select_image"),
            t("app.choose_image_source"),
            [
                { text: t("app.camera"), onPress: takePhoto },
                { text: t("app.gallery"), onPress: pickImages },
                { text: t("app.cancel"), style: "cancel" },
            ]
        );
    };

    // Function to remove image
    const removeImage = (index: number) => {
        setSelectedImages(prev => prev.filter((_, i) => i !== index));
    };

    // Function to submit review
    const submitReview = async () => {

        if (!content.trim() && selectedOptions.length === 0) {
            Alert.alert(t("app.error"), t("app.review_required"));
            return;
        }

        setIsSubmittingReview(true);
        try {
            // Upload images to Cloudinary
            setIsUploadingImages(true);
            const imageUrls: string[] = [];

            if (selectedImages.length > 0) {
                const uploadPromises = selectedImages.map(uri => uploadImageToCloudinary(uri));
                const uploadedUrls = await Promise.all(uploadPromises);
                imageUrls.push(...uploadedUrls);
            }

            setIsUploadingImages(false);

            // Prepare review data
            const reviewData = {
                bookingId: booking?.id || '',
                rating: star,
                selectedOptions,
                comment: content.trim(),
                images: imageUrls,
                createdAt: serverTimestamp(),
                userId: info?.id,
                restaurantId: booking?.restaurantId || ''
            };

            // Save to Firestore
            await saveReviewToFirestore(reviewData).then(async () => {
                await updateRestaurantRating(booking?.restaurantId ?? '', star);
                toast.success(t("app.success"), t("app.review_submitted"));
                setIsVisible(true);
            });
        } catch (error) {
            console.error('Error submitting review:', error);
            toast.error(t("app.error"), t("app.review_submit_error"));
        } finally {
            setIsSubmittingReview(false);
        }
    };

    return (
        <ScrollView style={styles.reviewContainer}>
            <View style={{ alignItems: 'center', paddingHorizontal: 16, paddingTop: 16, flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity onPress={() => router.replace("/(profile)/order")}>
                    <MaterialIcons name="chevron-left" size={24} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.replace("/(home)")}>
                    <MaterialIcons name="home" size={24} />
                </TouchableOpacity>
            </View>
            <View style={styles.reviewContent}>
                <View style={styles.reviewHeader}>
                    {loading ? (
                        <View style={styles.reviewImage} />
                    ) : (
                        <Image
                            source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4_ujwdtIghyTGEbxYYADIMUUxS2e9DBI7Juqa5E4lh3uApfs6Cah8iGfbPnar6pHQaf8&usqp=CAU' }}
                            style={styles.reviewImage}
                        />
                    )}
                    <Text style={styles.reviewTitle}>{t("app.thanks_for_your_review")}</Text>
                    <Text style={styles.reviewOrderId}>{t("app.order")} #{(booking?.id ?? "").slice(0, 6)}</Text>

                    {/* Star Rating Display */}
                    <View style={styles.reviewStars}>
                        {[1, 2, 3, 4, 5].map((item, index) => (
                            <AntDesign
                                name={item <= star ? "star" : "staro"}
                                size={32}
                                key={index}
                                color={item <= star ? "#FFD700" : "#D1D5DB"}
                            />
                        ))}
                    </View>
                    <Text style={styles.reviewRating}>{t("app.statisfaction_level")}</Text>
                </View>

                <Text style={styles.reviewSectionTitle}>{t("app.what_you_like")}</Text>
                <View style={styles.reviewOptions}>
                    {['Ngon', 'Rẻ', 'Giao Nhanh', 'Đóng gói tốt vệ sinh', 'Đủ ăn chỗi trưng'].map((option) => (
                        <TouchableOpacity
                            key={option}
                            style={[
                                styles.reviewOption,
                                selectedOptions.includes(option) && styles.reviewOptionSelected
                            ]}
                            onPress={() => {
                                if (!review) toggleOption(option)
                            }}
                        >
                            <Text style={[
                                styles.reviewOptionText,
                                selectedOptions.includes(option) && styles.reviewOptionTextSelected
                            ]}>
                                {option}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.reviewSectionTitle}>{t("app.leave_a_comment")}</Text>
                <TextInput
                    style={styles.reviewTextInput}
                    placeholder={t("app.write_comment")}
                    multiline
                    value={content}
                    onChangeText={(text) => {
                        if (!review) setContent(text)
                    }}
                    textAlignVertical="top"
                />

                <TouchableOpacity style={styles.imageUploadContainer} onPress={() => {
                    if (!review) showImageOptions()
                }}>
                    <Feather name="image" size={32} color="gray" />
                    <Text style={styles.imageUploadText}>{t("app.add_image_here")}</Text>
                    <Text style={styles.imageUploadSubtext}>{t("app.upload_image")}</Text>
                </TouchableOpacity>

                {/* Selected Images Preview */}
                {selectedImages.length > 0 && (
                    <View style={styles.imagePreviewContainer}>
                        {selectedImages.map((uri, index) => (
                            <View key={index} style={styles.imagePreviewWrapper}>
                                <Image source={{ uri }} style={styles.imagePreview} />
                                {!review && (
                                    <TouchableOpacity
                                        style={styles.removeImageButton}
                                        onPress={() => removeImage(index)}
                                    >
                                        <MaterialIcons name="close" size={16} color="white" />
                                    </TouchableOpacity>
                                )}
                            </View>
                        ))}
                    </View>
                )}

                {!review && (
                    <TouchableOpacity
                        style={[styles.submitButton, (isSubmittingReview || isUploadingImages) && styles.submitButtonDisabled]}
                        onPress={submitReview}
                        disabled={isSubmittingReview || isUploadingImages}
                    >
                        {(isSubmittingReview || isUploadingImages) ? (
                            <View style={styles.submitButtonLoading}>
                                <ActivityIndicator size="small" color="white" />
                                <Text style={styles.submitButtonText}>
                                    {isUploadingImages ? t("app.uploading_images") : t("app.submitting")}
                                </Text>
                            </View>
                        ) : (
                            <Text style={styles.submitButtonText}>{t("app.send")}</Text>
                        )}
                    </TouchableOpacity>
                )}
            </View>

            <Modal visible={isVisible} transparent animationType="fade">
                <TouchableWithoutFeedback onPress={() => setIsVisible(false)}>
                    <View style={styles.modalBackground}>
                        <View style={styles.voucherContainer}>
                            <Text style={styles.voucherTitle}>{voucher.title}</Text>
                            <Text style={styles.voucherDescription}>
                                {t("app.voucher_expire")}
                            </Text>
                            <TouchableOpacity
                                style={styles.voucherButton}
                                onPress={onCollect}
                                disabled={isCollecting}
                            >
                                {isCollecting && <ActivityIndicator size="small" color="white" />}
                                <Text style={styles.voucherButtonText}>{t("app.collect")}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    // Review screen
    reviewContainer: {
        flex: 1,
        backgroundColor: 'white',
    },
    reviewContent: {
        padding: 24,
    },
    reviewHeader: {
        alignItems: 'center',
        marginBottom: 24,
    },
    reviewImage: {
        width: 64,
        height: 64,
        backgroundColor: '#D1D5DB',
        borderRadius: 8,
        marginBottom: 16,
    },
    reviewTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
    },
    reviewOrderId: {
        color: '#6B7280',
        textAlign: 'center',
    },
    reviewStars: {
        flexDirection: 'row',
        gap: 4,
        marginVertical: 12,
    },
    reviewRating: {
        color: '#6B7280',
    },
    reviewSectionTitle: {
        fontWeight: '500',
        marginBottom: 12,
    },
    reviewOptions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 24,
    },
    reviewOption: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        backgroundColor: '#F3F4F6',
        borderColor: '#D1D5DB',
    },
    reviewOptionSelected: {
        backgroundColor: '#FEF3E2',
        borderColor: '#F97316',
    },
    reviewOptionText: {
        fontSize: 14,
        color: '#374151',
    },
    reviewOptionTextSelected: {
        color: '#F97316',
    },
    reviewTextInput: {
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        padding: 12,
        height: 80,
        marginBottom: 16,
        textAlignVertical: 'top',
    },
    imageUploadContainer: {
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: '#D1D5DB',
        borderRadius: 8,
        padding: 32,
        alignItems: 'center',
        marginBottom: 16,
    },
    imageUploadText: {
        color: '#6B7280',
        marginTop: 8,
    },
    imageUploadSubtext: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    imagePreviewContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 24,
    },
    imagePreviewWrapper: {
        position: 'relative',
    },
    imagePreview: {
        width: 64,
        height: 64,
        backgroundColor: '#D1D5DB',
        borderRadius: 4,
    },
    removeImageButton: {
        position: 'absolute',
        top: -8,
        right: -8,
        backgroundColor: '#EF4444',
        borderRadius: 12,
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    submitButton: {
        backgroundColor: '#F97316',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 16,
    },
    submitButtonDisabled: {
        backgroundColor: '#9CA3AF',
    },
    submitButtonLoading: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    submitButtonText: {
        color: 'white',
        fontWeight: '500',
        fontSize: 18,
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    voucherContainer: {
        backgroundColor: '#FEF3C7',
        padding: 16,
        borderRadius: 8,
        marginBottom: 24,
    },
    voucherTitle: {
        color: '#F97316',
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 8,
        textAlign: 'center'
    },
    voucherDescription: {
        fontSize: 14,
        color: '#374151',
        marginBottom: 12,
    },
    voucherButton: {
        backgroundColor: '#F97316',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 4,
        alignItems: 'center',
        flexDirection: 'row',
        gap: 8,
        justifyContent: 'center',
    },
    voucherButtonText: {
        color: 'white',
        fontWeight: '500',
    },
});