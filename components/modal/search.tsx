import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, FlatList, Pressable } from 'react-native';
import assets from '@/assets';
import screen from '@/utils/screen';
import Modal from '.';
import Icon from '../icon';

interface SearchModalProps {
    onClose: () => void;
    visible: boolean;
}

const SearchModal: React.FC<SearchModalProps> = ({ ...props }) => {
    const { onClose, visible } = props;

    const [searchText, setSearchText] = useState('');

    const recentSearches = [
        { id: '1', text: 'Lorem ipsum' },
        { id: '2', text: 'Lorem ipsum' },
    ];

    const prompts = [
        { id: '1', text: 'Lorem ipsum' },
        { id: '2', text: 'Lorem ipsum' },
        { id: '3', text: 'Lorem ipsum' },
        { id: '4', text: 'Lorem ipsum' },
    ];

    const suggestions = [
        {
            id: '1',
            name: 'Shop',
            logo: assets.shop.shop1,
            ratings: '4.5'
        },
        {
            id: '2',
            name: 'Shop',
            logo: assets.shop.shop1,
            ratings: '4.2'
        },
        {
            id: '3',
            name: 'Shop',
            logo: assets.shop.shop1,
            ratings: '4.8'
        },
        {
            id: '4',
            name: 'Shop',
            logo: assets.shop.shop1,
            ratings: '4.8'
        },
        {
            id: '5',
            name: 'Shop',
            logo: assets.shop.shop1,
            ratings: '4.8'
        },
        {
            id: '6',
            name: 'Shop',
            logo: assets.shop.shop1,
            ratings: '4.8'
        },
        {
            id: '7',
            name: 'Shop',
            logo: assets.shop.shop1,
            ratings: '4.8'
        },
    ];

    return (
        <Modal visible={visible}>
            <View style={styles.container}>
                {/* Header with search input */}
                <View style={styles.searchHeader}>
                    <Icon icon={assets.icon.search} size={24} />
                    <Pressable onPress={onClose}>
                        <Icon icon={assets.icon.dropdown} size={24} />
                    </Pressable>
                </View>

                {/* Content */}
                <View style={styles.content}>
                    {/* Recently search */}
                    <Text style={styles.sectionTitle}>Recently search</Text>
                    <View style={styles.chipContainer}>
                        {recentSearches.map((item) => (
                            <TouchableOpacity key={item.id} style={styles.chip}>
                                <Text style={styles.chipText}>{item.text}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Prompt */}
                    <Text style={styles.sectionTitle}>Prompt</Text>
                    <View style={styles.chipContainer}>
                        {prompts.map((item) => (
                            <TouchableOpacity key={item.id} style={styles.chip}>
                                <Text style={styles.chipText}>{item.text}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Suggestions */}
                    <Text style={styles.sectionTitle}>Suggestions</Text>
                    <FlatList
                        data={suggestions}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.suggestionsContainer}
                        renderItem={({ item }) => (
                            <View style={styles.suggestionItem}>
                                <Image source={item.logo} style={styles.suggestionLogo} />
                                <Text style={styles.suggestionName}>{item.name}</Text>
                                <View style={styles.ratingsContainer}>
                                    <Icon icon={assets.icon.star} size={16} />
                                    <Text style={styles.ratingsText}>Ratings</Text>
                                </View>
                            </View>
                        )}
                    />
                </View>
            </View>
        </Modal>
    );
}

export default SearchModal;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        flex: 1,
        height: screen.height * 0.87,
    },
    searchHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        gap: 10,
        backgroundColor: "white",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.36,
        shadowRadius: 6.68,
        elevation: 11,
    },
    downButton: {
        padding: 5,
    },
    searchInputContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#f1f1f1',
        borderRadius: 8,
        paddingHorizontal: 10,
        alignItems: 'center',
        height: 40,
    },
    searchInput: {
        flex: 1,
        paddingLeft: 10,
        fontSize: 16,
    },
    content: {
        flex: 1,
        paddingHorizontal: 15,
        paddingTop: 10,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 15,
        marginBottom: 10,
    },
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    chip: {
        backgroundColor: '#f1f1f1',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
    },
    chipText: {
        color: '#666',
    },
    suggestionsContainer: {
        paddingVertical: 10,
    },
    suggestionItem: {
        width: 160,
        marginRight: 15,
        alignItems: 'center',
        gap: 15
    },
    suggestionLogo: {
        width: 160,
        height: 174,
        resizeMode: 'center',
        backgroundColor: '#F6F6F6',
        borderRadius: 10
    },
    suggestionName: {
        fontWeight: '500',
        textAlign: 'left',
        fontSize: 16,
        width: '100%',
        paddingHorizontal: 10
    },
    ratingsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        paddingHorizontal: 10
    },
    ratingsText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 5,
    },
});