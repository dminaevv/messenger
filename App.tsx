import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';

import ChatListScreen from './src/screens/chats/chatList';
import SettingsScreen from './src/screens/settings/settings';
import ChatDetailScreen from './src/screens/chats/chatDetail';
import ErrorBoundary from './src/components/errorBoundary';
import AuthScreen from './src/screens/auth/auth';
import { AppProvider } from './src/contexts/appContext';
import RegistrationScreen from './src/screens/register/register';
import { colors } from './src/config/colors';
import ChatSettingsScreen from './src/screens/chats/chatSettings';
import { MenuProvider } from 'react-native-popup-menu';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { height: 50 },
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: colors.black,
        tabBarInactiveTintColor: colors.gray,
      }}
    >
      <Tab.Screen
        name="Chats"
        component={ChatListScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ size, focused }) => (
            <Icon name={focused ? `chatbubble` : `chatbubble-outline`} size={size} color={focused ? colors.black : colors.gray} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ size, focused }) => (
            <Icon name={focused ? `settings` : `settings-outline`} size={size} color={focused ? colors.black : colors.gray} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <MenuProvider>
      <AppProvider>
        <ErrorBoundary>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Auth">
              <Stack.Screen
                name="Auth"
                component={AuthScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Registration"
                component={RegistrationScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Home"
                component={MainTabNavigator}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="ChatDetail"
                component={ChatDetailScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="ChatSettings"
                component={ChatSettingsScreen}
                options={{ headerShown: false }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </ErrorBoundary>
      </AppProvider>
    </MenuProvider>
  );
}
