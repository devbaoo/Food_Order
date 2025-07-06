import { firestore } from "@/lib/firebase-config";
import { Voucher } from "@/types/voucher";
import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from "@firebase/firestore";

export const getAllVouchers = async (userId: string) => {
  try {
    const q = query(collection(firestore, "vouchers"),
      where("userId", "==", userId),
      where("isActive", "==", true)
    );
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

export const createVoucher = async (voucher: any) => {
  try {
    await addDoc(collection(firestore, "vouchers"), voucher);
    return true;
  } catch (error) {
    console.error("Lỗi khi tạo voucher: ", error);
    return false;
  }
};

export const createBookingVoucher = async (bookingId: string, voucherId: string) => {
  try {
    // Tạo booking-voucher record
    const bookingVoucherData: Omit<any, "id"> = {
      bookingId,
      voucherId,
      createdAt: new Date().toISOString()
    };

    const bookingVoucherRef = await addDoc(collection(firestore, "bookingVouchers"), bookingVoucherData);

    const voucherRef = doc(firestore, "vouchers", voucherId);
    await updateDoc(voucherRef, {
      isActive: false
    });

    return {
      bookingVoucherId: bookingVoucherRef.id,
      ...bookingVoucherData
    };
  } catch (err) {
    console.error('Error in createBookingVoucher:', err);
    throw err;
  }
};

export const restoreVoucherForBooking = async (bookingId: string) => {
  const q = query(
    collection(firestore, "bookingVouchers"),
    where("bookingId", "==", bookingId)
  );

  const snapshot = await getDocs(q);

  for (const docSnap of snapshot.docs) {
    const { voucherId } = docSnap.data();
    if (voucherId) {
      const voucherRef = doc(firestore, "vouchers", voucherId);
      await updateDoc(voucherRef, { isActive: true });
    }
  }
}

export const deleteVoucherAsync = async (id: string) => {
  try {
    await deleteDoc(doc(firestore, "vouchers", id));
    return true;
  } catch (error) {
    console.error("Lỗi khi xóa mã giảm giá: ", error);
    return false;
  }
}