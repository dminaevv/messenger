import React, { useContext, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import ChatListScreen from './src/screens/chats/chatList';
import SettingsScreen from './src/screens/settings/settings';
import ChatDetailScreen from './src/screens/chats/chatDetail';
import ErrorBoundary from './src/components/errorBoundary';
import AuthScreen from './src/screens/auth/auth';
import { AppProvider, useAppContext } from './src/contexts/appContext';
import ChatSettingsScreen from './src/screens/chats/chatSettings';
import { MenuProvider } from 'react-native-popup-menu';
import { moderateScale } from 'react-native-size-matters';
import { Links } from './src/config/links'
import { View } from 'react-native';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export default function App() {
  return (
    <MenuProvider>
      <ErrorBoundary>
        <NavigationContainer>
          <AppProvider>
            <Stack.Navigator>
              <Stack.Screen
                name={"Main"}
                component={MainNavigation}
                options={{ headerShown: false }}
              />
            </Stack.Navigator>
          </AppProvider>
        </NavigationContainer>
      </ErrorBoundary>
    </MenuProvider>
  );
}

function MainNavigation() {
  const { isAuth } = useAppContext();

  return (
    <>
      {isAuth == null
        ? <View></View>
        : <Stack.Navigator>
          {!isAuth
            ? (
              <Stack.Screen
                name={Links.Auth.Main}
                component={AuthScreen}
                options={{ headerShown: false }}
              />
            )
            :
            (
              <>
                <Stack.Screen
                  name={Links.Home.Main}
                  component={MainTabNavigator}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name={Links.Chat.Detail}
                  component={ChatDetailScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name={Links.Chat.Settings}
                  component={ChatSettingsScreen}
                  options={{ headerShown: false, gestureEnabled: true }}
                />
              </>
            )
          }
        </Stack.Navigator>
      }
    </>
  )
}

function MainTabNavigator() {
  const { colors } = useAppContext();
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { height: moderateScale(50), backgroundColor: colors.bottomMenuBackGroundColor },
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: colors.iconFocusedColor,
        tabBarInactiveTintColor: colors.iconColor,
      }}
    >
      <Tab.Screen
        name="Chats"
        component={ChatListScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ size, focused }) => (
            <Icon name={focused ? `chatbubble` : `chatbubble-outline`} size={size} color={focused ? colors.iconFocusedColor : colors.iconColor} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ size, focused }) => (
            <Icon name={focused ? `settings` : `settings-outline`} size={size} color={focused ? colors.iconFocusedColor : colors.iconColor} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}