import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BaseToast, ErrorToast } from 'react-native-toast-message';
import { theme, getColors } from './theme';
import i18n from './i18n';

const getFlexDirection = () => i18n.language === 'ar' ? 'row-reverse' : 'row';
const getTextAlign = () => i18n.language === 'ar' ? 'right' : 'left';

export const getToastConfig = (isDark: boolean) => {
  const colors = getColors(isDark);
  return {
    success: (props: any) => (
      <BaseToast
        {...props}
        style={{ 
          borderLeftColor: colors.primary, 
          backgroundColor: colors.surface,
          flexDirection: getFlexDirection()
        }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          fontSize: 15,
          fontWeight: '700',
          color: colors.text,
          textAlign: getTextAlign()
        }}
        text2Style={{
          fontSize: 13,
          color: colors.textSecondary,
          textAlign: getTextAlign()
        }}
      />
    ),
    error: (props: any) => (
      <ErrorToast
        {...props}
        style={{ 
          borderLeftColor: colors.error, 
          backgroundColor: colors.surface,
          flexDirection: getFlexDirection()
        }}
        text1Style={{
          fontSize: 15,
          fontWeight: '700',
          color: colors.text,
          textAlign: getTextAlign()
        }}
        text2Style={{
          fontSize: 13,
          color: colors.textSecondary,
          textAlign: getTextAlign()
        }}
      />
    ),
    info: (props: any) => (
      <BaseToast
        {...props}
        style={{ 
          borderLeftColor: '#2196F3', 
          backgroundColor: colors.surface,
          flexDirection: getFlexDirection()
        }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          fontSize: 15,
          fontWeight: '700',
          color: colors.text,
          textAlign: getTextAlign()
        }}
        text2Style={{
          fontSize: 13,
          color: colors.textSecondary,
          textAlign: getTextAlign()
        }}
      />
    )
  };
};
