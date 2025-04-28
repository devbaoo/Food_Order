import { getCategoriesByIds } from "@/api/modules/category";
import assets from "@/assets";
import Icon from "@/components/icon";
import BackgroundLoading from "@/components/loading/background";
import Modal from "@/components/modal";
import MenuStore from "@/components/ui/home/menu/store";
import { Category } from "@/types";
import screen from "@/utils/screen";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ResultScreen() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [show, setShow] = useState<boolean>(false);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const params = useLocalSearchParams();

    useEffect(() => {
        if (!params || !params.data) router.back();
        onLoad();
    }, []);

    const onLoad = async () => {
        try {
            setLoading(true);
            const result = await getCategoriesByIds(JSON.parse(params.data as string));
            setCategories(result);
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#00696C', '#00CBD2']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingHorizontal: 10
                }}
            >
                <View style={{
                    width: '100%',
                    maxHeight: '90%',
                    backgroundColor: 'rgba(255, 255, 255, 0.5)',
                    borderRadius: 30,
                    padding: 15
                }}>
                    <FlatList
                        data={categories}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={{ gap: 5, backgroundColor: 'white', borderRadius: 30, padding: 12, paddingBottom: 18 }}
                                onPress={() => {
                                    setShow(true);
                                    setSelectedCategory(item.id)
                                }}
                            >
                                <Image source={{ uri: item.image }} style={{ width: '100%', height: screen.height / 11.16, borderRadius: 18 }} resizeMode="cover" />
                                <Text style={{ fontSize: 16 }}>{item.name}</Text>
                                <Icon icon={assets.icon.star} size={16} />
                            </TouchableOpacity>
                        )}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ gap: 15 }}
                        style={{ width: '100%' }}
                    />
                </View>
            </LinearGradient>

            {loading && <BackgroundLoading />}

            <Modal
                visible={show}
                containerStyle={{ paddingBlock: screen.width * 0.08 }}
                onCancel={() => setShow(false)}
            >
                <LinearGradient
                    colors={['#00696C', '#00CBD2']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={{
                        flex: 1,
                    }}
                >
                    <MenuStore
                        onClose={() => setShow(false)}
                        selectedCategory={selectedCategory}
                        selectedTime={null}
                        onSelect={setSelectedCategory}
                        blockBack={true}
                    />
                </LinearGradient>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
})