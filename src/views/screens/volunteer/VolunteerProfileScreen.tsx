import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, I18nManager} from 'react-native';
import {theme, useThemeStore, getColors} from '../../../config/theme';
import {useAuthStore} from '../../../controllers/useAuthStore';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTranslation} from 'react-i18next';
import {SettingsModal} from '../../components/SettingsModal';

export const VolunteerProfileScreen = () => {
  const {user, logout} = useAuthStore();
  const {t, i18n} = useTranslation();
  const isDark = useThemeStore(s => s.isDark);
  const toggleDark = useThemeStore(s => s.toggle);
  const colors = getColors(isDark);
  const isRTL = I18nManager.isRTL;
  const rtlStyle = {writingDirection: isRTL ? 'rtl' : 'auto', textAlign: isRTL ? 'right' : 'left'} as any;

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'ar' : 'en');
  };
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <View style={styles.headerCard}>
        <View style={[styles.avatar, {backgroundColor: isDark ? '#5D4037' : '#FFB74D'}]}>
          <Text style={[styles.avatarText, {color: colors.surface}]}>V</Text>
        </View>
        <Text style={[styles.name, {color: colors.text}, rtlStyle]}>{user?.name || 'Volunteer Hero'}</Text>
        <Text style={[styles.email, {color: colors.textSecondary}, rtlStyle]}>{user?.email}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={[styles.statBox, {backgroundColor: colors.surface}]}>
          <Text style={[styles.statNumber, {color: colors.primary}]}>18</Text>
          <Text style={[styles.statLabel, {color: colors.textSecondary}, rtlStyle]}>{t('vol_deliveries')}</Text>
        </View>
        <View style={[styles.statBox, {backgroundColor: colors.surface}]}>
          <Text style={[styles.statNumber, {color: colors.primary}]}>4.9</Text>
          <Text style={[styles.statLabel, {color: colors.textSecondary}, rtlStyle]}>{t('vol_avg_rating')}</Text>
        </View>
        <View style={[styles.statBox, {backgroundColor: colors.surface}]}>
          <Text style={[styles.statNumber, {color: colors.primary}]}>30</Text>
          <Text style={[styles.statLabel, {color: colors.textSecondary}, rtlStyle]}>{t('vol_hours')}</Text>
        </View>
      </View>

      <View>
        <TouchableOpacity style={[styles.settingsButton, {backgroundColor: colors.surface, borderColor: colors.border}]} onPress={() => setIsSettingsOpen(true)}>
          <Text style={[styles.settingsText, {color: colors.text}, rtlStyle]}>{t('account_settings')}</Text>
          <Icon name={isRTL ? "chevron-left" : "chevron-right"} size={20} color={colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingRow} onPress={toggleLanguage}>
          <View style={styles.settingRowLeft}>
            <View style={[styles.settingIconBox, {backgroundColor: isDark ? '#333' : '#F8F9FA'}]}>
              <Icon name="translate" size={20} color={colors.textSecondary} />
            </View>
            <View>
              <Text style={[styles.settingTitle, {color: colors.text}, rtlStyle]}>{t('language')} / اللغة</Text>
              <Text style={[styles.settingSubtitle, {color: colors.textSecondary}, rtlStyle]}>{i18n.language === 'ar' ? 'العربية' : 'English'}</Text>
            </View>
          </View>
          <Icon name={isRTL ? "chevron-left" : "chevron-right"} size={20} color={colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingRow} onPress={toggleDark}>
          <View style={styles.settingRowLeft}>
            <View style={[styles.settingIconBox, {backgroundColor: isDark ? '#333' : '#F8F9FA'}]}>
              <Icon name={isDark ? 'weather-sunny' : 'weather-night'} size={20} color={colors.textSecondary} />
            </View>
            <View>
              <Text style={[styles.settingTitle, {color: colors.text}, rtlStyle]}>{t('dark_mode')}</Text>
              <Text style={[styles.settingSubtitle, {color: colors.textSecondary}, rtlStyle]}>{isDark ? 'On' : 'Off'}</Text>
            </View>
          </View>
          <Icon name={isDark ? 'toggle-switch' : 'toggle-switch-off-outline'} size={32} color={isDark ? colors.primary : colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Logout */}
      <TouchableOpacity style={[styles.logoutButton, {backgroundColor: colors.surface, borderColor: colors.error}]} onPress={logout}>
        <Icon name="logout" size={20} color={colors.error} style={{marginRight: 8}} />
        <Text style={[styles.logoutText, {color: colors.error}, rtlStyle]}>{t('log_out')}</Text>
      </TouchableOpacity>

      <SettingsModal 
        visible={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        title={t('account_settings')} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  headerCard: {alignItems: 'center', marginVertical: theme.spacing.xl},
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  avatarText: {...theme.typography.h1},
  name: {...theme.typography.h2},
  email: {...theme.typography.body},
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xxl,
  },
  statBox: {
    flex: 1,
    padding: theme.spacing.md,
    marginHorizontal: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    elevation: 1,
  },
  statNumber: {
    ...theme.typography.h2,
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    ...theme.typography.caption,
    textAlign: 'center',
  },
  settingsButton: {
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  settingsText: {...theme.typography.button},
  logoutButton: {
    borderWidth: 1,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  logoutText: {...theme.typography.button},
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
  settingRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 12,
  },
});
