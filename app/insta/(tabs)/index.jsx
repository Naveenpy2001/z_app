import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, StyleSheet, SafeAreaView, Animated, Dimensions, PanResponder, Easing, StatusBar, Modal, FlatList, RefreshControl, Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus, Heart, MessageCircle, Send, Bookmark, Camera, Video as VideoIcon, Mic, MoreHorizontal, Check, ChevronRight, BadgeCheck, HeartPlus, MessageSquarePlus, Forward, SendHorizontal, Bell, Volume2, VolumeX, UserPlus, UserMinus, X, Share, Flag, Edit3, Trash2, Copy } from 'lucide-react-native';
import { router } from 'expo-router';
import SwipeUpComments from '../../profile/components/SwipeUpComments';
import { Ionicons } from '@expo/vector-icons';
import { Video } from 'expo-av';
import { GestureHandlerRootView, PinchGestureHandler, TapGestureHandler, State } from 'react-native-gesture-handler';
import CreatePost from '../components/CreatePost';
import UserProfile from '../components/UserProfile';
import Stories from '../components/Stories';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Mock current user data
const CURRENT_USER = {
  id: 'current_user',
  username: 'your_username'
};

// Expanded data with more posts
const STORIES = [
  {
    id: '1',
    user: 'Your Story',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    isYourStory: true,
  },
  {
    id: '2',
    user: 'sarah_wilson',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
  },
  {
    id: '3',
    user: 'mike_adventures',
    avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
  },
  {
    id: '4',
    user: 'travel_guru',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
  },
  {
    id: '5',
    user: 'fitness_coach',
    avatar: 'https://images.pexels.com/photos/1229356/pexels-photo-1229356.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
  },
];

