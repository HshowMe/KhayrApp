import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, I18nManager} from 'react-native';
import {theme, useThemeStore, getColors} from '../../../config/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTranslation} from 'react-i18next';

export const RoleSelectionScreen = ({navigation}: any) => {
  const {t} = useTranslation();
  const isDark = useThemeStore(s => s.isDark);
  const colors = getColors(isDark);
  const isRTL = I18nManager.isRTL;
  const rtlStyle = {writingDirection: isRTL ? 'rtl' : 'auto', textAlign: isRTL ? 'right' : 'left'} as any;

  const roles = [
    {
      id: 'donor',
      title: t('role_donor'),
      desc: t('role_donor_desc'),
      icon: 'heart-outline',
      color: colors.error,
      bg: colors.iconRed,
    },
    {
      id: 'charity',
      title: t('role_charity'),
      desc: t('role_charity_desc'),
      icon: 'storefront-outline',
      color: '#1976D2',
      bg: colors.iconBlue,
    },
    {
      id: 'volunteer',
      title: t('role_volunteer'),
      desc: t('role_volunteer_desc'),
      icon: 'truck-outline',
      color: colors.primary,
      bg: colors.iconGreen,
    },
  ];

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <Text style={[styles.title, {color: colors.text}, rtlStyle]}>{t('join_khayr')}</Text>
      <Text style={[styles.subtitle, {color: colors.textSecondary}, rtlStyle]}>{t('choose_contribute')}</Text>

      <View style={styles.rolesContainer}>
        {roles.map(role => (
          <TouchableOpacity
            key={role.id}
            style={[styles.card, {backgroundColor: colors.surface, borderColor: colors.border}]}
            onPress={() => navigation.navigate('SignUp', {role: role.id})}
            activeOpacity={0.7}>
            <View style={[styles.iconContainer, {backgroundColor: role.bg}]}>
              <Icon name={role.icon} size={24} color={role.color} />
            </View>
            <View style={styles.cardContent}>
              <Text style={[styles.cardTitle, {color: colors.text}, rtlStyle]}>{role.title}</Text>
              <Text style={[styles.cardDesc, {color: colors.textSecondary}, rtlStyle]}>{role.desc}</Text>
            </View>
            <Icon name={isRTL ? "arrow-left" : "arrow-right"} size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.signInRow}
          onPress={() => navigation.navigate('Login')}>
          <Text style={[styles.footerText, {color: colors.textSecondary}, rtlStyle]}>{t('have_account')} </Text>
          <Text style={[styles.signInText, {color: colors.primary}]}>{t('sign_in')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.adminRow} onPress={() => navigation.navigate('Login', {role: 'admin'})}>
          <Text style={[styles.adminText, {color: colors.textSecondary}]}>{t('admin_portal')} ➔</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: 15,
    marginBottom: theme.spacing.xxl,
  },
  rolesContainer: {
    gap: theme.spacing.md,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  cardDesc: {
    fontSize: 13,
    lineHeight: 18,
  },
  footer: {
    marginTop: 60,
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  signInRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
  },
  signInText: {
    fontSize: 14,
    fontWeight: '700',
  },
  adminRow: {
    marginTop: theme.spacing.sm,
  },
  adminText: {
    fontSize: 12,
  },
});
