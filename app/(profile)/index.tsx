import { updateUser } from "@/api/modules/user";
import assets from "@/assets";
import Icon from "@/components/icon";
import { useAuth } from "@/providers/AuthenticatedProvider";
import { Info } from "@/types";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, View, Text, TextInput, StyleSheet, ActivityIndicator } from "react-native";

export default function ProfileScreen() {
    const { info, setInfo } = useAuth();
    const [loading, setLoading] = useState<boolean>(false);

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        address: "",
        provinceAddress: ""
    });

    const handleChange = (field: string, value: string) => {
        setFormData({
            ...formData,
            [field]: value
        });
    };

    const handleSave = async () => {
        if (info) {
            try {
                setLoading(true);
                await updateUser({
                    ...info,
                    ...formData
                } as Info).then(() => {
                    setInfo(prev => ({
                        ...info,
                        ...formData
                    }));
                });

            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        if (info) {
            setFormData({
                name: info.name,
                phone: info.phone,
                address: info.address ?? '',
                provinceAddress: info.provinceAddress ?? ''
            });
        }
    }, [info]);

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoidView}
            >
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    {/* Header with back button */}
                    <View style={styles.header}>
                        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                            <Icon icon={assets.icon.chevron_left} size={18} />
                        </TouchableOpacity>
                    </View>

                    {/* Form Title */}
                    <Text style={styles.title}>Confirm your billing address.</Text>

                    {/* Form Fields */}
                    <View style={styles.formContainer}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Full Name</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.name}
                                onChangeText={(text) => handleChange('name', text)}
                                placeholder="Full Name"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Phone</Text>
                            <View style={styles.phoneInputContainer}>
                                <View style={styles.prefixContainer}>
                                    <Icon icon={assets.icon.plus} size={18} />
                                </View>
                                <TextInput
                                    style={styles.phoneInput}
                                    value={formData.phone}
                                    onChangeText={(text) => handleChange('phone', text)}
                                    placeholder="Phone number"
                                    keyboardType="phone-pad"
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Address</Text>
                            <TextInput
                                style={styles.textArea}
                                value={formData.address}
                                multiline={true}
                                numberOfLines={4}
                                textAlignVertical="top"
                                onChangeText={(text) => handleChange('address', text)}
                                placeholder="Address"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Province Address</Text>
                            <TextInput
                                style={styles.textArea}
                                value={formData.provinceAddress}
                                multiline={true}
                                numberOfLines={4}
                                textAlignVertical="top"
                                onChangeText={(text) => handleChange('provinceAddress', text)}
                                placeholder="Province Address"
                            />
                        </View>
                    </View>

                    {/* Save Button */}
                    <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
                        {loading && <ActivityIndicator color={"white"} />}
                        <Text style={styles.saveButtonText}>Submit</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 32
    },
    keyboardAvoidView: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingBottom: 30,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10,
    },
    backButton: {

    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    formContainer: {
        marginBottom: 20,
    },
    inputGroup: {
        marginBottom: 15,
    },
    label: {
        fontSize: 14,
        marginBottom: 8,
        fontWeight: '400',
    },
    input: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    phoneInputContainer: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        overflow: 'hidden',
    },
    prefixContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 12,
        borderRightWidth: 1,
        borderRightColor: '#E0E0E0',
        backgroundColor: '#F5F5F5',
    },
    prefixText: {
        fontSize: 16,
        fontWeight: '500',
    },
    phoneInput: {
        flex: 1,
        padding: 12,
        fontSize: 16,
    },
    disabledInput: {
        backgroundColor: '#F5F5F5',
    },
    textArea: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        minHeight: 100,
        textAlignVertical: 'top',
    },
    saveButton: {
        backgroundColor: '#00A8E8',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        marginTop: 'auto',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 5
    },
    saveButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});