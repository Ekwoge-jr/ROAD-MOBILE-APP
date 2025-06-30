import React, { useState, useRef, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Switch, 
  Platform,
  ScrollView,
  Animated,
  SafeAreaView,
  StatusBar,
  Alert,
  Linking
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiService } from '../services/ApiService';
import { t } from '../utils/translate';

interface SettingOption {
  id: string;
  title: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  type: 'toggle' | 'navigation' | 'selector';
  value?: boolean | string;
  onPress?: () => void;
}

interface UserSettings {
  notificationsEnabled: boolean;
  language: string;
  voiceEnabled: boolean;
  darkMode: boolean;
  autoLocation: boolean;
}

export default function SettingsScreen() {
  const router = useRouter();
  const apiService = new ApiService();
  
  // Settings state
  const [settings, setSettings] = useState<UserSettings>({
    notificationsEnabled: true,
    language: 'English',
    voiceEnabled: false,
    darkMode: false,
    autoLocation: true
  });

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'fr'>('en');

  const scaleAnims = useRef([
    new Animated.Value(1),
    new Animated.Value(1),
    new Animated.Value(1),
    new Animated.Value(1),
    new Animated.Value(1),
    new Animated.Value(1),
    new Animated.Value(1)
  ]).current;

  // Load settings from storage
  useEffect(() => {
    loadSettings();
    loadUserData();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('userSettings');
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(parsedSettings);
        
        // Set current language for translation
        if (parsedSettings.language === 'French') {
          setCurrentLanguage('fr');
        } else {
          setCurrentLanguage('en');
        }
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const loadUserData = async () => {
    try {
      const userData = await apiService.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const saveSettings = async (newSettings: UserSettings) => {
    try {
      await AsyncStorage.setItem('userSettings', JSON.stringify(newSettings));
      setSettings(newSettings);
      
      // Update current language for translation
      if (newSettings.language === 'French') {
        setCurrentLanguage('fr');
      } else {
        setCurrentLanguage('en');
      }
      
      // Update user preferences on server
      if (user) {
        await apiService.updateUserPreferences({
          notifications_enabled: newSettings.notificationsEnabled,
          language: newSettings.language,
          voice_enabled: newSettings.voiceEnabled,
          auto_location: newSettings.autoLocation
        });
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      Alert.alert(t('error', currentLanguage), t('failedToSaveSettings', currentLanguage));
    }
  };

  const animatePress = (index: number) => {
    Animated.sequence([
      Animated.timing(scaleAnims[index], {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnims[index], {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleLanguageSelect = () => {
    Alert.alert(
      t('selectLanguage', currentLanguage),
      t('chooseLanguage', currentLanguage),
      [
        { text: t('english', currentLanguage), onPress: () => updateSetting('language', 'English') },
        { text: t('french', currentLanguage), onPress: () => updateSetting('language', 'French') },
        { text: t('spanish', currentLanguage), onPress: () => updateSetting('language', 'Spanish') },
        { text: t('cancel', currentLanguage), style: 'cancel' }
      ]
    );
  };

  const updateSetting = (key: keyof UserSettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    saveSettings(newSettings);
  };

  const handleToggle = async (optionId: string, value: boolean) => {
    setLoading(true);
    try {
      switch (optionId) {
        case 'notifications':
          updateSetting('notificationsEnabled', value);
          break;
        case 'voice':
          updateSetting('voiceEnabled', value);
          break;
        case 'darkMode':
          updateSetting('darkMode', value);
          break;
        case 'autoLocation':
          updateSetting('autoLocation', value);
          break;
      }
    } catch (error) {
      console.error('Error updating setting:', error);
      Alert.alert(t('error', currentLanguage), t('failedToUpdateSetting', currentLanguage));
    } finally {
      setLoading(false);
    }
  };

  const handleNavigation = (screen: string) => {
    switch (screen) {
      case 'help':
        router.push('/HelpSupportScreen');
        break;
      case 'privacy':
        router.push('/PrivacyPolicyScreen');
        break;
      case 'about':
        router.push('/AboutScreen');
        break;
      case 'profile':
        router.push('/ProfileScreen');
        break;
      case 'account':
        router.push('/AccountSettingsScreen');
        break;
      case 'feedback':
        handleFeedback();
        break;
    }
  };

  const handleFeedback = () => {
    Alert.alert(
      t('sendFeedbackTitle', currentLanguage),
      t('sendFeedbackMessage', currentLanguage),
      [
        { text: t('email', currentLanguage), onPress: () => Linking.openURL('mailto:support@roadbro.com') },
        { text: t('rateApp', currentLanguage), onPress: () => Linking.openURL('https://play.google.com/store/apps/details?id=com.roadbro.app') },
        { text: t('cancel', currentLanguage), style: 'cancel' }
      ]
    );
  };

  const settingsSections = [
    {
      title: t('account', currentLanguage),
      options: [
        {
          id: 'profile',
          title: t('profileSettings', currentLanguage),
          icon: 'person' as const,
          type: 'navigation' as const,
          onPress: () => handleNavigation('profile')
        },
        {
          id: 'account',
          title: t('accountSecurity', currentLanguage),
          icon: 'security' as const,
          type: 'navigation' as const,
          onPress: () => handleNavigation('account')
        }
      ]
    },
    {
      title: t('preferences', currentLanguage),
      options: [
        {
          id: 'language',
          title: t('language', currentLanguage),
          icon: 'language' as const,
          type: 'selector' as const,
          value: settings.language,
          onPress: handleLanguageSelect
        },
        {
          id: 'notifications',
          title: t('notifications', currentLanguage),
          icon: 'notifications' as const,
          type: 'toggle' as const,
          value: settings.notificationsEnabled
        },
        {
          id: 'voice',
          title: t('voiceGuidance', currentLanguage),
          icon: 'record-voice-over' as const,
          type: 'toggle' as const,
          value: settings.voiceEnabled
        },
        {
          id: 'autoLocation',
          title: t('autoLocation', currentLanguage),
          icon: 'location-on' as const,
          type: 'toggle' as const,
          value: settings.autoLocation
        }
      ]
    },
    {
      title: t('supportLegal', currentLanguage),
      options: [
        {
          id: 'help',
          title: t('helpSupportSettings', currentLanguage),
          icon: 'help' as const,
          type: 'navigation' as const,
          onPress: () => handleNavigation('help')
        },
        {
          id: 'feedback',
          title: t('sendFeedback', currentLanguage),
          icon: 'feedback' as const,
          type: 'navigation' as const,
          onPress: () => handleNavigation('feedback')
        },
        {
          id: 'privacy',
          title: t('privacyPolicy', currentLanguage),
          icon: 'policy' as const,
          type: 'navigation' as const,
          onPress: () => handleNavigation('privacy')
        },
        {
          id: 'about',
          title: t('aboutRoadbro', currentLanguage),
          icon: 'info' as const,
          type: 'navigation' as const,
          onPress: () => handleNavigation('about')
        }
      ]
    }
  ];

  const renderSettingOption = (option: any, index: number, sectionIndex: number) => {
    const animIndex = sectionIndex * 10 + index; // Unique index for each item
    const actualAnimIndex = animIndex < scaleAnims.length ? animIndex : 0;

    return (
      <Animated.View
        key={option.id}
        style={[
          styles.optionWrapper,
          { transform: [{ scale: scaleAnims[actualAnimIndex] }] }
        ]}
      >
        <TouchableOpacity
          style={styles.optionCard}
          onPress={() => {
            animatePress(actualAnimIndex);
            if (option.onPress) {
              option.onPress();
            }
          }}
          activeOpacity={option.type === 'toggle' ? 1 : 0.8}
          disabled={option.type === 'toggle'}
        >
          <View style={styles.optionGlass}>
            <View style={styles.optionLeft}>
              <View style={styles.iconContainer}>
                <MaterialIcons name={option.icon} size={22} color="#feca57" />
              </View>
              <Text style={styles.optionText}>{option.title}</Text>
            </View>
            
            <View style={styles.optionRight}>
              {option.type === 'toggle' && (
                <Switch
                  value={option.value as boolean}
                  onValueChange={(value) => handleToggle(option.id, value)}
                  trackColor={{ false: "rgba(255, 255, 255, 0.2)", true: "rgba(254, 202, 87, 0.3)" }}
                  thumbColor={option.value ? "#feca57" : "rgba(255, 255, 255, 0.8)"}
                  ios_backgroundColor="rgba(255, 255, 255, 0.2)"
                />
              )}
              
              {option.type === 'selector' && (
                <>
                  <Text style={styles.optionValue}>{option.value as string}</Text>
                  <MaterialIcons name="chevron-right" size={20} color="rgba(255, 255, 255, 0.7)" />
                </>
              )}
              
              {option.type === 'navigation' && (
                <MaterialIcons name="chevron-right" size={20} color="rgba(255, 255, 255, 0.7)" />
              )}
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />
      
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb']}
        style={styles.gradientContainer}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Floating Background Elements */}
        <Animatable.View 
          animation="rotate" 
          iterationCount="infinite" 
          duration={30000}
          style={[styles.floatingElement, styles.element1]}
        />
        <Animatable.View 
          animation="pulse" 
          iterationCount="infinite" 
          duration={5000}
          delay={2000}
          style={[styles.floatingElement, styles.element2]}
        />
        <Animatable.View 
          animation="bounce" 
          iterationCount="infinite" 
          duration={4000}
          delay={1000}
          style={[styles.floatingElement, styles.element3]}
        />

        {/* Enhanced Header */}
        <Animatable.View 
          animation="fadeInDown" 
          duration={1000}
          style={styles.headerSection}
        >
          <View style={styles.headerGlass}>
            <View style={styles.headerTop}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => router.back()}
              >
                <MaterialIcons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
              <View style={styles.headerCenter}>
                <Text style={styles.headerTitle}>{t('settings', currentLanguage)}</Text>
                <Text style={styles.headerSubtitle}>{t('customizeExperience', currentLanguage)}</Text>
              </View>
              <View style={styles.headerRight}>
                <TouchableOpacity style={styles.headerButton}>
                  <MaterialIcons name="more-vert" size={24} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Animatable.View>

        {/* Settings Content */}
        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {settingsSections.map((section, sectionIndex) => (
            <Animatable.View 
              key={section.title}
              animation="fadeInUp" 
              duration={1000}
              delay={300 + (sectionIndex * 200)}
              style={styles.sectionContainer}
            >
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <View style={styles.sectionGlass}>
                {section.options.map((option, optionIndex) => 
                  renderSettingOption(option, optionIndex, sectionIndex)
                )}
              </View>
            </Animatable.View>
          ))}

          {/* App Info Section */}
          <Animatable.View 
            animation="fadeIn" 
            duration={1000}
            delay={800}
            style={styles.appInfoSection}
          >
            <View style={styles.appInfoGlass}>
              <View style={styles.appInfoContent}>
                <View style={styles.appLogoContainer}>
                  <MaterialIcons name="directions-car" size={32} color="#feca57" />
                </View>
                <Text style={styles.appName}>{t('roadbro', currentLanguage)}</Text>
                <Text style={styles.appVersion}>Version 1.0.0</Text>
                <Text style={styles.appDescription}>{t('yourTrustedCompanion', currentLanguage)}</Text>
              </View>
            </View>
          </Animatable.View>
        </ScrollView>

        {/* Loading Overlay */}
        {loading && (
          <View style={styles.loadingOverlay}>
            <Animatable.View 
              animation="fadeIn" 
              style={styles.loadingGlass}
            >
              <Animatable.View 
                animation="rotate" 
                iterationCount="infinite" 
                duration={1000}
              >
                <MaterialIcons name="refresh" size={32} color="#feca57" />
              </Animatable.View>
              <Text style={styles.loadingText}>{t('updating', currentLanguage)}</Text>
            </Animatable.View>
          </View>
        )}
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#667eea',
  },
  gradientContainer: {
    flex: 1,
  },

  // Floating Background Elements
  floatingElement: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 100,
  },
  element1: {
    width: 140,
    height: 140,
    top: '8%',
    right: '-12%',
  },
  element2: {
    width: 100,
    height: 100,
    bottom: '30%',
    left: '-15%',
  },
  element3: {
    width: 80,
    height: 80,
    top: '50%',
    right: '10%',
  },

  // Header Section
  headerSection: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 20,
  },
  headerGlass: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 12,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
    marginTop: 2,
  },
  headerRight: {
    width: 44, // Same width as back button for balance
  },
  headerButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },

  // Content
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },

  // Section Styles
  sectionContainer: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    color: '#ffffff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  sectionGlass: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
  },

  // Option Styles
  optionWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  optionCard: {
    paddingHorizontal: 0,
  },
  optionGlass: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    backgroundColor: 'rgba(254, 202, 87, 0.15)',
    borderRadius: 12,
    padding: 8,
    marginRight: 12,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    flex: 1,
  },
  optionRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionValue: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginRight: 8,
    fontWeight: '500',
  },

  // App Info Section
  appInfoSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  appInfoGlass: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    padding: 24,
  },
  appInfoContent: {
    alignItems: 'center',
  },
  appLogoContainer: {
    backgroundColor: 'rgba(254, 202, 87, 0.15)',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
  },
  appName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  appDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 20,
  },

  // Loading Overlay
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingGlass: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  loadingText: {
    fontSize: 16,
    color: '#ffffff',
    marginTop: 12,
    fontWeight: '600',
  },
});