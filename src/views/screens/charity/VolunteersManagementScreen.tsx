import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView} from 'react-native';
import {theme, useThemeStore, getColors} from '../../../config/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTranslation } from 'react-i18next';
import firestore from '@react-native-firebase/firestore';
import Toast from 'react-native-toast-message';

export const VolunteersManagementScreen = () => {
  const {t, i18n} = useTranslation();
  const isDark = useThemeStore(s => s.isDark);
  const colors = getColors(isDark);

  const mockVolunteers = [
    {
      id: '1',
      name: 'Ahmed Al-Rashid',
      tasksCompleted: 157,
      rating: 4.8,
      status: 'Active',
      statusAr: 'نشط',
      distance: '1.2 km away',
    },
    {
      id: '2',
      name: 'Mohammed Al-Otaibi',
      tasksCompleted: 43,
      rating: 4.5,
      status: 'On Delivery',
      statusAr: 'في التوصيل',
      distance: '3.4 km away',
    },
    {
      id: '3',
      name: 'Fatima Al-Zahrani',
      tasksCompleted: 102,
      rating: 4.9,
      status: 'Available',
      statusAr: 'متاح',
      distance: '0.8 km away',
    },
  ];

  const [realVolunteers, setRealVolunteers] = useState<any[]>([]);

  useEffect(() => {
    const fetchVols = async () => {
      try {
        const snap = await firestore().collection('users').where('role', '==', 'volunteer').get();
        const vols = snap.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || 'New Volunteer',
            tasksCompleted: data.tasksCompleted || 0,
            rating: data.rating || 5.0,
            status: data.isAvailable ? 'Available' : 'Active',
            statusAr: data.isAvailable ? 'متاح' : 'نشط',
            distance: 'Unknown dist',
          };
        });
        setRealVolunteers(vols);
      } catch(e) {
        console.warn(e);
      }
    };
    fetchVols();
  }, []);

  const combinedData = [...mockVolunteers, ...realVolunteers];

  const handleInvite = () => {
    Toast.show({ 
      type: 'info', 
      text1: i18n.language === 'ar' ? 'تم نسخ الرابط' : 'Link Copied', 
      text2: i18n.language === 'ar' ? 'شارك هذا الرابط لدعوة متطوعين!' : 'Share this link to invite volunteers!',
      visibilityTime: 3000 
    });
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.topBar}>
        <Text style={[styles.headerTitle, {color: colors.text}]}>{t('volunteers') || 'Volunteers'}</Text>
        <TouchableOpacity>
          <Icon name="magnify" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={[styles.statsContainer, {backgroundColor: colors.surface, borderColor: colors.border}]}>
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, {color: colors.primary}]}>3</Text>
          <Text style={[styles.statLabel, {color: colors.textSecondary}]}>{t('available_volunteers') || 'Available'}</Text>
        </View>
        <View style={[styles.statDivider, {backgroundColor: colors.border}]} />
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, {color: colors.primary}]}>2</Text>
          <Text style={[styles.statLabel, {color: colors.textSecondary}]}>{t('filter_active') || 'Active'}</Text>
        </View>
        <View style={[styles.statDivider, {backgroundColor: colors.border}]} />
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, {color: colors.primary}]}>{combinedData.length}</Text>
          <Text style={[styles.statLabel, {color: colors.textSecondary}]}>{t('total_volunteers') || 'Total'}</Text>
        </View>
      </View>

      <TouchableOpacity style={[styles.inviteButton, {backgroundColor: colors.primary, shadowColor: colors.primary}]} onPress={handleInvite}>
        <Icon name="plus" size={20} color={'#FFF'} />
        <Text style={[styles.inviteButtonText, {color: '#FFF'}]}>{t('invite_volunteer') || 'Invite New Volunteer'}</Text>
      </TouchableOpacity>

      <Text style={[styles.sectionTitle, {color: colors.text}]}>{t('your_network') || 'Your Network'}</Text>
    </View>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
      case 'Available':
        return colors.primary;
      case 'On Delivery':
        return '#1976D2';
      default:
        return colors.textSecondary;
    }
  };

  const renderItem = ({item}: {item: any}) => (
    <View style={[styles.card, {backgroundColor: colors.surface, borderColor: colors.border}]}>
      <View style={[styles.avatar, {backgroundColor: colors.inputBackground}]}>
        <Text style={[styles.avatarLetter, {color: colors.textSecondary}]}>{item.name.charAt(0)}</Text>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={[styles.name, {color: colors.text}]}>{item.name}</Text>
          <Text style={[styles.status, {color: getStatusColor(item.status)}]}>
            {i18n.language === 'ar' ? item.statusAr : item.status}
          </Text>
        </View>
        
        <Text style={[styles.subtext, {color: colors.textSecondary}]}>
          <Icon name="star" size={12} color={theme.colors.warning} /> {item.rating} • {item.tasksCompleted} deliveries
        </Text>
        
        <View style={styles.cardFooter}>
          <Text style={[styles.distanceText, {color: colors.textSecondary}]}>📍 {item.distance}</Text>
          <TouchableOpacity style={[styles.callButton, {backgroundColor: colors.primary}]}>
            <Icon name="phone" size={16} color={'#FFF'} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: colors.background}]}>
      <FlatList
        data={combinedData}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  list: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: 40,
  },
  headerContainer: {
    marginBottom: theme.spacing.lg,
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: theme.borderRadius.xl,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 2},
    elevation: 2,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: '100%',
  },
  inviteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: theme.borderRadius.round,
    marginBottom: theme.spacing.xxl,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 4},
    elevation: 4,
  },
  inviteButtonText: {
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
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 2},
    elevation: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  avatarLetter: {
    fontSize: 18,
    fontWeight: '600',
  },
  cardContent: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  status: {
    fontSize: 12,
    fontWeight: '700',
  },
  subtext: {
    fontSize: 13,
    marginBottom: theme.spacing.md,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  distanceText: {
    fontSize: 13,
    fontWeight: '500',
  },
  callButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.round,
  },
});
