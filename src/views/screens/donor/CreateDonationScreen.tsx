import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Switch,
  ActivityIndicator,
  PermissionsAndroid
} from 'react-native';
import {theme, useThemeStore, getColors} from '../../../config/theme';
import {useDonationStore} from '../../../controllers/useDonationStore';
import {useAuthStore} from '../../../controllers/useAuthStore';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Toast from 'react-native-toast-message';
import { analyzeFoodImage } from '../../../services/visionApi';
import { useTranslation } from 'react-i18next';

export const CreateDonationScreen = ({navigation, route}: any) => {
  const { t } = useTranslation();
  const isDark = useThemeStore(s => s.isDark);
  const colors = getColors(isDark);
  
  const {addDonation, updateDonation, donations} = useDonationStore();
  const {user} = useAuthStore();

  const editId = route?.params?.editDonationId;
  const isEdit = !!editId;

  const [title, setTitle] = useState('');
  const [quantity, setQuantity] = useState('');
  const [bestBefore, setBestBefore] = useState('');
  const [isSOS, setIsSOS] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [isClassifying, setIsClassifying] = useState(false);

  useEffect(() => {
    if (isEdit) {
      const target = donations.find(d => d.id === editId);
      if (target) {
        setTitle(target.title);
        setQuantity(target.quantity);
        setBestBefore('2');
        setIsSOS(target.isSOS);
        setImageUrl(target.imageUrl || null);
      }
    }
  }, [isEdit, editId, donations]);

  const requestStoragePermission = async () => {
    if (Platform.OS !== 'android') return true;
    try {
      const apiLevel = Platform.Version;
      if (typeof apiLevel === 'number' && apiLevel >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          {
            title: 'Photo Access',
            message: 'This app needs access to your photos to upload food images.',
            buttonPositive: 'Allow',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'Photo Access',
            message: 'This app needs access to your photos to upload food images.',
            buttonPositive: 'Allow',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
    } catch (err) {
      console.warn('Permission error:', err);
      return false;
    }
  };

  const handleCaptureImage = async () => {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      Toast.show({ type: 'error', text1: 'Permission Denied', text2: 'Please allow photo access in your device settings.', visibilityTime: 5000 });
      return;
    }
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        includeBase64: true,
        selectionLimit: 1,
      });
      handleImageResponse(result);
    } catch (error) {
      console.error('Image picker error:', error);
      Toast.show({ type: 'error', text1: 'Error', text2: 'Could not open photo gallery', visibilityTime: 5000 });
    }
  };

  const handleImageResponse = async (response: any) => {
    if (response.didCancel || response.errorCode) return;

    if (response.assets && response.assets.length > 0) {
      const asset = response.assets[0];
      setImageUrl(asset.uri);
      
      if (asset.base64) {
        setBase64Image(`data:${asset.type || 'image/jpeg'};base64,${asset.base64}`);
        setIsClassifying(true);
        try {
          const { description, allLabels } = await analyzeFoodImage(asset.base64);
          setTitle(description);

          // Auto-SOS Detection Logic
          const RISK_KEYWORDS = ['mold', 'rot', 'decay', 'withered', 'overripe', 'stale', 'spoil', 'wilt', 'browning'];
          const isAtRisk = allLabels.some(label => 
            RISK_KEYWORDS.some(keyword => label.toLowerCase().includes(keyword))
          );

          if (isAtRisk) {
            setIsSOS(true);
            setBestBefore('1');
            Toast.show({
              type: 'info',
              text1: 'Urgency Detected', // "Premium" sounding title
              text2: 'Auto-enabled SOS mode for fresh/urgent pickup.',
              visibilityTime: 5000,
            });
          }
        } catch (error) {
          console.log('Vision API failed:', error);
          Toast.show({ type: 'error', text1: 'Classification Failed', text2: 'Could not auto-detect the food type. Please enter it manually.', visibilityTime: 5000 });
        } finally {
          setIsClassifying(false);
        }
      }
    }
  };


  const handleSubmit = async () => {
    if (title && quantity && bestBefore) {
      try {
        const days = parseInt(bestBefore) || 2;
        const expiryDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * days).toISOString();

        if (isEdit) {
          await updateDonation(editId, {
            title,
            foodType: title,
            quantity,
            isSOS,
            expiryDate,
          });
          Toast.show({ type: 'success', text1: 'Success', text2: 'Donation updated successfully.', visibilityTime: 3000 });
          navigation.goBack();
        } else {
          await addDonation({
            donorId: user?.id || 'mock-id-123',
            title,
            foodType: title,
            quantity,
            isSOS,
            imageUrl: base64Image || undefined,
            location: {latitude: 24.7136, longitude: 46.6753},
            expiryDate: expiryDate,
          });
          navigation.goBack();
          navigation.navigate('Donations');
        }
      } catch (e: any) {
        Toast.show({ type: 'error', text1: 'Error', text2: e.message, visibilityTime: 5000 });
      }
    } else {
      Toast.show({ type: 'error', text1: 'Missing Fields', text2: 'Please fill in all required fields.', visibilityTime: 5000 });
    }
  };

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: colors.background}]}>
      <KeyboardAvoidingView 
        style={{flex: 1}} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-left" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, {color: colors.text}]}>{isEdit ? t('edit_donation') : t('new_donation')}</Text>
          <View style={{width: 24}} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.section}>
            <Text style={[styles.label, {color: colors.text}]}>{t('food_photo')}</Text>
            <TouchableOpacity style={[styles.photoBox, {backgroundColor: colors.inputBackground, borderColor: colors.border}]} onPress={handleCaptureImage} activeOpacity={0.8}>
              {imageUrl ? (
                <>
                  <Image source={{uri: imageUrl}} style={styles.previewImage} />
                  {isClassifying && (
                    <View style={styles.classifyingOverlay}>
                      <ActivityIndicator size="large" color={colors.surface} />
                      <Text style={[styles.classifyingText, {color: colors.surface}]}>Analyzing...</Text>
                    </View>
                  )}
                </>
              ) : (
                <View style={styles.photoPlaceholder}>
                  <View style={[styles.iconCircle, {backgroundColor: colors.iconGreen}]}>
                    <Icon name="camera-outline" size={28} color={colors.primary} />
                  </View>
                  <Text style={[styles.photoText, {color: colors.textSecondary}]}>{t('take_photo')}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, {color: colors.text}]}>{t('what_donating')}</Text>
              <TextInput
                style={[styles.input, {backgroundColor: colors.surface, color: colors.text, borderColor: colors.border}]}
                placeholder={t('eg_vegetables')}
                placeholderTextColor={colors.textSecondary}
                value={title}
                onChangeText={setTitle}
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, {flex: 1, marginRight: theme.spacing.md}]}>
                <Text style={[styles.label, {color: colors.text}]}>{t('quantity')}</Text>
                <View style={[styles.inputWithIcon, {backgroundColor: colors.surface, borderColor: colors.border}]}>
                  <Icon name="scale-balance" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.innerInput, {color: colors.text}]}
                    placeholder="15 kg"
                    placeholderTextColor={colors.textSecondary}
                    value={quantity}
                    onChangeText={setQuantity}
                  />
                </View>
              </View>

              <View style={[styles.inputGroup, {flex: 1}]}>
                <Text style={[styles.label, {color: colors.text}]}>{t('best_before')}</Text>
                <View style={[styles.inputWithIcon, {backgroundColor: colors.surface, borderColor: colors.border}]}>
                  <Icon name="clock-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.innerInput, {color: colors.text}]}
                    placeholder="2"
                    keyboardType="numeric"
                    placeholderTextColor={colors.textSecondary}
                    value={bestBefore}
                    onChangeText={setBestBefore}
                  />
                </View>
              </View>
            </View>

            <View style={[styles.sosContainer, {backgroundColor: colors.surface, borderColor: colors.border}]}>
              <View style={{flex: 1}}>
                <Text style={[styles.label, {color: colors.text}]}>{t('mark_sos')}</Text>
                <Text style={[styles.subtitleSmall, {color: colors.textSecondary}]}>{t('sos_desc')}</Text>
              </View>
              <Switch
                trackColor={{ false: colors.border, true: colors.warning }}
                thumbColor={colors.surface}
                onValueChange={setIsSOS}
                value={isSOS}
              />
            </View>
          </View>

        </ScrollView>
        
        <View style={[styles.footer, {backgroundColor: colors.background}]}>
          <TouchableOpacity style={[styles.submitButton, {backgroundColor: colors.primary, shadowColor: colors.primary}]} onPress={handleSubmit}>
            <Text style={[styles.submitButtonText, {color: colors.surface}]}>{isEdit ? t('save_changes') : t('post_donation')}</Text>
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
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
    color: theme.colors.text,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: 40,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    marginLeft: 4,
  },
  photoBox: {
    height: 180,
    backgroundColor: theme.colors.inputBackground,
    borderRadius: theme.borderRadius.xl,
    borderWidth: 2,
    borderColor: '#EFEFF4',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  photoPlaceholder: {
    alignItems: 'center',
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.iconGreen,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  photoText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  formContainer: {
    marginBottom: theme.spacing.xl,
  },
  inputGroup: {
    marginBottom: theme.spacing.lg,
  },
  input: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderRadius: theme.borderRadius.lg,
    fontSize: 15,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  row: {
    flexDirection: 'row',
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 16,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  inputIcon: {
    marginRight: 8,
  },
  innerInput: {
    flex: 1,
    paddingVertical: 18,
    fontSize: 15,
    color: theme.colors.text,
  },
  footer: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
    paddingTop: theme.spacing.md,
    backgroundColor: theme.colors.background,
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 18,
    borderRadius: theme.borderRadius.round,
    alignItems: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.surface,
  },
  classifyingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  classifyingText: {
    color: theme.colors.surface,
    marginTop: 8,
    fontWeight: '600',
  },
  sosContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    marginTop: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  subtitleSmall: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
    marginLeft: 4,
  }
});
