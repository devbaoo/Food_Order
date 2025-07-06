import { Audio } from 'expo-av';

export const playSound = async () => {
    try {
        const { sound } = await Audio.Sound.createAsync(
            require('@/assets/audios/alert.mp3')
        );
        await sound.playAsync();
    } catch (error) {
        console.warn('🔇 Lỗi phát âm thanh:', error);
    }
};