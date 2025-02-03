import React, { useState } from 'react';
import { Text, TouchableOpacity, View, TextInput, StyleSheet } from 'react-native';
import { colors } from '../../config/colors';
import { Alert } from 'react-native';

export default function RegistrationScreen({ navigation }: any) {
    const [login, setLogin] = useState<string | null>(null);
    const [password, setPassword] = useState<string | null>(null);
    const [confirmPassword, setConfirmPassword] = useState<string | null>(null);

    const handleRegistration = () => {
        // if (!login || login.trim().length < 2) {
        //     Alert.alert('Введите корректное имя (минимум 2 символа).');
        //     return;
        // }
        // if (!password || password.length < 6) {
        //     Alert.alert('Пароль должен быть не менее 6 символов.');
        //     return;
        // }
        // if (password !== confirmPassword) {
        //     Alert.alert('Пароли не совпадают.');
        //     return;
        // }

        // Alert.alert('Регистрация успешна!');

        navigation.navigate('Home')
    };

    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.title}>Регистрация</Text>
                <Text style={styles.subtitle}>Создайте новый аккаунт</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Логин"
                    value={login ?? ''}
                    onChangeText={setLogin}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Придумайте пароль"
                    value={password ?? ''}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <TextInput
                    style={styles.input}
                    placeholder="Подтвердите пароль"
                    value={confirmPassword ?? ''}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                />

                <TouchableOpacity onPress={() => navigation.navigate('Auth')}>
                    <Text style={styles.recoveryText} >Уже есть аккаунт</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleRegistration}>
                <Text style={styles.buttonText}>Зарегистрироваться</Text>
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
    recoveryText: {
        fontSize: 14,
        color: colors.primary,
        textAlign: 'right',
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