import { useEffect, useRef, useState } from "react";

export function useCountdown(initialMinutes = 1) {
    const [timeLeft, setTimeLeft] = useState(initialMinutes * 60); // seconds
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    if (intervalRef.current !== null) {
                        clearInterval(intervalRef.current as NodeJS.Timeout);
                    }
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (intervalRef.current !== null) {
                clearInterval(intervalRef.current); // cleanup
            }
        };
    }, []);

    const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
    const seconds = String(timeLeft % 60).padStart(2, '0');

    return {
        formattedTime: `${minutes} : ${seconds}`,
        secondsLeft: timeLeft,
        stop: () => {
            if (intervalRef.current !== null) {
                clearInterval(intervalRef.current as NodeJS.Timeout);
            }
        },
        restart: (newMinutes: number) => {
            clearInterval(intervalRef.current as NodeJS.Timeout);
            setTimeLeft(newMinutes * 60);
            intervalRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(intervalRef.current as NodeJS.Timeout);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
    };
}