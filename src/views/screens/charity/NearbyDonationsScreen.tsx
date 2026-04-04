import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView} from 'react-native';
import {useDonationStore} from '../../../controllers/useDonationStore';
import {theme, useThemeStore, getColors} from '../../../config/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MapView, {Marker} from 'react-native-maps';
import { useTranslation } from 'react-i18next';
import firestore from '@react-native-firebase/firestore';

export const NearbyDonationsScreen = ({navigation}: any) => {
  const {donations, listenToDonations} = useDonationStore();

  useEffect(() => {
    const unsub = listenToDonations();
    return unsub;
  }, []);
  const [activeFilter, setActiveFilter] = useState('All');
  const [donorNames, setDonorNames] = useState<Record<string, string>>({});
  const {t} = useTranslation();
  const isDark = useThemeStore(s => s.isDark);
  const colors = getColors(isDark);

  // Fetch donor names for all visible donations
  useEffect(() => {
    const fetchDonorNames = async () => {
      const uniqueIds = [...new Set(donations.map(d => d.donorId).filter(Boolean))];
      const idsToFetch = uniqueIds.filter(id => !donorNames[id]);
      if (idsToFetch.length === 0) return;

      const newNames: Record<string, string> = {};
      for (const id of idsToFetch) {
        try {
          const doc = await firestore().collection('users').doc(id).get();
          newNames[id] = doc.data()?.name || 'Donor';
        } catch {
          newNames[id] = 'Donor';
        }
      }
      setDonorNames(prev => ({...prev, ...newNames}));
    };
    fetchDonorNames();
  }, [donations]);

  const filters = ['All', 'Urgent', 'Near You'];

  // Filter available sorting by SOS first, then simulate distance
  let availableDonations = donations.filter(d => d.status === 'Created' || d.status === 'In Transit' || d.status === 'Accepted');
  if (activeFilter === 'Urgent') {
    availableDonations = availableDonations.filter(d => d.isSOS);
  }
  availableDonations = availableDonations.sort((a, b) => (a.isSOS === b.isSOS ? 0 : a.isSOS ? -1 : 1));

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.topBar}>
        <Text style={[styles.headerTitle, {color: colors.text}]}>{t('nearby_donations') || 'Nearby Donations'}</Text>
        <TouchableOpacity>
          <Icon name="filter-variant" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={[styles.mapPlaceholder, {borderColor: colors.border}]}>
        <MapView
          style={{flex: 1, borderRadius: theme.borderRadius.lg}}
          initialRegion={{
            latitude: 24.7136,
            longitude: 46.6753,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}
          userInterfaceStyle={isDark ? 'dark' : 'light'}
        >
          {availableDonations.map(donation => (
            donation.location ? (
              <Marker
                key={donation.id}
                coordinate={donation.location}
                title={donation.title}
                description={donation.foodType}
                pinColor={donation.isSOS ? theme.colors.warning : theme.colors.primary}
              />
            ) : null
          ))}
        </MapView>
      </View>

      {/* Filter Pills */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {filters.map(f => {
            const isActive = activeFilter === f;
            return (
              <TouchableOpacity
                key={f}
                style={[
                  styles.filterPill, 
                  {backgroundColor: colors.surface, borderColor: colors.border},
                  isActive && {backgroundColor: colors.primary, borderColor: colors.primary}
                ]}
                onPress={() => setActiveFilter(f)}>
                <Text style={[
                  styles.filterText, {color: colors.textSecondary},
                  isActive && {color: '#FFFFFF'}
                ]}>
                  {f === 'All' ? (t('filter_all') || 'All') : f}
                </Text>
              </TouchableOpacity>
            )
          })}
        </ScrollView>
      </View>

      <Text style={[styles.sectionTitle, {color: colors.text}]}>Recent Listings</Text>
    </View>
  );

  const renderItem = ({item}: {item: any}) => (
    <TouchableOpacity
      style={[styles.card, {backgroundColor: colors.surface, borderColor: colors.border}]}
      onPress={() => navigation.navigate('CharityDonationDetails', {id: item.id})}>
      
      <View style={styles.cardHeader}>
        <View style={styles.titleRow}>
          {item.isSOS && <View style={styles.sosDot} />}
          <Text style={[styles.title, {color: colors.text}]} numberOfLines={1}>{item.title}</Text>
        </View>
        <View style={styles.distanceBadge}>
          <Text style={[styles.distanceText, {color: colors.text}]}>0.8 km</Text>
          <Text style={[styles.distanceSub, {color: colors.textSecondary}]}>away</Text>
        </View>
      </View>
      
      <Text style={[styles.subtitle, {color: colors.textSecondary}]}>{donorNames[item.donorId] || 'Donor'}</Text>

      <View style={styles.tagsRow}>
        <View style={[styles.tag, {backgroundColor: colors.inputBackground}]}>
          <Icon name="scale-balance" size={14} color={colors.textSecondary} style={{marginRight: 4}} />
          <Text style={[styles.tagText, {color: colors.textSecondary}]}>{item.quantity}</Text>
        </View>
        <View style={[styles.tag, {backgroundColor: colors.inputBackground}, item.isSOS && styles.sosTag]}>
          <Icon name="clock-outline" size={14} color={item.isSOS ? theme.colors.warning : colors.textSecondary} style={{marginRight: 4}} />
          <Text style={[styles.tagText, {color: colors.textSecondary}, item.isSOS && {color: theme.colors.warning, fontWeight: '600'}]}>
            {item.isSOS ? '2 hours' : '24 hours'}
          </Text>
        </View>
      </View>
      
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: colors.background}]}>
      <FlatList
        data={availableDonations}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={[styles.emptyText, {color: colors.textSecondary}]}>No available donations nearby.</Text>
          </View>
        }
      />
    </SafeAreaView>
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
    marginBottom: theme.spacing.lg,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  mapPlaceholder: {
    height: 160,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    overflow: 'hidden'
  },
  filterContainer: {
    marginBottom: theme.spacing.xl,
    flexDirection: 'row',
  },
  filterPill: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: theme.borderRadius.round,
    borderWidth: 1,
    marginRight: theme.spacing.sm,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: theme.spacing.md,
  },
  card: {
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 2},
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 16,
  },
  sosDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.warning,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  distanceBadge: {
    alignItems: 'flex-end',
  },
  distanceText: {
    fontSize: 15,
    fontWeight: '700',
  },
  distanceSub: {
    fontSize: 11,
  },
  subtitle: {
    fontSize: 13,
    marginBottom: theme.spacing.md,
  },
  tagsRow: {
    flexDirection: 'row',
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.md,
    marginRight: 12,
  },
  sosTag: {
    backgroundColor: '#FFF3E0',
  },
  tagText: {
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
