import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function MomePolicyPage() {
    const [activeSection, setActiveSection] = useState('privacy');
    const [expandedItems, setExpandedItems] = useState<{ [key: string]: boolean }>({});

    const toggleExpanded = (item: any) => {
        setExpandedItems(prev => ({
            ...prev,
            [item]: !prev[item]
        }));
    };

    const CollapsibleSection = ({ title, children, id }: any) => (
        <View style={styles.collapsibleContainer}>
            <TouchableOpacity
                style={styles.collapsibleHeader}
                onPress={() => toggleExpanded(id)}
            >
                <Text style={styles.collapsibleTitle}>{title}</Text>
                <Ionicons
                    name={expandedItems[id] ? 'chevron-up' : 'chevron-down'}
                    size={24}
                    color="#666"
                />
            </TouchableOpacity>
            {expandedItems[id] && (
                <View style={styles.collapsibleContent}>
                    {children}
                </View>
            )}
        </View>
    );

    const PrivacyPolicy = () => (
        <ScrollView style={styles.contentContainer}>
            {/* Header */}
            <View style={styles.headerContainer}>
                <View style={styles.headerIcon}>
                    <Ionicons name="shield-checkmark" size={32} color="#fff" />
                </View>
                <Text style={styles.headerTitle}>Chính sách bảo mật</Text>
                <Text style={styles.headerSubtitle}>
                    Quyền riêng tư của bạn rất quan trọng đối với chúng tôi. Chính sách này giải thích cách Mome thu thập, sử dụng và bảo vệ thông tin của bạn.
                </Text>
                <Text style={styles.lastUpdated}>
                    Cập nhật lần cuối: {new Date().toLocaleDateString()}
                </Text>
            </View>

            {/* Information We Collect */}
            <CollapsibleSection title="Thông tin chúng tôi thu thập" id="collect">
                <View style={styles.userTypeContainer}>
                    <View style={styles.userTypeItem}>
                        <Ionicons name="people" size={20} color="#3B82F6" />
                        <View style={styles.userTypeContent}>
                            <Text style={styles.userTypeTitle}>Dành cho tất cả người dùng</Text>
                            <Text style={styles.userTypeDescription}>
                                Tên, địa chỉ email, số điện thoại, ảnh đại diện và tùy chọn tài khoản.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.userTypeItem}>
                        <Ionicons name="storefront" size={20} color="#10B981" />
                        <View style={styles.userTypeContent}>
                            <Text style={styles.userTypeTitle}>Dành cho người bán</Text>
                            <Text style={styles.userTypeDescription}>
                                Thông tin doanh nghiệp, chi tiết nhà hàng, thực đơn, thông tin tài khoản ngân hàng để thanh toán, giấy phép kinh doanh và chứng nhận an toàn thực phẩm.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.userTypeItem}>
                        <Ionicons name="bicycle" size={20} color="#8B5CF6" />
                        <View style={styles.userTypeContent}>
                            <Text style={styles.userTypeTitle}>Dành cho người vận chuyển</Text>
                            <Text style={styles.userTypeDescription}>
                                Thông tin về xe, giấy phép lái xe, thông tin bảo hiểm, vị trí thực tế trong quá trình giao hàng và số liệu đo lường hiệu suất giao hàng.
                            </Text>
                        </View>
                    </View>
                </View>
            </CollapsibleSection>

            {/* How We Use Your Information */}
            <CollapsibleSection title="Chúng tôi sử dụng thông tin của bạn như thế nào" id="use">
                <View style={styles.bulletList}>
                    <View style={styles.bulletItem}>
                        <View style={styles.bullet} />
                        <Text style={styles.bulletText}>Xử lý và thực hiện đơn đặt hàng thực phẩm</Text>
                    </View>
                    <View style={styles.bulletItem}>
                        <View style={styles.bullet} />
                        <Text style={styles.bulletText}>Tạo điều kiện thuận lợi cho việc giao tiếp giữa người dùng, người bán và người vận chuyển</Text>
                    </View>
                    <View style={styles.bulletItem}>
                        <View style={styles.bullet} />
                        <Text style={styles.bulletText}>Xử lý thanh toán và quản lý giao dịch tài chính</Text>
                    </View>
                    <View style={styles.bulletItem}>
                        <View style={styles.bullet} />
                        <Text style={styles.bulletText}>Cung cấp hỗ trợ khách hàng và giải quyết vấn đề</Text>
                    </View>
                    <View style={styles.bulletItem}>
                        <View style={styles.bullet} />
                        <Text style={styles.bulletText}>Cải thiện dịch vụ và trải nghiệm người dùng của chúng tôi</Text>
                    </View>
                    <View style={styles.bulletItem}>
                        <View style={styles.bullet} />
                        <Text style={styles.bulletText}>Gửi thông báo về đơn hàng, chương trình khuyến mãi và cập nhật dịch vụ</Text>
                    </View>
                </View>
            </CollapsibleSection>

            {/* Information Sharing */}
            <CollapsibleSection title="Chia sẻ thông tin" id="sharing">
                <View style={styles.warningBox}>
                    <Text style={styles.warningTitle}>Chúng tôi chỉ chia sẻ thông tin khi cần thiết:</Text>
                    <Text style={styles.warningText}>• Với người bán để xử lý đơn đặt hàng và sở thích ăn kiêng của bạn</Text>
                    <Text style={styles.warningText}>• Với người giao hàng để giao thực phẩm của bạn (địa chỉ và thông tin liên lạc)</Text>
                    <Text style={styles.warningText}>• Với bộ xử lý thanh toán để xử lý giao dịch một cách an toàn</Text>
                    <Text style={styles.warningText}>• Với cơ quan thực thi pháp luật nếu luật pháp yêu cầu</Text>
                    <Text style={styles.warningText}>• Với các nhà cung cấp dịch vụ giúp chúng tôi vận hành ứng dụng</Text>
                </View>
                <Text style={styles.disclaimerText}>
                    Chúng tôi không bao giờ bán thông tin cá nhân của bạn cho bên thứ ba vì mục đích tiếp thị.
                </Text>
            </CollapsibleSection>

            {/* Data Security */}
            <CollapsibleSection title="Bảo mật dữ liệu" id="security">
                <View style={styles.securityContainer}>
                    <View style={styles.securityHeader}>
                        <Ionicons name="lock-closed" size={20} color="#10B981" />
                        <Text style={styles.securityTitle}>Chúng tôi thực hiện các biện pháp bảo mật theo tiêu chuẩn công nghiệp:</Text>
                    </View>
                    <View style={styles.securityList}>
                        <Text style={styles.securityItem}>• Mã hóa đầu cuối cho dữ liệu nhạy cảm</Text>
                        <Text style={styles.securityItem}>• Xử lý thanh toán an toàn với sự tuân thủ PCI DSS</Text>
                        <Text style={styles.securityItem}>• Kiểm tra bảo mật thường xuyên và đánh giá lỗ hổng</Text>
                        <Text style={styles.securityItem}>• Quyền truy cập hạn chế vào thông tin cá nhân khi cần thiết</Text>
                        <Text style={styles.securityItem}>• Tự động đăng xuất sau thời gian không hoạt động</Text>
                    </View>
                </View>
            </CollapsibleSection>

            {/* Your Rights */}
            <CollapsibleSection title="Quyền của bạn" id="rights">
                <View style={styles.rightsContainer}>
                    <View style={styles.rightsBox}>
                        <Text style={styles.rightsBoxTitle}>Truy cập & Kiểm soát</Text>
                        <Text style={styles.rightsBoxText}>• Xem thông tin cá nhân của bạn</Text>
                        <Text style={styles.rightsBoxText}>• Cập nhật hồ sơ của bạn bất cứ lúc nào</Text>
                        <Text style={styles.rightsBoxText}>• Tải xuống dữ liệu của bạn</Text>
                    </View>
                    <View style={styles.rightsBox}>
                        <Text style={styles.rightsBoxTitle}>Kiểm soát quyền riêng tư</Text>
                        <Text style={styles.rightsBoxText}>• Từ chối nhận email tiếp thị</Text>
                        <Text style={styles.rightsBoxText}>• Kiểm soát cài đặt thông báo</Text>
                        <Text style={styles.rightsBoxText}>• Yêu cầu xóa tài khoản</Text>
                    </View>
                </View>
            </CollapsibleSection>

            {/* Contact Us */}
            <CollapsibleSection title="Liên hệ với chúng tôi" id="contact">
                <View style={styles.contactBox}>
                    <Text style={styles.contactTitle}>Đối với các câu hỏi hoặc mối quan tâm liên quan đến quyền riêng tư, vui lòng liên hệ với chúng tôi:</Text>
                    <Text style={styles.contactItem}>Email: privacy@mome.app</Text>
                    <Text style={styles.contactItem}>Điện thoại: +1 (555) 123-4567</Text>
                    <Text style={styles.contactItem}>Địa chỉ: Khu công nghiệp Tân Đức, Lô 25 KCN Tân, ấp Chánh, Đức Hòa, Long An, Việt Nam</Text>
                </View>
            </CollapsibleSection>
        </ScrollView>
    );

    const TermsOfService = () => (
        <ScrollView style={styles.contentContainer}>
            {/* Header */}
            <View style={[styles.headerContainer, { backgroundColor: '#3B82F6' }]}>
                <View style={styles.headerIcon}>
                    <Ionicons name="document-text" size={32} color="#fff" />
                </View>
                <Text style={styles.headerTitle}>Điều khoản dịch vụ</Text>
                <Text style={styles.headerSubtitle}>
                    Bằng cách sử dụng Mome, bạn đồng ý với các điều khoản này. Vui lòng đọc kỹ các điều khoản này.
                </Text>
                <Text style={styles.lastUpdated}>
                    Cập nhật lần cuối: {new Date().toLocaleDateString()}
                </Text>
            </View>

            {/* User Responsibilities */}
            <CollapsibleSection title="Trách nhiệm của người dùng" id="responsibilities">
                <View style={styles.responsibilityContainer}>
                    <View style={styles.responsibilitySection}>
                        <Text style={styles.responsibilityTitle}>Dành cho tất cả người dùng</Text>
                        <Text style={styles.responsibilityText}>• Cung cấp thông tin chính xác và cập nhật</Text>
                        <Text style={styles.responsibilityText}>• Duy trì tính bảo mật của thông tin tài khoản của bạn</Text>
                        <Text style={styles.responsibilityText}>• Sử dụng ứng dụng theo đúng luật hiện hành</Text>
                        <Text style={styles.responsibilityText}>• Tôn trọng người dùng khác và duy trì hành vi chuyên nghiệp</Text>
                    </View>

                    <View style={styles.responsibilitySection}>
                        <Text style={styles.responsibilityTitle}>Dành cho người bán</Text>
                        <Text style={styles.responsibilityText}>• Duy trì giấy phép và giấy phép kinh doanh hợp lệ</Text>
                        <Text style={styles.responsibilityText}>• Cung cấp thông tin thực đơn và giá cả chính xác</Text>
                        <Text style={styles.responsibilityText}>• Chuẩn bị thực phẩm an toàn và đạt tiêu chuẩn sức khỏe</Text>
                        <Text style={styles.responsibilityText}>• Thực hiện đơn hàng nhanh chóng và chính xác</Text>
                    </View>

                    <View style={styles.responsibilitySection}>
                        <Text style={styles.responsibilityTitle}>Dành cho chủ hàng</Text>
                        <Text style={styles.responsibilityText}>• Duy trì giấy phép lái xe và bảo hiểm hợp lệ</Text>
                        <Text style={styles.responsibilityText}>• Giao hàng an toàn và đúng hạn</Text>
                        <Text style={styles.responsibilityText}>• Xử lý thực phẩm cẩn thận và duy trì nhiệt độ</Text>
                        <Text style={styles.responsibilityText}>• Thực hiện luật giao thông và quy định an toàn</Text>
                    </View>
                </View>
            </CollapsibleSection>

            {/* Payment Terms */}
            <CollapsibleSection title="Điều khoản thanh toán" id="payment">
                <View style={styles.paymentContainer}>
                    <View style={styles.paymentBox}>
                        <Text style={styles.paymentBoxTitle}>Xử lý thanh toán</Text>
                        <Text style={styles.paymentBoxText}>• Tất cả các khoản thanh toán được xử lý an toàn thông qua các đối tác thanh toán của chúng tôi</Text>
                        <Text style={styles.paymentBoxText}>• Giá bao gồm thuế và phí áp dụng</Text>
                        <Text style={styles.paymentBoxText}>• Thanh toán được tính khi đơn hàng được xác nhận</Text>
                        <Text style={styles.paymentBoxText}>• Việc hoàn tiền được xử lý theo chính sách hoàn tiền của chúng tôi</Text>
                    </View>

                    <View style={styles.paymentBox}>
                        <Text style={styles.paymentBoxTitle}>Thanh toán của người bán</Text>
                        <Text style={styles.paymentBoxText}>• Người bán nhận được thanh toán sau khi hoàn tất đơn hàng thành công</Text>
                        <Text style={styles.paymentBoxText}>• Mome giữ lại một khoản phí dịch vụ từ mỗi giao dịch</Text>
                        <Text style={styles.paymentBoxText}>• Thanh toán được xử lý hàng tuần vào các tài khoản ngân hàng đã đăng ký</Text>
                        <Text style={styles.paymentBoxText}>• Biểu mẫu báo cáo thuế được cung cấp hàng năm</Text>
                    </View>

                    <View style={styles.paymentBox}>
                        <Text style={styles.paymentBoxTitle}>Thanh toán của người gửi hàng</Text>
                        <Text style={styles.paymentBoxText}>• Người giao hàng kiếm được tiền cho mỗi lần giao hàng hoàn thành cộng với tiền boa</Text>
                        <Text style={styles.paymentBoxText}>• Thanh toán bao gồm phí cơ bản và bồi thường theo khoảng cách</Text>
                        <Text style={styles.paymentBoxText}>• Thanh toán hàng tuần cho các tài khoản đã đăng ký</Text>
                        <Text style={styles.paymentBoxText}>• Tiền thưởng hiệu suất cho các lần giao hàng được đánh giá cao</Text>
                    </View>
                </View>
            </CollapsibleSection>

            {/* Cancellation & Refunds */}
            <CollapsibleSection title="Hủy bỏ & Hoàn tiền" id="cancellation">
                <View style={styles.cancellationContainer}>
                    <View style={styles.cancellationBox}>
                        <Text style={styles.cancellationTitle}>Chính sách hủy</Text>
                        <Text style={styles.cancellationText}>• Đơn hàng có thể bị hủy trong vòng 2 phút sau khi đặt</Text>
                        <Text style={styles.cancellationText}>• Hủy sau khi đã bắt đầu chuẩn bị thức ăn có thể phải chịu phí</Text>
                        <Text style={styles.cancellationText}>• Người bán và người vận chuyển có thể hủy đơn hàng do những trường hợp bất khả kháng</Text>
                        <Text style={styles.cancellationText}>• Việc hủy bỏ nhiều lần có thể dẫn đến hạn chế tài khoản</Text>
                    </View>

                    <View style={styles.refundBox}>
                        <Text style={styles.refundTitle}>Chính sách hoàn tiền</Text>
                        <Text style={styles.refundText}>• Hoàn lại toàn bộ tiền cho các đơn hàng đã hủy trong thời gian hủy</Text>
                        <Text style={styles.refundText}>• Hoàn tiền cho các đơn hàng chưa giao hoặc chậm trễ đáng kể</Text>
                        <Text style={styles.refundText}>• Hoàn lại một phần tiền cho các mặt hàng bị thiếu hoặc các vấn đề về chất lượng</Text>
                        <Text style={styles.refundText}>• Hoàn tiền được xử lý trong vòng 3-5 ngày làm việc</Text>
                    </View>
                </View>
            </CollapsibleSection>

            {/* Prohibited Activities */}
            <CollapsibleSection title="Các hoạt động bị cấm" id="prohibited">
                <View style={styles.prohibitedBox}>
                    <Text style={styles.prohibitedTitle}>Các hoạt động sau đây bị nghiêm cấm:</Text>
                    <Text style={styles.prohibitedText}>• Tạo tài khoản hoặc đánh giá giả mạo</Text>
                    <Text style={styles.prohibitedText}>• Chia sẻ thông tin xác thực tài khoản</Text>
                    <Text style={styles.prohibitedText}>• Quấy rối hoặc hành vi không phù hợp</Text>
                    <Text style={styles.prohibitedText}>• Vi phạm quy định về an toàn thực phẩm</Text>
                    <Text style={styles.prohibitedText}>• Hoạt động thanh toán gian lận</Text>
                    <Text style={styles.prohibitedText}>• Bỏ qua phí nền tảng</Text>
                    <Text style={styles.prohibitedText}>• Thực hành phân biệt đối xử</Text>
                    <Text style={styles.prohibitedText}>• Bán rượu hoặc các mặt hàng bị cấm</Text>
                </View>
            </CollapsibleSection>

            {/* Limitation of Liability */}
            <CollapsibleSection title="Giới hạn trách nhiệm" id="liability">
                <Text style={styles.liabilityText}>
                    Mome đóng vai trò là nền tảng kết nối người dùng, người bán và người giao hàng. Mặc dù chúng tôi cố gắng cung cấp dịch vụ tốt nhất có thể, nhưng chúng tôi không thể đảm bảo chất lượng, sự an toàn hoặc tính chính xác của các mặt hàng thực phẩm hoặc dịch vụ giao hàng.
                </Text>
                <View style={styles.liabilityBox}>
                    <Text style={styles.liabilityTitle}>Trách nhiệm của chúng tôi được giới hạn ở:</Text>
                    <Text style={styles.liabilityItem}>• Số tiền đã thanh toán cho đơn hàng cụ thể đang được đề cập</Text>
                    <Text style={styles.liabilityItem}>• Các vấn đề kỹ thuật liên quan đến nền tảng nằm trong tầm kiểm soát của chúng tôi</Text>
                    <Text style={styles.liabilityItem}>• Vi phạm bảo mật dữ liệu do sự bất cẩn của chúng tôi</Text>
                </View>
            </CollapsibleSection>

            {/* Changes to Terms */}
            <CollapsibleSection title="Thay đổi điều khoản" id="changes">
                <View style={styles.changesBox}>
                    <Text style={styles.changesTitle}>Chúng tôi có thể cập nhật các điều khoản này theo thời gian. Khi chúng tôi làm:</Text>
                    <Text style={styles.changesText}>• Chúng tôi sẽ thông báo cho bạn qua email hoặc thông báo trong ứng dụng</Text>
                    <Text style={styles.changesText}>• Thay đổi có hiệu lực sau 30 ngày kể từ ngày thông báo</Text>
                    <Text style={styles.changesText}>• Việc tiếp tục sử dụng ứng dụng có nghĩa là chấp nhận</Text>
                    <Text style={styles.changesText}>• Bạn có thể đóng tài khoản của mình nếu bạn không đồng ý với những thay đổi</Text>
                </View>
            </CollapsibleSection>
        </ScrollView>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.backHeader}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#495057" />
                    <Text style={styles.backButtonText}>Quay lại</Text>
                </TouchableOpacity>
            </View>

            {/* Navigation */}
            <View style={styles.navigationContainer}>
                <TouchableOpacity
                    style={[
                        styles.navButton,
                        activeSection === 'privacy' && styles.navButtonActive
                    ]}
                    onPress={() => setActiveSection('privacy')}
                >
                    <Text style={[
                        styles.navButtonText,
                        activeSection === 'privacy' && styles.navButtonTextActive
                    ]}>
                        Privacy Policy
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.navButton,
                        activeSection === 'terms' && styles.navButtonActive
                    ]}
                    onPress={() => setActiveSection('terms')}
                >
                    <Text style={[
                        styles.navButtonText,
                        activeSection === 'terms' && styles.navButtonTextActive
                    ]}>
                        Terms of Service
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Content */}
            {activeSection === 'privacy' ? <PrivacyPolicy /> : <TermsOfService />}

            {/* Footer */}
            <View style={styles.footer}>
                <Text style={styles.footerText}>© 2024 Mome. All rights reserved.</Text>
                <Text style={styles.footerSubtext}>
                    Câu hỏi? Liên hệ với chúng tôi tại support@mome.app
                </Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 32
    },
    backHeader: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 4,
    },
    backButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#495057',
        marginLeft: 8,
    },
    navigationContainer: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#f8f9fa',
        gap: 10,
    },
    navButton: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        backgroundColor: '#e9ecef',
        alignItems: 'center',
    },
    navButtonActive: {
        backgroundColor: '#FF6B35',
    },
    navButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#495057',
    },
    navButtonTextActive: {
        color: '#fff',
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 20,
    },
    headerContainer: {
        backgroundColor: '#FF6B35',
        borderRadius: 12,
        padding: 20,
        marginVertical: 20,
        alignItems: 'center',
    },
    headerIcon: {
        marginBottom: 10,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#fff',
        opacity: 0.9,
        textAlign: 'center',
        marginBottom: 8,
    },
    lastUpdated: {
        fontSize: 12,
        color: '#fff',
        opacity: 0.7,
    },
    collapsibleContainer: {
        borderWidth: 1,
        borderColor: '#e9ecef',
        borderRadius: 8,
        marginBottom: 16,
        overflow: 'hidden',
    },
    collapsibleHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f8f9fa',
    },
    collapsibleTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#495057',
        flex: 1,
    },
    collapsibleContent: {
        padding: 16,
        backgroundColor: '#fff',
    },
    userTypeContainer: {
        gap: 16,
    },
    userTypeItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
    },
    userTypeContent: {
        flex: 1,
    },
    userTypeTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#495057',
        marginBottom: 4,
    },
    userTypeDescription: {
        fontSize: 14,
        color: '#6c757d',
        lineHeight: 20,
    },
    bulletList: {
        gap: 8,
    },
    bulletItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
    },
    bullet: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#FF6B35',
        marginTop: 6,
    },
    bulletText: {
        fontSize: 14,
        color: '#495057',
        flex: 1,
        lineHeight: 18,
    },
    warningBox: {
        backgroundColor: '#fff3cd',
        borderWidth: 1,
        borderColor: '#ffeaa7',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
    },
    warningTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#856404',
        marginBottom: 8,
    },
    warningText: {
        fontSize: 14,
        color: '#856404',
        lineHeight: 18,
    },
    disclaimerText: {
        fontSize: 12,
        color: '#6c757d',
        fontStyle: 'italic',
    },
    securityContainer: {
        gap: 12,
    },
    securityHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    securityTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#495057',
    },
    securityList: {
        gap: 4,
    },
    securityItem: {
        fontSize: 14,
        color: '#6c757d',
        lineHeight: 18,
    },
    rightsContainer: {
        gap: 16,
    },
    rightsBox: {
        backgroundColor: '#e7f3ff',
        borderWidth: 1,
        borderColor: '#b3d9ff',
        borderRadius: 8,
        padding: 16,
    },
    rightsBoxTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0056b3',
        marginBottom: 8,
    },
    rightsBoxText: {
        fontSize: 14,
        color: '#0056b3',
        lineHeight: 18,
    },
    contactBox: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 16,
    },
    contactTitle: {
        fontSize: 16,
        color: '#495057',
        marginBottom: 12,
    },
    contactItem: {
        fontSize: 14,
        color: '#6c757d',
        lineHeight: 20,
    },
    responsibilityContainer: {
        gap: 16,
    },
    responsibilitySection: {
        borderLeftWidth: 4,
        borderLeftColor: '#FF6B35',
        paddingLeft: 16,
    },
    responsibilityTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#495057',
        marginBottom: 8,
    },
    responsibilityText: {
        fontSize: 14,
        color: '#6c757d',
        lineHeight: 18,
    },
    paymentContainer: {
        gap: 16,
    },
    paymentBox: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 16,
    },
    paymentBoxTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#495057',
        marginBottom: 8,
    },
    paymentBoxText: {
        fontSize: 14,
        color: '#6c757d',
        lineHeight: 18,
    },
    cancellationContainer: {
        gap: 16,
    },
    cancellationBox: {
        backgroundColor: '#fff3cd',
        borderWidth: 1,
        borderColor: '#ffeaa7',
        borderRadius: 8,
        padding: 16,
    },
    cancellationTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#856404',
        marginBottom: 8,
    },
    cancellationText: {
        fontSize: 14,
        color: '#856404',
        lineHeight: 18,
    },
    refundBox: {
        backgroundColor: '#f8d7da',
        borderWidth: 1,
        borderColor: '#f5c6cb',
        borderRadius: 8,
        padding: 16,
    },
    refundTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#721c24',
        marginBottom: 8,
    },
    refundText: {
        fontSize: 14,
        color: '#721c24',
        lineHeight: 18,
    },
    prohibitedBox: {
        backgroundColor: '#f8d7da',
        borderWidth: 1,
        borderColor: '#f5c6cb',
        borderRadius: 8,
        padding: 16,
    },
    prohibitedTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#721c24',
        marginBottom: 12,
    },
    prohibitedText: {
        fontSize: 14,
        color: '#721c24',
        lineHeight: 18,
    },
    liabilityText: {
        fontSize: 14,
        color: '#495057',
        lineHeight: 20,
        marginBottom: 16,
    },
    liabilityBox: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 16,
    },
    liabilityTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#495057',
        marginBottom: 8,
    },
    liabilityItem: {
        fontSize: 14,
        color: '#6c757d',
        lineHeight: 18,
    },
    changesBox: {
        backgroundColor: '#e7f3ff',
        borderWidth: 1,
        borderColor: '#b3d9ff',
        borderRadius: 8,
        padding: 16,
    },
    changesTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0056b3',
        marginBottom: 8,
    },
    changesText: {
        fontSize: 14,
        color: '#0056b3',
        lineHeight: 18,
    },
    footer: {
        borderTopWidth: 1,
        borderTopColor: '#e9ecef',
        paddingVertical: 20,
        paddingHorizontal: 20,
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
    },
    footerText: {
        fontSize: 14,
        color: '#6c757d',
        marginBottom: 4,
    },
    footerSubtext: {
        fontSize: 12,
        color: '#6c757d',
    },
});