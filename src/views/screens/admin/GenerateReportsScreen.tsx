import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert, SafeAreaView, ScrollView} from 'react-native';
import {theme, useThemeStore, getColors} from '../../../config/theme';
import Toast from 'react-native-toast-message';
import {useAdminStore} from '../../../controllers/useAdminStore';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTranslation } from 'react-i18next';

export const GenerateReportsScreen = ({navigation}: any) => {
  const {t} = useTranslation();
  const isDark = useThemeStore(s => s.isDark);
  const colors = getColors(isDark);
  const {generateReport} = useAdminStore();

  const handleGenerate = async (format: string) => {
    try {
      Toast.show({ type: 'info', text1: 'Download Started', text2: `Compiling data for ${format} report...`, visibilityTime: 3000 });
      const start = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
      const end = new Date().toISOString();
      await generateReport(format.toLowerCase() as 'csv'|'pdf', {start, end});
    } catch (e: any) {
      Toast.show({ type: 'error', text1: 'Export Error', text2: e.message, visibilityTime: 5000 });
    }
  };

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: colors.background}]}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-left" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, {color: colors.text}]}>{t('system_reports_title')}</Text>
          <View style={{width: 24}} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.titleSection}>
          <Text style={[styles.title, {color: colors.text}]}>{t('monthly_overview')}</Text>
          <Text style={[styles.subtitle, {color: colors.textSecondary}]}>{t('export_desc')}</Text>
        </View>

        {/* Mock Chart Area */}
        <View style={[styles.chartCard, {backgroundColor: colors.surface, borderColor: colors.border}]}>
          <View style={styles.chartHeader}>
            <Text style={[styles.chartTitle, {color: colors.text}]}>Food Saved (kg)</Text>
            <TouchableOpacity>
              <Icon name="dots-horizontal" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
          
          <View style={[styles.pseudoChart, {borderBottomColor: colors.inputBackground}]}>
            {/* Just a stylized representation of a bar chart */}
            {[40, 70, 45, 90, 60, 110, 85].map((h, i) => (
              <View key={i} style={styles.barContainer}>
                <View style={[styles.chartBar, {height: h, opacity: i === 6 ? 1 : 0.6, backgroundColor: colors.primary}]} />
                <Text style={[styles.barLabel, {color: colors.textSecondary}]}>{['M','T','W','T','F','S','S'][i]}</Text>
              </View>
            ))}
          </View>
          
          <View style={styles.chartFooter}>
            <View>
              <Text style={[styles.chartTotal, {color: colors.text}]}>15,240 kg</Text>
              <Text style={[styles.chartSubtext, {color: colors.textSecondary}]}>Total This Month</Text>
            </View>
            <View style={[styles.growthBadge, {backgroundColor: colors.iconGreen}]}>
              <Icon name="trending-up" size={16} color={colors.primary} />
              <Text style={[styles.growthText, {color: colors.primary}]}>+12.5%</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <Text style={[styles.sectionTitle, {color: colors.text}]}>Export Options</Text>

        <TouchableOpacity
          style={[styles.exportCard, {backgroundColor: colors.surface, borderColor: colors.border}]}
          onPress={() => handleGenerate('PDF')}
          activeOpacity={0.7}>
          <View style={[styles.exportIconBox, {backgroundColor: isDark ? '#4A0000' : '#FFEBEE'}]}>
            <Icon name="file-pdf-box" size={32} color="#D32F2F" />
          </View>
          <View style={styles.exportContent}>
            <Text style={[styles.exportTitle, {color: colors.text}]}>{t('export_pdf')}</Text>
            <Text style={[styles.exportBody, {color: colors.textSecondary}]}>{t('export_pdf_desc')}</Text>
          </View>
          <Icon name="download" size={24} color={colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.exportCard, {backgroundColor: colors.surface, borderColor: colors.border}]}
          onPress={() => handleGenerate('CSV')}
          activeOpacity={0.7}>
          <View style={[styles.exportIconBox, {backgroundColor: isDark ? '#1A3320' : '#E8F5E9'}]}>
            <Icon name="file-excel-box" size={32} color="#388E3C" />
          </View>
          <View style={styles.exportContent}>
            <Text style={[styles.exportTitle, {color: colors.text}]}>{t('export_csv')}</Text>
            <Text style={[styles.exportBody, {color: colors.textSecondary}]}>{t('export_csv_desc')}</Text>
          </View>
          <Icon name="download" size={24} color={colors.textSecondary} />
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: 40,
  },
  titleSection: {
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: theme.colors.textSecondary,
    lineHeight: 22,
  },
  chartCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.xl,
    marginBottom: theme.spacing.xxl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 2},
    elevation: 2,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
  pseudoChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 140,
    marginBottom: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.inputBackground,
    paddingBottom: theme.spacing.md,
  },
  barContainer: {
    alignItems: 'center',
  },
  chartBar: {
    width: 24,
    backgroundColor: theme.colors.primary,
    borderRadius: 6,
    marginBottom: 8,
  },
  barLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  chartFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  chartTotal: {
    fontSize: 24,
    fontWeight: '800',
    color: theme.colors.text,
    marginBottom: 2,
  },
  chartSubtext: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  growthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.iconGreen,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },
  growthText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.primary,
    marginLeft: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  exportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  exportIconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  exportContent: {
    flex: 1,
    paddingRight: theme.spacing.md,
  },
  exportTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  exportBody: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
});

