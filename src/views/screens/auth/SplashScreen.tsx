import React, {useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {theme} from '../../../config/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {KhayrLogo} from '../../../assets/icons/KhayrLogo';

export const SplashScreen = ({navigation}: any) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Join');
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* Visual placeholder for the detailed logo in mockup */}
      <View style={styles.logoContainer}>
        <KhayrLogo width={80} height={80} />
      </View>
      <Text style={styles.logoText}>Khayr</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background, // Pure white
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: theme.spacing.sm,
  },
  logoText: {
    fontSize: 42,
    fontWeight: '800',
    color: theme.colors.primary,
  },
});
