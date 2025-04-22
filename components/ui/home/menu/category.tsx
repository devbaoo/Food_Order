import { getAllCategories } from "@/api/modules/category";
import BackgroundLoading from "@/components/loading/background";
import { Category } from "@/types";
import screen from "@/utils/screen";
import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View, Image, Text } from "react-native";

interface MenuCategoryProps {
    onPress: (selectedCategory: string) => void;
    selectedTime: string | null;
}

const MenuCategory: React.FC<MenuCategoryProps> = ({ ...props }) => {
    const { onPress, selectedTime } = props;
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const onLoad = async () => {
        try {
            setLoading(true);
            const categories = await getAllCategories(selectedTime);
            setCategories(categories);
        }
        finally {
            setTimeout(() => setLoading(false), 600);
        }
    }

    useEffect(() => {
        onLoad();
    }, [selectedTime]);

    return (
        <>
            <View style={{ padding: 16, backgroundColor: "white", borderRadius: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 15 }}>
                {
                    categories.map((item, index) => (
                        <TouchableOpacity style={{ gap: 5 }} onPress={() => onPress(item.id)} key={index.toString()}>
                            <Image source={{ uri: item.image }} style={{ width: screen.width / 3.9, height: screen.height / 6.38, borderRadius: 10 }} />
                            <Text>{item.name}</Text>
                        </TouchableOpacity>
                    ))
                }
            </View>
            {loading && <BackgroundLoading />}
        </>
    )
}

export default MenuCategory;

const styles = StyleSheet.create({

})