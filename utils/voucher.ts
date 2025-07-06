export function generateRandomVoucher(userId: string) {
    const possibleDiscounts = [10, 15, 20];
    const discount = possibleDiscounts[Math.floor(Math.random() * possibleDiscounts.length)];

    const now = new Date();
    const expiry = new Date(now);
    expiry.setDate(now.getDate() + 15);
    const expiryDate = `${String(expiry.getDate()).padStart(2, '0')}-${String(expiry.getMonth() + 1).padStart(2, '0')}-${expiry.getFullYear()}`;

    const step = 1000;
    const min = 10000;
    const max = 20000;

    const steps = Math.floor((max - min) / step) + 1; // = 11 bước
    const randomStep = Math.floor(Math.random() * steps); // random từ 0 → 10
    const maxDiscount = min + randomStep * step;

    const titles = [
        "Ưu đãi cho bạn mới",
        "Mở ví nhận quà",
        "Giảm giá lần đầu",
        "Quà tặng từ chúng tôi",
        "Voucher chào bạn",
        "Mừng bạn tới app",
        "Giảm giá cực chill",
        "Ưu đãi hấp dẫn",
        "Mã giảm hot 🔥",
    ];
    const title = titles[Math.floor(Math.random() * titles.length)];

    return {
        code: `CODE${discount}`,
        title,
        description: `${discount}% off on your first purchase`,
        discount,
        expiryDate,
        isActive: true,
        maxDiscount,
        minAmount: 50,
        type: 'percentage',
        userId,
    };
}