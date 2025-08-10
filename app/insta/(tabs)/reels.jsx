import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  PanResponder,
  AppState,
  StatusBar,
  Alert,
  Modal,
  ScrollView,
  Vibration,
} from 'react-native';
import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  ChevronDown,
  Heart,
  MessageCircle,
  Send,
  Music,
  Bookmark,
  MoreVertical,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Share,
  Flag,
  Download,
  Copy,
  UserX,
} from 'lucide-react-native';
import { Video } from 'expo-av';
import CommentsSheet from '../../components/CommentsSheet';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Various video sources for diverse content
const videoSources = [
  {
    uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    type: 'landscape',
    category: 'nature'
  },
  {
    uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    type: 'animation',
    category: 'creative'
  },
  {
    uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    type: 'animation',
    category: 'entertainment'
  },
  {
    uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    type: 'short-film',
    category: 'drama'
  },
  {
    uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    type: 'sci-fi',
    category: 'action'
  },
  {
    uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
    type: 'review',
    category: 'automotive'
  },
  {
    uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    type: 'adventure',
    category: 'travel'
  },
  {
    uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
    type: 'lifestyle',
    category: 'automotive'
  },
  {
    uri: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    type: 'demo',
    category: 'tech'
  },
  {
    uri: 'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4',
    type: 'sample',
    category: 'demo'
  },
  {
    uri: 'https://file-examples.com/storage/fe68c8777ec59e45bbe62eb/2017/10/file_example_MP4_1920_18MG.mp4',
    type: 'nature',
    category: 'wildlife'
  },
  {
    uri: 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4',
    type: 'trailer',
    category: 'animation'
  },
  // Backup videos in case some don't work
  {
    uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    type: 'adventure',
    category: 'travel'
  },
  {
    uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    type: 'entertainment',
    category: 'fun'
  },
  {
    uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    type: 'lifestyle',
    category: 'automotive'
  },
];

// Creative usernames and content
const usernames = [
  'travel_explorer', 'tech_guru', 'food_lover', 'fitness_freak', 'art_creator',
  'music_producer', 'photographer', 'dancer_pro', 'comedian_king', 'nature_lover',
  'car_enthusiast', 'adventure_seeker', 'creative_mind', 'lifestyle_blogger', 'film_maker'
];

const descriptions = [
  "Mind-blowing content! Can't believe this is real 🤯",
  "This took me 3 days to perfect! Worth every second ✨",
  "Tutorial coming soon! Drop a ❤️ if you want to see it",
  "Behind the scenes was even crazier than this! 🎬",
  "When passion meets creativity... this happens 🔥",
  "Plot twist: This was all done in one take! 🎯",
  "The amount of practice this took... insane! 💪",
  "Sometimes you just have to go for it! YOLO 🚀",
  "This location is absolutely stunning! 🌟",
  "Can you guess how we filmed this? 🤔",
  "The final result exceeded all expectations! ⚡",
  "This is what happens when creativity has no limits 🎨",
  "Breaking the internet one video at a time 📱",
  "The reaction was priceless! Had to share 😂",
  "This trend is taking over! Join the movement 🌊"
];

const audioTracks = [
  "Original Audio", "Trending Song 2024", "Viral Sound Effect", "Custom Mix",
  "Popular Remix", "Background Music", "Trending Audio", "Original Soundtrack",
  "Viral TikTok Sound", "Epic Music Mix", "Chill Vibes", "Upbeat Track",
  "Emotional Melody", "Dance Beat", "Acoustic Version"
];

const data = Array.from({ length: 15 }, (_, i) => ({
  id: i,
  uri: videoSources[i % videoSources.length].uri,
  type: videoSources[i % videoSources.length].type,
  category: videoSources[i % videoSources.length].category,
  username: usernames[i % usernames.length],
  description: descriptions[i % descriptions.length],
  likes: Math.floor(Math.random() * 50000) + 1000, // 1K to 50K likes
  comments: Math.floor(Math.random() * 5000) + 50, // 50 to 5K comments
  shares: Math.floor(Math.random() * 2000) + 25, // 25 to 2K shares
  audio: audioTracks[i % audioTracks.length],
  isLiked: Math.random() > 0.7, // 30% chance of being liked
  isBookmarked: Math.random() > 0.8, // 20% chance of being bookmarked
  commentsList: [
    { 
      id: 1, 
      user: usernames[Math.floor(Math.random() * usernames.length)], 
      text: ['Amazing! 🔥', 'This is incredible!', 'How did you do this?', 'Tutorial please!', 'Mind blown 🤯'][Math.floor(Math.random() * 5)], 
      time: ['2h ago', '1h ago', '45m ago', '30m ago', '15m ago'][Math.floor(Math.random() * 5)] 
    },
    { 
      id: 2, 
      user: usernames[Math.floor(Math.random() * usernames.length)], 
      text: ['Love this content!', 'Can you teach me?', 'So creative! ✨', 'This deserves more views', 'Absolutely stunning!'][Math.floor(Math.random() * 5)], 
      time: ['3h ago', '2h ago', '1h ago', '30m ago', '10m ago'][Math.floor(Math.random() * 5)] 
    },
    { 
      id: 3, 
      user: usernames[Math.floor(Math.random() * usernames.length)], 
      text: ['First! 🥇', 'Notifications on for this creator', 'This trend is fire 🔥', 'Share this everywhere!', 'Best reel today!'][Math.floor(Math.random() * 5)], 
      time: ['4h ago', '3h ago', '2h ago', '1h ago', '5m ago'][Math.floor(Math.random() * 5)] 
    },
  ],
}));

