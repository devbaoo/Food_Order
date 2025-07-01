import assets from '@/assets';
import { auth } from '@/lib/firebase-config';
import screen from '@/utils/screen';
import { toast } from '@/utils/toast';
import { router } from 'expo-router';
import { ConfirmationResult, signInWithPhoneNumber } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View, Text, ImageBackground, Image, TouchableOpacity, TextInput } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [countdown, setCountdown] = useState(60);
    const [isCountdownActive, setIsCountdownActive] = useState(false);
    const [code, setCode] = useState('');
    const [confirm, setConfirm] = useState<ConfirmationResult | null>(null);
    const { t } = useTranslation();

    const sendVerification = async () => {
        const confirmation = await signInWithPhoneNumber(auth, phoneNumber);
        console.log(confirmation);
        setConfirm(confirmation);
    };

    const confirmCode = async () => {
        try {
            await confirm?.confirm(code);
        } catch (error) {
            toast.error(t('app.error'), "");
        }
    };


    useEffect(() => {
        let interval = null;
        if (isCountdownActive && countdown > 0) {
            interval = setInterval(() => {
                setCountdown(countdown => countdown - 1);
            }, 1000);
        } else if (countdown === 0) {
            setIsCountdownActive(false);
            setCountdown(60);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isCountdownActive, countdown]);

    return (
        <KeyboardAwareScrollView>
            <ImageBackground source={assets.background.background} style={styles.container}>
                <Image source={assets.logo} style={styles.logo} />
                <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{t('app.what_is_your_phone')}</Text>
                <Text style={{ fontSize: 20 }}>{t('app.we_need_use_your_phone')}</Text>
                {confirm && (
                    <Text style={{ fontSize: 14, fontStyle: 'italic' }}>{t('app.we_have_sent_otp', { phone: phoneNumber })}</Text>
                )}
                <View style={styles.inputContainer}>
                    <Text style={styles.title}>{t('app.phone')}</Text>

                    {/* Phone Number Input Row */}
                    <View style={styles.phoneInputContainer}>
                        <TouchableOpacity style={styles.countryCodeButton}>
                            <Text style={styles.countryCodeText}>+84</Text>
                        </TouchableOpacity>

                        <TextInput
                            style={styles.phoneInput}
                            placeholder={t('app.phone')}
                            placeholderTextColor="#A0A0A0"
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                            keyboardType="phone-pad"
                            maxLength={10}
                        />
                    </View>

                    {/* OTP Input */}
                    <View style={styles.otpContainer}>
                        <View style={styles.otpInputContainer}>
                            <Text style={styles.searchIcon}>🔍</Text>
                            <TextInput
                                style={styles.otpInput}
                                placeholder={t('app.otp')}
                                placeholderTextColor="#A0A0A0"
                                value={code}
                                onChangeText={setCode}
                                keyboardType="numeric"
                                maxLength={6}
                            />
                        </View>

                        <TouchableOpacity
                            style={styles.resendButton}
                            onPress={sendVerification}
                            disabled={isCountdownActive}
                        >
                            <Text style={[
                                styles.resendText,
                                { opacity: isCountdownActive ? 0.5 : 1 }
                            ]}>
                                {isCountdownActive ? `${t('app.resend')} (${countdown}s)` : t('app.resend')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ marginTop: 'auto', width: '100%' }}>
                    <TouchableOpacity
                        style={{ width: '100%', paddingBlock: 6, backgroundColor: 'white', borderRadius: 20 }}
                        onPress={confirmCode}
                    >
                        <Text style={{ color: 'red', textAlign: 'center', fontSize: 24, textTransform: 'uppercase' }}>{t('app.continue')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ marginTop: 20, width: '100%' }}
                        onPress={() => router.back()}
                    >
                        <Text style={{ textAlign: 'center' }}>{t('app.try_another_way_go_back')}</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </KeyboardAwareScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        paddingBlock: 90,
        paddingInline: 40,
        gap: 10
    },

    logo: {
        height: screen.height * 0.12,
        objectFit: 'contain',
        alignSelf: 'center'
    },

    inputContainer: {
        flex: 1,
        marginTop: '20%'
    },
    title: {
        fontSize: 18,
        fontWeight: '500',
        color: '#2C5454',
        textAlign: 'center',
        marginBottom: 10,
    },
    phoneInputContainer: {
        flexDirection: 'row',
        marginBottom: 15,
        gap: 10,
    },
    countryCodeButton: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 60,
    },
    countryCodeText: {
        fontSize: 16,
        color: '#333333',
        fontWeight: '500',
    },
    phoneInput: {
        flex: 1,
        backgroundColor: '#F5F5F0',
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderRadius: 8,
        fontSize: 16,
        color: '#333333',
    },
    otpContainer: {
        position: 'relative',
    },
    otpInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F0',
        borderRadius: 8,
        paddingHorizontal: 15,
    },
    searchIcon: {
        fontSize: 18,
        marginRight: 10,
        opacity: 0.6,
    },
    otpInput: {
        flex: 1,
        paddingVertical: 15,
        fontSize: 16,
        color: '#333333',
    },
    resendButton: {
        position: 'absolute',
        right: 15,
        top: '50%',
        transform: [{ translateY: -10 }],
    },
    resendText: {
        color: '#E74C3C',
        fontSize: 14,
        fontWeight: '500',
    },
});