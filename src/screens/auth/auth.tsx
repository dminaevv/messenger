import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View, TextInput, StyleSheet } from 'react-native';
import { moderateScale, scale, ScaledSheet, verticalScale } from 'react-native-size-matters';
import { useAppContext } from '../../contexts/appContext';
import { AuthProvider } from '../../domain/auth/authProvider';
import { mapToUser } from '../../domain/user/user';
import Loader from '../../components/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Links } from '../../config/links';

export default function AuthScreen({ navigation }: any) {
    const { colors, login: loginInAccount } = useAppContext();

    const [login, setLogin] = useState<string | null>(null);
    const [password, setPassword] = useState<string | null>(null);
    const [error, setError] = useState<{ login?: string; password?: string }>({});

    const [isLoading, setIsLoading] = useState<boolean>(false);

    async function auth() {
        if (isLoading) return;
        setError({});

        if (!login || login.trim() == '') return setError((prev) => ({ ...prev, login: "Enter your username" }));
        if (!password || password.trim() == '') return setError((prev) => ({ ...prev, password: "Enter your password" }));

        setIsLoading(true);
        const response = await AuthProvider.login(login, password);
        setIsLoading(false);

        if (response.status === "success") {
            loginInAccount(mapToUser(response.data.user), response.data.session);
        } else {
            if (response.message === "Username not found") {
                setError((prev) => ({ ...prev, login: "Username not found" }));
            }
            if (response.message === "Password is incorrect") {
                setError((prev) => ({ ...prev, password: "Incorrect password" }));
            }
        }
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {isLoading && <Loader />}
            <View>
                <Text style={[styles.title, { color: colors.text }]}>Login</Text>
                <Text style={styles.subtitle}>
                    Enter your username and password to access the platform
                </Text>
                <TextInput
                    style={[
                        styles.input,
                        {
                            backgroundColor: colors.inputBackgroundColor,
                            color: colors.text,
                            borderColor: error.login ? 'red' : colors.lightGray,
                        },
                    ]}
                    placeholder="Your username"
                    placeholderTextColor={colors.textPlaceholderColor}
                    value={login ?? ''}
                    onChangeText={setLogin}
                />
                {error.login && <Text style={styles.errorText}>{error.login}</Text>}
                <TextInput
                    style={[
                        styles.input,
                        {
                            backgroundColor: colors.inputBackgroundColor,
                            color: colors.text,
                            borderColor: error.password ? 'red' : colors.lightGray,
                        },
                    ]}
                    placeholder="Your password"
                    placeholderTextColor={colors.textPlaceholderColor}
                    value={password ?? ''}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                {error.password && <Text style={styles.errorText}>{error.password}</Text>}
            </View>

            <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={auth}>
                <Text style={styles.buttonText}>Log In</Text>
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
    input: {
        width: '100%',
        height: verticalScale(50),
        borderWidth: 1,
        borderRadius: moderateScale(18),
        paddingHorizontal: moderateScale(16),
        marginBottom: verticalScale(8),
        fontSize: scale(16),
    },
    errorText: {
        color: 'red',
        fontSize: scale(14),
        marginBottom: verticalScale(8),
    },
    recoveryText: {
        fontSize: scale(14),
        textAlign: 'right',
    },
    button: {
        width: '100%',
        height: verticalScale(50),
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
