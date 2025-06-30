import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { useRouter } from 'expo-router';

export default function PrivacyPolicyScreen() {
  const router = useRouter();

  const privacySections = [
    {
      title: 'Information We Collect',
      content: [
        'Personal Information: Name, email address, phone number',
        'Location Data: GPS coordinates for road condition reporting',
        'Device Information: Device type, operating system, app version',
        'Usage Data: App interactions, feature usage, preferences',
        'Photos: Images uploaded for road reports (with your consent)'
      ]
    },
    {
      title: 'How We Use Your Information',
      content: [
        'Provide road safety information and notifications',
        'Process and display road condition reports',
        'Improve app functionality and user experience',
        'Send important safety alerts and updates',
        'Analyze usage patterns to enhance services'
      ]
    },
    {
      title: 'Data Sharing',
      content: [
        'We do not sell your personal information',
        'Data may be shared with emergency services when required',
        'Aggregated, anonymized data may be used for research',
        'Third-party services (maps, notifications) with your consent',
        'Legal authorities when required by law'
      ]
    },
    {
      title: 'Data Security',
      content: [
        'Encryption of all data in transit and at rest',
        'Secure authentication and authorization',
        'Regular security audits and updates',
        'Limited access to personal data by authorized personnel',
        'Secure data centers with industry-standard protection'
      ]
    },
    {
      title: 'Your Rights',
      content: [
        'Access your personal data and request corrections',
        'Delete your account and associated data',
        'Opt-out of non-essential communications',
        'Control location sharing and permissions',
        'Export your data in a portable format'
      ]
    },
    {
      title: 'Data Retention',
      content: [
        'Account data: Retained while account is active',
        'Location data: Automatically deleted after 30 days',
        'Report data: Retained for 2 years for safety purposes',
        'Usage analytics: Anonymized after 1 year',
        'Photos: Deleted upon account deletion'
      ]
    }
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />
      
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb']}
        style={styles.gradientContainer}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Header */}
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
                <Text style={styles.headerTitle}>Privacy Policy</Text>
                <Text style={styles.headerSubtitle}>Your privacy matters to us</Text>
              </View>
              <View style={styles.headerRight}>
                <MaterialIcons name="security" size={24} color="#feca57" />
              </View>
            </View>
          </View>
        </Animatable.View>

        {/* Content */}
        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Last Updated */}
          <Animatable.View 
            animation="fadeInUp" 
            duration={1000}
            delay={200}
            style={styles.lastUpdatedSection}
          >
            <View style={styles.lastUpdatedGlass}>
              <Text style={styles.lastUpdatedText}>
                Last Updated: December 2024
              </Text>
            </View>
          </Animatable.View>

          {/* Privacy Sections */}
          {privacySections.map((section, index) => (
            <Animatable.View 
              key={section.title}
              animation="fadeInUp" 
              duration={1000}
              delay={300 + (index * 100)}
              style={styles.sectionContainer}
            >
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <View style={styles.sectionGlass}>
                {section.content.map((item, itemIndex) => (
                  <View key={itemIndex} style={styles.listItem}>
                    <MaterialIcons name="check-circle" size={16} color="#feca57" />
                    <Text style={styles.listItemText}>{item}</Text>
                  </View>
                ))}
              </View>
            </Animatable.View>
          ))}

          {/* Contact Information */}
          <Animatable.View 
            animation="fadeInUp" 
            duration={1000}
            delay={800}
            style={styles.sectionContainer}
          >
            <Text style={styles.sectionTitle}>Contact Us</Text>
            <View style={styles.sectionGlass}>
              <View style={styles.contactItem}>
                <MaterialIcons name="email" size={20} color="#feca57" />
                <Text style={styles.contactText}>privacy@roadbro.com</Text>
              </View>
              <View style={styles.contactItem}>
                <MaterialIcons name="phone" size={20} color="#feca57" />
                <Text style={styles.contactText}>+237 123 456 789</Text>
              </View>
              <View style={styles.contactItem}>
                <MaterialIcons name="location-on" size={20} color="#feca57" />
                <Text style={styles.contactText}>Buea, Cameroon</Text>
              </View>
            </View>
          </Animatable.View>

          {/* Footer */}
          <Animatable.View 
            animation="fadeIn" 
            duration={1000}
            delay={900}
            style={styles.footerSection}
          >
            <Text style={styles.footerText}>
              By using ROADBRO, you agree to this Privacy Policy. 
              We may update this policy from time to time, and we will notify you of any changes.
            </Text>
          </Animatable.View>
        </ScrollView>
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
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
    marginTop: 2,
  },
  headerRight: {
    width: 44,
    alignItems: 'center',
  },

  // Content
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },

  // Last Updated Section
  lastUpdatedSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  lastUpdatedGlass: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
  },
  lastUpdatedText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
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
  },
  sectionGlass: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    padding: 16,
  },

  // List Items
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  listItemText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    flex: 1,
    marginLeft: 12,
    lineHeight: 20,
  },

  // Contact Items
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginLeft: 12,
  },

  // Footer
  footerSection: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  footerText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 18,
  },
}); 