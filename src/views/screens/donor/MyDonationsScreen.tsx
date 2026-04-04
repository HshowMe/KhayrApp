import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, StyleSheet, TouchableOpacity, I18nManager} from 'react-native';
import {useDonationStore} from '../../../controllers/useDonationStore';
import {useAuthStore} from '../../../controllers/useAuthStore';
import {theme, useThemeStore, getColors} from '../../../config/theme';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export const MyDonationsScreen = ({navigation}: any) => {
  const {t} = useTranslation();
  const {donations, listenToDonations} = useDonationStore();

  useEffect(() => {
    const unsub = listenToDonations();
    return unsub;
  }, []);
  const {user} = useAuthStore();
  const isDark = useThemeStore(s => s.isDark);
  const colors = getColors(isDark);
  const isRTL = I18nManager.isRTL;
  const rtlStyle = {writingDirection: isRTL ? 'rtl' : 'auto', textAlign: isRTL ? 'right' : 'left'} as any;

  const myDonations = donations.filter(d => d.donorId === user?.id) || [];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'available':
        return {bg: '#FFF3E0', color: colors.warning, icon: 'clock-outline'};
      case 'accepted':
      case 'inTransit':
        return {bg: colors.iconBlue, color: '#1976D2', icon: 'truck-fast-outline'};
      case 'delivered':
        return {bg: colors.iconGreen, color: colors.primary, icon: 'check-circle-outline'};
      default:
        return {bg: colors.surface, color: colors.textSecondary, icon: 'circle-outline'};
    }
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.topBar}>
        <Text style={[styles.headerTitle, {color: colors.text}]}>{t('my_donations')}</Text>
        <TouchableOpacity>
          <Icon name="magnify" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={[styles.impactCard, {backgroundColor: colors.iconGreen}]}>
        <Text style={[styles.impactTitle, {color: colors.primary}]}>{t('your_impact')}</Text>
        <View style={styles.impactStatsRow}>
          <View style={styles.impactStatItem}>
            <Text style={[styles.impactStatValue, {color: colors.primary}]}>{user?.stats?.mealsProvided || 127}</Text>
            <Text style={[styles.impactStatLabel, {color: colors.primary}]}>{t('meals_saved')}</Text>
          </View>
          <View style={styles.impactStatItem}>
            <Text style={[styles.impactStatValue, {color: colors.primary}]}>{user?.stats?.totalDonations || 42}</Text>
            <Text style={[styles.impactStatLabel, {color: colors.primary}]}>{t('total_donations')}</Text>
          </View>
          <View style={styles.impactStatItem}>
            <Text style={[styles.impactStatValue, {color: colors.primary}]}>{user?.stats?.co2Saved || 89}kg</Text>
            <Text style={[styles.impactStatLabel, {color: colors.primary}]}>{t('co2_reduced')}</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.giveFoodButton, {backgroundColor: colors.primary}]}
          onPress={() => navigation.navigate('Create')}>
          <Icon name="plus" size={20} color={colors.surface} />
          <Text style={[styles.giveFoodButtonText, {color: colors.surface}]}>{t('give_food')}</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.sectionTitle, {color: colors.text}]}>{t('recent_activity')}</Text>
    </View>
  );

  const renderItem = ({item}: {item: any}) => {
    const statusStyle = getStatusStyle(item.status);
    return (
      <TouchableOpacity
        style={[styles.card, {backgroundColor: colors.surface, borderColor: colors.border}]}
        onPress={() => navigation.navigate('DonationDetails', {id: item.id})}>
        {/* Placeholder image for donated food */}
        <View style={[styles.cardImagePlaceholder, {backgroundColor: colors.iconGreen}]}>
          <Icon name="food-apple" size={32} color={colors.primary} />
        </View>

        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={[styles.title, {color: colors.text}, rtlStyle]} numberOfLines={1}>{item.title}</Text>
            <View style={[styles.badge, {backgroundColor: statusStyle.bg}]}>
              <Text style={[styles.badgeText, {color: statusStyle.color}]}>
                {item.status.toUpperCase()}
              </Text>
            </View>
          </View>
          <Text style={[styles.details, {color: colors.textSecondary}, rtlStyle]}>{item.quantity} • {item.foodType}</Text>
          
          <View style={styles.cardFooter}>
            <View style={styles.dateRow}>
              <Icon name={statusStyle.icon} size={14} color={statusStyle.color} style={{marginRight: 4}} />
              <Text style={[styles.date, {color: colors.textSecondary}, rtlStyle]}>
                {t('today')}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <FlatList
        data={myDonations}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={[styles.emptyText, {color: colors.textSecondary}]}>{t('no_donations')}</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: 40,
  },
  headerContainer: {
    marginBottom: theme.spacing.md,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  impactCard: {
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  impactTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: theme.spacing.lg,
  },
  impactStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xl,
  },
  impactStatItem: {
    alignItems: 'flex-start',
  },
  impactStatValue: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  impactStatLabel: {
    fontSize: 12,
    opacity: 0.8,
  },
  giveFoodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: theme.borderRadius.round,
  },
  giveFoodButtonText: {
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: theme.spacing.md,
  },
  card: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 2},
    elevation: 2,
  },
  cardImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  details: {
    fontSize: 13,
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
    fontWeight: '500',
  },
  empty: {
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
  },
});
