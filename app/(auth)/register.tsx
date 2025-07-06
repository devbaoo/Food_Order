import { auth } from "@/lib/firebase-config";
import { createUserProfile } from "@/api/modules/user";
import { toast } from "@/utils/toast";
import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useRef, useState } from "react";
import { View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import PagerView from "react-native-pager-view";
import RoleSelectionScreen from "@/components/ui/auth/register/role-selection";
import RegisterForm from "@/components/ui/auth/register/form";

export default function RegisterScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [role, setRole] = useState('');
    const [loading, setLoading] = useState(false);
    const pagerRef = useRef<PagerView>(null);
    const { isGoogleLogin, uid } = useLocalSearchParams();
    const { t } = useTranslation();

    const handleRegister = async () => {
        // Validate input
        if (!name) {
            toast.error(t("app.error"), t("app.name_not_be_empty"));
            return;
        }

        if (!email) {
            toast.error(t("app.error"), t("app.email_not_be_empty"));
            return;
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
            toast.error(t("app.error"), t("app.invalid_email"));
            return;
        }

        if (!phone) {
            toast.error(t("app.error"), t("app.phone_not_be_empty"));
            return;
        }

        if (!isGoogleLogin) {
            if (!password) {
                toast.error(t("app.error"), t("app.password_not_be_empty"));
                return;
            } else if (password.length < 6) {
                toast.error(t("app.error"), t("app.password_length_must_has_at_least_6_characters"));
                return;
            }
        }

        setLoading(true);
        try {
            let userUid = null;

            // Create user with email and password
            if (!isGoogleLogin) {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                userUid = user.uid;
            }

            else {
                // If Google login, use the provided UID
                userUid = uid as string;
            }

            // Create user profile in Firestore using the API function
            const success = await createUserProfile(userUid, {
                name,
                email,
                role,
                phone,
                avatar: "https://preview.redd.it/turned-my-avatar-into-a-2010-inspired-profile-picture-yes-i-v0-ergti3sxlrae1.png?width=640&crop=smart&auto=webp&s=9ae5f2ad8f385489fd4dc035da097cc7cb3f515a"
            });

            if (success) {
                toast.success(t('app.success'), t('app.register_successfully'));
                router.replace("/(auth)" as any);
            } else {
                toast.error(t('app.error'), t('app.an_error_occured_when_creating_user'));
            }
        } catch (error: any) {
            if (error.code === 'auth/email-already-in-use') {
                toast.error(t('app.register_error'), t('app.email_was_used'));
            } else {
                toast.error(t('app.register_error'), t('app.an_error_occured_when_creating_user'));
            }
        } finally {
            setLoading(false);
        }
    };

    const handleNextStep = () => {
        pagerRef.current?.setPage(1);
    };

    const handlePreviousStep = () => {
        pagerRef.current?.setPage(0)
    };

    return (
        <View style={{ flex: 1 }}>
            <PagerView
                style={{ flex: 1 }}
                initialPage={0}
                ref={pagerRef}
                scrollEnabled={false}
            >
                <View style={{ flex: 1 }}>
                    <RegisterForm
                        key="1"
                        t={t}
                        name={name}
                        setName={setName}
                        password={password}
                        setPassword={setPassword}
                        email={email}
                        setEmail={setEmail}
                        phone={phone}
                        setPhone={setPhone}
                        loading={loading}
                        handleNext={handleNextStep}
                        isGoogleLogin={isGoogleLogin === "true" ? true : false}
                    />
                </View>
                <View style={{ flex: 1 }}>
                    <RoleSelectionScreen
                        key="2"
                        selectedRole={role}
                        setRole={setRole}
                        handleRegister={handleRegister}
                        handlePrevious={handlePreviousStep}
                        t={t}
                    />
                </View>
            </PagerView>
        </View>
    )
}