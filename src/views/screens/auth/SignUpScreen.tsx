import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  I18nManager,
} from 'react-native';
import Toast from 'react-native-toast-message';
import {theme, useThemeStore, getColors} from '../../../config/theme';
import {Role} from '../../../models/types';
import {useAuthStore} from '../../../controllers/useAuthStore';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTranslation} from 'react-i18next';

export const SignUpScreen = ({route, navigation}: any) => {
  const {signup, isLoading} = useAuthStore();
  const role: Role = route.params?.role || 'donor';
  const {t} = useTranslation();
  const isDark = useThemeStore(s => s.isDark);
  const colors = getColors(isDark);
  const isRTL = I18nManager.isRTL;
  const rtlStyle = {writingDirection: isRTL ? 'rtl' : 'auto', textAlign: isRTL ? 'right' : 'left'} as any;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Specific role fields
  const [charityId, setCharityId] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [vehicleId, setVehicleId] = useState('');

  const handleSignUp = async () => {
    if (email && password && name) {
      try {
        const extras: any = {};
        if (charityId) extras.charityId = charityId;
        if (vehiclePlate) extras.vehiclePlate = vehiclePlate;
        if (vehicleId) extras.vehicleId = vehicleId;

        await signup(email, password, name, role, extras);
      } catch (e: any) {
        Toast.show({ type: 'error', text1: t('sign_up'), text2: e.message, visibilityTime: 5000 });
      }
    } else {
      Toast.show({ type: 'error', text1: t('sign_up'), text2: 'Please fill in all required fields.', visibilityTime: 5000 });
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, {backgroundColor: colors.background}]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name={isRTL ? "arrow-right" : "arrow-left"} size={24} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={[styles.title, {color: colors.text}, rtlStyle]}>{t('create_account_title')}</Text>
          <Text style={[styles.subtitle, {color: colors.textSecondary}, rtlStyle]}>{t('create_account_sub')}</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={[styles.label, {color: colors.text}, rtlStyle]}>{t('full_name')}</Text>
            <TextInput
              style={[styles.input, {backgroundColor: colors.inputBackground, color: colors.text}]}
              placeholder="John Doe"
              placeholderTextColor={colors.textSecondary}
              value={name}
              onChangeText={setName}
              textAlign={isRTL ? 'right' : 'left'}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, {color: colors.text}, rtlStyle]}>{t('email')}</Text>
            <TextInput
              style={[styles.input, {backgroundColor: colors.inputBackground, color: colors.text}]}
              placeholder="hello@example.com"
              placeholderTextColor={colors.textSecondary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              textAlign={isRTL ? 'right' : 'left'}
            />
          </View>

          {role === 'charity' && (
            <View style={styles.inputContainer}>
              <Text style={[styles.label, {color: colors.text}, rtlStyle]}>{t('charity_reg_number')}</Text>
              <TextInput
                style={[styles.input, {backgroundColor: colors.inputBackground, color: colors.text}]}
                placeholder="123456789"
                placeholderTextColor={colors.textSecondary}
                value={charityId}
                onChangeText={setCharityId}
                keyboardType="numeric"
                textAlign={isRTL ? 'right' : 'left'}
              />
            </View>
          )}

          {role === 'volunteer' && (
            <>
              <View style={styles.inputContainer}>
                <Text style={[styles.label, {color: colors.text}, rtlStyle]}>{t('vehicle_plate')}</Text>
                <TextInput
                  style={[styles.input, {backgroundColor: colors.inputBackground, color: colors.text}]}
                  placeholder="123 ASD"
                  placeholderTextColor={colors.textSecondary}
                  value={vehiclePlate}
                  onChangeText={setVehiclePlate}
                  textAlign={isRTL ? 'right' : 'left'}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={[styles.label, {color: colors.text}, rtlStyle]}>{t('vehicle_vin')}</Text>
                <TextInput
                  style={[styles.input, {backgroundColor: colors.inputBackground, color: colors.text}]}
                  placeholder="123456789"
                  placeholderTextColor={colors.textSecondary}
                  value={vehicleId}
                  onChangeText={setVehicleId}
                  autoCapitalize="characters"
                  textAlign={isRTL ? 'right' : 'left'}
                />
              </View>
            </>
          )}

          <View style={styles.inputContainer}>
            <Text style={[styles.label, {color: colors.text}, rtlStyle]}>{t('password')}</Text>
            <TextInput
              style={[styles.input, {backgroundColor: colors.inputBackground, color: colors.text}]}
              placeholder="••••••••"
              placeholderTextColor={colors.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              textAlign={isRTL ? 'right' : 'left'}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, {backgroundColor: colors.primary, shadowColor: colors.primary}]}
            onPress={handleSignUp}
            disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color={colors.surface} />
            ) : (
              <Text style={[styles.buttonText, {color: colors.surface}, rtlStyle]}>{t('sign_up')}</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: 40,
  },
  backButton: {
    marginTop: 60,
    marginBottom: theme.spacing.lg,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: 15,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    padding: 16,
    borderRadius: theme.borderRadius.lg,
    fontSize: 15,
  },
  button: {
    padding: 18,
    borderRadius: theme.borderRadius.round,
    alignItems: 'center',
    marginTop: theme.spacing.lg,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
