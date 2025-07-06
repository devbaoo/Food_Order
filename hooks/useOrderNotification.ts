import { useEffect } from 'react';
import { onSnapshot, collection, query, where } from 'firebase/firestore';
import { firestore } from '@/lib/firebase-config';
import { playSound } from '@/utils/audio';
import { toast } from '@/utils/toast';

const useOrderNotification = (sellerId?: string) => {
    useEffect(() => {
        if (!sellerId) return;

        const q = query(
            collection(firestore, 'bookings'),
            where('restaurantId', '==', sellerId)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            snapshot.docChanges().forEach(change => {
                if (
                    change.type === 'added' &&
                    change.doc.data().status === 'Pending'
                ) {
                    playSound();
                    toast.info(`📦 Bạn có đơn hàng mới`);
                } else if (change.type === 'modified') {
                    playSound();
                    if (change.doc.data().status === 'Shipping')
                        toast.info(`🚚 Shipper đã xác nhận và đang giao đơn của bạn`);
                    else if (change.doc.data().status === 'Delivered')
                        toast.info(`✅ Đơn đã được giao hàng thành công`);
                }
            });
        });

        return () => unsubscribe();
    }, [sellerId]);
};

export default useOrderNotification;