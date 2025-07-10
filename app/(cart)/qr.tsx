import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    StyleSheet,
    Share,
    Linking,
    Dimensions,
    ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { checkPayment, createPaymentUrlPayOS, savePaymentHistory } from '@/api/modules/payment';
import { router, useLocalSearchParams } from 'expo-router';
import { formatCurrency } from '@/utils/currency';
import { useAuth } from '@/providers/AuthenticatedProvider';
import { getTimestampLong } from '@/utils/date';
import { toast } from '@/utils/toast';
import { usePaymentStore } from '@/stores/paymentStore';
import { createBookingsFromCart } from '@/api/modules/booking';
import { useTranslation } from 'react-i18next';
import { checkAndSendNotify } from '@/api/modules/notification';

const { width } = Dimensions.get('window');

export default function QRPaymentScreen() {
    const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [isChecking, setIsChecking] = useState(false);
    const [paymentCode, setPaymentCode] = useState('');
    const [paymentUrl, setPaymentUrl] = useState<string>('');
    const { amount, cartSF } = useLocalSearchParams();
    const [paymentLinkId, setPaymentLinkId] = useState<string | null>(null);
    const { setPaymentStatus } = usePaymentStore();
    const { t } = useTranslation();
    const { info } = useAuth();

    // Call VietQR API to generate QR code
    const generateQRCode = async () => {
        try {
            setLoading(true);

            const result = await createPaymentUrlPayOS({
                orderCode: getTimestampLong(),
                amount: Number(amount) || 0,
                description: `Don hang - ${JSON.parse(cartSF as string)?.id?.slice(0, 6)}`,
                buyerName: info?.name ?? '',
                buyerEmail: '',
                buyerPhone: info?.phone ?? '',
                buyerAddress: info?.address ?? '',
                items: JSON.parse(cartSF as string)?.cartItems?.map((item: any) => ({
                    name: item?.name ?? '',
                    quantity: item?.quantity ?? 0,
                    price: item?.price ?? 0
                })) || []
            })

            if (result && result.data) {
                const { bin, accountNumber, description, amount, qrCode, paymentLinkId, checkoutUrl } = result.data;
                console.log(paymentLinkId);
                const qrImageUrl = `https://api.vietqr.io/image/${bin}-${accountNumber}-vietqr_pro.jpg?addInfo=${encodeURIComponent(description)}&amount=${amount}`;
                setQrDataUrl(qrImageUrl);
                setPaymentLinkId(paymentLinkId);
                setPaymentUrl(checkoutUrl || '');
                setPaymentCode(qrCode || '');
            } else {
                Alert.alert('Lỗi', 'Không tạo được mã QR');
            }
            console.log('QR Code Result:', result);
        } catch (error) {
            console.error('QR Generation Error:', error);
            Alert.alert('Lỗi', 'Không tạo được mã QR');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (amount) generateQRCode();
    }, [amount]);

    // Open MoMo app with QR code
    // const openMoMoApp = async () => {
    //     try {
    //         // Try to open MoMo app directly
    //         const momoUrl = `momo://app`;
    //         const canOpen = await Linking.canOpenURL(momoUrl);

    //         if (canOpen) {
    //             await Linking.openURL(momoUrl);
    //         } else {
    //             // If MoMo app is not installed, open app store
    //             const storeUrl = Platform.OS === 'ios'
    //                 ? 'https://apps.apple.com/vn/app/momo-ví-điện-tử-số-1-việt-nam/id918751511'
    //                 : 'https://play.google.com/store/apps/details?id=com.mservice.momotransfer';

    //             Alert.alert(
    //                 'Cần có ứng dụng MoMo',
    //                 'Ứng dụng MoMo chưa được cài đặt. Bạn có muốn cài đặt không?',
    //                 [
    //                     { text: 'Hủy', style: 'cancel' },
    //                     { text: 'Cài đặt', onPress: () => Linking.openURL(storeUrl) }
    //                 ]
    //             );
    //         }
    //     } catch (error) {
    //         console.error('Error opening MoMo:', error);
    //         Alert.alert('Lỗi', 'Không thể mở ứng dụng MoMo');
    //     }
    // };

    const handleCheckPayment = async () => {
        if (!paymentLinkId) {
            toast.error("Lỗi", "Không có mã thanh toán để kiểm tra");
            return;
        }
        try {
            setIsChecking(true);

            const result = await checkPayment(paymentLinkId);

            if (result && result.data) {
                const { status, transactions } = result.data;
                if (!status) {
                    toast.success("Thông báo", "Chưa có thông tin thanh toán, vui lòng thử lại sau vài giây.");
                    return;
                }
                else {
                    if (status === "PENDING") {
                        toast.success("Thông báo", "Thanh toán chưa được xử lý, hãy tiến hành thanh toán.");
                        return;
                    }
                    if (status === "PAID") {
                        setPaymentStatus("paid");
                        const booking = await createBookingsFromCart(JSON.parse(cartSF as string));
                        if (booking) {
                            await savePaymentHistory({
                                userId: info?.id ?? "",
                                bookingId: booking.bookingId,
                                amount: Number(amount ?? 0),
                                method: 'qr',
                                responseCode: result.code ?? "99",
                                paymentUrl: paymentUrl,
                                raw: transactions && transactions[0] ? transactions[0] : {},
                                status: result.code === '00' ? "paid" : "failed",
                            });
                            toast.success(t("app.success"), t("app.thanks"));
                            await checkAndSendNotify(JSON.parse(cartSF as string)?.restaurantId, "Bạn có đơn hàng mới", "Vui lòng kiểm tra đơn hàng của bạn");
                        }
                    }
                    else {
                        setPaymentStatus("failed");
                        toast.success("Thông báo", "Thanh toán chưa thành công, vui lòng thử lại sau");
                    }
                    setQrDataUrl(null);
                    setPaymentCode('');
                    setPaymentLinkId(null);
                    router.replace("/(home)");
                }
            }
        } catch (error) {
            console.error('Checking Payment Error:', error);
            Alert.alert('Lỗi', 'Không thể kiểm tra thanh toán');
        } finally {
            setIsChecking(false);
        }
    }

    // Open banking app (generic)
    const openBankingApp = () => {
        Alert.alert(
            'Chọn ứng dụng ngân hàng',
            'Vui lòng chọn một ứng dụng để mở',
            [
                { text: 'Hủy', style: 'cancel' },
                { text: 'MB Bank', onPress: () => tryOpenBankApp('https://dl.vietqr.io/pay?app=mb') },
                { text: 'Khác', onPress: () => copyQRCode() }
            ]
        );
    };

    const tryOpenBankApp = async (bankUrl: string) => {
        try {
            const canOpen = await Linking.canOpenURL(bankUrl);
            if (canOpen) {
                await Linking.openURL(bankUrl);
            } else {
                Alert.alert(
                    'Ứng dụng không tìm thấy',
                    'Ứng dụng ngân hàng chưa được cài đặt. Mã QR đã được sao chép vào bảng tạm.',
                    [{ text: 'OK', onPress: () => copyQRCode() }]
                );
            }
        } catch (error) {
            console.error('Error opening banking app:', error);
            copyQRCode();
        }
    };

    // Copy QR code to clipboard
    const copyQRCode = async () => {
        try {
            if (paymentCode) {
                await Clipboard.setStringAsync(paymentCode);
                Alert.alert('Thành công', 'Mã thanh toán đã được sao chép vào clipboard');
            } else {
                Alert.alert('Lỗi', 'Không có mã thanh toán');
            }
        } catch (error) {
            console.error('Error copying to clipboard:', error);
            Alert.alert('Lỗi', 'Không sao chép được mã thanh toán');
        }
    };

    // Share QR code
    const shareQRCode = async () => {
        try {
            const result = await Share.share({
                message: `Mã QR thanh toán - Số tiền: ${2000} VND\nTest`,
                url: qrDataUrl ?? ""
            });
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    // Refresh QR code
    const refreshQRCode = () => {
        generateQRCode();
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#00B14F" />
                <Text style={styles.loadingText}>Đang tạo mã QR...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Payment</Text>
                <TouchableOpacity onPress={refreshQRCode} style={styles.refreshButton}>
                    <Ionicons name="refresh" size={24} color="#333" />
                </TouchableOpacity>
            </View>

            {/* Payment Info */}
            <View style={styles.paymentInfo}>
                <Text style={styles.amountLabel}>Số tiền phải trả</Text>
                <Text style={styles.amount}>{formatCurrency(Number(amount ?? 0))}</Text>
                <Text style={styles.orderInfo}>Thanh toán hóa đơn mã #{JSON.parse(cartSF as string)?.id?.slice(0, 6)}</Text>
            </View>

            {/* QR Code Display */}
            <View style={styles.qrContainer}>
                <Text style={styles.qrTitle}>Quét mã QR để thanh toán</Text>
                {qrDataUrl ? (
                    <Image source={{ uri: qrDataUrl }} style={styles.qrImage} />
                ) : (
                    <View style={styles.qrPlaceholder}>
                        <Ionicons name="qr-code" size={100} color="#ccc" />
                        <Text style={styles.qrPlaceholderText}>Mã QR không có sẵn</Text>
                    </View>
                )}
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.momoButton, isChecking && { backgroundColor: 'rgba(0, 0, 0, 0.3)' }]}
                    onPress={handleCheckPayment}
                    disabled={isChecking}
                >
                    <View style={styles.buttonContent}>
                        {isChecking ?
                            <ActivityIndicator size={24} color="white" />
                            :
                            <Ionicons name="checkmark-done-circle" size={24} color="#fff" />}
                        <Text style={styles.buttonText}>Xác nhận đã thanh toán</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.bankButton} onPress={openBankingApp}>
                    <View style={styles.buttonContent}>
                        <Ionicons name="card" size={24} color="#fff" />
                        <Text style={styles.buttonText}>Mở ứng dụng ngân hàng</Text>
                    </View>
                </TouchableOpacity>
            </View>

            {/* Additional Actions */}
            <View style={styles.additionalActions}>
                <TouchableOpacity style={styles.actionButton} onPress={copyQRCode}>
                    <Ionicons name="copy" size={20} color="#666" />
                    <Text style={styles.actionButtonText}>Sao chép mã</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton} onPress={shareQRCode}>
                    <Ionicons name="share" size={20} color="#666" />
                    <Text style={styles.actionButtonText}>Chia sẻ</Text>
                </TouchableOpacity>
            </View>

            {/* Instructions */}
            <View style={styles.instructions}>
                <Text style={styles.instructionTitle}>Làm thế nào để trả tiền:</Text>
                <Text style={styles.instructionText}>
                    1. Mở ứng dụng ngân hàng hoặc MoMo của bạn{'\n'}
                    2. Quét mã QR ở trên{'\n'}
                    3. Xác nhận chi tiết thanh toán{'\n'}
                    4. Hoàn tất giao dịch
                </Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 50,
        paddingBottom: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    refreshButton: {
        padding: 8,
    },
    paymentInfo: {
        backgroundColor: '#fff',
        padding: 24,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
    },
    amountLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    amount: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#00B14F',
        marginBottom: 8,
    },
    orderInfo: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
    },
    qrContainer: {
        backgroundColor: '#fff',
        padding: 24,
        alignItems: 'center',
        marginTop: 16,
        marginHorizontal: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    qrTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 16,
    },
    qrImage: {
        width: width * 0.6,
        height: width * 0.6,
        borderRadius: 8,
    },
    qrPlaceholder: {
        width: width * 0.6,
        height: width * 0.6,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#e9ecef',
        borderStyle: 'dashed',
    },
    qrPlaceholderText: {
        marginTop: 8,
        fontSize: 14,
        color: '#666',
    },
    buttonContainer: {
        paddingHorizontal: 16,
        paddingTop: 24,
    },
    momoButton: {
        backgroundColor: '#A50064',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12
    },
    bankButton: {
        backgroundColor: '#0066CC',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    additionalActions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#fff',
        borderRadius: 8,
        minWidth: 120,
        justifyContent: 'center',
    },
    actionButtonText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#666',
    },
    instructions: {
        margin: 16,
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#00B14F',
    },
    instructionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    instructionText: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
});