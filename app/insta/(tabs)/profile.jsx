import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Modal, Linking, Alert, FlatList, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  CreditCard as Edit, Grid2x2 as Grid, Heart, MessageCircle, Share, 
  MoveHorizontal as MoreHorizontal, Camera, Award, TrendingUp, Users, 
  Star, Settings, Pencil, Link, Facebook, Twitter, Instagram, Linkedin, 
  X, Globe, Plus, Play, Archive, Tag, Film, Grid3x3, Bookmark, 
  ArrowLeft, UserPlus, UserMinus, Search, Bell, Shield, Lock, 
  HelpCircle, LogOut, Palette, Moon, Volume2, VolumeX 
} from 'lucide-react-native';
import { useRouter } from 'expo-router';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const USER_POSTS = [
  { id: '1', type: 'image', uri: 'https://images.pexels.com/photos/814499/pexels-photo-814499.jpeg?auto=compress&cs=tinysrgb&w=400', likes: 1234, comments: 89 },
  { id: '2', type: 'video', uri: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400', likes: 856, comments: 42 },
  { id: '3', type: 'reel', uri: 'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=400', likes: 2145, comments: 156 },
  { id: '4', type: 'image', uri: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400', likes: 967, comments: 73 },
  { id: '5', type: 'video', uri: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400', likes: 1456, comments: 91 },
  { id: '6', type: 'reel', uri: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400', likes: 3021, comments: 234 },
];

const FOLLOWERS_LIST = [
  { id: '1', username: 'sarah_designer', fullName: 'Sarah Chen', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100', isFollowing: true },
  { id: '2', username: 'mike_photos', fullName: 'Mike Johnson', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100', isFollowing: false },
  { id: '3', username: 'emma_art', fullName: 'Emma Wilson', avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100', isFollowing: true },
  { id: '4', username: 'david_creative', fullName: 'David Brown', avatar: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=100', isFollowing: false },
];

const STORIES = [
  { id: '1', image: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=200', timestamp: '2h ago', isArchived: false },
  { id: '2', image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200', timestamp: '5h ago', isArchived: false },
  { id: '3', image: 'https://images.pexels.com/photos/814499/pexels-photo-814499.jpeg?auto=compress&cs=tinysrgb&w=200', timestamp: '1d ago', isArchived: true },
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
  const [activePostType, setActivePostType] = useState('all');
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [isFollowersVisible, setIsFollowersVisible] = useState(false);
  const [isFollowingVisible, setIsFollowingVisible] = useState(false);
  const [isPostDetailVisible, setIsPostDetailVisible] = useState(false);
  const [isStoryCreateVisible, setIsStoryCreateVisible] = useState(false);
  const [isArchiveVisible, setIsArchiveVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [followersList, setFollowersList] = useState(FOLLOWERS_LIST);
  const [stories, setStories] = useState(STORIES);
  
  const [profileData, setProfileData] = useState({
    username: '@creative_soul',
    fullName: 'Alex Johnson',
    bio: '✨ Digital Creator & Designer\n🎨 Turning ideas into reality\n📍 San Francisco, CA',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300',
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
      Alert.alert(
        'Share Profile',
        'Profile link copied to clipboard!',
        [{ text: 'OK', style: 'default' }]
      );
    } catch (error) {
      console.error('Error sharing profile:', error);
    }
  };

  const handleSaveProfile = () => {
    setProfileData({ ...tempProfileData });
    setIsEditModalVisible(false);
  };

  const handleFollowToggle = (userId) => {
    setFollowersList(prevList =>
      prevList.map(user =>
        user.id === userId ? { ...user, isFollowing: !user.isFollowing } : user
      )
    );
  };

  const handlePostPress = (post) => {
    setSelectedPost(post);
    setIsPostDetailVisible(true);
  };

  const handleLongPressProfile = () => {
    Alert.alert(
      'Profile Options',
      'What would you like to do?',
      [
        { text: 'Change Profile Photo', onPress: () => changeProfilePhoto() },
        { text: 'View Profile Photo', onPress: () => viewProfilePhoto() },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const changeProfilePhoto = () => {
    Alert.alert('Change Photo', 'Photo picker would open here');
  };

  const viewProfilePhoto = () => {
    Alert.alert('View Photo', 'Full screen photo view would open here');
  };

  const handleCreateStory = () => {
    Alert.alert('Create Story', 'Story creation interface would open here');
    setIsStoryCreateVisible(false);
  };

  const openLink = (url) => {
    if (url) {
      Linking.openURL(url.startsWith('http') ? url : `https://${url}`);
    }
  };

  const getFilteredPosts = () => {
    switch (activePostType) {
      case 'posts':
        return USER_POSTS.filter(post => post.type === 'image');
      case 'reels':
        return USER_POSTS.filter(post => post.type === 'reel');
      case 'tagged':
        return USER_POSTS.filter(post => post.type === 'video');
      default:
        return USER_POSTS;
    }
  };

  const renderFollowerItem = ({ item }) => (
    <View style={styles.followerItem}>
      <Image source={{ uri: item.avatar }} style={styles.followerAvatar} />
      <View style={styles.followerInfo}>
        <Text style={styles.followerUsername}>{item.username}</Text>
        <Text style={styles.followerFullName}>{item.fullName}</Text>
      </View>
      <TouchableOpacity
        style={[styles.followButton, item.isFollowing && styles.followingButton]}
        onPress={() => handleFollowToggle(item.id)}
      >
        <Text style={[styles.followButtonText, item.isFollowing && styles.followingButtonText]}>
          {item.isFollowing ? 'Following' : 'Follow'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderStoryItem = ({ item }) => (
    <TouchableOpacity style={styles.storyItem}>
      <Image source={{ uri: item.image }} style={styles.storyImage} />
      <Text style={styles.storyTime}>{item.timestamp}</Text>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2', '#f093fb']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Stories Section */}
          

          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <TouchableOpacity 
              style={styles.profileImageContainer}
              onLongPress={handleLongPressProfile}
              delayLongPress={500}
            >
              <Image 
                source={{ uri: profileData.avatar }}
                style={styles.profileImage}
              />
              <TouchableOpacity style={styles.cameraButton} onPress={changeProfilePhoto}>
                <Camera size={16} color="#fff" />
              </TouchableOpacity>
            </TouchableOpacity>
            
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
              <TouchableOpacity style={styles.statItem} onPress={() => setIsFollowersVisible(true)}>
                <Text style={styles.statNumber}>45.8K</Text>
                <Text style={styles.statLabel}>Followers</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.statItem} onPress={() => setIsFollowingVisible(true)}>
                <Text style={styles.statNumber}>892</Text>
                <Text style={styles.statLabel}>Following</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.editButton}
                onPress={() => {
                  setTempProfileData({ ...profileData });
                  setIsEditModalVisible(true);
                }}
              >
                <Pencil size={16} color="#fff" />
                <Text style={styles.editButtonText}>Edit Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareButton} onPress={handleShareProfile}>
                <Share size={16} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.moreButton} onPress={() => setIsSettingsVisible(true)}>
                <Settings size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

                {/* archives */}
                <View style={styles.storiesSection}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.storiesContainer}>
              <TouchableOpacity style={styles.addStoryButton} onPress={() => setIsStoryCreateVisible(true)}>
                <View style={styles.addStoryIcon}>
                  <Plus size={20} color="#6366f1" />
                </View>
                <Text style={styles.storyLabel}>Your Story</Text>
              </TouchableOpacity>
              <FlatList
                horizontal
                data={stories.filter(story => !story.isArchived)}
                renderItem={renderStoryItem}
                keyExtractor={(item) => item.id}
                showsHorizontalScrollIndicator={false}
              />
            </ScrollView>
            <TouchableOpacity style={styles.archiveButton} onPress={() => setIsArchiveVisible(true)}>
              <Archive size={16} color="#6366f1" />
              <Text style={styles.archiveText}>Archive</Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={styles.content}>
            {activeTab === 'posts' && (
              <>
                {/* Post Type Filter */}
                <View style={styles.postTypeFilter}>
                  {[
                    { key: 'all', icon: Grid3x3 },
                    { key: 'posts', icon: Grid },
                    { key: 'reels', icon: Film },
                    { key: 'tagged', icon: Tag },
                  ].map(({ key, icon: Icon }) => (
                    <TouchableOpacity
                      key={key}
                      style={[styles.filterButton, activePostType === key && styles.activeFilterButton]}
                      onPress={() => setActivePostType(key)}
                    >
                      <Icon size={24} color={activePostType === key ? '#6366f1' : '#9ca3af'} />
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={styles.postsGrid}>
                  {getFilteredPosts().map((post, index) => (
                    <TouchableOpacity key={index} style={styles.postItem} onPress={() => handlePostPress(post)}>
                      <Image source={{ uri: post.uri }} style={styles.postImage} />
                      {post.type === 'video' && (
                        <View style={styles.videoIndicator}>
                          <Play size={16} color="#fff" />
                        </View>
                      )}
                      {post.type === 'reel' && (
                        <View style={styles.reelIndicator}>
                          <Film size={16} color="#fff" />
                        </View>
                      )}
                      <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.6)']}
                        style={styles.postOverlay}
                      >
                        <View style={styles.postStats}>
                          <View style={styles.postStat}>
                            <Heart size={14} color="#fff" />
                            <Text style={styles.postStatText}>{post.likes}</Text>
                          </View>
                          <View style={styles.postStat}>
                            <MessageCircle size={14} color="#fff" />
                            <Text style={styles.postStatText}>{post.comments}</Text>
                          </View>
                        </View>
                      </LinearGradient>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
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
            <TouchableOpacity style={styles.editProfileImageContainer} onPress={changeProfilePhoto}>
              <Image 
                source={{ uri: tempProfileData.avatar }}
                style={styles.editProfileImage}
              />
              <View style={styles.editCameraButton}>
                <Camera size={16} color="#fff" />
              </View>
            </TouchableOpacity>
            
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
            
            {[
              { key: 'website', icon: Globe, placeholder: 'Website URL' },
              { key: 'facebook', icon: Facebook, placeholder: 'Facebook URL' },
              { key: 'twitter', icon: Twitter, placeholder: 'Twitter URL' },
              { key: 'instagram', icon: Instagram, placeholder: 'Instagram URL' },
              { key: 'linkedin', icon: Linkedin, placeholder: 'LinkedIn URL' },
            ].map(({ key, icon: Icon, placeholder }) => (
              <View key={key} style={styles.formGroup}>
                <View style={styles.linkInputContainer}>
                  <Icon size={20} color="#6b7280" style={styles.linkIcon} />
                  <TextInput
                    style={[styles.formInput, { paddingLeft: 40 }]}
                    value={tempProfileData.links[key]}
                    onChangeText={(text) => setTempProfileData({
                      ...tempProfileData, 
                      links: {...tempProfileData.links, [key]: text}
                    })}
                    placeholder={placeholder}
                    keyboardType="url"
                  />
                </View>
              </View>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Settings Modal */}
      <Modal
        visible={isSettingsVisible}
        animationType="slide"
        transparent={false}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.settingsHeader}>
            <TouchableOpacity onPress={() => setIsSettingsVisible(false)}>
              <ArrowLeft size={24} color="#1f2937" />
            </TouchableOpacity>
            <Text style={styles.settingsTitle}>Settings</Text>
            <View style={{ width: 24 }} />
          </View>
          
          <View style={styles.settingsContent}>
            <View style={styles.settingsUserInfo}>
              <Image source={{ uri: profileData.avatar }} style={styles.settingsAvatar} />
              <Text style={styles.settingsUsername}>{profileData.username}</Text>
              <Text style={styles.settingsFullName}>{profileData.fullName}</Text>
            </View>
            
            <ScrollView style={styles.settingsOptions}>
              {[
                { icon: Bell, title: 'Notifications', subtitle: 'Manage your notifications' },
                { icon: Shield, title: 'Privacy & Security', subtitle: 'Control your privacy settings' },
                { icon: Lock, title: 'Account Settings', subtitle: 'Manage your account' },
                { icon: Palette, title: 'Theme', subtitle: 'Customize app appearance' },
                { icon: Moon, title: 'Dark Mode', subtitle: 'Switch to dark theme' },
                { icon: Volume2, title: 'Sound Settings', subtitle: 'Manage audio preferences' },
                { icon: HelpCircle, title: 'Help & Support', subtitle: 'Get help and support' },
              ].map(({ icon: Icon, title, subtitle }, index) => (
                <TouchableOpacity key={index} style={styles.settingsOption}>
                  <View style={styles.settingsOptionLeft}>
                    <View style={styles.settingsOptionIcon}>
                      <Icon size={20} color="#6366f1" />
                    </View>
                    <View>
                      <Text style={styles.settingsOptionTitle}>{title}</Text>
                      <Text style={styles.settingsOptionSubtitle}>{subtitle}</Text>
                    </View>
                  </View>
                  <ArrowLeft 
                    size={16} 
                    color="#9ca3af" 
                    style={{ transform: [{ rotate: '180deg' }] }} 
                  />
                </TouchableOpacity>
              ))}
              
              <TouchableOpacity style={[styles.settingsOption, styles.logoutOption]}>
                <View style={styles.settingsOptionLeft}>
                  <View style={[styles.settingsOptionIcon, { backgroundColor: '#fee2e2' }]}>
                    <LogOut size={20} color="#ef4444" />
                  </View>
                  <Text style={[styles.settingsOptionTitle, { color: '#ef4444' }]}>Logout</Text>
                </View>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Followers/Following Modal */}
      <Modal
        visible={isFollowersVisible || isFollowingVisible}
        animationType="slide"
        transparent={false}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => {
              setIsFollowersVisible(false);
              setIsFollowingVisible(false);
            }}>
              <ArrowLeft size={24} color="#1f2937" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {isFollowersVisible ? 'Followers' : 'Following'}
            </Text>
            <TouchableOpacity>
              <Search size={24} color="#1f2937" />
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={followersList}
            renderItem={renderFollowerItem}
            keyExtractor={(item) => item.id}
            style={styles.followersList}
            showsVerticalScrollIndicator={false}
          />
        </SafeAreaView>
      </Modal>

      {/* Post Detail Modal */}
      <Modal
        visible={isPostDetailVisible}
        animationType="fade"
        transparent={true}
      >
        <View style={styles.postDetailContainer}>
          <TouchableOpacity 
            style={styles.postDetailBackdrop} 
            onPress={() => setIsPostDetailVisible(false)}
          />
          <View style={styles.postDetailContent}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setIsPostDetailVisible(false)}
            >
              <X size={24} color="#fff" />
            </TouchableOpacity>
            {selectedPost && (
              <>
                <Image source={{ uri: selectedPost.uri }} style={styles.fullScreenImage} />
                <View style={styles.postDetailActions}>
                  <TouchableOpacity style={styles.actionButton}>
                    <Heart size={24} color="#fff" />
                    <Text style={styles.actionText}>{selectedPost.likes}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <MessageCircle size={24} color="#fff" />
                    <Text style={styles.actionText}>{selectedPost.comments}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <Share size={24} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <Bookmark size={24} color="#fff" />
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Create Story Modal */}
      <Modal
        visible={isStoryCreateVisible}
        animationType="slide"
        transparent={false}
      >
        <SafeAreaView style={styles.createStoryContainer}>
          <View style={styles.createStoryHeader}>
            <TouchableOpacity onPress={() => setIsStoryCreateVisible(false)}>
              <X size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.createStoryTitle}>Create Story</Text>
            <TouchableOpacity onPress={handleCreateStory}>
              <Text style={styles.createStoryDone}>Done</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.createStoryContent}>
            <Text style={styles.createStoryPlaceholder}>Camera interface would be here</Text>
            <TouchableOpacity style={styles.createStoryButton} onPress={handleCreateStory}>
              <Camera size={32} color="#fff" />
              <Text style={styles.createStoryButtonText}>Take Photo</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Archive Stories Modal */}
      <Modal
        visible={isArchiveVisible}
        animationType="slide"
        transparent={false}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setIsArchiveVisible(false)}>
              <ArrowLeft size={24} color="#1f2937" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Archived Stories</Text>
            <View style={{ width: 24 }} />
          </View>
          
          <FlatList
            data={stories.filter(story => story.isArchived)}
            renderItem={renderStoryItem}
            keyExtractor={(item) => item.id}
            numColumns={3}
            style={styles.archiveGrid}
            showsVerticalScrollIndicator={false}
          />
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
  storiesSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  storiesContainer: {
    marginBottom: 8,
  },
  addStoryButton: {
    alignItems: 'center',
    marginRight: 16,
  },
  addStoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f3f4f6',
    borderWidth: 2,
    borderColor: '#6366f1',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  storyLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontFamily: 'Inter-Medium',
  },
  storyItem: {
    alignItems: 'center',
    marginRight: 16,
  },
  storyImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#6366f1',
    marginBottom: 4,
  },
  storyTime: {
    fontSize: 10,
    color: '#9ca3af',
    fontFamily: 'Inter-Regular',
  },
  archiveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  archiveText: {
    fontSize: 12,
    color: '#6366f1',
    marginLeft: 4,
    fontFamily: 'Inter-Medium',
  },
  profileHeader: {
    padding: 20,
    alignItems: 'center',
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#6366f1',
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
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1f2937',
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
    lineHeight: 20,
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
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
    marginHorizontal: 20,
  },
  statNumber: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1f2937',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6366f1',
    paddingHorizontal: 32,
    paddingVertical: 12,
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
    backgroundColor: '#10b981',
    padding: 12,
    borderRadius: 8,
    marginRight: 8,
  },
  moreButton: {
    backgroundColor: '#f59e0b',
    padding: 12,
    borderRadius: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(243, 244, 246, 0.8)',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  postTypeFilter: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 8,
  },
  filterButton: {
    padding: 12,
    borderRadius: 8,
  },
  activeFilterButton: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
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
  videoIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    padding: 4,
  },
  reelIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    padding: 4,
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
    gap: 12,
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
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  editCameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#6366f1',
    borderRadius: 16,
    padding: 6,
    borderWidth: 2,
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
  settingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  settingsTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
  },
  settingsContent: {
    flex: 1,
  },
  settingsUserInfo: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  settingsAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  settingsUsername: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
    marginBottom: 4,
  },
  settingsFullName: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  settingsOptions: {
    flex: 1,
    padding: 16,
  },
  settingsOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  settingsOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsOptionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingsOptionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#1f2937',
    marginBottom: 2,
  },
  settingsOptionSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  logoutOption: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#fee2e2',
    paddingTop: 20,
  },
  followersList: {
    padding: 16,
  },
  followerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  followerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  followerInfo: {
    flex: 1,
  },
  followerUsername: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
    marginBottom: 2,
  },
  followerFullName: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  followButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  followingButton: {
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  followButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
  },
  followingButtonText: {
    color: '#6b7280',
  },
  postDetailContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  postDetailBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  postDetailContent: {
    width: screenWidth,
    height: screenHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  },
  fullScreenImage: {
    width: screenWidth,
    height: screenWidth,
    resizeMode: 'cover',
  },
  postDetailActions: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    alignItems: 'center',
  },
  actionButton: {
    alignItems: 'center',
    marginBottom: 20,
  },
  actionText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    marginTop: 4,
  },
  createStoryContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  createStoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  createStoryTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
  },
  createStoryDone: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#6366f1',
  },
  createStoryContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createStoryPlaceholder: {
    fontSize: 16,
    color: '#9ca3af',
    marginBottom: 40,
    fontFamily: 'Inter-Regular',
  },
  createStoryButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    flexDirection: 'row',
  },
  createStoryButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    marginLeft: 8,
  },
  archiveGrid: {
    padding: 16,
  },
});