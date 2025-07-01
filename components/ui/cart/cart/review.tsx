import { createVoucher } from "@/api/modules/voucher";
import { toast } from "@/utils/toast";
import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { ScrollView, View, Text, TouchableOpacity, TextInput, Modal, StyleSheet, Image, ActivityIndicator, TouchableWithoutFeedback } from "react-native";

export const ReviewOrderScreen = ({ ...props }) => {
    const { loading, restaurant, bookingId, info, star, t } = props;
    const [review, setReview] = useState("");
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [isVisible, setIsVisible] = useState(false);
    const [isCollecting, setIsCollecting] = useState(false);

    const toggleOption = (option: string) => {
        setSelectedOptions(prev =>
            prev.includes(option)
                ? prev.filter(o => o !== option)
                : [...prev, option]
        );
    };

    const onCollect = async () => {
        setIsCollecting(true);
        await createVoucher(info?.id);
        toast.success(t("app.success"), t("app.save_success"));
        setTimeout(() => {
            setIsVisible(false);
            router.replace("/(home)");
        }, 500);
    }

    return (
        <ScrollView style={styles.reviewContainer}>
            <View style={{ alignItems: 'flex-end', paddingHorizontal: 16, paddingTop: 16 }}>
                <TouchableOpacity onPress={() => router.replace("/(home)")}>
                    <MaterialIcons name="home" size={24} />
                </TouchableOpacity>
            </View>
            <View style={styles.reviewContent}>
                <View style={styles.reviewHeader}>
                    {
                        loading ?
                            <View style={styles.reviewImage} />
                            :
                            <Image source={{ uri: restaurant?.imageUrl }} style={styles.reviewImage} />
                    }
                    <Text style={styles.reviewTitle}>{t("app.thanks_for_your_review")}</Text>
                    <Text style={styles.reviewOrderId}>{t("app.order")} #{(bookingId ?? "").slice(6)}</Text>

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
                            onPress={() => toggleOption(option)}
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
                    value={review}
                    onChangeText={setReview}
                    textAlignVertical="top"
                />

                <View style={styles.imageUploadContainer}>
                    <Feather name="image" size={32} color="gray" />
                    <Text style={styles.imageUploadText}>{t("app.add_image_here")}</Text>
                    <Text style={styles.imageUploadSubtext}>{t("app.upload_image")}</Text>
                </View>

                <View style={styles.imagePreviewContainer}>
                    <View style={styles.imagePreview} />
                    <View style={styles.imagePreview} />
                </View>

                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={() => setIsVisible(true)}
                >
                    <Text style={styles.submitButtonText}>{t("app.send")}</Text>
                </TouchableOpacity>
            </View>

            <Modal visible={isVisible} transparent animationType="fade">
                <TouchableWithoutFeedback onPress={() => setIsVisible(false)}>
                    <View style={{
                        flex: 1,
                        backgroundColor: 'rgba(0,0,0,0.5)', // nền mờ
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 24
                    }}>
                        <View style={styles.voucherContainer}>
                            <Text style={styles.voucherTitle}>Voucher 10%</Text>
                            <Text style={styles.voucherDescription}>
                                {t("app.voucher_expire")}
                            </Text>
                            <TouchableOpacity style={styles.voucherButton}
                                onPress={onCollect}
                            >
                                {isCollecting && <ActivityIndicator size="small" color="white" />}
                                <Text style={styles.voucherButtonText}>{t("app.collect")}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </ScrollView>
    )
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
        marginBottom: 24,
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
        gap: 8,
        marginBottom: 24,
    },
    imagePreview: {
        width: 64,
        height: 64,
        backgroundColor: '#D1D5DB',
        borderRadius: 4,
    },

    // Review complete
    reviewCompleteTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
        color: '#9CA3AF',
    },
    reviewCompleteOrderId: {
        color: '#9CA3AF',
        textAlign: 'center',
    },
    reviewCompleteRating: {
        color: '#9CA3AF',
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
        justifyContent: 'center'
    },
    voucherButtonText: {
        color: 'white',
        fontWeight: '500',
    },
    completeButton: {
        backgroundColor: '#F8BBD9',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 16,
    },
    completeButtonText: {
        color: '#6B7280',
        fontWeight: '500',
        fontSize: 18,
    },

    submitButton: {
        backgroundColor: '#F97316',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 16,
    },

    submitButtonText: {
        color: 'white',
        fontWeight: '500',
        fontSize: 18,
    },
})