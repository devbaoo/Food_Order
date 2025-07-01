import { firestore } from "@/lib/firebase-config";
import { Voucher } from "@/types/voucher";
import { addDoc, collection, getDocs, query, where } from "@firebase/firestore";

export const getAllVouchers = async (userId: string) => {
    try {
        const q = query(collection(firestore, "vouchers"), where("userId", "==", userId));
        const querySnapshot = await getDocs(q);

        const vouchers: Voucher[] = [];
        querySnapshot.forEach((doc) => {
            vouchers.push({
                id: doc.id ?? 0,
                code: doc.data()?.code ?? '',
                title: doc.data()?.title ?? '',
                description: doc.data()?.description ?? '',
                discount: doc.data()?.discount ?? 0,
                type: doc.data()?.type ?? '',
                minAmount: doc.data()?.minAmount ?? 0,
                maxDiscount: doc.data()?.maxDiscount ?? 0,
                expiryDate: doc.data()?.expiryDate ?? '',
                isActive: doc.data()?.isActive ?? false
            });
        });

        return vouchers;
    } catch (error) {
        console.error("An error occured while fetching vouchers: ", error);
        return [];
    }
};

export const createVoucher = async (userId: string) => {
    try {
        await addDoc(collection(firestore, "vouchers"), {
            code: "CODE20",
            description: "20% off on first purchase",
            discount: 20,
            expiryDate: "31-12-2024",
            isActive: true,
            maxDiscount: 100,
            minAmount: 50,
            title: "Welcome Discount",
            type: "percentage",
            userId
        });
        return true;
    } catch (error) {
        console.error("Lỗi khi tạo voucher: ", error);
        return false;
    }
};
