export interface Voucher {
    id: string;
    code: string;
    title: string;
    description: string;
    discount: number;
    type: string;
    minAmount: number;
    maxDiscount: number;
    expiryDate: string;
    isActive: boolean;
}