import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useThemeStore, getColors} from '../config/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTranslation} from 'react-i18next';

import {AvailableTasksScreen} from '../views/screens/volunteer/AvailableTasksScreen';
import {TaskMapScreen} from '../views/screens/volunteer/TaskMapScreen';
import {TaskSuccessScreen} from '../views/screens/volunteer/TaskSuccessScreen';
import {MyDeliveriesScreen} from '../views/screens/volunteer/MyDeliveriesScreen';
import {VolunteerProfileScreen} from '../views/screens/volunteer/VolunteerProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TasksStack = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="AvailableTasksList" component={AvailableTasksScreen} />
    <Stack.Screen name="TaskMap" component={TaskMapScreen} />
    <Stack.Screen name="TaskSuccessScreen" component={TaskSuccessScreen} />
  </Stack.Navigator>
);

export const VolunteerNavigator = () => {
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
        name="Tasks"
        component={TasksStack}
        options={{
          tabBarLabel: t('tasks'),
          tabBarIcon: ({color, size}) => <Icon name="clipboard-list-outline" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Deliveries"
        component={MyDeliveriesScreen}
        options={{
          tabBarLabel: t('deliveries'),
          tabBarIcon: ({color, size}) => <Icon name="truck-outline" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={VolunteerProfileScreen}
        options={{
          tabBarLabel: t('profile'),
          tabBarIcon: ({color, size}) => <Icon name="account-outline" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};
