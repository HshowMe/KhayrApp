import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Linking, ScrollView, I18nManager} from 'react-native';
import Toast from 'react-native-toast-message';
import MapView, {Marker, Polyline} from 'react-native-maps';
import {theme, useThemeStore, getColors} from '../../../config/theme';
import {useDonationStore} from '../../../controllers/useDonationStore';
import {useTaskStore} from '../../../controllers/useTaskStore';
import {useAuthStore} from '../../../controllers/useAuthStore';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTranslation} from 'react-i18next';

export const TaskMapScreen = ({route, navigation}: any) => {
  const {id} = route.params;
  const {donations} = useDonationStore();
  const {acceptTask, confirmDelivery} = useTaskStore();
  const {user} = useAuthStore();
  
  const {t} = useTranslation();
  const isDark = useThemeStore(s => s.isDark);
  const colors = getColors(isDark);
  const isRTL = I18nManager.isRTL;
  const rtlTextStyle = { writingDirection: isRTL ? 'rtl' : 'auto', textAlign: isRTL ? 'right' : 'left' } as any;

  const donation = donations.find(d => d.id === id);
  const [currentStep, setCurrentStep] = useState(
    donation?.status || 'Accepted',
  );

  if (!donation)
    return (
      <View style={[styles.center, {backgroundColor: colors.background}]}>
        <Text style={[{color: colors.text}, rtlTextStyle]}>{t('task_not_found')}</Text>
      </View>
    );

  const donorLoc = donation.location;
  const charityLoc = {latitude: donorLoc.latitude + 0.015, longitude: donorLoc.longitude + 0.01};
  const region = {
    latitude: (donorLoc.latitude + charityLoc.latitude) / 2,
    longitude: (donorLoc.longitude + charityLoc.longitude) / 2,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  const handleAction = async () => {
    try {
      if (currentStep === 'Accepted') {
        await acceptTask(donation.id, user?.id || 'vol-123');
        setCurrentStep('In Transit');
        
        const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${donorLoc.latitude},${donorLoc.longitude}&destination=${charityLoc.latitude},${charityLoc.longitude}`;
        Linking.openURL(mapsUrl).catch(() => console.warn('Could not launch maps'));

        Toast.show({ type: 'success', text1: t('task_accepted'), text2: t('navigate_to_donor'), visibilityTime: 3000 });
      } else if (currentStep === 'In Transit') {
        await confirmDelivery(donation.id);
        setCurrentStep('Delivered');
        navigation.replace('TaskSuccessScreen');
      }
    } catch(e: any) {
      Toast.show({ type: 'error', text1: t('error'), text2: e.message, visibilityTime: 5000 });
    }
  };

  const diff = new Date(donation.expiryDate).getTime() - Date.now();
  const hours = Math.max(1, Math.floor(diff / (1000 * 60 * 60)));

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <View style={styles.mapContainer}>
        <MapView style={styles.map} initialRegion={region}>
          <Marker coordinate={donorLoc} title={t('donor_pickup')}>
             <View style={styles.markerCircleBlue}>
                <View style={styles.markerInnerBlue} />
             </View>
          </Marker>
          <Marker coordinate={charityLoc} title={t('charity_dropoff')}>
             <View style={styles.markerCircleGreen}>
                <Icon name="cube-outline" size={14} color="#FFF" />
             </View>
          </Marker>
          <Polyline coordinates={[donorLoc, charityLoc]} strokeColor={theme.colors.primary} strokeWidth={3} />
        </MapView>
        <TouchableOpacity style={styles.backMapButton} onPress={() => navigation.goBack()}>
          <View style={[styles.backMapCircle, {backgroundColor: colors.surface}]}>
            <Icon name={isRTL ? "arrow-right" : "arrow-left"} size={22} color={colors.text} />
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={[styles.card, {backgroundColor: colors.surface, borderColor: colors.border}]}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.flex1}>
              <Text style={[styles.title, {color: colors.text}, rtlTextStyle]}>{donation.title}</Text>
              <Text style={[styles.subtitle, {color: colors.textSecondary}, rtlTextStyle]}>{donation.quantity} • {donation.foodType}</Text>
            </View>
            {donation.isSOS && (
              <View style={styles.sosBadge}>
                <Text style={styles.sosText}>SOS</Text>
              </View>
            )}
          </View>
          <View style={styles.expiryRow}>
            <Icon name="clock-outline" size={16} color={colors.textSecondary} style={{marginRight: 6}} />
            <Text style={[styles.expiryText, {color: colors.textSecondary}, rtlTextStyle]}>{t('expires_in')} {hours} {t('hours')}</Text>
          </View>
        </View>

        <View style={[styles.card, {backgroundColor: colors.surface, borderColor: colors.border}]}>
          <View style={styles.locationHeader}>
             <View style={[styles.dotBlue, {marginTop: 4, marginRight: 12}]} />
             <View style={styles.flex1}>
                <Text style={[styles.locationLabel, {color: colors.textSecondary}, rtlTextStyle]}>{t('pickup_location')}</Text>
                <Text style={[styles.locationName, {color: colors.text}, rtlTextStyle]}>Donor • Area</Text>
                <Text style={[styles.locationAddress, {color: colors.textSecondary}, rtlTextStyle]}>District, Street Address</Text>
                <TouchableOpacity style={styles.actionLink} onPress={() => Linking.openURL('tel:99999999')}>
                   <Icon name="phone-outline" size={16} color={theme.colors.primary} style={{marginRight: 6}} />
                   <Text style={[styles.actionLinkText, rtlTextStyle]}>{t('call_donor')}</Text>
                </TouchableOpacity>
             </View>
          </View>
        </View>

        <View style={[styles.card, {backgroundColor: colors.surface, borderColor: colors.border}]}>
          <View style={styles.locationHeader}>
             <View style={[styles.dotGreen, {marginTop: 4, marginRight: 12}]} />
             <View style={styles.flex1}>
                <Text style={[styles.locationLabel, {color: colors.textSecondary}, rtlTextStyle]}>{t('dropoff_location')}</Text>
                <Text style={[styles.locationName, {color: colors.text}, rtlTextStyle]}>Charity Hub</Text>
                <Text style={[styles.locationAddress, {color: colors.textSecondary}, rtlTextStyle]}>District, Street Address</Text>
                <TouchableOpacity style={styles.actionLink} onPress={() => Linking.openURL('tel:99999999')}>
                   <Icon name="phone-outline" size={16} color={theme.colors.primary} style={{marginRight: 6}} />
                   <Text style={[styles.actionLinkText, rtlTextStyle]}>{t('call_charity')}</Text>
                </TouchableOpacity>
             </View>
          </View>
        </View>

      </ScrollView>

      <View style={[styles.footer, {backgroundColor: colors.background, borderTopColor: colors.border}]}>
        <TouchableOpacity
          style={[styles.button, currentStep === 'In Transit' && styles.deliverButton]}
          onPress={handleAction}>
          <Text style={[styles.buttonText, rtlTextStyle]}>
            {currentStep === 'Accepted'
              ? t('accept_task')
              : t('complete_delivery')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  center: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  container: {flex: 1},
  mapContainer: {
    height: '40%',
    width: '100%',
    position: 'relative',
  },
  map: {flex: 1},
  backMapButton: {
    position: 'absolute',
    top: 48,
    left: 20,
    zIndex: 10,
  },
  backMapCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: {width: 0, height: 2},
  },
  markerCircleBlue: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  markerInnerBlue: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2196F3',
  },
  markerCircleGreen: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
    marginTop: -20,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 4},
  },
  flex1: {
    flex: 1,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  sosBadge: {
    backgroundColor: '#FF5722',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 12,
  },
  sosText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  expiryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expiryText: {
    fontSize: 13,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  dotBlue: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 4,
    borderColor: '#E3F2FD',
    backgroundColor: '#2196F3',
  },
  dotGreen: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 4,
    borderColor: '#E8F5E9',
    backgroundColor: '#4CAF50',
  },
  locationLabel: {
    fontSize: 13,
    marginBottom: 2,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  locationAddress: {
    fontSize: 13,
    marginBottom: 12,
  },
  actionLink: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionLinkText: {
    color: '#246D36',
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  button: {
    backgroundColor: '#246D36',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
  },
  deliverButton: {
    backgroundColor: '#795548', // distinctive color for delivery confirmation as seen in UI
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
