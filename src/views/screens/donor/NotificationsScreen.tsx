import React, { useState } from 'react';
import {View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity} from 'react-native';
import {useThemeStore, getColors, theme} from '../../../config/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTranslation } from 'react-i18next';

export const NotificationsScreen = () => {
  const { t } = useTranslation();
  const isDark = useThemeStore(s => s.isDark);
  const colors = getColors(isDark);
  const [filter, setFilter] = useState<'all' | 'new'>('all');
  const mockAlerts = [
    {
      id: '1',
      type: 'delivered',
      title: 'Donation Delivered!',
      body: 'Your donation of Fresh Vegetables has been delivered to Al-Bir Charity',
      time: '2 mins ago',
      unread: true,
    },
    {
      id: '2',
      type: 'accepted',
      title: 'Donation Accepted',
      body: 'Food Bank SA accepted your donation of Packaged Rice & Pasta',
      time: '2 mins ago',
      unread: true,
    },
    {
      id: '3',
      type: 'urgent',
      title: 'Urgent Pickup Needed',
      body: 'Your bread donation is expiring soon. We\'re finding a charity nearby.',
      time: '1 hr ago',
      unread: false,
    },
    {
      id: '4',
      type: 'volunteer',
      title: 'Volunteer Assigned',
      body: 'Ahmed will pick up your donation at 4:30 PM',
      time: '1 day ago',
      unread: false,
    },
  ];

  const displayedAlerts = filter === 'new' ? mockAlerts.filter(a => a.unread) : mockAlerts;

  const getIconProps = (type: string) => {
    switch (type) {
      case 'delivered':
        return {name: 'check-circle-outline', color: colors.primary, bg: colors.iconGreen};
      case 'accepted':
        return {name: 'file-document-outline', color: '#1976D2', bg: colors.iconBlue};
      case 'urgent':
        return {name: 'alert-circle-outline', color: colors.warning, bg: '#FFF3E0'};
      case 'volunteer':
        return {name: 'clock-outline', color: '#1976D2', bg: colors.iconBlue};
      default:
        return {name: 'bell-outline', color: colors.textSecondary, bg: colors.iconBlue};
    }
  };

  const renderItem = ({item}: {item: any}) => {
    const iconProps = getIconProps(item.type);

    return (
      <View style={[styles.card, {backgroundColor: colors.surface, borderColor: colors.border}]}>
        <View style={styles.cardHeader}>
          <View style={[styles.iconContainer, {backgroundColor: iconProps.bg}]}>
            <Icon name={iconProps.name} size={22} color={iconProps.color} />
          </View>
          <View style={styles.textContent}>
            <View style={styles.titleRow}>
              <Text style={[styles.title, {color: colors.text}]}>{item.title}</Text>
              {item.unread && <View style={[styles.unreadDot, {backgroundColor: colors.primary}]} />}
            </View>
            <Text style={[styles.body, {color: colors.textSecondary}]}>{item.body}</Text>
            <Text style={styles.time}>{item.time}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: colors.background}]}>
      <View style={[styles.header, {borderBottomColor: colors.border}]}>
        <Text style={[styles.headerTitle, {color: colors.text}]}>{t('alerts')}</Text>
      </View>

      <View style={styles.filterTabs}>
        <TouchableOpacity 
          style={[styles.filterTab, {backgroundColor: colors.iconBlue}, filter === 'all' && {backgroundColor: colors.primary}]}
          onPress={() => setFilter('all')}>
          <Text style={[styles.filterTabText, filter === 'all' && styles.filterTabTextActive]}>{t('all_alerts')}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterTab, {backgroundColor: colors.iconBlue}, filter === 'new' && {backgroundColor: colors.primary}]}
          onPress={() => setFilter('new')}>
          <Text style={[styles.filterTabText, filter === 'new' && styles.filterTabTextActive]}>{t('new_alerts')}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={displayedAlerts}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
  },
  filterTabs: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
  },
  filterTab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: theme.borderRadius.round,
    marginRight: theme.spacing.sm,
    backgroundColor: theme.colors.iconBlue,
  },
  filterTabActive: {
    backgroundColor: theme.colors.primary,
  },
  filterTabText: {
    color: '#1976D2',
    fontWeight: '600',
  },
  filterTabTextActive: {
    color: theme.colors.surface,
  },
  list: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 2},
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: theme.borderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  textContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.text,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
  },
  body: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginBottom: 8,
    lineHeight: 18,
  },
  time: {
    fontSize: 12,
    color: '#A0A0A5',
  },
});

