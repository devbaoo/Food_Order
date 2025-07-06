import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Alert,
    Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const HelpCenter = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedFAQ, setExpandedFAQ] = useState(null);

    const faqData = [
        {
            id: 1,
            question: 'Làm thế nào để tôi thiết lập lại mật khẩu của mình?',
            answer: 'Để đặt lại mật khẩu, hãy vào màn hình đăng nhập và chạm vào "Quên mật khẩu". Nhập địa chỉ email của bạn và chúng tôi sẽ gửi cho bạn liên kết đặt lại. Làm theo hướng dẫn trong email để tạo mật khẩu mới.',
        },
        {
            id: 2,
            question: 'Làm thế nào tôi có thể cập nhật thông tin hồ sơ của tôi?',
            answer: 'Bạn có thể cập nhật hồ sơ của mình bằng cách vào Cài đặt > Hồ sơ. Từ đó, bạn có thể chỉnh sửa tên, email, số điện thoại và thông tin cá nhân khác. Đừng quên lưu các thay đổi của bạn.',
        },
        {
            id: 3,
            question: 'Tại sao tôi không nhận được thông báo?',
            answer: 'Kiểm tra cài đặt thiết bị của bạn để đảm bảo thông báo được bật cho ứng dụng của chúng tôi. Ngoài ra, hãy xác minh tùy chọn thông báo của bạn trong cài đặt ứng dụng. Nếu sự cố vẫn tiếp diễn, hãy thử khởi động lại ứng dụng.',
        },
        {
            id: 4,
            question: 'Tôi có thể liên hệ với bộ phận hỗ trợ khách hàng bằng cách nào?',
            answer: 'Bạn có thể liên hệ với nhóm hỗ trợ của chúng tôi thông qua phần "Liên hệ với chúng tôi" bên dưới, qua email tại support@memo.com hoặc thông qua tính năng trò chuyện trực tiếp 24/7 của chúng tôi.',
        },
        {
            id: 5,
            question: 'Dữ liệu của tôi có an toàn không?',
            answer: 'Có, chúng tôi sử dụng mã hóa tiêu chuẩn công nghiệp để bảo vệ dữ liệu của bạn. Chúng tôi tuân thủ các giao thức bảo mật nghiêm ngặt và không bao giờ chia sẻ thông tin cá nhân của bạn với bên thứ ba mà không có sự đồng ý của bạn.',
        },
    ];

    const handleSearch = () => {
        if (searchQuery.trim()) {
            Alert.alert('Tìm kiếm', `Đang tìm kiếm: ${searchQuery}`);
        }
    };

    const handleContactPress = (method: string) => {
        switch (method) {
            case 'email':
                Linking.openURL('mailto:support@memo.com');
                break;
            case 'chat':
                Alert.alert('Trò chuyện trực tiếp', 'Đang mở cuộc trò chuyện trực tiếp...');
                break;
            case 'phone':
                Linking.openURL('tel:+1-800-123-4567');
                break;
            default:
                break;
        }
    };

    const toggleFAQ = (id: any) => {
        setExpandedFAQ(expandedFAQ === id ? null : id);
    };

    const renderFAQ = (faq: any) => (
        <View key={faq.id} style={styles.faqItem}>
            <TouchableOpacity
                style={styles.faqQuestion}
                onPress={() => toggleFAQ(faq.id)}
            >
                <Text style={styles.faqQuestionText}>{faq.question}</Text>
                <Ionicons
                    name={expandedFAQ === faq.id ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color="#666"
                />
            </TouchableOpacity>
            {expandedFAQ === faq.id && (
                <View style={styles.faqAnswer}>
                    <Text style={styles.faqAnswerText}>{faq.answer}</Text>
                </View>
            )}
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View style={styles.header}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Trung tâm trợ giúp</Text>
                </View>
                <Text style={styles.headerSubtitle}>
                    Chúng tôi có thể giúp gì cho bạn hôm nay?
                </Text>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <View style={styles.searchBar}>
                        <Ionicons name="search" size={20} color="#666" />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Tìm kiếm trợ giúp..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            onSubmitEditing={handleSearch}
                        />
                    </View>
                    <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                        <Text style={styles.searchButtonText}>Tìm kiếm</Text>
                    </TouchableOpacity>
                </View>

                {/* Popular Articles */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Bài viết phổ biến</Text>
                    <View style={styles.articlesContainer}>
                        <TouchableOpacity style={styles.articleItem}>
                            <Text style={styles.articleTitle}>
                                Bắt đầu với tài khoản của bạn
                            </Text>
                            <Text style={styles.articleViews}>2.1k lượt xem</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.articleItem}>
                            <Text style={styles.articleTitle}>
                                Xử lý sự cố đăng nhập
                            </Text>
                            <Text style={styles.articleViews}>1.8k lượt xem</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.articleItem}>
                            <Text style={styles.articleTitle}>
                                Cách cập nhật phương thức thanh toán
                            </Text>
                            <Text style={styles.articleViews}>1.5k lượt xem</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* FAQ */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Câu hỏi thường gặp</Text>
                    <View style={styles.faqContainer}>
                        {faqData.map(renderFAQ)}
                    </View>
                </View>

                {/* Contact Us */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Vẫn cần trợ giúp?</Text>
                    <Text style={styles.contactDescription}>
                        Không tìm thấy những gì bạn đang tìm kiếm? Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng trợ giúp.
                    </Text>

                    <View style={styles.contactOptions}>
                        <TouchableOpacity
                            style={styles.contactOption}
                            onPress={() => handleContactPress('email')}
                        >
                            <Ionicons name="mail-outline" size={24} color="#2196F3" />
                            <Text style={styles.contactOptionTitle}>Hỗ trợ qua email</Text>
                            <Text style={styles.contactOptionSubtitle}>
                                Nhận trợ giúp qua email trong vòng 24 giờ
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.contactOption}
                            onPress={() => handleContactPress('chat')}
                        >
                            <Ionicons name="chatbubble-outline" size={24} color="#4CAF50" />
                            <Text style={styles.contactOptionTitle}>Trò chuyện trực tiếp</Text>
                            <Text style={styles.contactOptionSubtitle}>
                                Trò chuyện với nhóm hỗ trợ của chúng tôi ngay bây giờ
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.contactOption}
                            onPress={() => handleContactPress('phone')}
                        >
                            <Ionicons name="call-outline" size={24} color="#FF9800" />
                            <Text style={styles.contactOptionTitle}>Hỗ trợ qua điện thoại</Text>
                            <Text style={styles.contactOptionSubtitle}>
                                Gọi cho chúng tôi theo số 1-800-123-4567
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        paddingTop: StatusBar.currentHeight || 0,
    },
    header: {
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingVertical: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#666',
    },
    scrollView: {
        flex: 1,
    },
    searchContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: 'white',
        marginBottom: 8,
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        paddingHorizontal: 12,
        marginRight: 12,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 12,
        paddingLeft: 8,
        fontSize: 16,
    },
    searchButton: {
        backgroundColor: '#2196F3',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    searchButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    section: {
        backgroundColor: 'white',
        marginBottom: 8,
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
    },
    categoriesContainer: {
        gap: 12,
    },
    categoryCard: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    categoryIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    categoryContent: {
        flex: 1,
    },
    categoryTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 2,
    },
    categoryArticles: {
        fontSize: 14,
        color: '#666',
    },
    articlesContainer: {
        gap: 12,
    },
    articleItem: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    articleTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        marginBottom: 4,
    },
    articleViews: {
        fontSize: 14,
        color: '#666',
    },
    faqContainer: {
        gap: 8,
    },
    faqItem: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        overflow: 'hidden',
    },
    faqQuestion: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 16,
        backgroundColor: '#f8f9fa',
    },
    faqQuestionText: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        marginRight: 8,
    },
    faqAnswer: {
        paddingVertical: 16,
        paddingHorizontal: 16,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    faqAnswerText: {
        fontSize: 15,
        color: '#555',
        lineHeight: 22,
    },
    contactDescription: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
        lineHeight: 24,
    },
    contactOptions: {
        gap: 16,
    },
    contactOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    contactOptionTitle: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginLeft: 12,
    },
    contactOptionSubtitle: {
        fontSize: 14,
        color: '#666',
        marginLeft: 12,
        flex: 2,
    },
});

export default HelpCenter;