import React from "react";
import { useEffect, useState } from "react";
import { TextStyle, Text } from "react-native";

export const CountdownTimer = ({ targetTime, style }: { targetTime: string, style: TextStyle }) => {
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        const updateCountdown = () => {
            const now = new Date();
            const [targetMinute, targetSecond] = targetTime.split(':').map(Number);

            const target = new Date();
            target.setMinutes(targetMinute, targetSecond, 0);

            // Nếu target đã qua hôm nay, đếm tới ngày mai
            if (target < now) {
                target.setDate(target.getDate() + 1);
            }

            const diff = target.getTime() - now.getTime();

            const minutes = Math.floor((diff / (1000 * 60)) % 60);
            const seconds = Math.floor((diff / 1000) % 60);

            setTimeLeft(
                `${String(minutes).padStart(
                    2,
                    '0'
                )}:${String(seconds).padStart(2, '0')}`
            );
        };

        updateCountdown(); // gọi ngay lần đầu

        const interval = setInterval(updateCountdown, 1000);

        return () => clearInterval(interval);
    }, [targetTime]);

    return <Text style={style}>{timeLeft}</Text>;
};