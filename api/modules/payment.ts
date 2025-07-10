import moment from "moment";
import querystring from "qs";
import CryptoJS from "crypto-js";
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "@firebase/firestore";
import { firestore } from "@/lib/firebase-config";

export const createPaymentUrlVNPay = (amount: number, bankCode: string) => {
    let date = new Date();
    let createDate = moment(date).format('YYYYMMDDHHmmss');

    let ipAddr = '127.0.0.1';

    let tmnCode = process.env.EXPO_PUBLIC_TMNCODE;
    let secretKey = process.env.EXPO_PUBLIC_HASHSECRET;
    let vnpUrl = process.env.EXPO_PUBLIC_VNPAY_URL
    let returnUrl = process.env.EXPO_PUBLIC_VNPAY_RETURN_URL;
    let orderId = moment(date).format('DDHHmmss');

    let locale = 'vn';
    if (locale === null || locale === '') {
        locale = 'vn';
    }
    let currCode = 'VND';
    let vnp_Params: { [key: string]: string | number } = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode as string;
    vnp_Params['vnp_Locale'] = locale;
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = 'Thanh toan don hang:' + orderId;
    vnp_Params['vnp_OrderType'] = 'other';
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl as string;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;
    if (bankCode !== null && bankCode !== '') {
        vnp_Params['vnp_BankCode'] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);

    let signData = querystring.stringify(vnp_Params, { encode: false });

    const signed = CryptoJS.HmacSHA512(signData, secretKey as string).toString(CryptoJS.enc.Hex);
    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

    return vnpUrl;
}

export const createPaymentUrlVietQR = async (amount: number, content: string) => {
    const url = 'https://api.vietqr.io/v2/generate';

    const body = {
        accountNo: process.env.EXPO_PUBLIC_ACCOUNT_NUMBER,
        accountName: process.env.EXPO_PUBLIC_ACCOUNT_NAME,
        acqId: process.env.EXPO_PUBLIC_BANK_BIN,
        amount: amount,
        addInfo: content,
        format: "text",
        template: "compact",
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'x-client-id': process.env.EXPO_PUBLIC_CLIENT_ID as string,
                'x-api-key': process.env.EXPO_PUBLIC_API_KEY as string,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data?.desc || 'Lỗi tạo QR');
        }

        return data;
    } catch (error) {
        console.error('VietQR error:', error);
        throw error;
    }
}

function sortObject(obj: any) {
    let sorted: { [key: string]: string } = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

export const createPaymentUrlPayOS = async (formValue: {
    orderCode: number;
    amount: number;
    description: string;
    buyerName: string;
    buyerEmail: string;
    buyerPhone: string;
    buyerAddress: string;
    items: {
        name: string;
        quantity: number;
        price: number;
    }[];
}) => {
    try {
        const checksumKey = process.env.EXPO_PUBLIC_CHECKSUM_KEY_PAYOS as string;
        const descData = `amount=${formValue.amount}&cancelUrl=http://localhost:3000/cancel&description=${formValue.description}&orderCode=${formValue.orderCode}&returnUrl=http://localhost:3000/return`;

        const signature = CryptoJS.HmacSHA256(descData, checksumKey).toString(CryptoJS.enc.Hex);

        const body = {
            ...formValue,
            signature,
            returnUrl: 'http://localhost:3000/return',
            cancelUrl: 'http://localhost:3000/cancel',
            expiredAt: Math.floor(moment().add(15, 'minutes').unix()),
        }

        const response = await fetch('https://api-merchant.payos.vn/v2/payment-requests', {
            method: 'POST',
            headers: {
                'x-client-id': process.env.EXPO_PUBLIC_CLIENT_ID_PAYOS as string,
                'x-api-key': process.env.EXPO_PUBLIC_API_KEY_PAYOS as string,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data?.desc || 'Lỗi tạo QR');
        }

        return data;
    } catch (error: any) {
        throw error;
    }
}

export const checkPayment = async (id: string) => {
    try {
        const response = await fetch(`https://api-merchant.payos.vn/v2/payment-requests/${id}`, {
            method: 'GET',
            headers: {
                'x-client-id': process.env.EXPO_PUBLIC_CLIENT_ID_PAYOS as string,
                'x-api-key': process.env.EXPO_PUBLIC_API_KEY_PAYOS as string,
                'Content-Type': 'application/json',
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data?.desc || 'Lỗi tạo QR');
        }

        return data;
    } catch (error: any) {
        throw error;
    }
}

export const savePaymentHistory = async ({
    userId,
    bookingId,
    amount,
    method,
    responseCode,
    paymentUrl,
    raw,
    status,
}: {
    userId: string;
    bookingId: string;
    amount: number;
    method: string;
    responseCode: string;
    paymentUrl: string;
    raw?: any;
    status: 'paid' | 'failed' | 'pending';
}): Promise<string | null> => {
    try {
        const docRef = await addDoc(collection(firestore, 'payments'), {
            userId,
            bookingId,
            amount,
            method,
            responseCode,
            paymentUrl,
            raw,
            status,
            createdAt: serverTimestamp(),
        });

        return docRef.id; // ✅ trả về paymentId
    } catch (error) {
        console.error("❌ Lỗi khi lưu lịch sử thanh toán:", error);
        return null;
    }
};

export const updateBookingIdInPayment = async (paymentId: string, bookingId: string) => {
    try {
        if (paymentId) {
            const paymentRef = doc(firestore, 'payments', paymentId);
            await updateDoc(paymentRef, { bookingId });
        }
    } catch (error) {
        console.error("❌ Lỗi khi cập nhật bookingId:", error);
    }
};