const POSTS = [
  {
    id: '1',
    user: {
      id: 'nature_explorer',
      username: 'nature_explorer',
      avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      isVerified: true,
      isFollowing: false,
      followers: '125k',
      following: '456',
      posts: '1.2k',
      bio: 'Adventure photographer 📸 | Mountain climber 🏔️ | Capturing nature\'s beauty'
    },
    media: [
      { type: 'image', uri: 'https://images.pexels.com/photos/814499/pexels-photo-814499.jpeg?auto=compress&cs=tinysrgb&w=800' },
      { type: 'image', uri: 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=800' },
      { type: 'image', uri: 'https://images.pexels.com/photos/15286/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800' }
    ],
    caption: 'Amazing sunset from the mountain peak! 🌄✨ #NaturePhotography #Adventure',
    likes: 2847,
    comments: 156,
    timeAgo: '2h',
    location: 'Rocky Mountains',
    isAuthor: false,
  },
  {
    id: '2',
    user: {
      id: 'current_user',
      username: 'your_username',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      isVerified: false,
      isFollowing: false,
      followers: '1.2k',
      following: '456',
      posts: '89',
      bio: 'Living my best life 🌟 | Coffee lover ☕ | Wanderlust soul 🌍'
    },
    media: [
      { type: 'video', uri: 'https://assets.mixkit.co/videos/preview/mixkit-woman-cooking-vegetables-on-the-kitchen-counter-39839-large.mp4', thumbnail: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800' }
    ],
    caption: 'Homemade pasta with fresh ingredients 🍝 Recipe in bio!',
    likes: 1923,
    comments: 89,
    timeAgo: '4h',
    location: 'My Kitchen',
    isAuthor: true,
  },
  {
    id: '3',
    user: {
      id: 'tech_enthusiast',
      username: 'tech_enthusiast',
      avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      isVerified: true,
      isFollowing: false,
      followers: '89.7k',
      following: '178',
      posts: '892',
      bio: 'Tech Reviewer | Latest gadgets & reviews | YouTube: TechEnthusiast'
    },
    media: [
      { type: 'image', uri: 'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=800' }
    ],
    caption: 'Just got the new MacBook Pro! The performance is insane. #Apple #Tech',
    likes: 3421,
    comments: 287,
    timeAgo: '6h',
    location: 'Apple Store',
    isAuthor: false,
  },
];

// Post Options Modal Component
const PostOptionsModal = ({ visible, onClose, post, onEdit, onDelete, onShare, onReport }) => {
  const isAuthor = post?.isAuthor;

  const authorOptions = [
    { icon: Edit3, text: 'Edit', action: onEdit, color: '#1f2937' },
    { icon: Trash2, text: 'Delete', action: onDelete, color: '#ef4444' },
    { icon: Share, text: 'Share', action: onShare, color: '#1f2937' },
  ];

  const viewerOptions = [
    { icon: Share, text: 'Share', action: onShare, color: '#1f2937' },
    { icon: Copy, text: 'Copy Link', action: () => {
      Alert.alert('Link copied!');
      onClose();
    }, color: '#1f2937' },
    { icon: Flag, text: 'Report', action: onReport, color: '#ef4444' },
  ];

  const options = isAuthor ? authorOptions : viewerOptions;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.modalOverlay} onPress={onClose}>
        <View style={styles.optionsModal}>
          <View style={styles.modalHandle} />
          <View style={styles.optionsContainer}>
            {options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.optionItem}
                onPress={option.action}
              >
                <option.icon size={20} color={option.color} />
                <Text style={[styles.optionText, { color: option.color }]}>
                  {option.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

// Enhanced Media Carousel Component
const MediaCarousel = ({ post, onDoubleTap }) => {
  const scrollViewRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState({});
  const [isMuted, setIsMuted] = useState({});

  const scrollToIndex = (index) => {
    scrollViewRef.current?.scrollTo({
      x: index * SCREEN_WIDTH,
      animated: true
    });
  };

  const onScroll = (event) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const viewSize = event.nativeEvent.layoutMeasurement;
    const pageNum = Math.floor(contentOffset.x / viewSize.width);
    setCurrentIndex(pageNum);
  };

  const toggleVideoPlayback = () => {
    setIsVideoPlaying(prev => ({
      ...prev,
      [post.id]: !prev[post.id]
    }));
  };

  const toggleMute = () => {
    setIsMuted(prev => ({
      ...prev,
      [post.id]: !prev[post.id]
    }));
  };

  return (
    <View style={styles.mediaContainer}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        style={styles.mediaScrollView}
      >
        {post.media.map((media, index) => (
          <View key={index} style={styles.mediaItem}>
            {media.type === 'image' ? (
              <TapGestureHandler
                numberOfTaps={2}
                onHandlerStateChange={({ nativeEvent }) => {
                  if (nativeEvent.state === State.ACTIVE) {
                    onDoubleTap(post.id);
                  }
                }}
              >
                <Animated.View style={styles.imageContainer}>
                  <Image 
                    source={{ uri: media.uri }} 
                    style={styles.postImage}
                    resizeMode="cover"
                  />
                </Animated.View>
              </TapGestureHandler>
            ) : (
              <View style={styles.videoContainer}>
                <Video
                  source={{ uri: media.uri }}
                  style={styles.videoPlayer}
                  shouldPlay={isVideoPlaying[post.id] !== false}
                  isLooping
                  resizeMode="cover"
                  isMuted={isMuted[post.id] !== false}
                  onPlaybackStatusUpdate={(status) => {
                    if (status.didJustFinish) {
                      setIsVideoPlaying(prev => ({ ...prev, [post.id]: false }));
                    }
                  }}
                />
                <TouchableOpacity
                  style={styles.muteButton}
                  onPress={toggleMute}
                >
                  {isMuted[post.id] !== false ? (
                    <VolumeX size={20} color="#fff" />
                  ) : (
                    <Volume2 size={20} color="#fff" />
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.videoOverlay}
                  onPress={toggleVideoPlayback}
                >
                  {isVideoPlaying[post.id] === false && (
                    <View style={styles.playButtonIcon}>
                      <Ionicons name="play" size={40} color="#fff" />
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {/* Improved Media Indicators */}
      {post.media.length > 1 && (
        <View style={styles.mediaIndicatorsContainer}>
          <View style={styles.mediaIndicators}>
            {post.media.map((_, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.mediaIndicator,
                  index === currentIndex && styles.activeMediaIndicator
                ]}
                onPress={() => scrollToIndex(index)}
              />
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

export default function FeedScreen() {
  const [showComments, setShowComments] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [savedPosts, setSavedPosts] = useState(new Set());
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [followingUsers, setFollowingUsers] = useState(new Set(['food_lover', 'fitness_coach', 'beach_vibes', 'coffee_culture']));
  const [refreshing, setRefreshing] = useState(false);
  const [showPostOptions, setShowPostOptions] = useState(false);
  const [selectedPostForOptions, setSelectedPostForOptions] = useState(null);
  
  // Animation values
  const likeAnimations = useRef({}).current;
  
  // Initialize like animations for each post
  useEffect(() => {
    POSTS.forEach(post => {
      if (!likeAnimations[post.id]) {
        likeAnimations[post.id] = {
          scale: new Animated.Value(0),
          opacity: new Animated.Value(0)
        };
      }
    });
  }, []);

  // Handle pull to refresh
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  const handleLike = (postId) => {
    const newLikedPosts = new Set(likedPosts);
    if (newLikedPosts.has(postId)) {
      newLikedPosts.delete(postId);
    } else {
      newLikedPosts.add(postId);
      triggerLikeAnimation(postId);
    }
    setLikedPosts(newLikedPosts);
  };

  const triggerLikeAnimation = (postId) => {
    const animation = likeAnimations[postId];
    if (!animation) return;

    // Reset values
    animation.scale.setValue(0);
    animation.opacity.setValue(0);

    // Animation sequence
    Animated.parallel([
      Animated.sequence([
        Animated.timing(animation.scale, {
          toValue: 1.2,
          duration: 150,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true
        }),
        Animated.timing(animation.scale, {
          toValue: 1,
          duration: 100,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true
        })
      ]),
      Animated.sequence([
        Animated.timing(animation.opacity, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true
        }),
        Animated.delay(200),
        Animated.timing(animation.opacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true
        })
      ])
    ]).start();
  };

  const handleDoubleTap = (postId) => {
    if (!likedPosts.has(postId)) {
      const newLikedPosts = new Set(likedPosts);
      newLikedPosts.add(postId);
      setLikedPosts(newLikedPosts);
      triggerLikeAnimation(postId);
    }
  };

  const handleSave = (postId) => {
    const newSavedPosts = new Set(savedPosts);
    if (newSavedPosts.has(postId)) {
      newSavedPosts.delete(postId);
    } else {
      newSavedPosts.add(postId);
    }
    setSavedPosts(newSavedPosts);
  };

  const handleComments = (postId) => {
    setSelectedPost(postId);
    setShowComments(true);
  };

  const handleUserPress = (user) => {
    setSelectedUser(user);
    setShowUserProfile(true);
  };

  const handleMoreOptions = (post) => {
    setSelectedPostForOptions(post);
    setShowPostOptions(true);
  };

  const handleEdit = () => {
    setShowPostOptions(false);
    Alert.alert('Edit Post', 'Edit functionality would be implemented here');
  };

  const handleDelete = () => {
    setShowPostOptions(false);
    Alert.alert(
      'Delete Post',
      'Are you sure you want to delete this post?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {
          Alert.alert('Post deleted!');
        }}
      ]
    );
  };

  const handleShare = () => {
    setShowPostOptions(false);
    router.push('/messaging');
  };

  const handleReport = () => {
    setShowPostOptions(false);
    Alert.alert('Report Post', 'Thank you for your report. We\'ll review it shortly.');
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LinearGradient
        colors={['#fef7ff', '#f3e8ff', '#e9d5ff']}
        style={styles.container}
      >
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={onRefresh}
              style={styles.logoContainer}
            >
              <LinearGradient
                colors={['#8b5cf6', '#a855f7', '#c084fc']}
                style={styles.logoGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.headerTitle}>Z</Text>
              </LinearGradient>
              <Text style={styles.appName}>ingsta</Text>
            </TouchableOpacity>
            
            <View style={styles.headerActions}>
              <TouchableOpacity 
                onPress={() => router.push('/insta/notification')}
                style={styles.headerIconButton}
              >
                <LinearGradient
                  colors={['#ff6b6b', '#ff8e8e']}
                  style={styles.iconGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Bell size={20} color="#ffffff" />
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push('/messaging')}
                style={styles.headerIconButton}
              >
                <LinearGradient
                  colors={['#4facfe', '#00f2fe']}
                  style={styles.iconGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <MessageCircle size={20} color="#ffffff" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView 
            style={styles.content} 
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={16}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#8b5cf6', '#a855f7']}
                tintColor="#8b5cf6"
                title="Refreshing..."
                titleColor="#8b5cf6"
              />
            }
          >
           {/* story */}
           <Stories />

            <CreatePost />
            
            {/* Posts */}
            {POSTS.map((post) => (
              <View key={post.id} style={styles.postContainer}>
                {/* Post Header */}
                <View style={styles.postHeader}>
                  <TouchableOpacity 
                    style={styles.postUserInfo}
                    onPress={() => handleUserPress(post.user)}
                  >
                    <Image source={{ uri: post.user.avatar }} style={styles.postUserAvatar} />
                    <View style={styles.postUserDetails}>
                      <View style={styles.usernameContainer}>
                        <Text style={styles.postUsername}>{post.user.username}</Text>
                        {post.user.isVerified && (
                          <LinearGradient
                            colors={['#1d9bf0', '#0ea5e9']}
                            style={styles.verifiedBadge}
                          >
                            <BadgeCheck size={14} color="#ffffff" />
                          </LinearGradient>
                        )}
                      </View>
                      <Text style={styles.postLocation}>{post.location} • {post.timeAgo}</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.moreButton}
                    onPress={() => handleMoreOptions(post)}
                  >
                    <MoreHorizontal size={20} color="#6b7280" />
                  </TouchableOpacity>
                </View>

                {/* Post Media with Like Animation */}
                <View style={styles.mediaWrapper}>
                  <MediaCarousel post={post} onDoubleTap={handleDoubleTap} />
                  
                  {/* Like animation overlay */}
                  {likedPosts.has(post.id) && likeAnimations[post.id] && (
                    <Animated.View 
                      style={[
                        styles.likeAnimation, 
                        { 
                          transform: [{ scale: likeAnimations[post.id].scale }],
                          opacity: likeAnimations[post.id].opacity
                        }
                      ]}
                    >
                      <HeartPlus size={100} color="#ff3040" fill="#ff3040" />
                    </Animated.View>
                  )}
                </View>

                {/* Post Actions */}
                <View style={styles.postActions}>
                  <View style={styles.leftActions}>
                    <TouchableOpacity
                      onPress={() => handleLike(post.id)}
                      style={styles.actionButton}
                    >
                      <HeartPlus  
                        size={26} 
                        color={likedPosts.has(post.id) ? '#ff3040' : '#1f2937'} 
                        fill={likedPosts.has(post.id) ? '#ff3040' : 'none'}
                      />
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      onPress={() => handleComments(post.id)}
                      style={styles.actionButton}
                    >
                      <MessageSquarePlus size={26} color="#1f2937" />
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      onPress={() => router.push('/messaging')}
                      style={styles.actionButton}
                    >
                      <Forward size={26} color="#1f2937" />
                    </TouchableOpacity>
                  </View>
                  
                  <TouchableOpacity
                    onPress={() => handleSave(post.id)}
                    style={styles.actionButton}
                  >
                    <Bookmark 
                      size={26} 
                      color={savedPosts.has(post.id) ? '#8b5cf6' : '#1f2937'} 
                      fill={savedPosts.has(post.id) ? '#8b5cf6' : 'none'}
                    />
                  </TouchableOpacity>
                </View>

                {/* Post Content */}
                <View style={styles.postContent}>
                  <Text style={styles.likesCount}>
                    {(post.likes + (likedPosts.has(post.id) ? 1 : 0)).toLocaleString()} likes
                  </Text>
                  <Text style={styles.postCaption}>
                    <Text style={styles.captionUsername}>{post.user.username}</Text> {post.caption}
                  </Text>
                  <TouchableOpacity onPress={() => handleComments(post.id)}>
                    <Text style={styles.viewComments}>
                      View all {post.comments} comments
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* User Profile Modal */}
          <UserProfile
            visible={showUserProfile}
            user={selectedUser}
            onClose={() => setShowUserProfile(false)}
          />

          {/* Post Options Modal */}
          <PostOptionsModal
            visible={showPostOptions}
            onClose={() => setShowPostOptions(false)}
            post={selectedPostForOptions}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onShare={handleShare}
            onReport={handleReport}
          />

          {/* Comments Modal */}
          <SwipeUpComments
            visible={showComments}
            onClose={() => setShowComments(false)}
            postId={selectedPost || ''}
            onShare={() => router.push('/messaging')}
          />
        </SafeAreaView>
      </LinearGradient>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  safeArea: {
    flex: 1,
    paddingTop: 35
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  logoGradient: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  headerTitle: {
    color: '#ffffff',
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    fontWeight: '900',
  },
  appName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    letterSpacing: 3,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  headerIconButton: {
    padding: 2,
  },
  iconGradient: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  content: {
    flex: 1,
    backgroundColor: '#ffffff',
  },


  postContainer: {
    backgroundColor: '#ffffff',
    marginBottom: 20,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  postUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  postUserAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 12,
    borderWidth: 1.5,
    borderColor: '#f3f4f6',
  },
  postUserDetails: {
    flex: 1,
  },
  usernameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postUsername: {
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
    fontWeight: '600',
  },
  verifiedBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    marginLeft: 6,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1d9bf0',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  postLocation: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    marginTop: 2,
  },
  moreButton: {
    padding: 8,
    borderRadius: 20,
  },
  mediaWrapper: {
    position: 'relative',
  },
  mediaContainer: {
    width: '100%',
    height: SCREEN_WIDTH * 1.25,
    position: 'relative',
    backgroundColor: '#000',
  },
  mediaScrollView: {
    flex: 1,
  },
  mediaItem: {
    width: SCREEN_WIDTH,
    height: '100%',
  },
  imageContainer: {
    width: '100%',
    height: '100%',
  },
  postImage: {
    width: '100%',
    height: '100%',
  },
  videoContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  videoPlayer: {
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 90,
  },
  playButtonIcon: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 50,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  muteButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  likeAnimation: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -50,
    marginTop: -50,
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaIndicatorsContainer: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  mediaIndicators: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  mediaIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    marginHorizontal: 3,
  },
  activeMediaIndicator: {
    backgroundColor: '#ffffff',
    width: 24,
    height: 8,
    borderRadius: 4,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  actionButton: {
    padding: 4,
  },
  postContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  likesCount: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
    marginBottom: 8,
    fontWeight: '600',
  },
  postCaption: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1f2937',
    lineHeight: 20,
    marginBottom: 8,
  },
  captionUsername: {
    fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
  },
  viewComments: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  optionsModal: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 34,
    maxHeight: '70%',
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#d1d5db',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  optionsContainer: {
    paddingHorizontal: 20,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#f3f4f6',
  },
  optionText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginLeft: 16,
    fontWeight: '500',
  },
});