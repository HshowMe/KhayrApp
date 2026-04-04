import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  I18nManager,
} from 'react-native';
import {theme, useThemeStore, getColors} from '../../../config/theme';
import Toast from 'react-native-toast-message';
import {useDonationStore} from '../../../controllers/useDonationStore';
import {useTaskStore} from '../../../controllers/useTaskStore';
import {useAuthStore} from '../../../controllers/useAuthStore';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTranslation} from 'react-i18next';
import firestore from '@react-native-firebase/firestore';

export const CharityDonationDetailsScreen = ({route, navigation}: any) => {
  const {id} = route.params;
  const {donations, acceptDonation} = useDonationStore();
  const {submitVolunteerRating} = useTaskStore();
  const {user} = useAuthStore();
  
  const {t} = useTranslation();
  const isDark = useThemeStore(s => s.isDark);
  const colors = getColors(isDark);

  const donation = donations.find(d => d.id === id);
  const [donorName, setDonorName] = useState('Loading...');

  const isRTL = I18nManager.isRTL;
  const writingDir = isRTL ? 'rtl' : 'auto';
  const textAlign = isRTL ? 'right' : 'left';
  const rtlTextStyle = {writingDirection: writingDir as any, textAlign: textAlign as any};

  useEffect(() => {
    if (donation?.donorId) {
      const fetchDonor = async () => {
        try {
          const doc = await firestore().collection('users').doc(donation.donorId).get();
          if (doc.exists()) {
            const data = doc.data();
            setDonorName(data?.displayName ?? data?.name ?? data?.email ?? 'Anonymous');
          } else {
            setDonorName('Anonymous');
          }
        } catch (e) {
          setDonorName('Anonymous');
        }
      };
      fetchDonor();
    }
  }, [donation?.donorId]);

  if (!donation) {
    return (
      <View style={[styles.center, {backgroundColor: colors.background}]}>
        <Text style={[{color: colors.text}, rtlTextStyle]}>Not Found</Text>
      </View>
    );
  }

  const handleAccept = async () => {
    try {
      await acceptDonation(donation.id, user?.id || 'charity-id-123');
      Toast.show({ type: 'success', text1: 'Success', text2: 'Donation accepted! Searching for nearby volunteers...', visibilityTime: 3000 });
      navigation.goBack();
    } catch(e: any) {
       Toast.show({ type: 'error', text1: 'Error', text2: e.message, visibilityTime: 5000 });
    }
  };

  const handleRate = async (stars: number) => {
    try {
      await submitVolunteerRating(donation.id, donation.volunteerId || '', stars, 'Great job!');
      Toast.show({ type: 'success', text1: 'Success', text2: 'Rating submitted!', visibilityTime: 3000 });
    } catch (e: any) {
      Toast.show({ type: 'error', text1: 'Error', text2: e.message, visibilityTime: 5000 });
    }
  };

  const getRelativeTime = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    const diff = new Date(dateStr).getTime() - Date.now();
    if (diff < 0) return 'Expired';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 0) return `${hours} hour${hours !== 1 ? 's' : ''}`;
    return `${mins} min${mins !== 1 ? 's' : ''}`;
  };

  const getPostedTime = (dateStr: string) => {
     if (!dateStr) return 'Recently';
     const diff = Date.now() - new Date(dateStr).getTime();
     if (diff < 0) return 'Recently';
     const mins = Math.floor(diff / (1000 * 60));
     const hours = Math.floor(mins / 60);
     if (hours > 0) return `${hours} hr${hours !== 1 ? 's' : ''} ago`;
     return `${mins} min${mins !== 1 ? 's' : ''} ago`;
  };

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: colors.background}]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name={isRTL ? "arrow-right" : "arrow-left"} size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, {color: colors.text}, rtlTextStyle]}>
          {t('donation_details') || 'Donation Details'}
        </Text>
        <View style={{width: 24}} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {!!donation.isSOS ? (
          <View style={styles.alertBanner}>
            <Icon name="alert-circle-outline" size={24} color="#FFF" style={styles.alertIcon} />
            <View style={styles.alertTextContainer}>
              <Text style={[styles.alertTitle, rtlTextStyle]}>Urgent Pickup Needed</Text>
              <Text style={[styles.alertSubtitle, rtlTextStyle]}>This food expires in {getRelativeTime(donation.expiryDate)}</Text>
            </View>
          </View>
        ) : null}

        <View style={[styles.card, {backgroundColor: colors.surface, borderColor: colors.border}]}>
          <View style={styles.cardHeaderRow}>
            <Text style={[styles.foodTitle, {color: colors.text}, rtlTextStyle]}>{donation.title}</Text>
            {!!donation.isSOS ? (
              <View style={styles.sosBadge}>
                <Text style={styles.sosBadgeText}>SOS</Text>
              </View>
            ) : null}
          </View>
          <Text style={[styles.foodQuantity, {color: colors.textSecondary}, rtlTextStyle]}>{donation.quantity}</Text>

          <View style={styles.infoRow}>
            <Icon name="cube-outline" size={22} color={colors.textSecondary} style={styles.infoIcon} />
            <View style={styles.infoTextContainer}>
              <Text style={[styles.infoLabel, {color: colors.textSecondary}, rtlTextStyle]}>{t('description') || 'Description'}</Text>
              <Text style={[styles.infoValue, {color: colors.text}, rtlTextStyle]}>{donation.foodType || 'Assorted food items'}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Icon name="map-marker-outline" size={22} color={colors.textSecondary} style={styles.infoIcon} />
            <View style={styles.infoTextContainer}>
              <Text style={[styles.infoLabel, {color: colors.textSecondary}, rtlTextStyle]}>{t('pickup_location') || 'Pickup Location'}</Text>
              <Text style={[styles.infoValue, {color: colors.text}, rtlTextStyle]}>Riyadh District</Text>
              <Text style={[styles.infoDistance, rtlTextStyle]}>0.8 km from your location</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Icon name="clock-outline" size={22} color={colors.textSecondary} style={styles.infoIcon} />
            <View style={styles.infoTextContainer}>
              <Text style={[styles.infoLabel, {color: colors.textSecondary}, rtlTextStyle]}>{t('best_before') || 'Best Before'}</Text>
              <Text style={[styles.infoValue, {color: colors.text}, rtlTextStyle]}>{getRelativeTime(donation.expiryDate)}</Text>
            </View>
          </View>
        </View>

        <View style={[styles.card, {backgroundColor: colors.surface, borderColor: colors.border}]}>
          <Text style={[styles.sectionTitle, {color: colors.text}, rtlTextStyle]}>{t('donor_information') || 'Donor Information'}</Text>
          <View style={styles.donorRow}>
            <View style={[styles.avatar, {backgroundColor: colors.inputBackground}]}>
              <Icon name="account-outline" size={28} color={colors.textSecondary} />
            </View>
            <View style={styles.donorTextContainer}>
              <Text style={[styles.donorName, {color: colors.text}, rtlTextStyle]}>{donorName}</Text>
              <Text style={[styles.donorTime, {color: colors.textSecondary}, rtlTextStyle]}>Posted {getPostedTime(donation.createdAt)}</Text>
            </View>
            <TouchableOpacity style={styles.phoneButton}>
              <Icon name="phone" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>

      <View style={[styles.footer, {backgroundColor: colors.background, borderTopColor: colors.border}]}>
        {donation.status === 'Created' ? (
          <View style={styles.actionRow}>
            <TouchableOpacity style={[styles.outlineButton, {borderColor: colors.border}]} onPress={() => navigation.goBack()}>
              <Text style={[styles.outlineButtonText, {color: colors.text}, rtlTextStyle]}>{t('decline') || 'Decline'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.primaryButton} onPress={handleAccept}>
              <Text style={[styles.primaryButtonText, rtlTextStyle]}>{t('accept_donation') || 'Accept Donation'}</Text>
            </TouchableOpacity>
          </View>
        ) : donation.status === 'Delivered' ? (
           (donation as any).volunteerRating ? (
             <View style={[styles.disabledButton, {backgroundColor: colors.inputBackground}]}>
               <Icon name="star" size={20} color={theme.colors.warning} style={{marginRight: 8}} />
               <Text style={[styles.disabledButtonText, {color: colors.textSecondary}, rtlTextStyle]}>Rated {(donation as any).volunteerRating} Stars</Text>
             </View>
           ) : (
             <View style={styles.ratingSection}>
                <Text style={[styles.ratingTitle, {color: colors.text}, rtlTextStyle]}>Rate the Volunteer</Text>
                <View style={styles.starsRow}>
                  {[1,2,3,4,5].map(star => (
                    <TouchableOpacity key={star} onPress={() => handleRate(star)} style={{marginHorizontal: 8}}>
                      <Icon name="star-outline" size={36} color={theme.colors.warning} />
                    </TouchableOpacity>
                  ))}
                </View>
             </View>
           )
        ) : (
          <View style={[styles.disabledButton, {backgroundColor: colors.inputBackground}]}>
            <Icon name="check-circle" size={20} color={colors.textSecondary} style={{marginRight: 8}} />
            <Text style={[styles.disabledButtonText, {color: colors.textSecondary}, rtlTextStyle]}>
              {donation.status ? `Already ${donation.status.toUpperCase()}` : 'Unavailable'}
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  center: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  container: {flex: 1},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  backButton: {
    padding: theme.spacing.xs,
    marginLeft: -theme.spacing.xs,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  scrollContent: {
    paddingBottom: 40,
    paddingHorizontal: theme.spacing.md,
  },
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF5722',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  alertIcon: {
    marginRight: 12,
  },
  alertTextContainer: {
    flex: 1,
  },
  alertTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  alertSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 13,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    marginBottom: 16,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  foodTitle: {
    fontSize: 20,
    fontWeight: '700',
    flex: 1,
  },
  sosBadge: {
    backgroundColor: '#FF5722',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 10,
  },
  sosBadgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  foodQuantity: {
    fontSize: 15,
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  infoIcon: {
    marginRight: 16,
    marginTop: 2,
  },
  infoTextContainer: {
    flex: 1,
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
  infoDistance: {
    color: '#4CAF50',
    fontSize: 13,
    marginTop: 4,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  donorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  donorTextContainer: {
    flex: 1,
  },
  donorName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  donorTime: {
    fontSize: 13,
  },
  phoneButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#246D36',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  outlineButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    borderWidth: 1,
  },
  outlineButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryButton: {
    flex: 1.5,
    backgroundColor: '#246D36',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    flexDirection: 'row',
    paddingVertical: 18,
    borderRadius: theme.borderRadius.round,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  ratingSection: {
    alignItems: 'center',
  },
  ratingTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: theme.spacing.md,
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
