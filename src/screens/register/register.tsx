import React, { useState } from 'react';
import { Text, TouchableOpacity, View, TextInput, StyleSheet } from 'react-native';
import { colors } from '../../config/colors';
import { moderateScale, scale, ScaledSheet, verticalScale } from 'react-native-size-matters';

export default function RegistrationScreen({ navigation }: any) {
    const [login, setLogin] = useState<string | null>(null);
    const [password, setPassword] = useState<string | null>(null);
    const [confirmPassword, setConfirmPassword] = useState<string | null>(null);

    const handleRegistration = () => {

        navigation.navigate('Home')
    };

    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.title}>Registration</Text>
                <Text style={styles.subtitle}>Create a new account</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    value={login ?? ''}
                    onChangeText={setLogin}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Create a password"
                    value={password ?? ''}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <TextInput
                    style={styles.input}
                    placeholder="Confirm password"
                    value={confirmPassword ?? ''}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                />

                <TouchableOpacity onPress={() => navigation.navigate('Auth')}>
                    <Text style={styles.recoveryText}>Already have an account</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleRegistration}>
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = ScaledSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: moderateScale(16),
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    title: {
        fontSize: scale(32),
        marginBottom: verticalScale(8),
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: scale(16),
        color: '#666',
        marginBottom: verticalScale(16),
    },
    recoveryText: {
        fontSize: scale(14),
        color: colors.primary,
        textAlign: 'right',
    },
    input: {
        width: '100%',
        height: verticalScale(50),
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: moderateScale(18),
        paddingHorizontal: moderateScale(16),
        marginBottom: verticalScale(16),
        fontSize: scale(16),
    },
    button: {
        width: '100%',
        height: verticalScale(50),
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: moderateScale(18),
    },
    buttonText: {
        color: '#fff',
        fontSize: scale(16),
        fontWeight: 'bold',
    },
});