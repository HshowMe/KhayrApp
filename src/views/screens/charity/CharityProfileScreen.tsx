import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch} from 'react-native';
import {theme, useThemeStore, getColors} from '../../../config/theme';
import {useAuthStore} from '../../../controllers/useAuthStore';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTranslation } from 'react-i18next';
import {SettingsModal} from '../../components/SettingsModal';

export const CharityProfileScreen = () => {
  const {user, logout} = useAuthStore();
  const {t, i18n} = useTranslation();
  const isDark = useThemeStore(s => s.isDark);
  const toggleDark = useThemeStore(s => s.toggle);
  const colors = getColors(isDark);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'ar' : 'en');
  };

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <View style={[styles.header, {borderBottomColor: colors.border}]}>
        <Text style={[styles.headerTitle, {color: colors.text}]}>{t('organization')}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Organization Card */}
        <View style={[styles.card, {backgroundColor: colors.surface, borderColor: colors.border}]}>
          <View style={styles.orgHeader}>
            <View style={[styles.avatar, {backgroundColor: isDark ? '#2E3B32' : '#E8F5E9'}]}>
              <Icon name="domain" size={32} color={colors.primary} />
            </View>
            <View style={styles.orgInfo}>
              <Text style={[styles.orgName, {color: colors.text}]}>{user?.name || 'Al-Birr Charity'}</Text>
              <Text style={[styles.orgType, {color: colors.textSecondary}]}>{t('non_profit_org')}</Text>
              <View style={[styles.verifiedPill, {backgroundColor: isDark ? '#0D47A1' : '#E3F2FD'}]}>
                <Text style={[styles.verifiedText, {color: isDark ? '#90CAF9' : '#1976D2'}]}>{t('verified_cr')}</Text>
              </View>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={[styles.statNum, {color: colors.primary}]}>186</Text>
              <Text style={[styles.statDesc, {color: colors.textSecondary}]}>{t('stats_donations')}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={[styles.statNum, {color: colors.text}]}>1.2k</Text>
              <Text style={[styles.statDesc, {color: colors.textSecondary}]}>{t('stats_meals')}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={[styles.statNum, {color: colors.text}]}>12</Text>
              <Text style={[styles.statDesc, {color: colors.textSecondary}]}>{t('stats_volunteers')}</Text>
            </View>
          </View>
        </View>

        {/* Recognition */}
        <Text style={[styles.sectionTitle, {color: colors.text}]}>{t('recognition')}</Text>
        <View style={styles.recognitionRow}>
          <View style={[styles.recogCard, {backgroundColor: colors.surface, borderColor: colors.border}]}>
            <View style={[styles.recogIconBox, {backgroundColor: isDark ? '#1A3320' : '#E8F5E9'}]}>
              <Icon name="ribbon" size={24} color="#388E3C" />
            </View>
            <Text style={[styles.recogText, {color: colors.textSecondary}]}>{t('top_charity')}</Text>
          </View>

          <View style={[styles.recogCard, {backgroundColor: colors.surface, borderColor: colors.border}]}>
            <View style={[styles.recogIconBox, {backgroundColor: isDark ? '#0D47A1' : '#E3F2FD'}]}>
              <Icon name="package-variant" size={24} color="#1976D2" />
            </View>
            <Text style={[styles.recogText, {color: colors.textSecondary}]}>{t('fast_response')}</Text>
          </View>

          <View style={[styles.recogCard, {backgroundColor: colors.surface, borderColor: colors.border}]}>
            <View style={[styles.recogIconBox, {backgroundColor: isDark ? '#4A148C' : '#F3E5F5'}]}>
              <Icon name="account-group" size={24} color="#8E24AA" />
            </View>
            <Text style={[styles.recogText, {color: colors.textSecondary}]}>{t('community')}</Text>
          </View>
        </View>

        {/* Contact Info */}
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, {color: colors.text, marginBottom: 0}]}>{t('contact_info')}</Text>
          <TouchableOpacity onPress={() => setIsSettingsOpen(true)}>
            <Icon name="pencil" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
        <View style={[styles.card, {backgroundColor: colors.surface, borderColor: colors.border, padding: 0}]}>
          
          <View style={[styles.contactRow, {borderBottomColor: colors.inputBackground}]}>
            <View style={[styles.contactIconBox, {backgroundColor: colors.inputBackground}]}>
              <Icon name="map-marker-outline" size={20} color={colors.textSecondary} />
            </View>
            <View style={styles.contactInfoWrapper}>
              <Text style={[styles.contactLabel, {color: colors.textSecondary}]}>{t('address')}</Text>
              <Text style={[styles.contactVal, {color: colors.text}]}>{user?.address || t('address_val')}</Text>
            </View>
          </View>

          <View style={[styles.contactRow, {borderBottomColor: colors.inputBackground}]}>
            <View style={[styles.contactIconBox, {backgroundColor: colors.inputBackground}]}>
              <Icon name="phone-outline" size={20} color={colors.textSecondary} />
            </View>
            <View style={styles.contactInfoWrapper}>
              <Text style={[styles.contactLabel, {color: colors.textSecondary}]}>{t('phone')}</Text>
              <Text style={[styles.contactVal, {color: colors.text}]}>{user?.phone || t('number_val')}</Text>
            </View>
          </View>

          <View style={[styles.contactRow, {borderBottomWidth: 0}]}>
            <View style={[styles.contactIconBox, {backgroundColor: colors.inputBackground}]}>
              <Icon name="email-outline" size={20} color={colors.textSecondary} />
            </View>
            <View style={styles.contactInfoWrapper}>
              <Text style={[styles.contactLabel, {color: colors.textSecondary}]}>{t('email')}</Text>
              <Text style={[styles.contactVal, {color: colors.text}]}>{user?.email || 'contact@albirr-charity.sa'}</Text>
            </View>
          </View>

        </View>

        {/* Settings */}
        <Text style={[styles.sectionTitle, {color: colors.text}]}>{t('charity_settings')}</Text>
        <View style={[styles.card, {backgroundColor: colors.surface, borderColor: colors.border, padding: 0, marginBottom: 40}]}>
          
          <TouchableOpacity style={[styles.settingRow, {borderBottomColor: colors.inputBackground}]} activeOpacity={0.7} onPress={() => setIsSettingsOpen(true)}>
            <View style={styles.settingContent}>
              <View style={[styles.contactIconBox, {backgroundColor: colors.inputBackground, marginRight: 16}]}>
                <Icon name="map-marker-circle" size={20} color={colors.textSecondary} />
              </View>
              <View>
                <Text style={[styles.settingTitle, {color: colors.text}]}>{t('operating_areas')}</Text>
                <Text style={[styles.settingSubtitle, {color: colors.textSecondary}]}>{user?.operatingAreas || t('operating_areas_val')}</Text>
              </View>
            </View>
            <Icon name="chevron-right" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.settingRow, {borderBottomColor: colors.inputBackground}]} activeOpacity={0.7}>
            <View style={styles.settingContent}>
              <View style={[styles.contactIconBox, {backgroundColor: colors.inputBackground, marginRight: 16}]}>
                <Icon name="bell-outline" size={20} color={colors.textSecondary} />
              </View>
              <View>
                <Text style={[styles.settingTitle, {color: colors.text}]}>{t('notifs')}</Text>
                <Text style={[styles.settingSubtitle, {color: colors.textSecondary}]}>{t('manage_alerts')}</Text>
              </View>
            </View>
            <Icon name="chevron-right" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <View style={[styles.settingRow, {borderBottomColor: colors.inputBackground}]}>
            <View style={styles.settingContent}>
              <View style={[styles.contactIconBox, {backgroundColor: isDark ? '#333' : '#FFF8E1', marginRight: 16}]}>
                <Icon name={isDark ? 'weather-sunny' : 'weather-night'} size={20} color={isDark ? '#FFB74D' : '#F57F17'} />
              </View>
              <View>
                <Text style={[styles.settingTitle, {color: colors.text}]}>{t('dark_mode')}</Text>
                <Text style={[styles.settingSubtitle, {color: colors.textSecondary}]}>{isDark ? 'On' : 'Off'}</Text>
              </View>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleDark}
              trackColor={{ false: colors.border, true: colors.primary + '80' }}
              thumbColor={isDark ? colors.primary : '#f4f3f4'}
            />
          </View>

          <TouchableOpacity style={[styles.settingRow, {borderBottomColor: colors.inputBackground}]} onPress={toggleLanguage} activeOpacity={0.7}>
            <View style={styles.settingContent}>
              <View style={[styles.contactIconBox, {backgroundColor: isDark ? '#4A148C' : '#F3E5F5', marginRight: 16}]}>
                <Icon name="translate" size={20} color="#8E24AA" />
              </View>
              <View>
                <Text style={[styles.settingTitle, {color: colors.text}]}>{t('language')}</Text>
                <Text style={[styles.settingSubtitle, {color: colors.textSecondary}]}>{i18n.language === 'ar' ? 'العربية' : 'English'}</Text>
              </View>
            </View>
            <Icon name="chevron-right" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.settingRow, {borderBottomWidth: 0}]} onPress={logout} activeOpacity={0.7}>
            <View style={styles.settingContent}>
              <View style={[styles.contactIconBox, {backgroundColor: isDark ? '#4A0000' : '#FFEBEE', marginRight: 16}]}>
                <Icon name="logout" size={20} color="#D32F2F" />
              </View>
              <Text style={[styles.settingTitle, {color: '#D32F2F'}]}>{t('log_out')}</Text>
            </View>
          </TouchableOpacity>

        </View>

      </ScrollView>

      <SettingsModal 
        visible={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        title={t('charity_settings') || "Settings"} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  header: {
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  scrollContent: {
    padding: theme.spacing.lg,
  },
  card: {
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  orgHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  orgInfo: {
    flex: 1,
  },
  orgName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  orgType: {
    fontSize: 13,
    marginBottom: 8,
  },
  verifiedPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verifiedText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: theme.spacing.md,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statNum: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  statDesc: {
    fontSize: 12,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#E0E0E0',
    opacity: 0.5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: theme.spacing.md,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  recognitionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xl,
  },
  recogCard: {
    flex: 1,
    alignItems: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    marginHorizontal: 4,
  },
  recogIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  recogText: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  contactRow: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  contactIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  contactInfoWrapper: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  contactVal: {
    fontSize: 13,
    fontWeight: '500',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 12,
  },
});
