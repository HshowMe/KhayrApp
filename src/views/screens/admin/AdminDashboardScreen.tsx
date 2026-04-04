import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {theme, useThemeStore, getColors} from '../../../config/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useAuthStore} from '../../../controllers/useAuthStore';
import {useAdminStore} from '../../../controllers/useAdminStore';
import {useDonationStore} from '../../../controllers/useDonationStore';
import { useTranslation } from 'react-i18next';

export const AdminDashboardScreen = ({navigation}: any) => {
  const {logout} = useAuthStore();
  const {t, i18n} = useTranslation();
  const isDark = useThemeStore(s => s.isDark);
  const toggleDark = useThemeStore(s => s.toggle);
  const colors = getColors(isDark);

  const {users, startUsersListener, stopUsersListener} = useAdminStore();
  const {donations, listenToDonations} = useDonationStore();

  useEffect(() => {
    startUsersListener();
    const unsub = listenToDonations();
    return () => {
      stopUsersListener();
      if(unsub) unsub();
    };
  }, []);

  const totalUsers = users.length;
  const pendingOrgs = users.filter(u => (u.status === 'pending' || u.status === 'pending_approval') && (u.role === 'charity' || u.type === 'charity')).length;
  const totalDonations = donations.length;
  const co2ReducedRaw = donations.reduce((acc, d) => acc + (parseInt(d.quantity) || 1) * 0.6, 0);
  const co2Formatted = co2ReducedRaw >= 1000 ? (co2ReducedRaw / 1000).toFixed(1) + 'k' : Math.round(co2ReducedRaw).toString();

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'ar' : 'en');
  };

  const getLocalizedDate = () => {
    const locale = i18n.language === 'ar' ? 'ar-SA' : 'en-US';
    return new Date().toLocaleDateString(locale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, {color: colors.text}]}>{t('system_admin')}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.welcomeSection}>
          <Text style={[styles.welcomeText, {color: colors.text}]}>{t('overview_dashboard')}</Text>
          <Text style={[styles.dateText, {color: colors.textSecondary}]}>{getLocalizedDate()}</Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={[styles.statBox, {backgroundColor: colors.surface, borderColor: colors.border}]}>
            <View style={[styles.statIconCircle, {backgroundColor: colors.iconBlue}]}>
              <Icon name="account-group" size={24} color="#1976D2" />
            </View>
            <Text style={[styles.statNumber, {color: colors.text}]}>{totalUsers}</Text>
            <Text style={[styles.statLabel, {color: colors.textSecondary}]}>{t('stat_total_users')}</Text>
          </View>
          
          <View style={[styles.statBox, {backgroundColor: colors.surface, borderColor: colors.border}]}>
            <View style={[styles.statIconCircle, {backgroundColor: isDark ? '#4E342E' : '#FFF3E0'}]}>
              <Icon name="bank-outline" size={24} color={colors.warning} />
            </View>
            <Text style={[styles.statNumber, {color: colors.warning}]}>{pendingOrgs}</Text>
            <Text style={[styles.statLabel, {color: colors.textSecondary}]}>{t('stat_pending_orgs')}</Text>
          </View>
          
          <View style={[styles.statBox, {backgroundColor: colors.surface, borderColor: colors.border}]}>
            <View style={[styles.statIconCircle, {backgroundColor: colors.iconGreen}]}>
              <Icon name="package-variant-closed" size={24} color={colors.primary} />
            </View>
            <Text style={[styles.statNumber, {color: colors.text}]}>{totalDonations}</Text>
            <Text style={[styles.statLabel, {color: colors.textSecondary}]}>{t('stat_donations')}</Text>
          </View>
          
          <View style={[styles.statBox, {backgroundColor: colors.surface, borderColor: colors.border}]}>
            <View style={[styles.statIconCircle, {backgroundColor: colors.iconGreen}]}>
              <Icon name="leaf" size={24} color={colors.primary} />
            </View>
            <Text style={[styles.statNumber, {color: colors.text}]}>{co2Formatted}</Text>
            <Text style={[styles.statLabel, {color: colors.textSecondary}]}>{t('stat_co2')}</Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, {color: colors.text}]}>{t('quick_actions')}</Text>
        
        <TouchableOpacity
          style={[styles.actionCard, {backgroundColor: colors.surface, borderColor: colors.border}]}
          onPress={() => navigation.navigate('Users')}
          activeOpacity={0.7}>
          <View style={[styles.actionIconBox, {backgroundColor: colors.iconBlue}]}>
            <Icon name="shield-account-outline" size={28} color="#1976D2" />
          </View>
          <View style={styles.actionContent}>
            <Text style={[styles.actionTitle, {color: colors.text}]}>{t('manage_users')}</Text>
            <Text style={[styles.actionBody, {color: colors.textSecondary}]}>{t('manage_users_sub')}</Text>
          </View>
          <Icon name="chevron-right" size={24} color={colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, {backgroundColor: colors.surface, borderColor: colors.border}]}
          onPress={() => navigation.navigate('Reports')}
          activeOpacity={0.7}>
          <View style={[styles.actionIconBox, {backgroundColor: colors.iconGreen}]}>
            <Icon name="chart-box-outline" size={28} color={colors.primary} />
          </View>
          <View style={styles.actionContent}>
            <Text style={[styles.actionTitle, {color: colors.text}]}>{t('generate_reports')}</Text>
            <Text style={[styles.actionBody, {color: colors.textSecondary}]}>{t('generate_reports_sub')}</Text>
          </View>
          <Icon name="chevron-right" size={24} color={colors.textSecondary} />
        </TouchableOpacity>

        <Text style={[styles.sectionTitle, {color: colors.text}]}>{t('account_settings')}</Text>

        <TouchableOpacity
          style={[styles.actionCard, {backgroundColor: colors.surface, borderColor: colors.border}]}
          onPress={toggleLanguage}
          activeOpacity={0.7}>
          <View style={[styles.actionIconBox, {backgroundColor: isDark ? '#4A148C' : '#F3E5F5'}]}>
            <Icon name="translate" size={28} color="#8E24AA" />
          </View>
          <View style={styles.actionContent}>
            <Text style={[styles.actionTitle, {color: colors.text}]}>Language / اللغة</Text>
            <Text style={[styles.actionBody, {color: colors.textSecondary}]}>{i18n.language === 'ar' ? 'العربية' : 'English'}</Text>
          </View>
          <Icon name="chevron-right" size={24} color={colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, {backgroundColor: colors.surface, borderColor: colors.border}]}
          onPress={toggleDark}
          activeOpacity={0.7}>
          <View style={[styles.actionIconBox, {backgroundColor: isDark ? '#333' : '#FFF8E1'}]}>
            <Icon name={isDark ? 'weather-sunny' : 'weather-night'} size={28} color={isDark ? '#FFB74D' : '#F57F17'} />
          </View>
          <View style={styles.actionContent}>
            <Text style={[styles.actionTitle, {color: colors.text}]}>{t('dark_mode')}</Text>
            <Text style={[styles.actionBody, {color: colors.textSecondary}]}>{isDark ? 'On' : 'Off'}</Text>
          </View>
          <Icon name={isDark ? 'toggle-switch' : 'toggle-switch-off-outline'} size={32} color={isDark ? colors.primary : colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, {backgroundColor: colors.surface, borderColor: colors.error, marginBottom: 40}]}
          onPress={logout}
          activeOpacity={0.7}>
          <View style={[styles.actionIconBox, {backgroundColor: isDark ? '#4A0000' : '#FFEBEE'}]}>
            <Icon name="logout" size={28} color="#D32F2F" />
          </View>
          <View style={styles.actionContent}>
            <Text style={[styles.actionTitle, {color: colors.text}]}>{i18n.language === 'ar' ? 'تسجيل الخروج' : 'Log Out'}</Text>
            <Text style={[styles.actionBody, {color: colors.textSecondary}]}>Securely close session</Text>
          </View>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: 40,
  },
  welcomeSection: {
    marginBottom: theme.spacing.xl,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 4,
  },
  dateText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
  },
  statBox: {
    width: '48%',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.xl,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 2},
    elevation: 2,
    alignItems: 'flex-start',
  },
  statIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: theme.colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  actionIconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  actionBody: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
});
