import assets from "@/assets";
import { auth } from "@/lib/firebase-config";
import { useAuth } from "@/providers/AuthenticatedProvider";
import screen from "@/utils/screen";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { signOut } from "firebase/auth";
import React from "react";
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from "react-native";

export default function ProfileScreen() {
    const { info } = useAuth();

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#00696C', '#00CBD2']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={{ flex: 1, paddingTop: 32, gap: 15 }}
            >
                <View style={{ paddingHorizontal: 15, flexDirection: "row", width: "100%", justifyContent: "space-between", alignItems: "center" }}>
                    <View style={{ gap: 5 }}>
                        <Image source={info ? { uri: info.avatar } : assets.avatar.default_user} style={styles.avatar} />
                        <Text style={{ fontSize: 16, color: "white" }}>{info?.name}</Text>
                    </View>
                    <TouchableOpacity
                        style={{ padding: 8, backgroundColor: "gray", borderRadius: screen.width }}
                        onPress={async () => await signOut(auth)}
                    >
                        <MaterialCommunityIcons name="logout" size={20} color="white" />
                    </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingBottom: 10 }}>
                    <View style={styles.contentContainer}>
                        <Text style={styles.content}>Content</Text>
                    </View>
                    <View style={styles.contentContainer}>
                        <Text style={styles.content}>Content</Text>
                    </View>
                    <View style={styles.contentContainer}>
                        <Text style={styles.content}>Content</Text>
                    </View>
                    <View style={styles.contentContainer}>
                        <Text style={styles.content}>Content</Text>
                    </View>
                    <View style={styles.contentContainer}>
                        <Text style={styles.content}>Content</Text>
                    </View>
                    <View style={styles.contentContainer}>
                        <Text style={styles.content}>Content</Text>
                    </View>
                    <View style={styles.contentContainer}>
                        <Text style={styles.content}>Content</Text>
                    </View>
                </ScrollView>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },

    avatar: {
        width: 77,
        height: 77,
        borderRadius: screen.width
    },

    contentContainer: {
        width: '100%',
        height: 190,
        borderRadius: 25,
        backgroundColor: "white",
        alignItems: 'center',
        justifyContent: 'center'
    },

    content: {
        fontSize: 16
    }
});