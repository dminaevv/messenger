import React, { useState } from 'react';
import { Text, TouchableOpacity, View, TextInput, StyleSheet } from 'react-native';
import { colors } from '../../config/colors';

export default function AuthScreen({ navigation }: any) {
    const [login, setLogin] = useState<string | null>(null);
    const [password, setPassword] = useState<string | null>(null);

    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.title}>Вход</Text>
                <Text style={styles.subtitle}>
                    Для входа на платформу введите логин и пароль
                </Text>
                <TextInput
                    style={styles.input}
                    placeholder="Ваш логин"
                    value={login ?? ''}
                    onChangeText={setLogin}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Ваш пароль"
                    value={password ?? ''}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                <TouchableOpacity onPress={() => navigation.navigate('Registration')}>
                    <Text style={styles.recoveryText}>Регистрация</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
                <Text style={styles.buttonText}>Войти</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 32,
        marginBottom: 8,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 16,
    },
    input: {
        width: '100%',
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 18,
        paddingHorizontal: 16,
        marginBottom: 16,
        fontSize: 16,
    },
    recoveryText: {
        fontSize: 14,
        color: colors.primary,
        textAlign: 'right',
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 18,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});