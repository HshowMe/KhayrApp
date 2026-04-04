import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {MyDonationsScreen} from '../views/screens/donor/MyDonationsScreen';
import {theme} from '../config/theme';
import {useThemeStore, getColors} from '../config/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTranslation} from 'react-i18next';

import {CreateDonationScreen} from '../views/screens/donor/CreateDonationScreen';
import {NotificationsScreen} from '../views/screens/donor/NotificationsScreen';
import {ProfileScreen} from '../views/screens/donor/ProfileScreen';
import {DonationDetailsScreen} from '../views/screens/donor/DonationDetailsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const MyDonationsStack = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="MyDonationsList" component={MyDonationsScreen} />
    <Stack.Screen name="DonationDetails" component={DonationDetailsScreen} />
  </Stack.Navigator>
);

export const DonorNavigator = () => {
  const {t} = useTranslation();
  const isDark = useThemeStore(s => s.isDark);
  const colors = getColors(isDark);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {backgroundColor: colors.tabBar, borderTopColor: colors.border},
      }}>
      <Tab.Screen
        name="Donations"
        component={MyDonationsStack}
        options={{
          tabBarLabel: t('donations'),
          tabBarIcon: ({color, size}) => <Icon name="gift-outline" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Create"
        component={CreateDonationScreen}
        options={{
          tabBarLabel: t('create'),
          tabBarIcon: ({color, size}) => <Icon name="plus-circle-outline" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Alerts"
        component={NotificationsScreen}
        options={{
          tabBarLabel: t('alerts'),
          tabBarIcon: ({color, size}) => <Icon name="bell-outline" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: t('profile'),
          tabBarIcon: ({color, size}) => <Icon name="account-outline" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};
