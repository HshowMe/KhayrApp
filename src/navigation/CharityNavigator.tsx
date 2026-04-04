import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NearbyDonationsScreen} from '../views/screens/charity/NearbyDonationsScreen';
import {useThemeStore, getColors} from '../config/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTranslation} from 'react-i18next';

import {CharityDonationDetailsScreen} from '../views/screens/charity/CharityDonationDetailsScreen';
import {VolunteersManagementScreen} from '../views/screens/charity/VolunteersManagementScreen';
import {CharityProfileScreen} from '../views/screens/charity/CharityProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const NearbyStack = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="NearbyDonationsList" component={NearbyDonationsScreen} />
    <Stack.Screen name="CharityDonationDetails" component={CharityDonationDetailsScreen} />
  </Stack.Navigator>
);

export const CharityNavigator = () => {
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
        name="Nearby"
        component={NearbyStack}
        options={{
          tabBarLabel: t('nearby'),
          tabBarIcon: ({color, size}) => <Icon name="map-marker-radius-outline" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Volunteers"
        component={VolunteersManagementScreen}
        options={{
          tabBarLabel: t('volunteers'),
          tabBarIcon: ({color, size}) => <Icon name="account-group-outline" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={CharityProfileScreen}
        options={{
          tabBarLabel: t('profile'),
          tabBarIcon: ({color, size}) => <Icon name="cog-outline" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};
