
import { auth } from "@/lib/firebase-config";
import { useAuth } from "@/providers/AuthenticatedProvider";
import i18next from "@/services/i18next";
import { saveLanguage } from "@/utils/language";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { signOut } from "firebase/auth";
import React from "react";
import { useTranslation } from "react-i18next";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";

export default function ProfileScreen() {
    const { info } = useAuth();
    const changeLng = async (lng: string) => {
        i18next.changeLanguage(lng);
        await saveLanguage(lng);
    };
    const { i18n, t } = useTranslation();
    const currentLang = i18n.language;

    const menuItems = [
        {
            id: 1,
            title: t('app.voucher'),
            icon: 'local-offer',
            hasArrow: true,
            path: '/(profile)/voucher'
        },
        {
            id: 2,
            title: t('app.award'),
            icon: 'card-giftcard',
            subtitle: t('app.in-progressing'),
            hasArrow: true,
            path: ''
        },
        {
            id: 3,
            title: t('app.invite_friend'),
            icon: 'card-giftcard',
            subtitle: t('app.in-progressing'),
            hasArrow: true,
            path: ''
        },
    ];

    const generalItems = [
        {
            id: 1,
            title: t('app.help_center'),
            icon: 'help-outline',
            subtitle: t('app.in-progressing'),
            hasArrow: true,
        },
        {
            id: 2,
            title: t('app.mome_for_business'),
            icon: 'business',
            subtitle: t('app.in-progressing'),
            hasArrow: true,
        },
        {
            id: 3,
            title: t('app.privacy_and_policy'),
            icon: 'description',
            subtitle: t('app.in-progressing'),
            hasArrow: true,
        },
        {
            id: 4,
            title: t('app.language'),
            icon: 'language',
            subtitle: currentLang === "vi" ? "Tiếng Việt" : "English",
            hasArrow: false,
        },
    ];

    const renderMenuItem = (item: any) => (
        <TouchableOpacity key={item.id} style={styles.menuItem} onPress={() => {
            if (item.hasArrow) router.push(item.path);
            else {
                if (currentLang === "vi") changeLng("en");
                else changeLng("vi");
            }
        }}>
            <View style={styles.menuItemLeft}>
                <MaterialIcons name={item.icon} size={24} color="#333" style={styles.menuIcon} />
                <View style={styles.menuTextContainer}>
                    <Text style={styles.menuTitle}>{item.title}</Text>
                    {item.subtitle && (
                        <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                    )}
                </View>
            </View>
            {item.hasArrow && (
                <MaterialIcons name="chevron-right" size={24} color="#ccc" />
            )}
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>{t('app.account')}</Text>
                <TouchableOpacity>
                    <MaterialIcons name="settings" size={24} color="#333" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Profile Section */}
                <View style={styles.profileSection}>
                    <Text style={styles.profileName}>{info?.name}</Text>
                    <Text style={styles.profilePhone}>{info?.phone}</Text>

                    {/* Profile Image Placeholder */}
                    <View style={styles.profileImageContainer}>
                        <Image source={{ uri: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/cebd17f1-b283-45e5-8600-6ec3edc558fd/dee2aqv-222532a7-8676-4788-b8e3-08d4f5be55e2.png/v1/fill/w_1280,h_640,q_80,strp/profile_banner_by_darkfigure4_dee2aqv-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NjQwIiwicGF0aCI6IlwvZlwvY2ViZDE3ZjEtYjI4My00NWU1LTg2MDAtNmVjM2VkYzU1OGZkXC9kZWUyYXF2LTIyMjUzMmE3LTg2NzYtNDc4OC1iOGUzLTA4ZDRmNWJlNTVlMi5wbmciLCJ3aWR0aCI6Ijw9MTI4MCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.sdy7FtZ92V4tHXX-hTf0PupZmkD7CQoG-BkmOY0_mQg" }} style={styles.profileImagePlaceholder} />
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.actionButtons}>
                        <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/(profile)/order')}>
                            <MaterialIcons name="qr-code" size={20} color="#fff" />
                            <Text style={styles.actionButtonText}>{t('app.order')}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/(profile)/favourite')}>
                            <MaterialIcons name="favorite" size={20} color="#fff" />
                            <Text style={styles.actionButtonText}>{t('app.favourite')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Menu Sections */}
                <View style={styles.menuSection}>
                    <Text style={styles.sectionTitle}>{t("app.privileges_for_you")}</Text>
                    {menuItems.map(renderMenuItem)}
                </View>

                <View style={styles.menuSection}>
                    <Text style={styles.sectionTitle}>{t("app.general")}</Text>
                    {generalItems.map(renderMenuItem)}
                </View>

                {/* Logout Button */}
                <TouchableOpacity style={styles.logoutButton} onPress={async () => await signOut(auth)}>
                    <Text style={styles.logoutButtonText}>{t("app.logout")}</Text>
                </TouchableOpacity>
            </ScrollView>
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
        borderBottomColor: '#f0f0f0',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    content: {
        flex: 1,
    },
    profileSection: {
        padding: 20,
        backgroundColor: '#fff',
    },
    profileName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    profilePhone: {
        fontSize: 14,
        color: '#666',
        marginBottom: 20,
    },
    profileImageContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    profileImagePlaceholder: {
        width: '100%',
        height: 150,
        backgroundColor: '#E0E0E0',
        borderRadius: 8,
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    actionButton: {
        flex: 1,
        backgroundColor: '#FF5722',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    menuSection: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 15,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5',
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    menuIcon: {
        marginRight: 15,
    },
    menuTextContainer: {
        flex: 1,
    },
    menuTitle: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    menuSubtitle: {
        fontSize: 12,
        color: '#999',
        marginTop: 2,
    },
    logoutButton: {
        marginHorizontal: 20,
        marginVertical: 20,
        paddingVertical: 15,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        alignItems: 'center',
    },
    logoutButtonText: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    }
});