export default function Reels({ navigation }) {
  const [coins, setCoins] = useState(42);
  const [currentReelId, setCurrentReelId] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [progress, setProgress] = useState(0);
  const [appState, setAppState] = useState(AppState.currentState);
  const [isMuted, setIsMuted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [reelsData, setReelsData] = useState(data);
  const [isLongPressing, setIsLongPressing] = useState(false);
  
  const videoRefs = useRef([]);
  const coinAnim = useRef(new Animated.Value(1)).current;
  const likeAnim = useRef(new Animated.Value(0)).current;
  const muteButtonAnim = useRef(new Animated.Value(0)).current;
  const pauseIconAnim = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  const longPressTimer = useRef(null);

  // Award coin animation
  const awardCoin = () => {
    setCoins(prev => prev + 1);
    Animated.sequence([
      Animated.timing(coinAnim, {
        toValue: 1.3,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(coinAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Like animation
  const animateLike = () => {
    Animated.sequence([
      Animated.timing(likeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(likeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Mute button animation
  const animateMuteButton = () => {
    Animated.sequence([
      Animated.timing(muteButtonAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.delay(1000),
      Animated.timing(muteButtonAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Pause icon animation
  const animatePauseIcon = (show) => {
    Animated.timing(pauseIconAnim, {
      toValue: show ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  // Handle viewable items change
  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const newId = viewableItems[0].item.id;
      if (newId !== currentReelId) {
        // Pause previous video
        if (videoRefs.current[currentReelId]) {
          videoRefs.current[currentReelId].pauseAsync();
        }
        
        setCurrentReelId(newId);
        setProgress(0);
        setIsPaused(false);
        awardCoin();
        
        // Play current video
        setTimeout(() => {
          if (videoRefs.current[newId] && appState === 'active') {
            videoRefs.current[newId].playAsync();
          }
        }, 100);
      }
    }
  }, [currentReelId, appState]);

  // Pan responder for swipe controls
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => false,
    onMoveShouldSetPanResponder: (_, gesture) => {
      return Math.abs(gesture.dy) > 10 && Math.abs(gesture.dx) < 50;
    },
    onPanResponderGrant: () => {
      // Optional: Add haptic feedback
      Vibration.vibrate(10);
    },
    onPanResponderMove: (_, gesture) => {
      // Optional: Add visual feedback during swipe
    },
    onPanResponderRelease: (_, gesture) => {
      if (gesture.dy < -50 && currentReelId < reelsData.length - 1) {
        // Swipe up - next reel
        scrollToReel(currentReelId + 1);
      } else if (gesture.dy > 50 && currentReelId > 0) {
        // Swipe down - previous reel
        scrollToReel(currentReelId - 1);
      }
    },
  });

  // Scroll to specific reel
  const scrollToReel = (index) => {
    if (flatListRef.current && index >= 0 && index < reelsData.length) {
      flatListRef.current.scrollToIndex({ index, animated: true });
    }
  };

  // Handle app state changes
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState === 'active' && nextAppState.match(/inactive|background/)) {
        // Pause all videos when app goes to background or tab changes
        videoRefs.current.forEach(ref => ref?.pauseAsync());
        setIsPaused(true);
      } else if (nextAppState === 'active' && appState.match(/inactive|background/)) {
        // Resume current video when app comes to foreground
        if (videoRefs.current[currentReelId] && !isLongPressing) {
          videoRefs.current[currentReelId].playAsync();
          setIsPaused(false);
        }
      }
      setAppState(nextAppState);
    });
    
    return () => subscription?.remove();
  }, [appState, currentReelId, isLongPressing]);

  // Handle component unmount (when leaving reels tab)
  useEffect(() => {
    return () => {
      // Stop all videos when component unmounts
      videoRefs.current.forEach(ref => ref?.pauseAsync());
    };
  }, []);

  // Handle tap to mute/unmute
  const handleTapToMute = () => {
    setIsMuted(!isMuted);
    
    // Quick mute button animation (faster)
    Animated.sequence([
      Animated.timing(muteButtonAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.delay(800),
      Animated.timing(muteButtonAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Apply mute/unmute to current video immediately
    if (videoRefs.current[currentReelId]) {
      videoRefs.current[currentReelId].setIsMutedAsync(!isMuted);
    }
  };

  // Handle double tap to like
  const handleDoubleTap = (id) => {
    const updatedData = reelsData.map(item => 
      item.id === id 
        ? { ...item, isLiked: !item.isLiked, likes: item.isLiked ? item.likes - 1 : item.likes + 1 }
        : item
    );
    setReelsData(updatedData);
    animateLike();
    Vibration.vibrate(50);
  };

  // Handle long press to pause
  const handleLongPress = () => {
    setIsLongPressing(true);
    if (videoRefs.current[currentReelId]) {
      videoRefs.current[currentReelId].pauseAsync();
      setIsPaused(true);
      // Removed pause icon animation
    }
  };

  // Handle long press release
  const handlePressOut = () => {
    if (isLongPressing) {
      setIsLongPressing(false);
      if (videoRefs.current[currentReelId] && appState === 'active') {
        videoRefs.current[currentReelId].playAsync();
        setIsPaused(false);
        // Removed pause icon animation
      }
    }
  };

  // Handle bookmark
  const handleBookmark = (id) => {
    const updatedData = reelsData.map(item => 
      item.id === id ? { ...item, isBookmarked: !item.isBookmarked } : item
    );
    setReelsData(updatedData);
  };

  // Handle more options
  const handleMoreOptions = () => {
    setShowMoreOptions(true);
  };

  // More options data
  const moreOptions = [
    { icon: Share, label: 'Share', action: () => Alert.alert('Share', 'Share functionality') },
    { icon: Download, label: 'Save to Gallery', action: () => Alert.alert('Save', 'Save functionality') },
    { icon: Copy, label: 'Copy Link', action: () => Alert.alert('Copy', 'Link copied!') },
    { icon: Flag, label: 'Report', action: () => Alert.alert('Report', 'Report functionality') },
    { icon: UserX, label: 'Not Interested', action: () => Alert.alert('Not Interested', 'Marked as not interested') },
  ];

  // Render more options modal
  const renderMoreOptions = () => (
    <Modal
      visible={showMoreOptions}
      transparent
      animationType="slide"
      onRequestClose={() => setShowMoreOptions(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <View style={styles.modalHandle} />
          </View>
          <ScrollView>
            {moreOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.optionItem}
                onPress={() => {
                  setShowMoreOptions(false);
                  option.action();
                }}
              >
                <option.icon size={24} color="#333" />
                <Text style={styles.optionText}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  // Render individual reel
  const renderItem = ({ item, index }) => (
    <View style={styles.reelContainer} {...panResponder.panHandlers}>
      <TouchableOpacity
        activeOpacity={1}
        onLongPress={handleLongPress}
        onPressOut={handlePressOut}
        onPress={handleTapToMute}
        style={styles.videoTouchArea}
      >
        <Video
          ref={ref => (videoRefs.current[index] = ref)}
          source={{ uri: item.uri }}
          style={styles.video}
          resizeMode="cover"
          isLooping
          shouldPlay={index === currentReelId && !isPaused && appState === 'active'}
          isMuted={isMuted}
          onPlaybackStatusUpdate={status => {
            if (status.isLoaded && index === currentReelId) {
              setProgress(status.positionMillis / status.durationMillis);
            }
          }}
          useNativeControls={false}
        />
      </TouchableOpacity>

      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
      </View>

      {/* Overlay UI */}
      <View style={styles.overlay}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity 
            onPress={() => navigation?.navigate('/insta')}
            style={styles.backButton}
          >
            <ChevronDown size={28} color="white" />
          </TouchableOpacity>
          
          <View style={styles.topRightContainer}>
            <Animated.View style={[styles.coinCounter, { transform: [{ scale: coinAnim }] }]}>
              <Text style={styles.coinText}>💰 {coins}</Text>
            </Animated.View>
          </View>
        </View>

        {/* Center Pause Icon - Removed */}

        {/* Mute Button Animation */}
        <Animated.View 
          style={[
            styles.muteButton, 
            { 
              opacity: muteButtonAnim,
              transform: [{ scale: muteButtonAnim }]
            }
          ]}
        >
          <View style={styles.muteButtonContainer}>
            {isMuted ? <VolumeX size={28} color="white" /> : <Volume2 size={28} color="white" />}
          </View>
        </Animated.View>

        {/* Like Animation */}
        <Animated.View 
          style={[
            styles.likeAnimation, 
            { 
              opacity: likeAnim,
              transform: [
                { scale: likeAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 1.5] }) },
                { rotate: likeAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '15deg'] }) }
              ]
            }
          ]}
        >
          <Heart size={80} color="#ff3040" fill="#ff3040" />
        </Animated.View>

        {/* Right Actions */}
        <View style={styles.rightActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleDoubleTap(item.id)}
          >
            <Heart 
              size={32} 
              color="white" 
              fill={item.isLiked ? '#ff3040' : 'transparent'}
            />
            <Text style={styles.actionText}>{item.likes}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => setShowComments(true)}
          >
            <MessageCircle size={32} color="white" />
            <Text style={styles.actionText}>{item.comments}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Send size={32} color="white" />
            <Text style={styles.actionText}>{item.shares}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleBookmark(item.id)}
          >
            <Bookmark 
              size={32} 
              color="white" 
              fill={item.isBookmarked ? 'white' : 'transparent'}
            />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleMoreOptions}
          >
            <MoreVertical size={32} color="white" />
          </TouchableOpacity>

          {/* Audio Button */}
          <TouchableOpacity style={[styles.actionButton, styles.audioButton]}>
            <View style={styles.audioIconContainer}>
              <Music size={20} color="white" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Bottom Container */}
        <View style={styles.bottomContainer}>
          <View style={styles.userInfo}>
            <Text style={styles.username}>@{item.username}</Text>
          </View>
          
          <View style={styles.descriptionContainer}>
            <Text style={styles.description} numberOfLines={2}>
              {item.description}
            </Text>
            <TouchableOpacity style={styles.followButton}>
              <Text style={styles.followButtonText}>Follow</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.audioRow}>
            <Music size={16} color="white" />
            <Text style={styles.audioName} numberOfLines={1}>
              {item.audio}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="black" />
      
      <FlatList
        ref={flatListRef}
        data={reelsData}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 70 }}
        snapToInterval={screenHeight}
        snapToAlignment="start"
        decelerationRate="fast"
        removeClippedSubviews={true}
        maxToRenderPerBatch={3}
        windowSize={3}
      />

      <CommentsSheet
        visible={showComments}
        onClose={() => setShowComments(false)}
        comments={reelsData[currentReelId]?.commentsList || []}
      />

      {renderMoreOptions()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  reelContainer: {
    width: screenWidth,
    height: screenHeight,
    position: 'relative',
  },
  videoTouchArea: {
    flex: 1,
  },
  video: {
    flex: 1,
  },
  progressBarContainer: {
    position: 'absolute',
    bottom: 100,
    left: 16,
    right: 80,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 50,
  },
  backButton: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 25,
    padding: 8,
  },
  topRightContainer: {
    alignItems: 'flex-end',
  },
  coinCounter: {
    backgroundColor: 'rgba(255, 215, 0, 0.9)',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  coinText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 14,
  },
  centerIcon: {
    position: 'absolute',
    alignSelf: 'center',
    top: '45%',
  },
  pauseIconContainer: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 50,
    padding: 20,
  },
  muteButton: {
    position: 'absolute',
    alignSelf: 'center',
    top: '42%',
  },
  muteButtonContainer: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 25,
    padding: 12,
  },
  likeAnimation: {
    position: 'absolute',
    alignSelf: 'center',
    top: '35%',
  },
  rightActions: {
    position: 'absolute',
    right: 16,
    bottom: 120,
    alignItems: 'center',
  },
  actionButton: {
    alignItems: 'center',
    marginVertical: 12,
  },
  actionText: {
    color: 'white',
    marginTop: 4,
    fontSize: 12,
    fontWeight: '600',
  },
  audioButton: {
    marginTop: 8,
  },
  audioIconContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    padding: 8,
  },
  bottomContainer: {
    padding: 16,
    paddingBottom: 120,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  username: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  descriptionContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 8,
  },
  followButton: {
    backgroundColor: '#ff3040',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginLeft: 12,
    alignSelf: 'flex-start',
  },
  followButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  description: {
    color: 'white',
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  audioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  audioName: {
    color: 'white',
    marginLeft: 8,
    fontSize: 12,
    maxWidth: 200,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '50%',
  },
  modalHeader: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#ccc',
    borderRadius: 2,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionText: {
    marginLeft: 16,
    fontSize: 16,
    color: '#333',
  },
});