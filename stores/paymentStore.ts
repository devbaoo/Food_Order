import { create } from 'zustand';

type PaymentStatus = 'idle' | 'pending' | 'paid' | 'failed';

interface PaymentStore {
    paymentStatus: PaymentStatus;
    device: string;
    setDevice: (device: string) => void;
    setPaymentStatus: (status: PaymentStatus) => void;
    resetPaymentStatus: () => void;
}

export const usePaymentStore = create<PaymentStore>((set) => ({
    paymentStatus: 'idle',
    device: '',
    setDevice: (device) => set({ device: device }),
    setPaymentStatus: (status) => set({ paymentStatus: status }),
    resetPaymentStatus: () => set({ paymentStatus: 'idle' }),
}));