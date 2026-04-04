import React, {useEffect} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity, I18nManager, SafeAreaView} from 'react-native';
import {theme, useThemeStore, getColors} from '../../../config/theme';
import {useDonationStore} from '../../../controllers/useDonationStore';
import {useTaskStore} from '../../../controllers/useTaskStore';
import {useAuthStore} from '../../../controllers/useAuthStore';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTranslation} from 'react-i18next';

export const AvailableTasksScreen = ({navigation}: any) => {
  const {donations, listenToDonations} = useDonationStore();
  const {listenToTasks} = useTaskStore();
  const {user} = useAuthStore();
  const {t} = useTranslation();
  
  const isDark = useThemeStore(s => s.isDark);
  const colors = getColors(isDark);
  const isRTL = I18nManager.isRTL;
  const rtlTextStyle = { writingDirection: isRTL ? 'rtl' : 'auto', textAlign: isRTL ? 'right' : 'left' } as any;

  useEffect(() => {
    const unsubDons = listenToDonations();
    const unsubTasks = listenToTasks();
    return () => {
      unsubDons();
      unsubTasks();
    };
  }, []);

  const availableTasks = donations
    .filter(d => d.status === 'Accepted' && !d.volunteerId)
    .sort((a, b) => (a.isSOS === b.isSOS ? 0 : a.isSOS ? -1 : 1));

  const urgentTasksCount = availableTasks.filter(t => t.isSOS).length;
  const rating = user?.stats?.rating?.toFixed(1) || '5.0';
  const points = (user?.stats?.tasksCompleted || 0) * 50;

  const renderItem = ({item}: {item: any}) => {
    // Generate realistic relative time based on expiryDate
    const diff = new Date(item.expiryDate).getTime() - Date.now();
    const hours = Math.max(1, Math.floor(diff / (1000 * 60 * 60)));
    
    return (
      <TouchableOpacity
        style={[styles.card, {backgroundColor: colors.surface, borderColor: colors.border}]}
        onPress={() => navigation.navigate('TaskMap', {id: item.id})}>
        
        <View style={styles.cardHeader}>
          <View style={[styles.iconCircle, {backgroundColor: colors.inputBackground}]}>
            <Icon name="cube-outline" size={24} color={colors.textSecondary} />
          </View>
          <View style={styles.cardTitleContainer}>
            <Text style={[styles.title, {color: colors.text}, rtlTextStyle]}>{item.title}</Text>
            <Text style={[styles.subtitle, {color: colors.textSecondary}, rtlTextStyle]}>{item.quantity}</Text>
          </View>
          <View style={styles.distanceContainer}>
            <Text style={[styles.distanceText, {color: colors.textSecondary}, rtlTextStyle]}>5.2 {t('km_total') || 'km total'}</Text>
          </View>
        </View>

        <View style={styles.routeContainer}>
          <View style={styles.routeTimeline}>
            <View style={[styles.dot, {backgroundColor: '#2196F3'}]} />
            <View style={[styles.line, {backgroundColor: colors.border}]} />
            <View style={[styles.dot, {backgroundColor: theme.colors.success}]} />
          </View>
          <View style={styles.routeTextContainer}>
            <View style={styles.routePoint}>
              <Text style={[styles.routeLabel, {color: colors.textSecondary}, rtlTextStyle]}>{t('pickup')}</Text>
              <Text style={[styles.routeValue, {color: colors.text}, rtlTextStyle]}>Donor Location, District</Text>
            </View>
            <View style={styles.routePoint}>
              <Text style={[styles.routeLabel, {color: colors.textSecondary}, rtlTextStyle]}>{t('drop_off')}</Text>
              <Text style={[styles.routeValue, {color: colors.text}, rtlTextStyle]}>Charity Hub, Area</Text>
            </View>
          </View>
        </View>

        <View style={styles.cardFooter}>
           <View style={[styles.expiryBadge, {backgroundColor: item.isSOS ? '#FFF3E0' : colors.inputBackground}]}>
             <Icon name="clock-outline" size={14} color={item.isSOS ? theme.colors.warning : colors.textSecondary} style={{marginRight: 4}} />
             <Text style={[styles.expiryText, {color: item.isSOS ? theme.colors.warning : colors.textSecondary}, rtlTextStyle]}>
               {t('expires_in')} {hours} {t('hours')}
             </Text>
           </View>
           <View style={[styles.arrowCircle, {backgroundColor: colors.iconGreen}]}>
             <Icon name={isRTL ? "arrow-left" : "arrow-right"} size={20} color={theme.colors.primary} />
           </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: colors.background}]}>
      <View style={styles.headerRow}>
        <Text style={[styles.header, {color: colors.text}, rtlTextStyle]}>{t('delivery_tasks')}</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Icon name="filter-variant" size={24} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={availableTasks}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            {urgentTasksCount > 0 ? (
              <View style={[styles.urgentBanner, {backgroundColor: isDark ? '#3A2A1A' : '#FFF8E1'}]}>
                <View style={styles.urgentIconCircle}>
                  <Icon name="alert-circle-outline" size={20} color={theme.colors.warning} />
                </View>
                <View style={styles.urgentTextContainer}>
                   <Text style={[styles.urgentTitle, {color: isDark ? colors.warning : '#8D6E63'}, rtlTextStyle]}>{urgentTasksCount} {t('urgent_deliveries')}</Text>
                   <Text style={[styles.urgentSubtitle, {color: isDark ? colors.textSecondary : '#A1887F'}, rtlTextStyle]}>{t('urgent_desc')}</Text>
                </View>
              </View>
            ) : null}

            <View style={styles.statsRow}>
              <View style={[styles.statBox, {backgroundColor: colors.surface, borderColor: colors.border}]}>
                <Text style={[styles.statValue, {color: theme.colors.primary}]}>{availableTasks.length}</Text>
                <Text style={[styles.statLabel, {color: colors.textSecondary}, rtlTextStyle]}>{t('today_tasks')}</Text>
              </View>
              <View style={[styles.statBox, {backgroundColor: colors.surface, borderColor: colors.border}]}>
                <Text style={[styles.statValue, {color: colors.text}]}>{rating}</Text>
                <Text style={[styles.statLabel, {color: colors.textSecondary}, rtlTextStyle]}>{t('rating')}</Text>
              </View>
              <View style={[styles.statBox, {backgroundColor: colors.surface, borderColor: colors.border}]}>
                <Text style={[styles.statValue, {color: colors.text}]}>{points}</Text>
                <Text style={[styles.statLabel, {color: colors.textSecondary}, rtlTextStyle]}>{t('points')}</Text>
              </View>
            </View>

            <Text style={[styles.sectionTitle, {color: colors.text}, rtlTextStyle]}>{t('available_near_you')}</Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={[{color: colors.textSecondary}, rtlTextStyle]}>{t('no_tasks')}</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
  },
  filterButton: {
    padding: 8,
  },
  list: {
    padding: 20,
    paddingBottom: 40,
  },
  urgentBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
  },
  urgentIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,149,0,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  urgentTextContainer: {
    flex: 1,
  },
  urgentTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#8D6E63',
    marginBottom: 4,
  },
  urgentSubtitle: {
    fontSize: 13,
    color: '#A1887F',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statBox: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardTitleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
  },
  distanceContainer: {
    alignItems: 'flex-end',
  },
  distanceText: {
    fontSize: 12,
    marginTop: 4,
  },
  routeContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    paddingLeft: 4,
  },
  routeTimeline: {
    width: 20,
    alignItems: 'center',
    marginRight: 12,
    paddingVertical: 6,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
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
    fontSize: 11,
    marginBottom: 2,
  },
  routeValue: {
    fontSize: 13,
    fontWeight: '500',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expiryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  expiryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  arrowCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: {
    padding: 32,
    alignItems: 'center',
  },
});
