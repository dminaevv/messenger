import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useState, useContext, ReactNode, useEffect, useMemo } from 'react';
import { darkColors, lightColors } from '../config/colors';
import { mapToUser, User } from '../domain/user/user';
import { AuthProvider } from '../domain/auth/authProvider';
import useWebSocket from '../hooks/useWebSocket';

interface IAppContextPropsBase {
    theme: string;
    setTheme: (theme: string) => void;
    colors: typeof lightColors;
    logout: () => void;
    login: (user: User, token: string) => void;
}

interface IAppContextPropsAuth extends IAppContextPropsBase {
    user: User;
    isAuth: true;
    token: string;
}

interface IAppContextPropsNotAuth extends IAppContextPropsBase {
    user: User | null;
    isAuth: false | null;
    token: null;
}

type IAppContextProps = IAppContextPropsAuth | IAppContextPropsNotAuth;

const AppContext = createContext<IAppContextProps | undefined>(undefined);

interface IAppProviderProps {
    children: ReactNode;
}

export function AppProvider(props: IAppProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isAuth, setIsAuth] = useState<boolean | null>(null);
    const [theme, setTheme] = useState<string>('light');
    const colors = useMemo(() => (theme === 'light' ? lightColors : darkColors), [theme]);

    const webSocket = useWebSocket({ userId: isAuth && user ? user.id : null, token });

    useEffect(() => {
        loadTheme();
        checkSession();
    }, []);

    useEffect(() => {
        saveTheme(theme);
    }, [theme]);

    async function checkSession() {
        const token = await AsyncStorage.getItem('session');
        if (token) {
            const response = await AuthProvider.me(token);
            login(mapToUser(response.data), token);
        }
        else {
            logout();
        }
    }

    async function loadTheme() {
        try {
            const storedTheme = await AsyncStorage.getItem('theme');
            if (storedTheme) setTheme(storedTheme);
        } catch (e) {
            console.error('Ошибка загрузки темы:', e);
        }
    };

    async function saveTheme(theme: string) {
        try {
            await AsyncStorage.setItem('theme', theme);
        } catch (e) {
            console.error('Ошибка сохранения темы:', e);
        }
    };

    function login(user: User, token: string | null = null) {
        setUser(user);
        setIsAuth(true);
        if (token) {
            setToken(token);
            AsyncStorage.setItem("session", token);
        }
    }

    async function logout() {
        setIsAuth(false);
        setToken(null);
        await AsyncStorage.removeItem('session');
    }

    return (
        <AppContext.Provider
            value={{
                user,
                token: isAuth ? (token as string) : null,
                theme,
                setTheme,
                colors,
                isAuth,
                login,
                logout
            } as IAppContextProps}
        >
            {props.children}
        </AppContext.Provider>
    );
};

export const useAppContext = (): IAppContextProps => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
