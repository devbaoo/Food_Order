import screen from "@/utils/screen";
import { ReactNode, useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";


interface ModalProps {
    children?: ReactNode;
    visible: boolean;
}

const Modal: React.FC<ModalProps> = ({ ...props }) => {
    const { children, visible } = props;
    const slideAnim = useRef(new Animated.Value(screen.height)).current;

    useEffect(() => {
        if (visible) {
            Animated.timing(slideAnim, {
                toValue: 0, // dịch lên khoảng này để container nằm 87%
                duration: 300,
                easing: Easing.out(Easing.ease),
                useNativeDriver: false, // vì bạn dùng height/margin
            }).start();
        } else {
            Animated.timing(slideAnim, {
                toValue: screen.height, // trượt xuống
                duration: 200,
                easing: Easing.in(Easing.ease),
                useNativeDriver: false,
            }).start();
        }
    }, [visible]);

    return (
        <Animated.View
            style={[
                StyleSheet.absoluteFillObject,
                {
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    top: slideAnim,
                }
            ]}
        >
            <View style={styles.container}>
                {children}
            </View>
        </Animated.View>
    )
}

export default Modal;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        marginTop: 15,
        marginBottom: 15,
        overflow: 'hidden',
    }
})