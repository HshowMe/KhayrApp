import React from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity, I18nManager, SafeAreaView} from 'react-native';
import {theme, useThemeStore, getColors} from '../../../config/theme';
import {useDonationStore} from '../../../controllers/useDonationStore';
import {useAuthStore} from '../../../controllers/useAuthStore';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTranslation} from 'react-i18next';

export const MyDeliveriesScreen = ({navigation}: any) => {
  const {donations} = useDonationStore();
  const {user} = useAuthStore();
  
  const {t} = useTranslation();
  const isDark = useThemeStore(s => s.isDark);
  const colors = getColors(isDark);
  const isRTL = I18nManager.isRTL;
  const rtlTextStyle = { writingDirection: isRTL ? 'rtl' : 'auto', textAlign: isRTL ? 'right' : 'left' } as any;

  const myDeliveries = donations.filter(
    d =>
      (d.status === 'In Transit' || d.status === 'Delivered') &&
      d.volunteerId === (user?.id || 'vol-123'),
  ).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const rating = user?.stats?.rating?.toFixed(1) || '4.6';
  const points = (user?.stats?.tasksCompleted || 0) * 50;
  const deliveryCount = user?.stats?.tasksCompleted || myDeliveries.filter(m => m.status === 'Delivered').length;

  const renderItem = ({item}: {item: any}) => {
    const isInTransit = item.status === 'In Transit';
    
    const CardWrapper = isInTransit ? TouchableOpacity : View;
    const cardProps = isInTransit
      ? { onPress: () => navigation.navigate('Tasks', { screen: 'TaskMap', params: { id: item.id } }), activeOpacity: 0.7 }
      : {};

    return (
      <CardWrapper style={[styles.card, {backgroundColor: colors.surface, borderColor: colors.border}]} {...cardProps}>
        <View style={styles.cardHeader}>
          <View style={styles.flex1}>
            <Text style={[styles.title, {color: colors.text}, rtlTextStyle]}>{item.title}</Text>
            <Text style={[styles.subtitle, {color: colors.textSecondary}, rtlTextStyle]}>{item.quantity}</Text>
          </View>
          {isInTransit ? (
            <View style={[styles.badgeInProgress, {backgroundColor: isDark ? '#3A2A1A' : '#FFF3E0'}]}>
              <Icon name="truck-fast-outline" size={14} color="#FF9800" style={{marginRight: 4}} />
              <Text style={styles.badgeInProgressText}>{t('in_progress')}</Text>
            </View>
          ) : (
            <View style={[styles.badgeSuccess, {backgroundColor: isDark ? '#1B3A1B' : '#E8F5E9'}]}>
              <Icon name="check-circle-outline" size={14} color="#4CAF50" style={{marginRight: 4}} />
              <Text style={styles.badgeSuccessText}>{t('completed')}</Text>
            </View>
          )}
        </View>

        <View style={styles.routeContainer}>
          <View style={styles.routeTimeline}>
            <View style={styles.dotBlue} />
            <View style={[styles.line, {backgroundColor: colors.border}]} />
            <View style={styles.dotGreen} />
          </View>
          <View style={styles.routeTextContainer}>
            <View style={styles.routePoint}>
              <Text style={[styles.routeLabel, {color: colors.textSecondary}, rtlTextStyle]}>{t('from')}</Text>
              <Text style={[styles.routeValue, {color: colors.text}, rtlTextStyle]}>Donor Location</Text>
            </View>
            <View style={styles.routePoint}>
              <Text style={[styles.routeLabel, {color: colors.textSecondary}, rtlTextStyle]}>{t('to')}</Text>
              <Text style={[styles.routeValue, {color: colors.text}, rtlTextStyle]}>Charity Location</Text>
            </View>
          </View>
        </View>

        <View style={[styles.divider, {backgroundColor: colors.border}]} />

        <View style={styles.cardFooter}>
           <View style={styles.dateRating}>
             <Icon name="clock-outline" size={14} color={colors.textSecondary} style={{marginRight: 4}} />
             <Text style={[styles.dateText, {color: colors.textSecondary}, rtlTextStyle]}>
               {new Date(item.createdAt).toLocaleDateString()}
             </Text>
             <Icon name="star" size={14} color="#FFC107" style={{marginLeft: 12, marginRight: 4}} />
             <Text style={[styles.dateText, {color: colors.textSecondary}, rtlTextStyle]}>
               {((item as any).volunteerRating || 5.0).toFixed(1)}
             </Text>
           </View>
           {isInTransit ? (
             <View style={styles.tapHintRow}>
               <Text style={[styles.tapHintText, {color: colors.primary}, rtlTextStyle]}>{t('complete_delivery')}</Text>
               <Icon name={isRTL ? "arrow-left" : "arrow-right"} size={16} color={colors.primary} />
             </View>
           ) : (
             <Text style={[styles.pointsText, rtlTextStyle]}>50 {t('points')}</Text>
           )}
        </View>
      </CardWrapper>
    );
  };

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: colors.background}]}>
      <Text style={[styles.header, {color: colors.text}, rtlTextStyle]}>{t('my_deliveries')}</Text>

      <FlatList
        data={myDeliveries}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <View style={styles.perfCard}>
              <Text style={[styles.perfTitle, rtlTextStyle]}>{t('your_performance')}</Text>
              <View style={styles.perfStatsRow}>
                <View style={styles.perfStatBox}>
                  <Text style={[styles.perfStatValue, rtlTextStyle]}>{deliveryCount}</Text>
                  <Text style={[styles.perfStatLabel, rtlTextStyle]}>{t('deliveries')}</Text>
                </View>
                <View style={styles.perfStatBox}>
                  <Text style={[styles.perfStatValue, rtlTextStyle]}>{rating}</Text>
                  <Text style={[styles.perfStatLabel, rtlTextStyle]}>{t('avg_rating')}</Text>
                </View>
                <View style={styles.perfStatBox}>
                  <Text style={[styles.perfStatValue, rtlTextStyle]}>{points}</Text>
                  <Text style={[styles.perfStatLabel, rtlTextStyle]}>{t('points_earned')}</Text>
                </View>
              </View>
            </View>
            <Text style={[styles.sectionTitle, {color: colors.textSecondary}, rtlTextStyle]}>{t('recent_deliveries')}</Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={[{color: colors.textSecondary}, rtlTextStyle]}>{t('no_deliveries')}</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  header: {
    fontSize: 24,
    fontWeight: '700',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  list: {
    padding: 20,
    paddingBottom: 40,
  },
  perfCard: {
    backgroundColor: '#246D36',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
  },
  perfTitle: {
    color: '#E8F5E9',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  perfStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  perfStatBox: {
    flex: 1,
  },
  perfStatValue: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  perfStatLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  flex1: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  badgeSuccess: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeSuccessText: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: '700',
  },
  badgeInProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeInProgressText: {
    color: '#FF9800',
    fontSize: 12,
    fontWeight: '700',
  },
  routeContainer: {
    flexDirection: 'row',
  },
  routeTimeline: {
    width: 20,
    alignItems: 'center',
    marginRight: 12,
    paddingVertical: 6,
  },
  dotBlue: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 3,
    borderColor: '#E3F2FD',
    backgroundColor: '#2196F3',
  },
  dotGreen: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 3,
    borderColor: '#E8F5E9',
    backgroundColor: '#4CAF50',
  },
  line: {
    width: 1,
    flex: 1,
    marginVertical: 4,
  },
  routeTextContainer: {
    flex: 1,
  },
  routePoint: {
    justifyContent: 'center',
    height: 38,
  },
  routeLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  routeValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 13,
  },
  pointsText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '700',
  },
  tapHintRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tapHintText: {
    fontSize: 13,
    fontWeight: '600',
    marginRight: 4,
  },
  empty: {
    padding: 32,
    alignItems: 'center',
  },
});
