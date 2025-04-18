import assets from "@/assets";
import Icon from "@/components/icon";
import { LinearGradient } from "expo-linear-gradient";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ResultScreen() {
    const foods = [
        {
            id: 1,
            name: 'Pho Hanoi',
            image: assets.food.phohanoi
        },
        {
            id: 2,
            name: 'Bun bo hue',
            image: assets.food.bunbohue
        },
        {
            id: 3,
            name: 'Mi quang',
            image: assets.food.miquang
        },
        {
            id: 4,
            name: 'Banh canh cua',
            image: assets.food.banhcanhcua
        },
        {
            id: 5,
            name: 'Bun rieu cua',
            image: assets.food.bunrieucua
        }
    ];

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
                        data={foods}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={{ gap: 5, backgroundColor: 'white', borderRadius: 30, padding: 12, paddingBottom: 18 }}>
                                <Image source={item.image} style={{ width: '100%', borderRadius: 18 }} resizeMode="cover" />
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
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
})