import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppContext } from '../contexts/appContext';

interface IConfirmModalProps {
    visible: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    title?: string;
    message?: string;
}

export default function ConfirmModal(props: IConfirmModalProps) {
    const { colors } = useAppContext();

    return (
        <Modal
            transparent
            visible={props.visible}
            animationType="fade"
            onRequestClose={props.onCancel}
        >
            <View style={styles.overlay}>
                <View style={[styles.modalContainer, { backgroundColor: colors.inputBackgroundColor }]}>
                    <Text style={[styles.title, { color: colors.text }]}>{props.title}</Text>
                    <Text style={[styles.message, { color: colors.text }]}>{props.message}</Text>

                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={props.onCancel}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, styles.confirmButton]} onPress={props.onConfirm}>
                            <Text style={styles.confirmText}>Confirm</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: 300,
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    message: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    button: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 5,
    },
    cancelButton: {
        backgroundColor: '#ccc',
        marginRight: 10,
    },
    confirmButton: {
        backgroundColor: 'red',
    },
    cancelText: {
        color: 'black',
        fontSize: 16,
    },
    confirmText: {
        color: 'white',
        fontSize: 16,
    },
});
