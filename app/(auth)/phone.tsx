import assets from '@/assets';
import { auth } from '@/lib/firebase-config';
import screen from '@/utils/screen';
import { toast } from '@/utils/toast';
import { router } from 'expo-router';
import { signInWithEmailAndPassword, signInWithPhoneNumber } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View, Text, ImageBackground, Image, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function PhoneScreen() {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [countdown, setCountdown] = useState(60);
    const [isCountdownActive, setIsCountdownActive] = useState(false);
    const [code, setCode] = useState('');
    const [state, setState] = useState(2);
    const [loading, setLoading] = useState(false);
    const [confirmPhone, setConfirmPhone] = useState<any>(null);
    const [isCodeSent, setIsCodeSent] = useState(false);
    const { t } = useTranslation();

    // Function to format phone number by removing leading 0
    const formatPhoneNumber = (phone: string) => {
        if (!phone) return '';
        // Remove leading 0 if exists
        const cleanedPhone = phone.startsWith('0') ? phone.substring(1) : phone;
        return cleanedPhone;
    };

    async function sendVerification() {
        const formattedPhone = formatPhoneNumber(phoneNumber);

        if (!formattedPhone || formattedPhone.length < 8) {
            toast.error(t('app.error'), t('app.invalid_phone_number'));
            return;
        }

        setLoading(true);
        try {
            const fullPhoneNumber = "+84" + formattedPhone;
            console.log('Sending verification to:', fullPhoneNumber);

            const confirmation = await signInWithPhoneNumber(auth, fullPhoneNumber);
            setConfirmPhone(confirmation);
            setIsCodeSent(true);
            setIsCountdownActive(true);
            setCountdown(60);

            toast.success(t("app.success"), t("app.otp_sent"));
        } catch (error) {
            console.error('Error sending verification:', error);
            toast.error(t('app.error'), t('app.failed_to_send_otp'));
        } finally {
            setLoading(false);
        }
    }

    async function confirmCode() {
        if (!code || code.length < 6) {
            toast.error(t('app.error'), t('app.invalid_code'));
            return;
        }

        setLoading(true);
        try {
            if (confirmPhone) {
                await confirmPhone.confirm(code);
                toast.success(t("app.success"), t("app.login_successfully"));
            } else {
                console.log('No confirmation object available.');
                toast.error(t('app.error'), t('app.please_request_new_code'));
            }
        } catch (error) {
            console.error('Error confirming code:', error);
            toast.error(t('app.error'), t('app.invalid_code'));
        } finally {
            setLoading(false);
        }
    }

    const confirm = async () => {
        setLoading(true);
        try {
            if (state === 2) {
                if (!email || !password) {
                    toast.error(t('app.error'), t('app.please_fill_all_fields'));
                    return;
                }
                await signInWithEmailAndPassword(auth, email, password);
                toast.success(t("app.success"), t("app.login_successfully"));
            }
        } catch (error: any) {
            console.error('Email login error:', error);
            toast.error(t('app.error'), error?.message || t('app.login_failed'));
        } finally {
            setLoading(false);
        }
    };

    const handleContinue = () => {
        if (state === 1) {
            if (!isCodeSent) {
                // Send OTP first
                sendVerification();
            } else {
                // Confirm OTP
                confirmCode();
            }
        } else {
            // Email login
            confirm();
        }
    };

    const handleResend = () => {
        if (!isCountdownActive) {
            sendVerification();
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
        <KeyboardAwareScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
            <ImageBackground source={assets.background.background} style={styles.container}>
                <Image source={assets.logo} style={styles.logo} />
                <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
                    {state === 1 ? t('app.what_is_your_phone') : t('app.what_is_your_email')}
                </Text>
                <Text style={{ fontSize: 20 }}>
                    {state === 1 ? t('app.we_need_use_your_phone') : t('app.we_need_use_your_email')}
                </Text>
                {isCodeSent && state === 1 && (
                    <Text style={{ fontSize: 14, fontStyle: 'italic' }}>
                        {t('app.we_have_sent_otp', { phone: `+84${formatPhoneNumber(phoneNumber)}` })}
                    </Text>
                )}

                {state === 1 ? (
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
                                editable={!isCodeSent}
                            />
                        </View>

                        {/* OTP Input - Only show if code is sent */}
                        {isCodeSent && (
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
                                    onPress={handleResend}
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
                        )}
                    </View>
                ) : (
                    <View style={styles.inputContainer}>
                        <Text style={styles.title}>{t('app.email')}</Text>

                        {/* Email Input */}
                        <View style={styles.phoneInputContainer}>
                            <TextInput
                                style={styles.phoneInput}
                                placeholder={t('app.email')}
                                placeholderTextColor="#A0A0A0"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>

                        {/* Password Input */}
                        <View style={styles.phoneInputContainer}>
                            <TextInput
                                style={styles.phoneInput}
                                placeholder={t('app.password')}
                                placeholderTextColor="#A0A0A0"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={true}
                            />
                        </View>
                    </View>
                )}

                <View style={{ marginTop: 'auto', width: '100%' }}>
                    <TouchableOpacity
                        style={{
                            width: '100%',
                            paddingBlock: 6,
                            backgroundColor: 'white',
                            borderRadius: 20,
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 8,
                            justifyContent: 'center'
                        }}
                        onPress={handleContinue}
                        disabled={loading}
                    >
                        {loading && <ActivityIndicator size="small" />}
                        <Text style={{ color: 'red', textAlign: 'center', fontSize: 24, textTransform: 'uppercase' }}>
                            {state === 1 ?
                                (isCodeSent ? t('app.verify') : t('app.send_otp')) :
                                t('app.continue')
                            }
                        </Text>
                    </TouchableOpacity>

                    {isCodeSent && state === 1 && (
                        <TouchableOpacity
                            style={{ marginTop: 20, width: '100%' }}
                            onPress={() => {
                                setIsCodeSent(false);
                                setCode('');
                                setConfirmPhone(null);
                            }}
                        >
                            <Text style={{ textAlign: 'center' }}>{t('app.change_phone_number')}</Text>
                        </TouchableOpacity>
                    )}

                    {/* <TouchableOpacity
                        style={{ marginTop: 20, width: '100%' }}
                        onPress={() => {
                            setState(prev => prev === 1 ? 2 : 1);
                            setIsCodeSent(false);
                            setCode('');
                            setConfirmPhone(null);
                        }}
                    >
                        <Text style={{ textAlign: 'center' }}>
                            {state === 1 ? t('app.login_by_email') : t('app.login_by_phone')}
                        </Text>
                    </TouchableOpacity> */}

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