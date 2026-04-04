import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  I18nManager,
  SafeAreaView
} from 'react-native';
import {theme, useThemeStore, getColors} from '../../../config/theme';
import {useDonationStore} from '../../../controllers/useDonationStore';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTranslation} from 'react-i18next';

export const DonationDetailsScreen = ({route, navigation}: any) => {
  const {id} = route.params;
  const {donations} = useDonationStore();
  
  const {t} = useTranslation();
  const isDark = useThemeStore(s => s.isDark);
  const colors = getColors(isDark);

  const isRTL = I18nManager.isRTL;
  const rtlTextStyle = { writingDirection: isRTL ? 'rtl' : 'auto', textAlign: isRTL ? 'right' : 'left' } as any;

  const donation = donations.find(d => d.id === id);

  if (!donation) {
    return (
      <View style={[styles.center, {backgroundColor: colors.background}]}>
        <Text style={[{color: colors.text}, rtlTextStyle]}>Not Found</Text>
      </View>
    );
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const statusProgressValue = (status: string, volunteerId?: string) => {
    switch (status) {
      case 'Created': return 1;
      case 'Accepted': return volunteerId ? 3 : 2;
      case 'In Transit': return 4;
      case 'Delivered': return 5;
      default: return 0;
    }
  };

  const currentStep = statusProgressValue(donation.status, donation.volunteerId);

  const steps = [
    { title: t('created'), time: formatDate(donation.createdAt) || t('today'), done: currentStep >= 1 },
    { title: t('accepted'), time: currentStep >= 2 ? t('done') : t('pending'), done: currentStep >= 2 },
    { title: t('volunteer_assigned'), time: currentStep >= 3 ? t('done') : t('pending'), done: currentStep >= 3 },
    { title: t('in_transit'), time: currentStep >= 4 ? t('done') : t('pending'), done: currentStep >= 4 },
    { title: t('delivered'), time: currentStep >= 5 ? t('done') : t('pending'), done: currentStep >= 5 },
  ];

  const handleOptions = () => {
    // Show actions like edit / delete here
  };

  return (
    <SafeAreaView style={[styles.safeArea, {backgroundColor: colors.background}]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <Icon name={isRTL ? "arrow-right" : "arrow-left"} size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, {color: colors.text}, rtlTextStyle]}>{donation.title}</Text>
        <TouchableOpacity onPress={handleOptions} style={styles.iconButton}>
          <Icon name="dots-horizontal" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Main Item Card */}
        <View style={[styles.card, {backgroundColor: colors.surface, borderColor: colors.border}]}>
          <View style={styles.itemRow}>
             {donation.imageUrl ? (
                <Image source={{uri: donation.imageUrl}} style={styles.itemImage} resizeMode="cover" />
             ) : (
                <View style={[styles.itemImagePlaceholder, {backgroundColor: colors.inputBackground}]}>
                  <Icon name="food-apple-outline" size={32} color={colors.textSecondary} />
                </View>
             )}
             <View style={styles.itemTextContainer}>
                <Text style={[styles.itemTitle, {color: colors.text}, rtlTextStyle]}>{donation.title}</Text>
                <Text style={[styles.itemSubtitle, {color: colors.textSecondary}, rtlTextStyle]}>{donation.quantity} • {formatDate(donation.createdAt) || 'Today'}</Text>
                <View style={[styles.statusBadge, {backgroundColor: colors.inputBackground}]}>
                  <Text style={[styles.statusBadgeText, {color: colors.textSecondary}, rtlTextStyle]}>{donation.status}</Text>
                </View>
             </View>
          </View>
        </View>

        {/* Timeline Card */}
        <View style={[styles.card, {backgroundColor: colors.surface, borderColor: colors.border}]}>
          {steps.map((step, index) => {
            const isLast = index === steps.length - 1;
            return (
              <View key={index} style={styles.timelineRow}>
                <View style={styles.timelineIconContainer}>
                   {step.done ? (
                     <View style={[styles.timelineDotActive, {backgroundColor: colors.surface}]}>
                        <View style={styles.timelineDotInner} />
                     </View>
                   ) : (
                     <View style={[styles.timelineDotInactive, {backgroundColor: colors.inputBackground}]} />
                   )}
                   {!isLast && (
                     <View style={[styles.timelineLine, {backgroundColor: colors.border}]} />
                   )}
                </View>
                <View style={[styles.timelineTextContainer, isLast && {paddingBottom: 0}]}>
                   <Text style={[styles.timelineTitle, {color: step.done ? colors.text : colors.textSecondary}, rtlTextStyle]}>{step.title}</Text>
                   <Text style={[styles.timelineTime, {color: colors.textSecondary}, rtlTextStyle]}>{step.time}</Text>
                </View>
              </View>
            )
          })}
        </View>

        <Text style={[styles.sectionTitle, {color: colors.text}, rtlTextStyle]}>{t('details') || 'Details'}</Text>

        <View style={[styles.card, {backgroundColor: colors.surface, borderColor: colors.border}]}>
          <View style={styles.infoRow}>
            <View style={[styles.iconCircle, {backgroundColor: colors.inputBackground}]}>
              <Icon name="map-marker-outline" size={20} color={colors.textSecondary} />
            </View>
            <View style={styles.infoTextWrapper}>
              <Text style={[styles.infoLabel, {color: colors.textSecondary}, rtlTextStyle]}>{t('pickup_location') || 'Pickup Location'}</Text>
              <Text style={[styles.infoValue, {color: colors.text}, rtlTextStyle]}>Al Olaya District, Riyadh</Text>
            </View>
          </View>
          
          <View style={[styles.divider, {backgroundColor: colors.border}]} />

          <View style={styles.infoRow}>
            <View style={[styles.iconCircle, {backgroundColor: colors.inputBackground}]}>
              <Icon name="clock-outline" size={20} color={colors.textSecondary} />
            </View>
            <View style={styles.infoTextWrapper}>
              <Text style={[styles.infoLabel, {color: colors.textSecondary}, rtlTextStyle]}>{t('best_before') || 'Best Before'}</Text>
              <Text style={[styles.infoValue, {color: colors.text}, rtlTextStyle]}>{formatDate(donation.expiryDate) || 'Today at 8:00 PM'}</Text>
            </View>
          </View>

          <View style={[styles.divider, {backgroundColor: colors.border}]} />

          <View style={styles.infoRow}>
            <View style={[styles.iconCircle, {backgroundColor: colors.inputBackground}]}>
              <Icon name="cube-outline" size={20} color={colors.textSecondary} />
            </View>
            <View style={styles.infoTextWrapper}>
              <Text style={[styles.infoLabel, {color: colors.textSecondary}, rtlTextStyle]}>{t('description') || 'Description'}</Text>
              <Text style={[styles.infoValue, {color: colors.text}, rtlTextStyle]}>{donation.foodType}</Text>
            </View>
          </View>

        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  center: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  iconButton: {
    padding: 8,
    marginHorizontal: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    marginBottom: 16,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemImage: {
    width: 72,
    height: 72,
    borderRadius: 12,
    marginRight: 16,
  },
  itemImagePlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 12,
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemTextContainer: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  itemSubtitle: {
    fontSize: 14,
    marginBottom: 10,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  timelineRow: {
    flexDirection: 'row',
  },
  timelineIconContainer: {
    alignItems: 'center',
    width: 24,
    marginRight: 16,
  },
  timelineDotActive: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  timelineDotInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4CAF50',
  },
  timelineDotInactive: {
    width: 16,
    height: 16,
    borderRadius: 8,
    zIndex: 2,
    marginTop: 2,
  },
  timelineLine: {
    width: 1,
    flex: 1,
    minHeight: 40,
    marginVertical: -4,
    zIndex: 1,
  },
  timelineTextContainer: {
    flex: 1,
    paddingBottom: 32,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  timelineTime: {
    fontSize: 13,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    marginTop: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoTextWrapper: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 2,
  },
  infoLabel: {
    fontSize: 13,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 22,
  },
  divider: {
    height: 1,
    marginVertical: 16,
    marginLeft: 60, 
  },
});
