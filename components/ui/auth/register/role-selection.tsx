import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TFunction } from 'i18next';

const RoleSelectionScreen = ({
    selectedRole,
    setRole,
    handleRegister,
    handlePrevious,
    t
}: {
    selectedRole: string,
    setRole: React.Dispatch<React.SetStateAction<string>>,
    handleRegister: () => void,
    handlePrevious: () => void,
    t: TFunction<"translation", undefined>
}) => {
    const roles = [
        {
            id: 'customer',
            title: t("app.customer"),
            value: 'user',
            description: t("app.customer_description"),
            icon: 'person-outline',
            color: '#4CAF50',
            bgColor: '#E8F5E8',
        },
        {
            id: 'shipper',
            title: t("app.shipper"),
            value: 'shipper',
            description: t("app.shipper_description"),
            icon: 'bicycle-outline',
            color: '#2196F3',
            bgColor: '#E3F2FD',
        },
        {
            id: 'store_owner',
            title: t("app.store_owner"),
            value: 'seller',
            description: t("app.store_owner_description"),
            icon: 'storefront-outline',
            color: '#FF9800',
            bgColor: '#FFF3E0',
        },
    ];

    const handleRoleSelect = (value: any) => {
        setRole(value);
    };

    const RoleCard = ({ role }: any) => {
        const isSelected = selectedRole === role.value;

        return (
            <TouchableOpacity
                style={[
                    styles.roleCard,
                    { backgroundColor: role.bgColor },
                    isSelected && { borderColor: role.color, borderWidth: 2 }
                ]}
                onPress={() => handleRoleSelect(role.value)}
                activeOpacity={0.8}
            >
                <View style={styles.cardContent}>
                    <View style={[styles.iconContainer, { backgroundColor: role.color }]}>
                        <Ionicons name={role.icon} size={32} color="white" />
                    </View>

                    <View style={styles.textContainer}>
                        <Text style={[styles.roleTitle, { color: role.color }]}>
                            {role.title}
                        </Text>
                        <Text style={styles.roleDescription}>
                            {role.description}
                        </Text>
                    </View>

                    {isSelected && (
                        <View style={[styles.checkmark, { backgroundColor: role.color }]}>
                            <Ionicons name="checkmark" size={20} color="white" />
                        </View>
                    )}
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Chọn vai trò của bạn</Text>
                <Text style={styles.subtitle}>
                    Chọn cách bạn muốn sử dụng nền tảng của chúng tôi
                </Text>
            </View>

            <View style={styles.rolesContainer}>
                {roles.map((role) => (
                    <RoleCard key={role.id} role={role} />
                ))}
            </View>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[
                        styles.continueButton,
                        !selectedRole && styles.continueButtonDisabled
                    ]}
                    onPress={handleRegister}
                    disabled={!selectedRole}
                    activeOpacity={0.8}
                >
                    <Text style={[
                        styles.continueButtonText,
                        !selectedRole && styles.continueButtonTextDisabled
                    ]}>
                        {t("app.continue")}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.skipButton}
                    onPress={handlePrevious}
                >
                    <Text style={styles.skipButtonText}>{t("app.back")}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 40,
        paddingBottom: 30,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#666666',
        textAlign: 'center',
        lineHeight: 22,
    },
    rolesContainer: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    roleCard: {
        borderRadius: 16,
        marginBottom: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: 'transparent',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
    },
    roleTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    roleDescription: {
        fontSize: 14,
        color: '#666666',
        lineHeight: 20,
    },
    checkmark: {
        position: 'absolute',
        right: 0,
        top: 0,
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    footer: {
        paddingHorizontal: 20,
        paddingBottom: 30,
        paddingTop: 20,
    },
    continueButton: {
        backgroundColor: '#007AFF',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        marginBottom: 12,
    },
    continueButtonDisabled: {
        backgroundColor: '#E0E0E0',
    },
    continueButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
    continueButtonTextDisabled: {
        color: '#999999',
    },
    skipButton: {
        alignItems: 'center',
        paddingVertical: 12,
    },
    skipButtonText: {
        color: '#007AFF',
        fontSize: 16,
        fontWeight: '500',
    },
});

export default RoleSelectionScreen;