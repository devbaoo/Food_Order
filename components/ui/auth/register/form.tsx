import assets from "@/assets";
import Checkbox from "@/components/checkbox";
import screen from "@/utils/screen";
import { TFunction } from "i18next";
import React from "react";
import { ActivityIndicator, ImageBackground, StyleSheet, TextInput, TouchableOpacity, View, Text, Image } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";


const RegisterForm = ({
    t,
    name,
    setName,
    password,
    setPassword,
    email,
    setEmail,
    phone,
    setPhone,
    loading,
    handleNext,
    isGoogleLogin
}: {
    t: TFunction<"translation", undefined>,
    name: string,
    setName: React.Dispatch<React.SetStateAction<string>>,
    password: string,
    setPassword: React.Dispatch<React.SetStateAction<string>>,
    email: string,
    setEmail: React.Dispatch<React.SetStateAction<string>>,
    phone: string,
    setPhone: React.Dispatch<React.SetStateAction<string>>,
    loading: boolean,
    handleNext: () => void,
    isGoogleLogin?: boolean
}) => {
    return (
        <KeyboardAwareScrollView>
            <ImageBackground source={assets.background.background} style={styles.container}>
                <Image source={assets.logo} style={styles.logo} />
                <Text style={{ fontSize: 20 }}>{t('app.your_information_is_useful')}</Text>
                <View style={styles.inputContainer}>
                    <View style={styles.inputWrapper}>
                        <Image source={assets.icon.register_user} style={styles.icon} />
                        <TextInput
                            placeholder={t('app.full_name')}
                            style={styles.input}
                            onChangeText={(text) => setName(text)}
                            value={name}
                        />
                    </View>
                    {!isGoogleLogin && (
                        <View style={styles.inputWrapper}>
                            <Image source={assets.icon.register_lock} style={styles.icon} />
                            <TextInput
                                placeholder={t('app.password')}
                                style={styles.input}
                                secureTextEntry
                                onChangeText={(text) => setPassword(text)}
                                value={password}
                            />
                        </View>
                    )}
                    <View>
                        <Image source={assets.icon.register_mail} style={styles.icon} />
                        <TextInput
                            placeholder="Email"
                            style={styles.input}
                            onChangeText={(text) => setEmail(text)}
                            keyboardType="email-address"
                            value={email}
                        />
                    </View>
                    <View>
                        <Image source={assets.icon.register_phone} style={styles.icon} />
                        <TextInput
                            placeholder={t('app.phone')}
                            style={styles.input}
                            onChangeText={(text) => setPhone(text)}
                            value={phone}
                        />
                    </View>

                    <View style={{ width: '100%', marginTop: 5, flexDirection: 'row', gap: 5, alignItems: 'center' }}>
                        <Checkbox
                            checked={true}
                            onChange={() => { }}
                        />
                        <Text style={{ fontSize: 16 }}>{t('app.i_aggree_with_privacy')}</Text>
                    </View>
                </View>
                <View style={{ marginTop: 'auto', width: '100%' }}>
                    <TouchableOpacity style={{
                        width: '100%',
                        paddingBlock: 6,
                        backgroundColor: 'white',
                        borderRadius: 20,
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 8,
                        justifyContent: 'center'
                    }}
                        disabled={loading}
                        onPress={handleNext}
                    >
                        {loading && <ActivityIndicator style={{ zIndex: 10 }} color="#347433" size={18} />}
                        <Text style={{ color: 'red', textAlign: 'center', fontSize: 24, textTransform: 'uppercase' }}>{t('app.continue')}</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </KeyboardAwareScrollView>
    )
}

export default RegisterForm;

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
        marginTop: '10%',
        gap: 20
    },

    input: {
        backgroundColor: 'white',
        width: '100%',
        borderRadius: 8,
        paddingLeft: 50,
        height: 50
    },

    inputWrapper: {
        position: 'relative',
    },

    icon: {
        position: 'absolute',
        top: '50%',
        left: '5%',
        transform: [
            {
                translateY: '-50%'
            }
        ],
        zIndex: 10
    }
}) 