import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, ScrollView} from 'react-native';
import {theme, useThemeStore, getColors} from '../../../config/theme';
import Toast from 'react-native-toast-message';
import {useAdminStore} from '../../../controllers/useAdminStore';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTranslation } from 'react-i18next';

export const UserManagementScreen = ({navigation}: any) => {
  const {t} = useTranslation();
  const isDark = useThemeStore(s => s.isDark);
  const colors = getColors(isDark);
  const [activeFilter, setActiveFilter] = useState('All');
  const filters = ['All', 'Pending', 'Active', 'Suspended'];

  const {
    users,
    startUsersListener,
    stopUsersListener,
    approveCharity,
    rejectCharity,
    suspendUser,
    restoreUser
  } = useAdminStore();

  useEffect(() => {
    startUsersListener();
    return () => {
      stopUsersListener();
    }
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await approveCharity(id);
      Toast.show({ type: 'success', text1: 'Success', text2: 'User approved!', visibilityTime: 3000 });
    } catch (e: any) {
      Toast.show({ type: 'error', text1: 'Error', text2: e.message || 'Failed to approve user', visibilityTime: 5000 });
    }
  };

  const handleSuspend = async (id: string) => {
    try {
      await suspendUser(id);
      Toast.show({ type: 'success', text1: 'Success', text2: 'User suspended!', visibilityTime: 3000 });
    } catch (e: any) {
      Toast.show({ type: 'error', text1: 'Error', text2: e.message || 'Failed to suspend user', visibilityTime: 5000 });
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectCharity(id);
      Toast.show({ type: 'success', text1: 'Success', text2: 'User rejected', visibilityTime: 3000 });
    } catch (e: any) {
      Toast.show({ type: 'error', text1: 'Error', text2: e.message || 'Failed to reject user', visibilityTime: 5000 });
    }
  };

  const handleRestore = async (id: string) => {
    try {
      await restoreUser(id);
      Toast.show({ type: 'success', text1: 'Success', text2: 'User account restored', visibilityTime: 3000 });
    } catch (e: any) {
      Toast.show({ type: 'error', text1: 'Error', text2: e.message || 'Failed to restore user', visibilityTime: 5000 });
    }
  };

  const filteredUsers = users.filter(u => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Pending') return u.status === 'pending' || u.status === 'pending_approval';
    if (activeFilter === 'Active') return u.status === 'active' || u.status === 'approved';
    if (activeFilter === 'Suspended') return u.status === 'suspended';
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': 
      case 'pending_approval': return colors.warning;
      case 'approved':
      case 'active': return colors.primary;
      case 'suspended': return colors.error;
      default: return colors.textSecondary;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'charity': return 'bank';
      case 'volunteer': return 'account-hard-hat';
      case 'donor': return 'account-heart';
      default: return 'account';
    }
  };

  const getFilterLabel = (f: string) => {
    switch(f) {
      case 'All': return t('filter_all');
      case 'Pending': return t('filter_pending');
      case 'Active': return t('filter_active');
      case 'Suspended': return t('filter_suspended');
      default: return f;
    }
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, {color: colors.text}]}>{t('user_management')}</Text>
        <TouchableOpacity>
          <Icon name="magnify" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Filter Pills */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {filters.map(f => (
            <TouchableOpacity
              key={f}
              style={[styles.filterPill, {backgroundColor: colors.surface, borderColor: colors.border}, activeFilter === f && {backgroundColor: colors.primary, borderColor: colors.primary}]}
              onPress={() => setActiveFilter(f)}>
              <Text style={[styles.filterText, {color: colors.textSecondary}, activeFilter === f && {color: colors.surface}]}>
                {getFilterLabel(f)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );

  const renderItem = ({item}: {item: any}) => (
    <View style={[styles.card, {backgroundColor: colors.surface, borderColor: colors.border}]}>
      <View style={styles.cardRow}>
        <View style={[styles.avatar, {backgroundColor: colors.inputBackground}]}>
          <Icon name={getTypeIcon(item.role || item.type)} size={24} color={colors.textSecondary} />
        </View>
        <View style={styles.userInfo}>
          <Text style={[styles.name, {color: colors.text}]}>{item.name}</Text>
          <View style={styles.typeStatusRow}>
            <Text style={[styles.type, {color: colors.textSecondary}]}>{(item.role || item.type || '').toUpperCase()}</Text>
            <Text style={styles.bullet}>•</Text>
            <Text style={[styles.status, {color: getStatusColor(item.status)}]}>
              {(item.status || 'unknown').toUpperCase()}
            </Text>
          </View>
        </View>
      </View>
      
      <View style={[styles.actionsRow, {borderTopColor: colors.inputBackground}]}>
        {item.status === 'pending' || item.status === 'pending_approval' ? (
          <>
            <TouchableOpacity style={[styles.rejectButton, {backgroundColor: colors.surface, borderColor: colors.border}]} onPress={() => handleReject(item.id)}>
              <Text style={[styles.rejectText, {color: colors.textSecondary}]}>{t('btn_reject')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.approveButton, {backgroundColor: colors.primary}]} onPress={() => handleApprove(item.id)}>
              <Text style={[styles.buttonText, {color: colors.surface}]}>{t('btn_approve')}</Text>
            </TouchableOpacity>
          </>
        ) : item.status !== 'suspended' ? (
          <TouchableOpacity style={styles.suspendButton} onPress={() => handleSuspend(item.id)}>
            <Text style={styles.suspendText}>{t('btn_suspend')}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.restoreButton} onPress={() => handleRestore(item.id)}>
            <Text style={styles.restoreText}>{t('btn_restore')}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: colors.background}]}>
      <FlatList
        data={filteredUsers}
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
  container: {
    flex: 1, 
    backgroundColor: theme.colors.background
  },
  list: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: 40,
  },
  headerContainer: {
    marginBottom: theme.spacing.sm,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  backButton: {
    padding: theme.spacing.xs,
    marginLeft: -theme.spacing.xs,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
  },
  filterContainer: {
    marginBottom: theme.spacing.md,
    flexDirection: 'row',
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginRight: theme.spacing.sm,
  },
  filterPillActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  filterTextActive: {
    color: theme.colors.surface,
  },
  card: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.inputBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  userInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  typeStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  type: {
    fontSize: 12,
    fontWeight: '500',
    color: theme.colors.textSecondary,
  },
  bullet: {
    marginHorizontal: 6,
    color: theme.colors.textSecondary,
    fontSize: 12,
  },
  status: {
    fontSize: 12,
    fontWeight: '700',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: theme.colors.inputBackground,
    paddingTop: theme.spacing.md,
  },
  approveButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: theme.borderRadius.round,
    marginLeft: theme.spacing.sm,
  },
  buttonText: {
    fontSize: 13,
    color: theme.colors.surface,
    fontWeight: '700',
  },
  rejectButton: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: theme.borderRadius.round,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  rejectText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  suspendButton: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: theme.borderRadius.round,
  },
  suspendText: {
    fontSize: 13,
    color: theme.colors.warning,
    fontWeight: '700',
  },
  restoreButton: {
    backgroundColor: theme.colors.iconBlue,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: theme.borderRadius.round,
  },
  restoreText: {
    fontSize: 13,
    color: '#1976D2',
    fontWeight: '700',
  },
});

