import { createBookingsFromCart } from '@/api/modules/booking';
import { createPaymentUrlVNPay, savePaymentHistory } from '@/api/modules/payment';
import { usePaymentStore } from '@/stores/paymentStore';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Modal, FlatList } from 'react-native';
import { createBookingVoucher, getAllVouchers } from '@/api/modules/voucher';
import { Voucher } from '@/types/voucher';
import moment from 'moment';
import { toast } from '@/utils/toast';
import { formatCurrency } from '@/utils/currency';
import { paymentMethods } from '@/data/payment';

const CheckoutScreen = ({ ...props }) => {
    const { pagerRef, cart, currentStep, setCurrentStep, info, t } = props;
    const [selectedPayment, setSelectedPayment] = useState('cash');
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [showDiscountModal, setShowDiscountModal] = useState(false);
    const [selectedDiscount, setSelectedDiscount] = useState<Voucher | null>(null);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [discounts, setDiscounts] = useState<Voucher[]>([]);
    const { device, paymentStatus, setPaymentStatus, resetPaymentStatus } = usePaymentStore();

    const handlePaymentSelect = (paymentId: string) => {
        setSelectedPayment(paymentId);
    };

    // Function to handle step back
    const handlePreviousStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
            pagerRef.current?.setPage(0)
        }
    };

    // Calculate discount amount
    const calculateDiscountAmount = (discount: Voucher) => {
        if (!discount || !cart?.totalPrice) return 0;

        const totalPrice = cart.totalPrice;

        if (totalPrice < discount.minAmount) return 0;

        let discountValue = 0;

        switch (discount.type) {
            case 'percentage':
                discountValue = (totalPrice * discount.discount) / 100;
                break;
            case 'fixed':
                discountValue = discount.discount;
                break;
            case 'freeship':
                // For freeship, we'll assume shipping cost is included in calculation
                discountValue = Math.min(50000, discount.maxDiscount); // Assuming 50k shipping
                break;
            default:
                discountValue = 0;
        }

        return Math.min(discountValue, discount.maxDiscount);
    };

    // Handle discount selection
    const handleDiscountSelect = (discount: Voucher) => {
        if (moment(discount.expiryDate, "DD-MM-YYYY").hour(12).isBefore(moment())) {
            toast.error("Không thể", "Mã của bạn đã hết hạn, không thể dùng!");
            setShowDiscountModal(false);
            return;
        }

        const discountValue = calculateDiscountAmount(discount);

        if (discountValue > 0) {
            toast.success(t("app.success"), `Áp dụng mã giảm giá thành công! Giảm ${formatCurrency(discountValue)}`);
            setSelectedDiscount(discount);
            setCode(discount.code);
            setDiscountAmount(discountValue);
        } else {
            toast.info(t("app.info"), `Đơn hàng chưa đủ điều kiện áp dụng mã này`);
        }
        setShowDiscountModal(false);
    };

    // Remove discount
    const removeDiscount = () => {
        setSelectedDiscount(null);
        setCode('');
        setDiscountAmount(0);
        toast.info(t("app.info"), "Đã xóa mã giảm giá");
    };

    // Apply discount manually
    const applyDiscountCode = () => {
        if (!code.trim()) {
            toast.info(t("app.info"), "Vui lòng nhập mã giảm giá");
            return;
        }

        const foundDiscount = discounts.find(d =>
            d.code.toLowerCase() === code.toLowerCase() && d.isActive
        );

        if (foundDiscount) {
            handleDiscountSelect(foundDiscount);
        } else {
            toast.error(t("app.error"), "Mã giảm giá không hợp lệ hoặc đã hết hạn");
        }
    };

    // Calculate final total
    const finalTotal = Math.max(0, (cart?.totalPrice ?? 0) - discountAmount);

    const handleCheckout = async () => {
        setLoading(true);
        try {
            if (selectedPayment !== 'vnpay' && selectedPayment !== 'cash' && selectedPayment !== 'vietqr') {
                toast.info(t("app.info"), t("app.this_function_is_being_built"));
                return;
            }
            else if (selectedPayment === 'vnpay') {
                const url = await createPaymentUrlVNPay(finalTotal, "VNBANK");
                setPaymentStatus("pending")
                router.push({
                    pathname: "/(cart)/status",
                    params: {
                        paymentUrl: encodeURIComponent(url ?? ""),
                        amount: finalTotal,
                        cartSF: JSON.stringify(cart),
                        paymentType: selectedPayment,
                        discountCode: selectedDiscount?.code ?? "",
                        discountAmount: discountAmount
                    },
                });
            } else if (selectedPayment === 'vietqr') {
                setPaymentStatus("pending")
                router.push({
                    pathname: "/(cart)/qr",
                    params: {
                        amount: finalTotal,
                        cartSF: JSON.stringify(cart),
                        paymentType: selectedPayment,
                        discountCode: selectedDiscount?.code ?? "",
                        discountAmount: discountAmount
                    },
                });
            }
            else {
                const booking = await createBookingsFromCart(cart, finalTotal);
                if (booking) {
                    await savePaymentHistory({
                        userId: info?.id ?? "",
                        bookingId: booking.bookingId,
                        amount: finalTotal,
                        method: 'cash',
                        responseCode: "",
                        paymentUrl: "",
                        raw: {
                            discountCode: selectedDiscount?.code ?? "",
                            discountAmount: discountAmount,
                            originalAmount: cart?.totalPrice ?? 0
                        },
                        status: "pending",
                    });
                    if (selectedDiscount) {
                        await createBookingVoucher(booking.bookingId, selectedDiscount.id);
                    }
                    toast.success(t("app.success"), t("app.thanks"));
                }
                setTimeout(() => {
                    resetPaymentStatus();
                    pagerRef.current?.setPage(2);
                }, 500);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (paymentStatus === 'paid') {
            // Thành công
            setTimeout(() => {
                resetPaymentStatus();
                pagerRef.current?.setPage(2);
            }, 500);
            // redirect tiếp...
        } else if (paymentStatus === 'failed') {
            resetPaymentStatus();
        }
    }, [paymentStatus]);

    const onLoad = async () => {
        try {
            const vouchers = await getAllVouchers(info?.id);
            setDiscounts(vouchers);
        } finally {

        }
    }

    useEffect(() => {
        if (info) onLoad();
    }, [info]);

    const PaymentMethodItem = ({ method, isSelected, onSelect }: any) => {
        return (
            <TouchableOpacity
                style={[
                    styles.paymentMethod,
                    isSelected && styles.paymentMethodSelected
                ]}
                onPress={() => onSelect(method.id)}
                activeOpacity={0.7}
            >
                <View style={styles.paymentMethodContent}>
                    <View style={[styles.iconContainer, { backgroundColor: method.color + '15' }]}>
                        {method.icon}
                    </View>

                    <View style={styles.paymentMethodText}>
                        <Text style={styles.paymentMethodTitle}>{method.title}</Text>
                        <Text style={styles.paymentMethodSubtitle}>{method.subtitle}</Text>
                    </View>

                    <View style={styles.paymentMethodRight}>
                        {isSelected ? (
                            <View style={styles.selectedIndicator}>
                                <MaterialCommunityIcons name="check" size={16} color="#FFFFFF" strokeWidth={3} />
                            </View>
                        ) : (
                            <MaterialCommunityIcons name="arrow-right" size={20} color="#9CA3AF" strokeWidth={2} />
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const DiscountItem = ({ discount, onSelect }: { discount: Voucher, onSelect: (discount: Voucher) => void }) => {
        const canApply = (cart?.totalPrice ?? 0) >= discount.minAmount;
        const discountValue = calculateDiscountAmount(discount);
        const isExpired = moment(discount.expiryDate, "DD-MM-YYYY").hour(12).isBefore(moment());

        return (
            <TouchableOpacity
                style={[styles.discountItem, (!canApply || isExpired) && styles.discountItemDisabled]}
                onPress={() => onSelect(discount)}
                activeOpacity={0.7}
            >
                <View style={styles.discountItemContent}>
                    <View style={[styles.discountIcon, { backgroundColor: canApply ? '#4F46E5' : '#9CA3AF' }]}>
                        <MaterialCommunityIcons
                            name="ticket-percent"
                            size={24}
                            color="white"
                        />
                    </View>

                    <View style={styles.discountItemText}>
                        <Text style={[styles.discountTitle, !canApply && styles.discountTitleDisabled]}>
                            {discount.title}
                        </Text>
                        <Text style={[styles.discountDescription, !canApply && styles.discountDescriptionDisabled]}>
                            {discount.description}
                        </Text>
                        {canApply && discountValue > 0 && (
                            <Text style={styles.discountValue}>
                                Tiết kiệm: {formatCurrency(discountValue)}
                            </Text>
                        )}
                        {!canApply && (
                            <Text style={styles.discountCondition}>
                                Áp dụng cho đơn từ {formatCurrency(discount.minAmount)}
                            </Text>
                        )}
                    </View>

                    <View style={styles.discountCode}>
                        <Text style={[styles.discountCodeText, !canApply && styles.discountCodeTextDisabled]}>
                            {discount.code}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={handlePreviousStep}>
                    <AntDesign name="left" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerText}>{t("app.checkout")}</Text>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Lựa chọn phương thức thanh toán</Text>
                    <Text style={styles.headerSubtitle}>Chọn cách bạn muốn thanh toán cho đơn hàng của mình</Text>
                </View>

                {/* Order Summary */}
                <View style={styles.orderSummary}>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Tạm tính</Text>
                        <Text style={styles.summaryValue}>{formatCurrency(cart?.totalPrice ?? 0)}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Thuế</Text>
                        <Text style={styles.summaryValue}>{formatCurrency(0)}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Phí ship</Text>
                        <Text style={styles.summaryValue}>Miễn phí</Text>
                    </View>
                    {discountAmount > 0 && (
                        <View style={styles.summaryRow}>
                            <Text style={[styles.summaryLabel, styles.discountLabel]}>Giảm giá</Text>
                            <Text style={[styles.summaryValue, styles.discountValue]}>
                                -{formatCurrency(discountAmount)}
                            </Text>
                        </View>
                    )}
                    <View style={[styles.summaryRow, styles.totalRow]}>
                        <Text style={styles.totalLabel}>Tổng cộng</Text>
                        <Text style={styles.totalValue}>{formatCurrency(finalTotal)}</Text>
                    </View>
                </View>

                {/* Discount Code Section */}
                <View style={{ paddingHorizontal: 16, marginBottom: 12 }}>
                    <Text style={styles.label}>Mã giảm giá</Text>
                    {selectedDiscount && (
                        <View style={styles.appliedDiscountContainer}>
                            <View style={styles.appliedDiscountInfo}>
                                <MaterialCommunityIcons name="ticket-percent" size={20} color="#4F46E5" />
                                <View style={styles.appliedDiscountText}>
                                    <Text style={styles.appliedDiscountTitle}>{selectedDiscount.title}</Text>
                                    <Text style={styles.appliedDiscountCode}>{selectedDiscount.code}</Text>
                                </View>
                            </View>
                            <TouchableOpacity onPress={removeDiscount} style={styles.removeDiscountButton}>
                                <MaterialCommunityIcons name="close" size={20} color="#EF4444" />
                            </TouchableOpacity>
                        </View>
                    )}

                    <TouchableOpacity
                        style={styles.selectDiscountButton}
                        onPress={() => setShowDiscountModal(true)}
                    >
                        <MaterialCommunityIcons name="ticket-percent" size={20} color="#4F46E5" />
                        <Text style={styles.selectDiscountText}>Chọn mã giảm giá có sẵn</Text>
                        <MaterialCommunityIcons name="chevron-right" size={20} color="#4F46E5" />
                    </TouchableOpacity>
                </View>

                {/* Payment Methods */}
                <View style={styles.paymentSection}>
                    <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>

                    {paymentMethods.map((method) => (
                        <PaymentMethodItem
                            key={method.id}
                            method={method}
                            isSelected={selectedPayment === method.id}
                            onSelect={handlePaymentSelect}
                        />
                    ))}
                </View>

                {/* Security Notice */}
                <View style={styles.securityNotice}>
                    <Text style={styles.securityText}>
                        🔒 Thông tin thanh toán của bạn được mã hóa và an toàn
                    </Text>
                </View>
            </ScrollView>

            {/* Bottom Action */}
            <View style={styles.bottomSection}>
                <TouchableOpacity
                    style={[styles.checkoutButton, loading && { backgroundColor: "rgba(0, 0, 0, 0.3)" }]}
                    onPress={handleCheckout}
                    activeOpacity={0.9}
                    disabled={loading}
                >
                    {loading && <ActivityIndicator size={20} color="white" />}
                    <Text style={styles.checkoutButtonText}>
                        Xác nhận • {formatCurrency(finalTotal)}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Discount Modal */}
            <Modal
                visible={showDiscountModal}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setShowDiscountModal(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Chọn mã giảm giá</Text>
                        <TouchableOpacity
                            onPress={() => setShowDiscountModal(false)}
                            style={styles.closeButton}
                        >
                            <MaterialCommunityIcons name="close" size={24} color="#111827" />
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={discounts}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <DiscountItem
                                discount={item}
                                onSelect={handleDiscountSelect}
                            />
                        )}
                        contentContainerStyle={styles.discountList}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            </Modal>
        </View>
    );
};

export default CheckoutScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    // Header
    headerContainer: {
        backgroundColor: 'white',
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    headerText: {
        fontSize: 18,
        fontWeight: '600',
    },
    headerSpacer: {
        width: 24,
    },
    scrollView: {
        flex: 1
    },
    header: {
        padding: 24,
        paddingBottom: 16
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 8
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#6B7280',
        lineHeight: 22
    },
    orderSummary: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 16,
        marginBottom: 24,
        padding: 20,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12
    },
    summaryLabel: {
        fontSize: 16,
        color: '#6B7280'
    },
    summaryValue: {
        fontSize: 16,
        color: '#111827',
        fontWeight: '500'
    },
    discountLabel: {
        color: '#10B981'
    },
    discountValue: {
        color: '#10B981',
        fontWeight: '600'
    },
    totalRow: {
        marginTop: 12,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        marginBottom: 0
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827'
    },
    totalValue: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111827'
    },
    paymentSection: {
        paddingHorizontal: 16,
        marginBottom: 24
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 16,
        marginLeft: 4
    },
    paymentMethod: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        borderWidth: 2,
        borderColor: 'transparent'
    },
    paymentMethodSelected: {
        borderColor: '#4F46E5',
        shadowColor: '#4F46E5',
        shadowOpacity: 0.15
    },
    paymentMethodContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16
    },
    paymentMethodText: {
        flex: 1
    },
    paymentMethodTitle: {
        fontSize: 17,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 2
    },
    paymentMethodSubtitle: {
        fontSize: 14,
        color: '#6B7280'
    },
    paymentMethodRight: {
        marginLeft: 12
    },
    selectedIndicator: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#4F46E5',
        justifyContent: 'center',
        alignItems: 'center'
    },
    securityNotice: {
        marginHorizontal: 16,
        marginBottom: 24,
        padding: 16,
        backgroundColor: '#F0FDF4',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#BBF7D0'
    },
    securityText: {
        fontSize: 14,
        color: '#15803D',
        textAlign: 'center',
        fontWeight: '500'
    },
    bottomSection: {
        padding: 16,
        paddingBottom: 24,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB'
    },
    checkoutButton: {
        backgroundColor: '#4F46E5',
        borderRadius: 16,
        paddingVertical: 18,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 10
    },
    checkoutButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '700'
    },

    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: '#333',
    },

    inputWrapper: {
        flexDirection: 'row',
        backgroundColor: '#f2f2f2',
        borderRadius: 12,
        padding: 6,
        alignItems: 'center',
        marginBottom: 12,
    },
    input: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 12,
        fontSize: 16,
        color: '#000',
    },
    button: {
        backgroundColor: '#00c851',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 10,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
    },

    // Applied Discount Styles
    appliedDiscountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EEF2FF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#C7D2FE',
    },
    appliedDiscountInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    appliedDiscountText: {
        marginLeft: 12,
    },
    appliedDiscountTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },
    appliedDiscountCode: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 2,
    },
    removeDiscountButton: {
        padding: 4,
    },

    // Select Discount Button
    selectDiscountButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderStyle: 'dashed',
    },
    selectDiscountText: {
        flex: 1,
        marginLeft: 12,
        fontSize: 16,
        color: '#4F46E5',
        fontWeight: '500',
    },

    // Modal Styles
    modalContainer: {
        flex: 1,
        backgroundColor: 'white',
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#111827',
    },
    closeButton: {
        padding: 4,
    },
    discountList: {
        padding: 16,
    },

    // Discount Item Styles
    discountItem: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    discountItemDisabled: {
        backgroundColor: '#F9FAFB',
        opacity: 0.7,
    },
    discountItemContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    discountIcon: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    discountItemText: {
        flex: 1,
    },
    discountTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 4,
    },
    discountTitleDisabled: {
        color: '#9CA3AF',
    },
    discountDescription: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 4,
    },
    discountDescriptionDisabled: {
        color: '#9CA3AF',
    },
    discountCondition: {
        fontSize: 12,
        color: '#EF4444',
        fontStyle: 'italic',
    },
    discountCode: {
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        marginLeft: 12,
    },
    discountCodeText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#374151',
    },
    discountCodeTextDisabled: {
        color: '#9CA3AF',
    },
});