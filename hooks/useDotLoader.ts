import { useEffect, useState } from "react";

export const useDotLoader = (maxDots: number = 3, intervalMs: number = 500) => {
    const [dotCount, setDotCount] = useState(1);

    useEffect(() => {
        const interval = setInterval(() => {
            setDotCount(prev => (prev % maxDots) + 1);
        }, intervalMs);

        return () => clearInterval(interval);
    }, [maxDots, intervalMs]);

    const dots = '.'.repeat(dotCount);
    return dots;
};