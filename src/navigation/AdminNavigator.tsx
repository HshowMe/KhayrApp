import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AdminDashboardScreen} from '../views/screens/admin/AdminDashboardScreen';
import {GenerateReportsScreen} from '../views/screens/admin/GenerateReportsScreen';
import {UserManagementScreen} from '../views/screens/admin/UserManagementScreen';

const Stack = createNativeStackNavigator();

export const AdminNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: true, headerBackVisible: false}}>
      <Stack.Screen
        name="Dashboard"
        component={AdminDashboardScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Reports"
        component={GenerateReportsScreen}
        options={{title: 'Impact Reports'}}
      />
      <Stack.Screen
        name="Users"
        component={UserManagementScreen}
        options={{title: 'Manage Users'}}
      />
    </Stack.Navigator>
  );
};
