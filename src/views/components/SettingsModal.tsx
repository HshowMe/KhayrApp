import React, {useState} from 'react';
import {Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, I18nManager} from 'react-native';
import Toast from 'react-native-toast-message';
import {theme, useThemeStore, getColors} from '../../config/theme';
import {useAuthStore} from '../../controllers/useAuthStore';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTranslation} from 'react-i18next';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
}

export const SettingsModal = ({visible, onClose, title}: SettingsModalProps) => {
  const {user, updateUser} = useAuthStore();
  const {t} = useTranslation();
  const isDark = useThemeStore(s => s.isDark);
  const colors = getColors(isDark);
  const isRTL = I18nManager.isRTL;
  const rtlStyle = {writingDirection: isRTL ? 'rtl' : 'auto', textAlign: isRTL ? 'right' : 'left'} as any;

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [operatingAreas, setOperatingAreas] = useState(user?.operatingAreas || '');

  const handleSave = async () => {
    try {
      if (!user) return;
      const updateData: any = {
        name,
        phone,
      };
      if (user.role === 'charity') {
        updateData.address = address;
        updateData.operatingAreas = operatingAreas;
      }
      await updateUser(updateData);
      Toast.show({ type: 'success', text1: t('save_changes'), text2: t('save_changes'), visibilityTime: 3000 });
      onClose();
    } catch (e: any) {
      Toast.show({ type: 'error', text1: 'Error', text2: e.message, visibilityTime: 5000 });
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={[styles.container, {backgroundColor: colors.background}]}>
        <View style={[styles.header]}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Icon name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, {color: colors.text}, rtlStyle]}>{title}</Text>
          <View style={{width: 24}} />
        </View>

        <View style={styles.content}>
          <Text style={[styles.label, {color: colors.text}, rtlStyle]}>{t('name_org')}</Text>
          <TextInput
            style={[styles.input, {backgroundColor: colors.surface, borderColor: colors.border, color: colors.text}]}
            value={name}
            onChangeText={setName}
            placeholderTextColor={colors.textSecondary}
            textAlign={isRTL ? 'right' : 'left'}
          />

          <Text style={[styles.label, {color: colors.text}, rtlStyle]}>{t('phone_number')}</Text>
          <TextInput
            style={[styles.input, {backgroundColor: colors.surface, borderColor: colors.border, color: colors.text}]}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholderTextColor={colors.textSecondary}
            textAlign={isRTL ? 'right' : 'left'}
          />

          {user?.role === 'charity' && (
            <>
              <Text style={[styles.label, {color: colors.text}, rtlStyle]}>{t('address')}</Text>
              <TextInput
                style={[styles.input, {backgroundColor: colors.surface, borderColor: colors.border, color: colors.text}]}
                value={address}
                onChangeText={setAddress}
                placeholderTextColor={colors.textSecondary}
                textAlign={isRTL ? 'right' : 'left'}
              />

              <Text style={[styles.label, {color: colors.text}, rtlStyle]}>{t('operating_areas')}</Text>
              <TextInput
                style={[styles.input, {backgroundColor: colors.surface, borderColor: colors.border, color: colors.text}]}
                value={operatingAreas}
                onChangeText={setOperatingAreas}
                placeholder={t('operating_areas_val')}
                placeholderTextColor={colors.textSecondary}
                textAlign={isRTL ? 'right' : 'left'}
              />
            </>
          )}

          <Text style={[styles.label, {color: colors.text}, rtlStyle]}>{t('email_readonly')}</Text>
          <TextInput
            style={[styles.input, {backgroundColor: colors.surface, borderColor: colors.border, color: colors.text, opacity: 0.5}]}
            value={user?.email}
            editable={false}
            textAlign={isRTL ? 'right' : 'left'}
          />

          <TouchableOpacity style={[styles.saveButton, {backgroundColor: colors.primary}]} onPress={handleSave}>
            <Text style={[styles.saveButtonText, {color: colors.surface}, rtlStyle]}>{t('save_changes')}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  header: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: theme.spacing.lg},
  closeButton: {padding: theme.spacing.xs, marginLeft: -theme.spacing.xs},
  headerTitle: {fontSize: 18, fontWeight: '700'},
  content: {padding: theme.spacing.lg},
  label: {fontSize: 13, fontWeight: '600', marginBottom: theme.spacing.sm, marginTop: theme.spacing.md},
  input: {padding: 16, borderRadius: theme.borderRadius.lg, borderWidth: 1, fontSize: 15},
  saveButton: {padding: 18, borderRadius: theme.borderRadius.round, alignItems: 'center', marginTop: theme.spacing.xl},
  saveButtonText: {fontSize: 16, fontWeight: '700'},
});
