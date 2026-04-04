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
  I18nManager,
} from 'react-native';
import {theme, useThemeStore, getColors} from '../../../config/theme';
import {useAuthStore} from '../../../controllers/useAuthStore';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {KhayrLogo} from '../../../assets/icons/KhayrLogo';
import {useTranslation} from 'react-i18next';

export const LoginScreen = ({navigation}: any) => {
  const {login, isLoading} = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {t} = useTranslation();
  const isDark = useThemeStore(s => s.isDark);
  const colors = getColors(isDark);
  const isRTL = I18nManager.isRTL;
  const rtlStyle = {writingDirection: isRTL ? 'rtl' : 'auto', textAlign: isRTL ? 'right' : 'left'} as any;

  const handleLogin = async () => {
    if (email && password) {
      await login(email, password, 'donor');
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, {backgroundColor: colors.background}]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name={isRTL ? "arrow-right" : "arrow-left"} size={24} color={colors.text} />
      </TouchableOpacity>

      <View style={styles.header}>
        <KhayrLogo width={60} height={60} />
        <Text style={[styles.title, {color: colors.text}, rtlStyle]}>{t('welcome')}</Text>
        <Text style={[styles.subtitle, {color: colors.textSecondary}, rtlStyle]}>{t('sign_in_sub')}</Text>
      </View>

      <View style={styles.form}>
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

        <View style={styles.inputContainer}>
          <View style={styles.passwordLabelRow}>
            <Text style={[styles.label, {color: colors.text}, rtlStyle]}>{t('password')}</Text>
            <TouchableOpacity>
              <Text style={[styles.forgotPasswordText, {color: colors.primary}]}>{t('forgot_password')}</Text>
            </TouchableOpacity>
          </View>
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
          onPress={handleLogin}
          disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color={colors.surface} />
          ) : (
            <Text style={[styles.buttonText, {color: colors.surface}, rtlStyle]}>{t('login')}</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => navigation.navigate('SignUp')}>
          <Text style={[styles.linkText, {color: colors.textSecondary}, rtlStyle]}>
            {t('no_account')} <Text style={[styles.linkTextBold, {color: colors.primary}]}>{t('sign_up')}</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  backButton: {
    marginTop: 60,
    marginBottom: theme.spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
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
  passwordLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    marginLeft: 4,
    marginRight: 4,
  },
  forgotPasswordText: {
    fontSize: 13,
    fontWeight: '600',
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
    marginTop: theme.spacing.xl,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  linkButton: {
    marginTop: theme.spacing.xl,
    alignItems: 'center',
  },
  linkText: {
    fontSize: 14,
  },
  linkTextBold: {
    fontWeight: '700',
  },
});
