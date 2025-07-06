import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { generatePromptFromPreferences } from '@/utils/text';

export default function HealthSurveyForm() {
    const { t } = useTranslation();
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<any>({
        meals: [],
        concerns: [],
        activityLevel: null,
        saltiness: null,
        ingredients: [],
        spicyLevel: null,
        cafeFreq: null,
        dietType: [],
        outsideEating: null,
        cuisinePrefs: [],
        foodRegions: [],
        feeling: [],
        medicalConcerns: [],
    });

    const steps = [
        {
            title: "Bạn ăn bao nhiều bữa 1 ngày?",
            subtitle: "Chọn 1 hoặc nhiều đáp án",
            type: "multiple",
            key: "meals",
            options: [
                "1 bữa",
                "2 bữa",
                "3 bữa",
                "3 bữa trở lên",
                "Linh hoạt không cố định"
            ]
        },
        {
            title: "Bạn quan tâm điều gì nhất khi chọn đồ ăn?",
            subtitle: "Chọn tối đa 3",
            type: "tags",
            key: "concerns",
            options: [
                "Giảm cân", "Tăt chở tăng béo", "Để tiêu, ít đậu mỡ",
                "Ăn chay", "Phù hợp với dạy giảo/niêm tín", "Tối ưu đơi/ tôc",
                "Tiết kiệm chi phí", "Tăng cơ", "Nhanh, tiện lợi", "Không đi ứng"
            ]
        },
        {
            title: "Mức độ hoạt động thể thao của bạn (1-5)?",
            subtitle: "(Trong dại 1-5: 1 là ít vận động - 5 là tập luyện cường độ cao hàng ngày). Chọn 1",
            type: "scale",
            key: "activityLevel",
            min: 1,
            max: 5
        },
        {
            title: "Bạn thường ăn nhạt hay mặn?",
            subtitle: "Chọn 1 hoặc nhiều đáp án",
            type: "single",
            key: "saltiness",
            options: ["Rất mặn", "Mặn", "Vừa phải", "Nhạt", "Ăn kiêng muối"]
        },
        {
            title: "Bạn có ăn được những nguyên liệu này không?",
            subtitle: "Chọn những cái bạn không thể ăn",
            type: "tags",
            key: "ingredients",
            options: [
                "Cá biển", "Hành / Tỏi", "Sữa đồng vật", "Thịt đỏ",
                "Hải sản có cùng (tôm, cua, sò)", "Đậu nành",
                "Gluten (lúa mì)", "Không đi ứng"
            ]
        },
        {
            title: "Bạn thích mức độ cay như thế nào?",
            subtitle: "(Trong dại 1-5: 1 là không ăn cay - 5 là cực cay). Chọn 1",
            type: "scale",
            key: "spicyLevel",
            min: 1,
            max: 5
        },
        {
            title: "Tần suất bạn uống cafe hoặc trà sữa mỗi tuần?",
            type: "single",
            key: "cafeFreq",
            options: ["Không uống", "1-2 lần", "3-5 lần", "Gần như mỗi ngày"]
        },
        {
            title: "Bạn có ăn được những nguyên liệu này không?",
            subtitle: "Chọn những cái bạn không thể ăn",
            type: "tags",
            key: "dietType",
            options: [
                "Eat Clean", "Chay", "Low Carb / Keto", "Không theo",
                "Nhịn ăn gián đoạn", "Địa Trung Hải"
            ]
        },
        {
            title: "Bạn có thường xuyên ăn ngoài không?",
            subtitle: "(Trong dại 1-5: 1 là ăn từ tự nấu - 5 là ăn ngoài mỗi ngày)",
            type: "scale",
            key: "outsideEating",
            min: 1,
            max: 5
        },
        {
            title: "Bạn thích âm thực vùng nào nhất?",
            subtitle: "Chọn tối đa 3",
            type: "tags",
            key: "cuisinePrefs",
            options: [
                "Tây / Âu", "Hàn", "Nam (Cơm tấm, hủ tiếu, chả)",
                "Bắc (Bún chả, phở, bún riêu)", "Ăn vặt đường phố",
                "Nhật", "Trung (Bún bò, mì quảng, bánh bèo)"
            ]
        },
        {
            title: "Những món bạn ăn thường xuyên hoặc yêu thích?",
            subtitle: "Chọn tối đa 5",
            type: "tags",
            key: "foodRegions",
            options: [
                "Phở", "Cơm", "Bún / Miến", "Salad", "Mì gói",
                "Cháo", "Đồ nướng", "Đồ chiên xào", "Bánh mì",
                "Bánh cuốn", "Món nước (Bún bò, hủ tiếu, mì quảng, ...)"
            ]
        },
        {
            title: "Say khi ăn bạn thường cảm thấy thế nào?",
            type: "tags",
            key: "feeling",
            options: [
                "Buồn ngủ", "No lâu, khó khoăn",
                "Đói nhanh", "Nặng bụng, đầy hơi"
            ]
        },
        {
            title: "Bạn có vấn đề nào cần lưu ý không?",
            subtitle: "Chọn tất cả những gì phù hợp",
            type: "tags",
            key: "medicalConcerns",
            options: [
                "Tiểu đường", "Mỡ máu", "Không có vấn đề nào",
                "Đau dạ dày", "Dị ứng thực phẩm", "Huyết áp cao / Thấp",
                "Dễ đầy hơi, chướng bụng"
            ]
        }
    ];

    const handleAnswer = (key: keyof typeof answers, value: any, isMultiple = false) => {
        if (isMultiple) {
            setAnswers((prev: typeof answers) => ({
                ...prev,
                [key]: Array.isArray(prev[key])
                    ? (prev[key] as any[]).includes(value)
                        ? (prev[key] as any[]).filter(item => item !== value)
                        : [...(prev[key] as any[]), value]
                    : [value]
            }));
        } else {
            setAnswers((prev: typeof answers) => ({
                ...prev,
                [key]: value
            }));
        }
    };

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const renderQuestion = () => {
        const step = steps[currentStep];
        const currentAnswer = answers[step.key];

        switch (step.type) {
            case 'multiple':
                return (
                    <View style={styles.optionsContainer}>
                        {Array.isArray(step.options) && step.options.map((option, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.checkboxOption,
                                    currentAnswer.includes(option) && styles.selectedOption
                                ]}
                                onPress={() => handleAnswer(step.key, option, true)}
                            >
                                <View style={[
                                    styles.checkbox,
                                    currentAnswer.includes(option) && styles.checkedBox
                                ]}>
                                    {currentAnswer.includes(option) && (
                                        <Ionicons name="checkmark" size={16} color="white" />
                                    )}
                                </View>
                                <Text style={styles.optionText}>{option}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                );

            case 'single':
                return (
                    <View style={styles.optionsContainer}>
                        {Array.isArray(step.options) && step.options.map((option, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.singleOption,
                                    currentAnswer === option && styles.selectedSingleOption
                                ]}
                                onPress={() => handleAnswer(step.key, option)}
                            >
                                <Text style={[
                                    styles.singleOptionText,
                                    currentAnswer === option && styles.selectedSingleOptionText
                                ]}>{option}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                );

            case 'tags':
                return (
                    <View style={styles.tagsContainer}>
                        {Array.isArray(step.options) && step.options.map((option, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.tag,
                                    currentAnswer.includes(option) && styles.selectedTag
                                ]}
                                onPress={() => handleAnswer(step.key, option, true)}
                            >
                                <Text style={[
                                    styles.tagText,
                                    currentAnswer.includes(option) && styles.selectedTagText
                                ]}>{option}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                );

            case 'scale':
                return (
                    <View style={styles.scaleContainer}>
                        {Array.from({ length: typeof step.max === 'number' ? step.max : 5 }, (_, i) => i + 1).map(num => (
                            <TouchableOpacity
                                key={num}
                                style={[
                                    styles.scaleButton,
                                    currentAnswer === num && styles.selectedScale
                                ]}
                                onPress={() => handleAnswer(step.key, num)}
                            >
                                <Text style={[
                                    styles.scaleText,
                                    currentAnswer === num && styles.selectedScaleText
                                ]}>{num}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                );

            default:
                return null;
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            {
                currentStep > 0 && (
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => router.replace("/(menu-ai)/chat")}>
                            <Ionicons
                                name="arrow-back"
                                size={24}
                                color={currentStep === 0 ? "#ccc" : "#333"}
                            />
                        </TouchableOpacity>
                        <Text style={styles.skip}>{t("app.skip")}</Text>
                    </View>
                )
            }

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <Text style={styles.questionTitle}>{steps[currentStep].title}</Text>
                {steps[currentStep].subtitle && (
                    <Text style={styles.questionSubtitle}>{steps[currentStep].subtitle}</Text>
                )}

                {renderQuestion()}
            </ScrollView>

            {/* Continue Button */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.continueButton}
                    onPress={currentStep === steps.length - 1 ? () => router.replace({
                        pathname: "/(menu-ai)/chat",
                        params: { text: generatePromptFromPreferences(answers) }
                    }) : nextStep}
                >
                    <Text style={styles.continueButtonText}>
                        {currentStep === steps.length - 1 ? t("app.success") : t("app.continue")}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 32
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0'
    },
    skip: {
        color: '#666',
        fontSize: 16,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    questionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
        lineHeight: 28,
    },
    questionSubtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 24,
        lineHeight: 20,
    },
    optionsContainer: {
        gap: 12,
    },
    checkboxOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    selectedOption: {
        backgroundColor: '#e8f4f8',
        borderColor: '#FF6B35',
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#ccc',
        marginRight: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkedBox: {
        backgroundColor: '#FF6B35',
        borderColor: '#FF6B35',
    },
    optionText: {
        fontSize: 16,
        color: '#333',
        flex: 1,
    },
    singleOption: {
        paddingVertical: 16,
        paddingHorizontal: 20,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
        marginBottom: 8,
    },
    selectedSingleOption: {
        backgroundColor: '#FF6B35',
    },
    singleOptionText: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
    },
    selectedSingleOptionText: {
        color: 'white',
        fontWeight: '500',
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    tag: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        backgroundColor: '#f8f9fa',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    selectedTag: {
        backgroundColor: '#FF6B35',
        borderColor: '#FF6B35',
    },
    tagText: {
        fontSize: 14,
        color: '#333',
    },
    selectedTagText: {
        color: 'white',
    },
    scaleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    scaleButton: {
        flex: 1,
        paddingVertical: 16,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
        alignItems: 'center',
    },
    selectedScale: {
        backgroundColor: '#FF6B35',
        borderColor: '#FF6B35',
    },
    scaleText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    selectedScaleText: {
        color: 'white',
    },
    buttonContainer: {
        paddingHorizontal: 20,
        paddingVertical: 20,
        backgroundColor: '#fff',
    },
    continueButton: {
        backgroundColor: '#999',
        paddingVertical: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    continueButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
});