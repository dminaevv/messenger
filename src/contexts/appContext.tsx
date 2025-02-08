import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User } from '../config/data';

interface AppContextProps {
    user: User | null;
    setUser: (user: User | null) => void;
    theme: string;
    setTheme: (theme: string) => void;
}


const AppContext = createContext<AppContextProps | undefined>(undefined);

interface AppProviderProps {
    children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [theme, setTheme] = useState<string>('light');

    useEffect(() => {
        setUser({ id: '0', name: 'Alexey', surname: "Ivanov", avatar: 'https://i.pravatar.cc/150?img=8', userName: 'test222', mail: 'test@mail.ru' })
    }, [])


    return (
        <AppContext.Provider
            value={{
                user,
                setUser,
                theme,
                setTheme
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = (): AppContextProps => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
