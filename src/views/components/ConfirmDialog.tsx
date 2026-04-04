import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme, useThemeStore, getColors } from '../../config/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTranslation } from 'react-i18next';

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDestructive?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  visible,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  isDestructive = false
}) => {
  const { t, i18n } = useTranslation();
  const isDark = useThemeStore(s => s.isDark);
  const colors = getColors(isDark);
  const isAr = i18n.language === 'ar';

  if (!visible) return null;

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={[styles.dialogContainer, { backgroundColor: colors.surface }]}>
          <View style={styles.iconContainer}>
            <View style={[styles.iconCircle, { backgroundColor: isDestructive ? '#FFEBEE' : '#E3F2FD' }]}>
              <Icon 
                name={isDestructive ? 'alert-circle-outline' : 'help-circle-outline'} 
                size={36} 
                color={isDestructive ? theme.colors.error : theme.colors.primary} 
              />
            </View>
          </View>
          
          <Text style={[styles.title, { color: colors.text, textAlign: isAr ? 'right' : 'center' }]}>{title}</Text>
          <Text style={[styles.message, { color: colors.textSecondary, textAlign: isAr ? 'right' : 'center' }]}>{message}</Text>
          
          <View style={[styles.buttonRow, isAr && { flexDirection: 'row-reverse' }]}>
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton, { borderColor: colors.border }]} 
              onPress={onCancel}
              activeOpacity={0.7}
            >
              <Text style={[styles.cancelText, { color: colors.textSecondary }]}>
                {cancelText || (isAr ? 'إلغاء' : 'Cancel')}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.confirmButton, { backgroundColor: isDestructive ? theme.colors.error : theme.colors.primary }]} 
              onPress={onConfirm}
              activeOpacity={0.7}
            >
              <Text style={styles.confirmText}>
                {confirmText || (isAr ? 'تأكيد' : 'Confirm')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  dialogContainer: {
    width: '100%',
    borderRadius: theme.borderRadius.xl,
    padding: 24,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  iconContainer: {
    marginBottom: 16,
    alignItems: 'center',
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  message: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: theme.borderRadius.lg,
  },
  cancelButton: {
    marginRight: 8,
    borderWidth: 1,
  },
  confirmButton: {
    marginLeft: 8,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
  },
  confirmText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
