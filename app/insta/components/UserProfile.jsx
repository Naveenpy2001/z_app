import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  StyleSheet, 
  Dimensions, 
  Alert 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  X, 
  MoreHorizontal, 
  BadgeCheck, 
  MessageCircle, 
  UserPlus, 
  UserMinus,
  Grid3X3,
  Heart,
  MessageSquare,
  Play
} from 'lucide-react-native';
import { router } from 'expo-router';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Mock user posts data
const generateUserPosts = (count = 12) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `post_${i}`,
    image: `https://images.pexels.com/photos/${1000000 + i * 123}/pexels-photo-${1000000 + i * 123}.jpeg?auto=compress&cs=tinysrgb&w=400`,
    type: i % 4 === 0 ? 'video' : 'image',
    likes: Math.floor(Math.random() * 5000) + 100,
    comments: Math.floor(Math.random() * 200) + 10,
    isMultiple: i % 3 === 0,
  }));
};

const UserProfile = ({ visible, user, onClose }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [userPosts] = useState(generateUserPosts());
  const [activeTab, setActiveTab] = useState('posts');

  if (!user) return null;

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    Alert.alert(
      isFollowing ? 'Unfollowed' : 'Following',
      `You ${isFollowing ? 'unfollowed' : 'are now following'} ${user.username}`
    );
  };

  const handleMessage = () => {
    onClose();
    router.push('/messaging');
  };

  const handlePostPress = (post) => {
    Alert.alert('Post', 'Would open post detail view');
  };

  const PostGridItem = ({ post }) => (
    <TouchableOpacity 
      style={styles.gridItem}
      onPress={() => handlePostPress(post)}
    >
      <Image source={{ uri: post.image }} style={styles.gridImage} />
      
      {/* Post type indicators */}
      {post.type === 'video' && (
        <View style={styles.videoIndicator}>
          <Play size={16} color="#ffffff" fill="#ffffff" />
        </View>
      )}
      
      {post.isMultiple && (
        <View style={styles.multipleIndicator}>
          <View style={styles.multipleIcon} />
          <View style={[styles.multipleIcon, styles.multipleIconOffset]} />
        </View>
      )}

      {/* Hover overlay with stats */}
      <View style={styles.postOverlay}>
        <View style={styles.postStats}>
          <View style={styles.statItem}>
            <Heart size={16} color="#ffffff" fill="#ffffff" />
            <Text style={styles.statText}>{post.likes.toLocaleString()}</Text>
          </View>
          <View style={styles.statItem}>
            <MessageSquare size={16} color="#ffffff" />
            <Text style={styles.statText}>{post.comments}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#1f2937" />
          </TouchableOpacity>
          
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>{user.username}</Text>
            {user.isVerified && (
              <LinearGradient
                colors={['#1d9bf0', '#0ea5e9']}
                style={styles.verifiedBadge}
              >
                <BadgeCheck size={16} color="#ffffff" />
              </LinearGradient>
            )}
          </View>
          
          <TouchableOpacity style={styles.moreButton}>
            <MoreHorizontal size={24} color="#1f2937" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Profile Info Section */}
          <View style={styles.profileSection}>
            <View style={styles.profileHeader}>
              <View style={styles.avatarContainer}>
                <LinearGradient
                  colors={['#8b5cf6', '#a855f7', '#c084fc']}
                  style={styles.avatarGradient}
                >
                  <Image source={{ uri: user.avatar }} style={styles.avatar} />
                </LinearGradient>
              </View>
              
              <View style={styles.statsContainer}>
                <View style={styles.statColumn}>
                  <Text style={styles.statNumber}>{user.posts}</Text>
                  <Text style={styles.statLabel}>Posts</Text>
                </View>
                <View style={styles.statColumn}>
                  <Text style={styles.statNumber}>{user.followers}</Text>
                  <Text style={styles.statLabel}>Followers</Text>
                </View>
                <View style={styles.statColumn}>
                  <Text style={styles.statNumber}>{user.following}</Text>
                  <Text style={styles.statLabel}>Following</Text>
                </View>
              </View>
            </View>

            {/* Bio Section */}
            <View style={styles.bioSection}>
              <Text style={styles.displayName}>{user.username}</Text>
              <Text style={styles.bio}>{user.bio}</Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.followButton, isFollowing && styles.followingButton]}
                onPress={handleFollow}
              >
                <LinearGradient
                  colors={isFollowing ? ['#f3f4f6', '#f3f4f6'] : ['#8b5cf6', '#a855f7']}
                  style={styles.buttonGradient}
                >
                  {isFollowing ? (
                    <UserMinus size={16} color="#1f2937" />
                  ) : (
                    <UserPlus size={16} color="#ffffff" />
                  )}
                  <Text style={[styles.buttonText, isFollowing && styles.followingButtonText]}>
                    {isFollowing ? 'Following' : 'Follow'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionButton, styles.messageButton]}
                onPress={handleMessage}
              >
                <MessageCircle size={16} color="#1f2937" />
                <Text style={styles.messageButtonText}>Message</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Content Tabs */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'posts' && styles.activeTab]}
              onPress={() => setActiveTab('posts')}
            >
              <Grid3X3 size={20} color={activeTab === 'posts' ? '#8b5cf6' : '#6b7280'} />
              <Text style={[styles.tabText, activeTab === 'posts' && styles.activeTabText]}>
                Posts
              </Text>
            </TouchableOpacity>
          </View>

          {/* Posts Grid */}
          {activeTab === 'posts' && (
            <View style={styles.postsGrid}>
              {userPosts.map((post) => (
                <PostGridItem key={post.id} post={post} />
              ))}
            </View>
          )}

          {/* Empty state if no posts */}
          {userPosts.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No posts yet</Text>
              <Text style={styles.emptyStateSubtext}>
                When {user.username} shares photos, they'll appear here.
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    backgroundColor: '#ffffff',
  },
  closeButton: {
    padding: 8,
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
    fontWeight: '600',
  },
  verifiedBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginLeft: 6,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1d9bf0',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  moreButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  profileSection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    marginRight: 24,
  },
  avatarGradient: {
    width: 94,
    height: 94,
    borderRadius: 47,
    padding: 3,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 44,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  statsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statColumn: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1f2937',
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    marginTop: 2,
  },
  bioSection: {
    marginBottom: 24,
  },
  displayName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
    fontWeight: '600',
    marginBottom: 4,
  },
  bio: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
  },
  buttonText: {
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    fontWeight: '600',
  },
  followButton: {
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  followingButton: {
    shadowColor: 'transparent',
  },
  followingButtonText: {
    color: '#1f2937',
  },
  messageButton: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
  },
  messageButtonText: {
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
    fontWeight: '600',
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    backgroundColor: '#ffffff',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#8b5cf6',
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#8b5cf6',
  },
  postsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 1,
  },
  gridItem: {
    width: (SCREEN_WIDTH - 6) / 3,
    height: (SCREEN_WIDTH - 6) / 3,
    margin: 1,
    position: 'relative',
    backgroundColor: '#f3f4f6',
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  videoIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 12,
    padding: 4,
  },
  multipleIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
  },
  multipleIcon: {
    width: 6,
    height: 6,
    backgroundColor: '#ffffff',
    borderRadius: 3,
    marginLeft: 2,
  },
  multipleIconOffset: {
    marginTop: 2,
  },
  postOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0,
  },
  postStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default UserProfile;