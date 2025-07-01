// components/Checkbox.tsx
import React from 'react';
import { TouchableOpacity, View, StyleSheet, Text } from 'react-native';

type CheckboxProps = {
    checked: boolean;
    onChange: () => void;
};

export default function Checkbox({ checked, onChange }: CheckboxProps) {
    return (
        <TouchableOpacity onPress={onChange} style={styles.checkbox}>
            {checked && <Text style={styles.checkmark}>✔</Text>}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkmark: {
        fontSize: 15,
        color: 'black',
        fontWeight: 'bold',
    },
});
