import moment from "moment";

export const getTimestampLong = () => {
    const now = new Date();
    const orderCode = parseInt(
        now.getFullYear().toString().slice(2) + // 2 chữ số năm
        (now.getMonth() + 1).toString() +       // tháng không padding
        now.getDate().toString() +              // ngày không padding
        now.getHours().toString().padStart(2, '0') + // giờ
        now.getMinutes().toString().padStart(2, '0') + // phút
        now.getSeconds().toString().padStart(2, '0'),  // giây
        10
    );

    console.log("getTimestampLong", orderCode);

    // Format: YYMMDDHHmmss
    return orderCode;
}