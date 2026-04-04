import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, SafeAreaView, I18nManager} from 'react-native';
import {useThemeStore, getColors} from '../../../config/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTranslation} from 'react-i18next';

export const TaskSuccessScreen = ({navigation}: any) => {
  const {t} = useTranslation();
  const isDark = useThemeStore(s => s.isDark);
  const colors = getColors(isDark);
  const isRTL = I18nManager.isRTL;
  const rtlTextStyle = { writingDirection: isRTL ? 'rtl' : 'auto', textAlign: isRTL ? 'right' : 'left' } as any;

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: colors.background}]}>
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Icon name="check" size={64} color="#FFF" />
        </View>
        <Text style={[styles.title, {color: colors.text}, rtlTextStyle]}>
          {t('thank_you')}
        </Text>
        <Text style={[styles.subtitle, {color: colors.textSecondary}, rtlTextStyle]}>
          {t('delivery_completed_msg')}
        </Text>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.replace('AvailableTasksList')}
        >
          <Text style={styles.buttonText}>{t('back_to_tasks')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#34A853',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  button: {
    backgroundColor: '#246D36',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
