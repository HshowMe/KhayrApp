import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {useAuthStore} from '../controllers/useAuthStore';
import {Text, View, StyleSheet} from 'react-native';

import {SplashScreen} from '../views/screens/auth/SplashScreen';
import {RoleSelectionScreen} from '../views/screens/auth/RoleSelectionScreen';
import {LoginScreen} from '../views/screens/auth/LoginScreen';
import {SignUpScreen} from '../views/screens/auth/SignUpScreen';

// Auth Navigator
const AuthStack = createNativeStackNavigator();
const AuthNavigator = () => (
  <AuthStack.Navigator
    screenOptions={{headerShown: false}}
    initialRouteName="Splash">
    <AuthStack.Screen name="Splash" component={SplashScreen} />
    <AuthStack.Screen name="Join" component={RoleSelectionScreen} />
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="SignUp" component={SignUpScreen} />
  </AuthStack.Navigator>
);

import {DonorNavigator} from './DonorNavigator';
import {CharityNavigator} from './CharityNavigator';
import {VolunteerNavigator} from './VolunteerNavigator';
import {AdminNavigator} from './AdminNavigator';

const RoleNavigator = ({role}: {role: string}) => {
  if (role === 'donor') {
    return <DonorNavigator />;
  }
  if (role === 'charity') {
    return <CharityNavigator />;
  }
  if (role === 'volunteer') {
    return <VolunteerNavigator />;
  }
  if (role === 'admin') {
    return <AdminNavigator />;
  }

  // Placeholders for other roles
  const RoleStack = createNativeStackNavigator();
  return (
    <RoleStack.Navigator screenOptions={{headerShown: false}}>
      <RoleStack.Screen
        name="Home"
        component={() => (
          <View style={styles.center}>
            <Text>{role} Dashboard</Text>
          </View>
        )}
      />
    </RoleStack.Navigator>
  );
};

export const RootNavigator = () => {
  const {isAuthenticated, user} = useAuthStore();

  return (
    <NavigationContainer>
      {isAuthenticated && user ? (
        <RoleNavigator role={user.role} />
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  center: {flex: 1, justifyContent: 'center', alignItems: 'center'},
});
