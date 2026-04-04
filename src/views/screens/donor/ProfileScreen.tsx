import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import {theme, useThemeStore, getColors} from '../../../config/theme';
import {useAuthStore} from '../../../controllers/useAuthStore';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTranslation} from 'react-i18next';
import {SettingsModal} from '../../components/SettingsModal';

export const ProfileScreen = () => {
  const {user, logout} = useAuthStore();
  const {t, i18n} = useTranslation();
  const isDark = useThemeStore(s => s.isDark);
  const toggleDark = useThemeStore(s => s.toggle);
  const colors = getColors(isDark);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'ar' : 'en');
  };

  const mockAchievements = [
    {id: '1', title: '100 Meals', icon: 'medal-outline', color: colors.warning, bg: '#FFF3E0'},
    {id: '2', title: 'Eco Hero', icon: 'leaf-circle-outline', color: colors.primary, bg: colors.iconGreen},
    {id: '3', title: '500 Meals', icon: 'medal-outline', color: '#BDBDBD', bg: isDark ? '#333' : '#F5F5F5'},
  ];

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, {color: colors.text}]}>{t('profile')}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        <View style={styles.profileInfoContainer}>
          <View style={[styles.avatar, {backgroundColor: isDark ? '#333' : '#EFEFF4'}]}>
            <Icon name="account" size={40} color={colors.textSecondary} />
          </View>
          <View style={styles.profileTextContainer}>
            <Text style={[styles.name, {color: colors.text}]}>{user?.name || 'Sarah Al-Mutairi'}</Text>
            <Text style={[styles.joinDate, {color: colors.textSecondary}]}>Donor since Jan 2024</Text>
            <View style={[styles.badgeContainer, {backgroundColor: colors.iconGreen}]}>
              <Icon name="check-decagram" size={14} color={colors.primary} />
              <Text style={[styles.badgeText, {color: colors.primary}]}>Verified Donor</Text>
            </View>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, {color: colors.primary}]}>{user?.stats?.mealsProvided || 127}</Text>
            <Text style={[styles.statLabel, {color: colors.textSecondary}]}>{t('meals_saved')}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, {color: colors.primary}]}>{user?.stats?.totalDonations || 42}</Text>
            <Text style={[styles.statLabel, {color: colors.textSecondary}]}>{t('total_donations')}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, {color: colors.primary}]}>{user?.stats?.co2Saved || 89}kg</Text>
            <Text style={[styles.statLabel, {color: colors.textSecondary}]}>{t('co2_reduced')}</Text>
          </View>
        </View>

        <View style={[styles.divider, {backgroundColor: colors.border}]} />

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, {color: colors.text}]}>{t('achievements')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.achievementsScroll}>
            {mockAchievements.map(ach => (
              <View key={ach.id} style={styles.achievementBox}>
                <View style={[styles.achievementIconCircle, {backgroundColor: ach.bg}]}>
                  <Icon name={ach.icon} size={28} color={ach.color} />
                </View>
                <Text style={[styles.achievementTitle, {color: colors.textSecondary}]}>{ach.title}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={[styles.divider, {backgroundColor: colors.border}]} />

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, {color: colors.text}]}>{t('settings')}</Text>

          <TouchableOpacity style={styles.settingRow} onPress={() => setIsSettingsOpen(true)}>
            <View style={styles.settingRowLeft}>
              <View style={[styles.settingIconBox, {backgroundColor: isDark ? '#333' : '#F8F9FA'}]}>
                <Icon name="account-outline" size={20} color={colors.textSecondary} />
              </View>
              <View>
                <Text style={[styles.settingTitle, {color: colors.text}]}>{t('personal_info')}</Text>
                <Text style={[styles.settingSubtitle, {color: colors.textSecondary}]}>{t('personal_info_sub')}</Text>
              </View>
            </View>
            <Icon name="chevron-right" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingRow} onPress={toggleLanguage}>
            <View style={styles.settingRowLeft}>
              <View style={[styles.settingIconBox, {backgroundColor: isDark ? '#333' : '#F8F9FA'}]}>
                <Icon name="translate" size={20} color={colors.textSecondary} />
              </View>
              <View>
                <Text style={[styles.settingTitle, {color: colors.text}]}>{t('language')} / اللغة</Text>
                <Text style={[styles.settingSubtitle, {color: colors.textSecondary}]}>{i18n.language === 'ar' ? 'العربية' : 'English'}</Text>
              </View>
            </View>
            <Icon name="chevron-right" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingRow} onPress={toggleDark}>
            <View style={styles.settingRowLeft}>
              <View style={[styles.settingIconBox, {backgroundColor: isDark ? '#333' : '#F8F9FA'}]}>
                <Icon name={isDark ? 'weather-sunny' : 'weather-night'} size={20} color={colors.textSecondary} />
              </View>
              <View>
                <Text style={[styles.settingTitle, {color: colors.text}]}>{t('dark_mode')}</Text>
                <Text style={[styles.settingSubtitle, {color: colors.textSecondary}]}>{isDark ? 'On' : 'Off'}</Text>
              </View>
            </View>
            <Icon name={isDark ? 'toggle-switch' : 'toggle-switch-off-outline'} size={32} color={isDark ? colors.primary : colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingRowLeft}>
              <View style={[styles.settingIconBox, {backgroundColor: isDark ? '#333' : '#F8F9FA'}]}>
                <Icon name="help-circle-outline" size={20} color={colors.textSecondary} />
              </View>
              <Text style={[styles.settingTitle, {color: colors.text, marginLeft: 0, marginTop: 4}]}>{t('help_support')}</Text>
            </View>
            <Icon name="chevron-right" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Icon name="logout" size={20} color={colors.error} style={{marginRight: 8}} />
          <Text style={[styles.logoutText, {color: colors.error}]}>{t('log_out')}</Text>
        </TouchableOpacity>

      </ScrollView>

      <SettingsModal
        visible={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        title="Account Settings"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  header: {alignItems: 'center', paddingVertical: theme.spacing.md, paddingTop: 50},
  headerTitle: {fontSize: 18, fontWeight: '700'},
  scrollContent: {paddingHorizontal: theme.spacing.lg, paddingTop: theme.spacing.md, paddingBottom: 40},
  profileInfoContainer: {flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.xl},
  avatar: {width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', marginRight: theme.spacing.md},
  profileTextContainer: {flex: 1},
  name: {fontSize: 20, fontWeight: '700', marginBottom: 2},
  joinDate: {fontSize: 13, marginBottom: 6},
  badgeContainer: {flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: theme.borderRadius.sm},
  badgeText: {fontSize: 10, fontWeight: '600', marginLeft: 4},
  statsContainer: {flexDirection: 'row', justifyContent: 'space-between', marginBottom: theme.spacing.xl},
  statBox: {alignItems: 'flex-start'},
  statNumber: {fontSize: 22, fontWeight: '800', marginBottom: 4},
  statLabel: {fontSize: 12},
  divider: {height: 1, marginBottom: theme.spacing.lg},
  section: {marginBottom: theme.spacing.lg},
  sectionTitle: {fontSize: 16, fontWeight: '600', marginBottom: theme.spacing.md},
  achievementsScroll: {flexDirection: 'row'},
  achievementBox: {alignItems: 'center', marginRight: theme.spacing.lg},
  achievementIconCircle: {width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginBottom: 8},
  achievementTitle: {fontSize: 12, fontWeight: '500'},
  settingRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: theme.spacing.md},
  settingRowLeft: {flexDirection: 'row', alignItems: 'center'},
  settingIconBox: {width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: theme.spacing.md},
  settingTitle: {fontSize: 15, fontWeight: '500', marginBottom: 2},
  settingSubtitle: {fontSize: 12},
  logoutButton: {flexDirection: 'row', alignItems: 'center', paddingVertical: theme.spacing.lg, marginTop: theme.spacing.md},
  logoutText: {fontSize: 16, fontWeight: '600'},
});
