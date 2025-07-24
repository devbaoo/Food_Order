import { firestore } from "@/lib/firebase-config";
import { Commission } from "@/types/commission";
import { calculateCommission } from "@/utils/calculate";
import { doc, setDoc, Timestamp } from "@firebase/firestore";

export const saveCommission = async (bookingId: string, restaurantId: string, totalAmount: number) => {
  const commissionAmount = calculateCommission(totalAmount);

  const commission: Commission = {
    bookingId,
    restaurantId,
    amount: commissionAmount,
    createdAt: Timestamp.now(),
  };

  const ref = doc(firestore, "commissions", bookingId);
  await setDoc(ref, commission);
};