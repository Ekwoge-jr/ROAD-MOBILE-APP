import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { t } from './utils/translate';
import { ApiService } from './services/ApiService';

const HelpSupportScreen = () => {
  const [language, setLanguage] = useState<'en' | 'fr'>('en');

  useEffect(() => {
    // Fetch user preferences to get language
    const fetchLanguage = async () => {
      try {
        const api = new ApiService();
        const prefs = await api.getUserPreferences();
        if (prefs.language && (prefs.language === 'fr' || prefs.language === 'en')) {
          setLanguage(prefs.language);
        }
      } catch (e) {
        // fallback to English
      }
    };
    fetchLanguage();
  }, []);

  const handleContactSupport = () => {
    // You can implement email or phone contact here
    Linking.openURL('mailto:support@roadapp.com');
  };

  const handleFAQ = () => {
    // Navigate to FAQ screen or open FAQ modal
    console.log('FAQ pressed');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>{t('helpSupport', language)}</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('needHelp', language)}</Text>
          <Text style={styles.description}>{t('wereHereToHelp', language)}</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleContactSupport}>
          <Text style={styles.buttonText}>{t('contactSupport', language)}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleFAQ}>
          <Text style={styles.buttonText}>{t('faq', language)}</Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('appVersion', language)}</Text>
          <Text style={styles.versionText}>{t('version', language)}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  versionText: {
    fontSize: 16,
    color: '#666',
  },
});

export default HelpSupportScreen; 