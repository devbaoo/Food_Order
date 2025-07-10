// app/screens/PaymentWebView.tsx
import React, { useRef } from 'react';
import { WebView } from 'react-native-webview';
import { router, useLocalSearchParams } from 'expo-router';
import Toast from 'react-native-toast-message';
import { usePaymentStore } from '@/stores/paymentStore';
import { savePaymentHistory } from '@/api/modules/payment';
import { useAuth } from '@/providers/AuthenticatedProvider';
import { useTranslation } from 'react-i18next';
import { createBookingsFromCart } from '@/api/modules/booking';
import { toast } from '@/utils/toast';
import { checkAndSendNotify } from '@/api/modules/notification';

const PaymentWebView = () => {
  const webViewRef = useRef(null);
  const hasHandled = useRef(false);
  const { info } = useAuth();
  const { paymentUrl, amount, cartSF } = useLocalSearchParams();
  const { setPaymentStatus } = usePaymentStore();
  const { t } = useTranslation();

  const handleNavigation = async (navState: any) => {
    const { url } = navState;

    if (hasHandled.current) return;

    // Kiểm tra nếu quay về returnUrl của bạn
    if (url.includes('vnpay_return')) {
      hasHandled.current = true;
      const queryParams = new URLSearchParams(url.split('?')[1]);
      const responseCode = queryParams.get('vnp_ResponseCode');

      if (responseCode === '00') {
        Toast.show({
          type: 'success',
          text1: t('app.successful_payment'),
        });
        setPaymentStatus("paid");
      } else {
        Toast.show({
          type: 'error',
          text1: t('app.failed_payment'),
          text2: t('app.error_code', { code: responseCode }),
        });
        setPaymentStatus("failed");
      }

      const cart = cartSF ? JSON.parse(cartSF as string) : null;
      if (!cart) {
        toast.error(t("app.error"), t("app.cart_does_not_exists"));
        return;
      }

      const booking = await createBookingsFromCart(cart);
      if (booking) {
        await savePaymentHistory({
          userId: info?.id ?? "",
          bookingId: booking.bookingId,
          amount: Number(amount ?? 0),
          method: 'vnpay',
          responseCode: responseCode ?? "99",
          paymentUrl: url,
          raw: Object.fromEntries(new URLSearchParams(url.split('?')[1])),
          status: responseCode === '00' ? "paid" : "failed",
        });
        toast.success(t("app.success"), t("app.thanks"));
        await checkAndSendNotify(cart?.restaurantId, "Bạn có đơn hàng mới", "Vui lòng kiểm tra đơn hàng của bạn");
        router.replace("/(home)");
      }
    }
  };

  return (
    <WebView
      ref={webViewRef}
      source={{ uri: decodeURIComponent(paymentUrl as string) }}
      onNavigationStateChange={handleNavigation}
    />
  );
};

export default PaymentWebView;
