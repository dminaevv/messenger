import { StackNavigationProp } from "@react-navigation/stack";

export const Links = {
    Auth: {
        Main: 'Auth' as const
    },
    Home: {
        Main: 'Home' as const
    },
    Chat: {
        Detail: "ChatDetail",
        Settings: "ChatSettings"
    }
}

type RootStackParamList = {
    Home: undefined;
    Auth: undefined;
    Chat: { chatId: string };
};

export type NavigationProps = StackNavigationProp<RootStackParamList>;