import screen from "@/utils/screen";
import React from "react";
import { ReactNode, useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View, ViewStyle } from "react-native";


interface ModalProps {
    children?: ReactNode;
    visible: boolean;
    containerStyle?: ViewStyle;
    wrapperStyle?: ViewStyle;
    onCancel?: () => void;
}

const Modal: React.FC<ModalProps> = ({ ...props }) => {
    const { children, visible, containerStyle, wrapperStyle, onCancel } = props;
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
        <TouchableWithoutFeedback onPress={onCancel}>
            <Animated.View
                style={[
                    StyleSheet.absoluteFillObject,
                    {
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                        top: slideAnim,
                    },
                    containerStyle
                ]}
            >
                <TouchableWithoutFeedback>
                    <View
                        style={[styles.container, wrapperStyle]}
                    >
                        {children}
                    </View>
                </TouchableWithoutFeedback>
            </Animated.View>
        </TouchableWithoutFeedback>
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