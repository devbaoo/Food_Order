import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";

export const paymentMethods = [
    {
        id: 'cash',
        title: 'Thanh toán trực tiếp',
        subtitle: 'Khách nhận hàng và trả bằng tiền mặt',
        icon: <MaterialCommunityIcons name="cash" size={16} />,
        color: '#4F46E5'
    },
    {
        id: 'momo',
        title: 'Momo',
        subtitle: 'Thanh toán bằng Momo',
        icon: <MaterialCommunityIcons name="credit-card" size={16} />,
        color: '#4F46E5'
    },
    {
        id: 'zalo',
        title: 'Zalo Pay',
        subtitle: 'Thanh toán bằng Zalo Pay',
        icon: <MaterialCommunityIcons name="phone-dial" size={16} />,
        color: '#000000'
    },
    {
        id: 'vietqr',
        title: 'VietQR',
        subtitle: 'Thanh toán bằng VietQR',
        icon: <MaterialCommunityIcons name="qrcode-scan" size={16} />,
        color: '#4285F4'
    },
    {
        id: 'vnpay',
        title: 'VNPay',
        subtitle: 'Thanh toán bằng VNPay',
        icon: <MaterialCommunityIcons name="pyramid" size={16} />,
        color: '#059669'
    }
];