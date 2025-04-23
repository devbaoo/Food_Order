import { useEffect, useState } from "react";

export const useTypewriter = (text: string, speed = 100, delay = 1000) => {
    const [displayedText, setDisplayedText] = useState('');
    const [index, setIndex] = useState(0);
    const [reverse, setReverse] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            if (!reverse) {
                if (index < text.length) {
                    setDisplayedText(prev => prev + text.charAt(index));
                    setIndex(prev => prev + 1);
                } else {
                    setTimeout(() => setReverse(true), delay);
                    clearInterval(interval);
                }
            } else {
                if (index > 0) {
                    setDisplayedText(prev => prev.slice(0, -1));
                    setIndex(prev => prev - 1);
                } else {
                    setTimeout(() => setReverse(false), delay);
                    clearInterval(interval);
                }
            }
        }, speed);

        return () => clearInterval(interval);
    }, [index, reverse]);

    return displayedText;
};