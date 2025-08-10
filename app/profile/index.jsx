import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Modal, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { CreditCard as Edit, Grid2x2 as Grid, Heart, MessageCircle, Share, MoveHorizontal as MoreHorizontal, Camera, Award, TrendingUp, Users, Star, Settings, Pencil, Link, Facebook, Twitter, Instagram, Linkedin, X, Globe } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const USER_POSTS = [
  'https://images.pexels.com/photos/814499/pexels-photo-814499.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
];

const ACHIEVEMENTS = [
  { icon: Award, title: 'Top Creator', color: '#f59e0b' },
  { icon: TrendingUp, title: 'Trending', color: '#10b981' },
  { icon: Users, title: 'Community Leader', color: '#6366f1' },
  { icon: Star, title: 'Verified', color: '#ef4444' },
];

export default function ProfileTab() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('posts');
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [profileData, setProfileData] = useState({
    username: '@creative_soul',
    fullName: 'Alex Johnson',
    bio: '✨ Digital Creator & Designer\n🎨 Turning ideas into reality\n📍 San Francisco, CA',
    links: {
      website: '',
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: ''
    }
  });
  const [tempProfileData, setTempProfileData] = useState({ ...profileData });

  const handleShareProfile = async () => {
    try {
      // In a real app, you would share the actual profile URL
      await Share.share({
        message: `Check out ${profileData.username}'s profile!`,
        url: 'https://yourapp.com/profile/' + profileData.username,
        title: 'Share Profile'
      });
    } catch (error) {
      console.error('Error sharing profile:', error);
    }
  };

  const handleSaveProfile = () => {
    setProfileData({ ...tempProfileData });
    setIsEditModalVisible(false);
  };

  const openLink = (url) => {
    if (url) {
      Linking.openURL(url.startsWith('http') ? url : `https://${url}`);
    }
  };

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <View style={styles.profileImageContainer}>
              <Image 
                source={{ uri: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300' }}
                style={styles.profileImage}
              />
              <TouchableOpacity style={styles.cameraButton}>
                <Camera size={16} color="#fff" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.profileInfo}>
              <Text style={styles.username}>{profileData.username}</Text>
              <Text style={styles.fullName}>{profileData.fullName}</Text>
              <Text style={styles.bio}>{profileData.bio}</Text>
              
              {/* Social Links */}
              <View style={styles.socialLinks}>
                {profileData.links.website && (
                  <TouchableOpacity onPress={() => openLink(profileData.links.website)}>
                    <Globe size={16} color="#6366f1" style={styles.socialIcon} />
                  </TouchableOpacity>
                )}
                {profileData.links.facebook && (
                  <TouchableOpacity onPress={() => openLink(profileData.links.facebook)}>
                    <Facebook size={16} color="#6366f1" style={styles.socialIcon} />
                  </TouchableOpacity>
                )}
                {profileData.links.twitter && (
                  <TouchableOpacity onPress={() => openLink(profileData.links.twitter)}>
                    <Twitter size={16} color="#6366f1" style={styles.socialIcon} />
                  </TouchableOpacity>
                )}
                {profileData.links.instagram && (
                  <TouchableOpacity onPress={() => openLink(profileData.links.instagram)}>
                    <Instagram size={16} color="#6366f1" style={styles.socialIcon} />
                  </TouchableOpacity>
                )}
                {profileData.links.linkedin && (
                  <TouchableOpacity onPress={() => openLink(profileData.links.linkedin)}>
                    <Linkedin size={16} color="#6366f1" style={styles.socialIcon} />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>1.2K</Text>
                <Text style={styles.statLabel}>Posts</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>45.8K</Text>
                <Text style={styles.statLabel}>Followers</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>892</Text>
                <Text style={styles.statLabel}>Following</Text>
              </View>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.editButton}
                onPress={() => {
                  setTempProfileData({ ...profileData });
                  setIsEditModalVisible(true);
                }}
              >
                <Pencil size={16} color="#6366f1" />
                <Text style={styles.editButtonText}>Edit Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareButton} onPress={handleShareProfile}>
                <Share size={16} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.moreButton} onPress={() => router.push('/settings')}>
                <Settings size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Tab Navigation */}
          <View style={styles.tabContainer}>
            {[
              { key: 'posts', label: 'Posts', icon: Grid },
              { key: 'achievements', label: 'Achievements', icon: Award },
              { key: 'analytics', label: 'Analytics', icon: TrendingUp },
            ].map(({ key, label, icon: Icon }) => (
              <TouchableOpacity
                key={key}
                style={[styles.tab, activeTab === key && styles.activeTab]}
                onPress={() => setActiveTab(key)}
              >
                <Icon size={20} color={activeTab === key ? '#6366f1' : '#9ca3af'} />
                <Text style={[
                  styles.tabText,
                  activeTab === key && styles.activeTabText
                ]}>
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Content */}
          <View style={styles.content}>
            {activeTab === 'posts' && (
              <View style={styles.postsGrid}>
                {USER_POSTS.map((post, index) => (
                  <TouchableOpacity key={index} style={styles.postItem}>
                    <Image source={{ uri: post }} style={styles.postImage} />
                    <LinearGradient
                      colors={['transparent', 'rgba(0,0,0,0.6)']}
                      style={styles.postOverlay}
                    >
                      <View style={styles.postStats}>
                        <View style={styles.postStat}>
                          <Heart size={14} color="#fff" />
                          <Text style={styles.postStatText}>1.2K</Text>
                        </View>
                        <View style={styles.postStat}>
                          <MessageCircle size={14} color="#fff" />
                          <Text style={styles.postStatText}>89</Text>
                        </View>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {activeTab === 'achievements' && (
              <View style={styles.achievementsContainer}>
                {ACHIEVEMENTS.map((achievement, index) => (
                  <View key={index} style={styles.achievementItem}>
                    <View style={[styles.achievementIcon, { backgroundColor: achievement.color }]}>
                      <achievement.icon size={24} color="#fff" />
                    </View>
                    <View style={styles.achievementInfo}>
                      <Text style={styles.achievementTitle}>{achievement.title}</Text>
                      <Text style={styles.achievementDescription}>
                        Earned for outstanding contribution to the community
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {activeTab === 'analytics' && (
              <View style={styles.analyticsContainer}>
                <View style={styles.analyticsCard}>
                  <Text style={styles.analyticsTitle}>This Month</Text>
                  <View style={styles.analyticsStats}>
                    <View style={styles.analyticsStat}>
                      <Text style={styles.analyticsNumber}>+2.4K</Text>
                      <Text style={styles.analyticsLabel}>New Followers</Text>
                    </View>
                    <View style={styles.analyticsStat}>
                      <Text style={styles.analyticsNumber}>89.2K</Text>
                      <Text style={styles.analyticsLabel}>Total Likes</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.analyticsCard}>
                  <Text style={styles.analyticsTitle}>Engagement Rate</Text>
                  <Text style={styles.engagementRate}>8.7%</Text>
                  <Text style={styles.engagementChange}>+1.2% from last month</Text>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Edit Profile Modal */}
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent={false}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setIsEditModalVisible(false)}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TouchableOpacity onPress={handleSaveProfile}>
              <Text style={styles.modalSave}>Save</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.editForm}>
            <View style={styles.editProfileImageContainer}>
              <Image 
                source={{ uri: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300' }}
                style={styles.editProfileImage}
              />
              <TouchableOpacity style={styles.editCameraButton}>
                <Camera size={16} color="#fff" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Username</Text>
              <TextInput
                style={styles.formInput}
                value={tempProfileData.username}
                onChangeText={(text) => setTempProfileData({...tempProfileData, username: text})}
                placeholder="Username"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Full Name</Text>
              <TextInput
                style={styles.formInput}
                value={tempProfileData.fullName}
                onChangeText={(text) => setTempProfileData({...tempProfileData, fullName: text})}
                placeholder="Full Name"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Bio</Text>
              <TextInput
                style={[styles.formInput, { height: 100 }]}
                value={tempProfileData.bio}
                onChangeText={(text) => setTempProfileData({...tempProfileData, bio: text})}
                placeholder="Tell about yourself..."
                multiline
              />
            </View>
            
            <Text style={styles.sectionTitle}>Social Links</Text>
            
            <View style={styles.formGroup}>
              <View style={styles.linkInputContainer}>
                <Globe size={20} color="#6b7280" style={styles.linkIcon} />
                <TextInput
                  style={[styles.formInput, { paddingLeft: 40 }]}
                  value={tempProfileData.links.website}
                  onChangeText={(text) => setTempProfileData({
                    ...tempProfileData, 
                    links: {...tempProfileData.links, website: text}
                  })}
                  placeholder="Website URL"
                  keyboardType="url"
                />
              </View>
            </View>
            
            <View style={styles.formGroup}>
              <View style={styles.linkInputContainer}>
                <Facebook size={20} color="#6b7280" style={styles.linkIcon} />
                <TextInput
                  style={[styles.formInput, { paddingLeft: 40 }]}
                  value={tempProfileData.links.facebook}
                  onChangeText={(text) => setTempProfileData({
                    ...tempProfileData, 
                    links: {...tempProfileData.links, facebook: text}
                  })}
                  placeholder="Facebook URL"
                  keyboardType="url"
                />
              </View>
            </View>
            
            <View style={styles.formGroup}>
              <View style={styles.linkInputContainer}>
                <Twitter size={20} color="#6b7280" style={styles.linkIcon} />
                <TextInput
                  style={[styles.formInput, { paddingLeft: 40 }]}
                  value={tempProfileData.links.twitter}
                  onChangeText={(text) => setTempProfileData({
                    ...tempProfileData, 
                    links: {...tempProfileData.links, twitter: text}
                  })}
                  placeholder="Twitter URL"
                  keyboardType="url"
                />
              </View>
            </View>
            
            <View style={styles.formGroup}>
              <View style={styles.linkInputContainer}>
                <Instagram size={20} color="#6b7280" style={styles.linkIcon} />
                <TextInput
                  style={[styles.formInput, { paddingLeft: 40 }]}
                  value={tempProfileData.links.instagram}
                  onChangeText={(text) => setTempProfileData({
                    ...tempProfileData, 
                    links: {...tempProfileData.links, instagram: text}
                  })}
                  placeholder="Instagram URL"
                  keyboardType="url"
                />
              </View>
            </View>
            
            <View style={styles.formGroup}>
              <View style={styles.linkInputContainer}>
                <Linkedin size={20} color="#6b7280" style={styles.linkIcon} />
                <TextInput
                  style={[styles.formInput, { paddingLeft: 40 }]}
                  value={tempProfileData.links.linkedin}
                  onChangeText={(text) => setTempProfileData({
                    ...tempProfileData, 
                    links: {...tempProfileData.links, linkedin: text}
                  })}
                  placeholder="LinkedIn URL"
                  keyboardType="url"
                />
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
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
  profileHeader: {
    padding: 10,
    alignItems: 'center',
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 160,
    height: 160,
    borderRadius: 90,
    borderWidth: 2,
    borderColor: '#991b27',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#6366f1',
    borderRadius: 20,
    padding: 8,
    borderWidth: 3,
    borderColor: '#fff',
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  username: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#bd2630',
    marginBottom: 4,
  },
  fullName: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
    marginBottom: 8,
  },
  bio: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4b5563',
    textAlign: 'center',
    lineHeight: 25,
  },
  socialLinks: {
    flexDirection: 'row',
    marginTop: 12,
  },
  socialIcon: {
    marginHorizontal: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  statItem: {
    alignItems: 'center',
    marginHorizontal: 20,
  },
  statNumber: {
    fontSize: 22,
    fontFamily: 'Inter-Bold',
    color: '#1f2937',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    marginTop: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#122c6f',
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 8,
    marginRight: 12,
  },
  editButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    marginLeft: 8,
  },
  shareButton: {
    backgroundColor: '#6695ed',
    padding: 16,
    borderRadius: 40,
    marginRight: 8,
  },
  moreButton: {
    backgroundColor: '#b82638',
    padding: 16,
    borderRadius: 40,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(243, 244, 246, 0.5)',
    marginHorizontal: 10,
    borderRadius: 16,
    padding: 4,
    marginBottom: 20,
    gap: 10
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    paddingHorizontal: 6
  },
  tabText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#9ca3af',
    marginLeft: 6,
  },
  activeTabText: {
    color: '#6366f1',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  postsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  postItem: {
    width: '48%',
    aspectRatio: 1,
    marginBottom: 8,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  postImage: {
    width: '100%',
    height: '100%',
  },
  postOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    justifyContent: 'flex-end',
    padding: 8,
  },
  postStats: {
    flexDirection: 'row',
  },
  postStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  postStatText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    marginLeft: 4,
  },
  achievementsContainer: {
    gap: 16,
  },
  achievementItem: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  analyticsContainer: {
    gap: 16,
  },
  analyticsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  analyticsTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
    marginBottom: 16,
  },
  analyticsStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  analyticsStat: {
    alignItems: 'center',
  },
  analyticsNumber: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#6366f1',
  },
  analyticsLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    marginTop: 4,
  },
  engagementRate: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#10b981',
    textAlign: 'center',
    marginBottom: 8,
  },
  engagementChange: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    textAlign: 'center',
  },
  // Edit Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
  },
  modalCancel: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  modalSave: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#6366f1',
  },
  editForm: {
    padding: 20,
  },
  editProfileImageContainer: {
    position: 'relative',
    alignSelf: 'center',
    marginBottom: 24,
  },
  editProfileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  editCameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#6366f1',
    borderRadius: 20,
    padding: 8,
    borderWidth: 3,
    borderColor: '#fff',
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#4b5563',
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1f2937',
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
    marginTop: 24,
    marginBottom: 16,
  },
  linkInputContainer: {
    position: 'relative',
  },
  linkIcon: {
    position: 'absolute',
    left: 12,
    top: 12,
    zIndex: 1,
  },
});