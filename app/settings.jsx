import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Bell, Shield, Palette, Globe, CircleHelp as HelpCircle, LogOut, ChevronRight, Moon, Smartphone, Lock, Eye, Download, Trash2,ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';


const SETTINGS_SECTIONS = [
  {
    title: 'Account',
    items: [
      { icon: User, title: 'Personal Information', subtitle: 'Update your profile details' },
      { icon: Shield, title: 'Privacy & Security', subtitle: 'Manage your privacy settings' },
      { icon: Lock, title: 'Password & Authentication', subtitle: 'Change password and 2FA' },
    ]
  },
  {
    title: 'Preferences',
    items: [
      { icon: Bell, title: 'Notifications', subtitle: 'Customize your alerts', hasSwitch: true },
      { icon: Moon, title: 'Dark Mode', subtitle: 'Switch to dark theme', hasSwitch: true },
      { icon: Globe, title: 'Language', subtitle: 'English (US)', value: 'English' },
      { icon: Palette, title: 'Theme Color', subtitle: 'Customize app appearance' },
    ]
  },
  {
    title: 'Content',
    items: [
      { icon: Eye, title: 'Content Preferences', subtitle: 'Manage what you see' },
      { icon: Download, title: 'Download Quality', subtitle: 'High quality', value: 'High' },
      { icon: Smartphone, title: 'Auto-play Videos', subtitle: 'Play videos automatically', hasSwitch: true },
    ]
  },
  {
    title: 'Support',
    items: [
      { icon: HelpCircle, title: 'Help Center', subtitle: 'Get help and support' },
      { icon: Shield, title: 'Report a Problem', subtitle: 'Let us know about issues' },
    ]
  },
  {
    title: 'Account Actions',
    items: [
      { icon: Trash2, title: 'Delete Account', subtitle: 'Permanently delete your account', danger: true },
      { icon: LogOut, title: 'Sign Out', subtitle: 'Sign out of your account', danger: true },
    ]
  }
];

export default function SettingsTab() {
  const [switches, setSwitches] = useState({
    notifications: true,
    darkMode: false,
    autoPlay: true,
  });

  const toggleSwitch = (key) => {
    setSwitches(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.push('/main-menu')}
            style={styles.backButton}
          >
            <ArrowLeft size={26} color="#000" />
          </TouchableOpacity>
          <Text style={styles.title}>Settings</Text>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {SETTINGS_SECTIONS.map((section, sectionIndex) => (
            <View key={sectionIndex} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <View style={styles.sectionContent}>
                {section.items.map((item, itemIndex) => (
                  <TouchableOpacity
                    key={itemIndex}
                    style={[
                      styles.settingItem,
                      itemIndex === section.items.length - 1 && styles.lastItem
                    ]}
                  >
                    <View style={[
                      styles.iconContainer,
                      item.danger && styles.dangerIcon
                    ]}>
                      <item.icon size={20} color={item.danger ? '#ef4444' : '#6366f1'} />
                    </View>
                    
                    <View style={styles.settingContent}>
                      <Text style={[
                        styles.settingTitle,
                        item.danger && styles.dangerText
                      ]}>
                        {item.title}
                      </Text>
                      <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
                    </View>

                    <View style={styles.settingAction}>
                      {item.hasSwitch ? (
                        <Switch
                          value={switches[item.title.toLowerCase().replace(/[^a-z]/g, '')]}
                          onValueChange={() => toggleSwitch(item.title.toLowerCase().replace(/[^a-z]/g, ''))}
                          trackColor={{ false: '#d1d5db', true: '#6366f1' }}
                          thumbColor="#ffffff"
                        />
                      ) : item.value ? (
                        <View style={styles.valueContainer}>
                          <Text style={styles.valueText}>{item.value}</Text>
                          <ChevronRight size={16} color="#9ca3af" />
                        </View>
                      ) : (
                        <ChevronRight size={16} color="#9ca3af" />
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}

          <View style={styles.footer}>
            <Text style={styles.footerText}>Version 0.0.1</Text>
            <Text style={styles.footerText}>© 2025 Zingsta App</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    marginTop: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  header: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection:'row',
    alignItems:'center'
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    padding: 8,
    
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#1f2937',
    marginBottom: 6,
    textAlign:'center'

  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 12,
  },
  sectionContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  dangerIcon: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
    marginBottom: 2,
  },
  dangerText: {
    color: '#ef4444',
  },
  settingSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  settingAction: {
    alignItems: 'center',
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  valueText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
    marginRight: 8,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingBottom: 120,
  },
  footerText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9ca3af',
    marginBottom: 4,
  },
});