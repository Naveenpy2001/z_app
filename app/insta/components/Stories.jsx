import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  StyleSheet, 
  Modal, 
  TextInput, 
  Dimensions,
  Animated,
  SafeAreaView,
  StatusBar,
  Alert,
  PanGestureHandler,
  State,
  TouchableWithoutFeedback,
  Pressable
} from 'react-native';
import { 
  Plus, 
  Heart, 
  MessageCircle, 
  MoreHorizontal, 
  X, 
  Send,
  ArrowLeft,
  Eye,
  Share,
  Download,
  Flag,
  Smile,
  Camera,
  Type,
  Sticker,
  Music,
  Palette,
  Star,
  Move
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

// Current user ID (in a real app, this would come from auth)
const CURRENT_USER_ID = 'current_user';

const STORIES = [
  {
    id: '2',
    user: 'sarah_wilson',
    displayName: 'Sarah Wilson',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    hasUnseenStory: true,
    isLive: false,
  },
  {
    id: '3',
    user: 'mike_adventures',
    displayName: 'Mike Adventures',
    avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    hasUnseenStory: true,
    isLive: true,
  },
  {
    id: '4',
    user: 'travel_guru',
    displayName: 'Travel Guru',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    hasUnseenStory: true,
    isLive: false,
  },
  {
    id: '5',
    user: 'fitness_coach',
    displayName: 'Fitness Coach',
    avatar: 'https://images.pexels.com/photos/1229356/pexels-photo-1229356.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    hasUnseenStory: false,
    isLive: false,
  },
];


const STORY_VIEWS = [
  { id: '1', username: 'user123', displayName: 'Alex Johnson', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', time: '2h ago' },
  { id: '2', username: 'traveler22', displayName: 'Emma Davis', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', time: '1h ago' },
  { id: '3', username: 'fitness_guru', displayName: 'Maya Singh', avatar: 'https://randomuser.me/api/portraits/women/68.jpg', time: '30m ago' },
  { id: '4', username: 'photo_lover', displayName: 'Jake Wilson', avatar: 'https://randomuser.me/api/portraits/men/12.jpg', time: '15m ago' },
  { id: '5', username: 'creative_soul', displayName: 'Luna Martinez', avatar: 'https://randomuser.me/api/portraits/women/25.jpg', time: '5m ago' },
];

// User's own stories
const MY_STORIES = [
  {
    id: '1-1',
    image: 'https://images.pexels.com/photos/1461974/pexels-photo-1461974.jpeg?auto=compress&cs=tinysrgb&w=400&h=800',
    postedTime: '2023-05-15T10:30:00Z',
    views: 124,
    type: 'image',
    replies: [
      { id: '1', user: 'user1', displayName: 'John Doe', avatar: 'https://randomuser.me/api/portraits/men/1.jpg', text: 'Amazing view! 🔥', time: '2h ago' },
      { id: '2', user: 'user2', displayName: 'Jane Smith', avatar: 'https://randomuser.me/api/portraits/women/2.jpg', text: 'Where is this? 😍', time: '1h ago' },
    ],
  },
  {
    id: '1-2',
    image: 'https://images.pexels.com/photos/258109/pexels-photo-258109.jpeg?auto=compress&cs=tinysrgb&w=400&h=800',
    postedTime: '2023-05-15T12:45:00Z',
    views: 89,
    type: 'image',
    replies: [],
  },
];

const USER_STORIES = [
  {
    id: '1',
    user: CURRENT_USER_ID,
    displayName: 'Your Story',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
    isVerified: false,
    isOwn: true,
    stories: MY_STORIES,
  },
  {
    id: '2',
    user: 'sarah_wilson',
    displayName: 'Sarah Wilson',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
    isVerified: true,
    isOwn: false,
    stories: [
      {
        id: '2-1',
        image: 'https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg?auto=compress&cs=tinysrgb&w=400&h=800',
        postedTime: '2023-05-15T14:20:00Z',
        type: 'image',
      },
    ],
  },
  {
    id: '3',
    user: 'mike_adventures',
    displayName: 'Mike Adventures',
    avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg',
    isVerified: false,
    isOwn: false,
    stories: [
      {
        id: '3-1',
        image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400&h=800',
        postedTime: '2023-05-15T16:10:00Z',
        type: 'image',
      },
    ],
  },
];

const STORY_CREATION_TOOLS = [
  { id: 'text', icon: Type, label: 'Text', color: '#ffffff' },
  { id: 'camera', icon: Camera, label: 'Camera', color: '#ffffff' },
  { id: 'sticker', icon: Sticker, label: 'Sticker', color: '#ffffff' },
  { id: 'music', icon: Music, label: 'Music', color: '#ffffff' },
  { id: 'palette', icon: Palette, label: 'Draw', color: '#ffffff' },
];

const Stories = () => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [createStoryModal, setCreateStoryModal] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [showViewers, setShowViewers] = useState(false);
  const [activeStory, setActiveStory] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [showCreationTools, setShowCreationTools] = useState(false);
  const [textElements, setTextElements] = useState([]);
  const [selectedTextElement, setSelectedTextElement] = useState(null);
  const [textInput, setTextInput] = useState('');
  const [showTextEditor, setShowTextEditor] = useState(false);
  
  const progressAnim = useRef(new Animated.Value(0)).current;
  const pressAnimRef = useRef(null);
  const longPressTimerRef = useRef(null);

  const hasOwnStories = MY_STORIES.length > 0;

  useEffect(() => {
    if (modalVisible && activeStory && !isPaused && !showViewers) {
      startStoryAnimation();
    } else {
      if (pressAnimRef.current) {
        pressAnimRef.current.stop();
      }
    }
    return () => {
      if (pressAnimRef.current) {
        pressAnimRef.current.stop();
      }
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
    };
  }, [modalVisible, activeStory, isPaused, currentStoryIndex, showViewers]);

  const startStoryAnimation = () => {
    progressAnim.setValue(0);
    pressAnimRef.current = Animated.timing(progressAnim, {
      toValue: 1,
      duration: 5000,
      useNativeDriver: false,
    });
    pressAnimRef.current.start(({ finished }) => {
      if (finished && !isPaused && !showViewers) {
        handleNextStory();
      }
    });
  };

  const pauseStory = () => {
    setIsPaused(true);
    if (pressAnimRef.current) {
      pressAnimRef.current.stop();
    }
  };

  const resumeStory = () => {
    setIsPaused(false);
    if (modalVisible && activeStory && !showViewers) {
      startStoryAnimation();
    }
  };

  const handleLongPressStart = () => {
    longPressTimerRef.current = setTimeout(() => {
      pauseStory();
    }, 200);
  };

  const handleLongPressEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }
    if (!showViewers) {
      resumeStory();
    }
  };

  const handleNextStory = () => {
    if (activeStory && currentStoryIndex < activeStory.stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
    } else if (currentUserIndex < USER_STORIES.length - 1) {
      const nextUser = USER_STORIES[currentUserIndex + 1];
      setActiveStory(nextUser);
      setCurrentUserIndex(currentUserIndex + 1);
      setCurrentStoryIndex(0);
    } else {
      setModalVisible(false);
    }
  };

  const handlePrevStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
    } else if (currentUserIndex > 0) {
      const prevUser = USER_STORIES[currentUserIndex - 1];
      setActiveStory(prevUser);
      setCurrentUserIndex(currentUserIndex - 1);
      setCurrentStoryIndex(prevUser.stories.length - 1);
    }
  };

  const openStory = (user) => {
    const userStories = USER_STORIES.find(u => u.user === user);
    if (userStories) {
      setActiveStory(userStories);
      setCurrentStoryIndex(0);
      setCurrentUserIndex(USER_STORIES.findIndex(u => u.user === user));
      setModalVisible(true);
      setIsPaused(false);
      setShowViewers(false);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [9, 16],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setCreateStoryModal(true);
    }
  };

  const postStory = () => {
    if (selectedImage || textElements.length > 0) {
      Alert.alert('Story Posted', 'Your story has been shared! 🎉');
      setCreateStoryModal(false);
      setSelectedImage(null);
      setCaption('');
      setTextElements([]);
      setShowCreationTools(false);
      setShowTextEditor(false);
    }
  };

  const sendReply = () => {
    if (replyText.trim() && activeStory) {
      setReplyText('');
      Alert.alert('Reply sent! 💬', 'Your reply has been sent!');
    }
  };

  const sendQuickReaction = (emoji) => {
    Alert.alert('Reaction sent! ' + emoji, 'Your reaction has been sent!');
    setShowReactions(false);
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const posted = new Date(timestamp);
    const diffInHours = Math.floor((now - posted) / (1000 * 60 * 60));
    return diffInHours < 1 ? 'Just now' : `${diffInHours}h ago`;
  };

  const addTextElement = () => {
    if (textInput.trim()) {
      const newTextElement = {
        id: Date.now().toString(),
        text: textInput,
        x: width / 2 - 100,
        y: height / 2 - 50,
        fontSize: 24,
        color: '#ffffff',
      };
      setTextElements([...textElements, newTextElement]);
      setTextInput('');
      setShowTextEditor(false);
    }
  };

  const onTextPanGestureEvent = (event, textId) => {
    const { translationX, translationY } = event.nativeEvent;
    setTextElements(prev => 
      prev.map(element => 
        element.id === textId 
          ? { ...element, x: element.x + translationX, y: element.y + translationY }
          : element
      )
    );
  };

  const renderQuickReactions = () => (
    <View style={styles.quickReactions}>
      {['❤️', '😂', '😮', '😢', '👏', '🔥'].map((emoji, index) => (
        <TouchableOpacity
          key={index}
          style={styles.reactionButton}
          onPress={() => sendQuickReaction(emoji)}
        >
          <Text style={styles.reactionEmoji}>{emoji}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderStoryViewers = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showViewers}
      onRequestClose={() => {
        setShowViewers(false);
        resumeStory();
      }}
    >
      <View style={styles.viewersModalContainer}>
        <TouchableWithoutFeedback onPress={() => {
          setShowViewers(false);
          resumeStory();
        }}>
          <View style={styles.modalBackdrop} />
        </TouchableWithoutFeedback>
        <View style={styles.viewersContainer}>
          <View style={styles.viewersHeader}>
            <Text style={styles.viewersTitle}>
              <Eye size={20} color="#000" /> {activeStory?.stories[currentStoryIndex]?.views || 0} views
            </Text>
            <TouchableOpacity onPress={() => {
              setShowViewers(false);
              resumeStory();
            }}>
              <X size={24} color="#666" />
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            {STORY_VIEWS.map(viewer => (
              <View key={viewer.id} style={styles.viewerItem}>
                <Image source={{ uri: viewer.avatar }} style={styles.viewerAvatar} />
                <View style={styles.viewerInfo}>
                  <Text style={styles.viewerDisplayName}>{viewer.displayName}</Text>
                  <Text style={styles.viewerUsername}>@{viewer.username}</Text>
                </View>
                <Text style={styles.viewerTime}>{viewer.time}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  const renderCreationTools = () => (
    <View style={styles.creationToolsContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {STORY_CREATION_TOOLS.map((tool) => (
          <TouchableOpacity
            key={tool.id}
            style={styles.creationTool}
            onPress={() => {
              if (tool.id === 'text') {
                setShowTextEditor(true);
              } else if (tool.id === 'camera') {
                pickImage();
              } else {
                Alert.alert(tool.label, `${tool.label} feature coming soon! 🚀`);
              }
            }}
          >
            <View style={styles.creationToolIcon}>
              <tool.icon size={24} color={tool.color} />
            </View>
            <Text style={styles.creationToolLabel}>{tool.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderDraggableText = (textElement) => (
    <PanGestureHandler
      key={textElement.id}
      onGestureEvent={(event) => onTextPanGestureEvent(event, textElement.id)}
    >
      <Animated.View
        style={[
          styles.draggableText,
          {
            left: textElement.x,
            top: textElement.y,
          }
        ]}
      >
        <View style={styles.textBackground}>
          <Text style={[
            styles.draggableTextContent,
            {
              fontSize: textElement.fontSize,
              color: textElement.color,
            }
          ]}>
            {textElement.text}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.textDeleteButton}
          onPress={() => {
            setTextElements(prev => prev.filter(el => el.id !== textElement.id));
          }}
        >
          <X size={16} color="#fff" />
        </TouchableOpacity>
      </Animated.View>
    </PanGestureHandler>
  );

  const renderTextEditor = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showTextEditor}
      onRequestClose={() => setShowTextEditor(false)}
    >
      <View style={styles.textEditorOverlay}>
        <View style={styles.textEditorContainer}>
          <View style={styles.textEditorHeader}>
            <TouchableOpacity onPress={() => setShowTextEditor(false)}>
              <X size={24} color="#666" />
            </TouchableOpacity>
            <Text style={styles.textEditorTitle}>Add Text</Text>
            <TouchableOpacity onPress={addTextElement}>
              <Text style={styles.textEditorDone}>Done</Text>
            </TouchableOpacity>
          </View>
          
          <TextInput
            style={styles.textEditorInput}
            placeholder="Type your text here..."
            placeholderTextColor="#999"
            value={textInput}
            onChangeText={setTextInput}
            multiline
            autoFocus
          />
        </View>
      </View>
    </Modal>
  );

  return (
    <>
      <View style={styles.storiesContainer}>
        <LinearGradient
          colors={['#ffecd2', '#fcb69f']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.storiesGradient}
        >
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.storiesScrollContent}
          >
            {/* Your Story - Show + if no stories, otherwise show your story */}
            <TouchableOpacity 
              style={styles.storyItem} 
              onPress={() => {
                if (hasOwnStories) {
                  openStory(CURRENT_USER_ID);
                } else {
                  setCreateStoryModal(true);
                }
              }}
            >
              <View style={[
                styles.storyImageContainer, 
                hasOwnStories ? styles.unseenStoryBorder : styles.yourStoryBorder
              ]}>
                <Image 
                  source={{ uri: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150' }} 
                  style={styles.storyImage} 
                />
                {!hasOwnStories && (
                  <LinearGradient
                    colors={['#667eea', '#764ba2']}
                    style={styles.addStoryButton}
                  >
                    <Plus size={16} color="#ffffff" />
                  </LinearGradient>
                )}
              </View>
              <Text style={styles.storyUsername}>Your Story</Text>
            </TouchableOpacity>

            {STORIES.map((story, index) => (
              <TouchableOpacity 
                key={story.id} 
                style={styles.storyItem}
                onPress={() => openStory(story.user)}
              >
                <View style={[
                  styles.storyImageContainer, 
                  story.hasUnseenStory ? styles.unseenStoryBorder : styles.seenStoryBorder
                ]}>
                  <Image source={{ uri: story.avatar }} style={styles.storyImage} />
                  {story.isLive && (
                    <LinearGradient
                      colors={['#FF006E', '#FF4081']}
                      style={styles.liveIndicator}
                    >
                      <Text style={styles.liveText}>LIVE</Text>
                    </LinearGradient>
                  )}
                </View>
                <Text style={styles.storyUsername} numberOfLines={1}>
                  {story.displayName.split(' ')[0]}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </LinearGradient>
      </View>

      {/* Full Screen Story Viewer */}
      <Modal
        animationType="fade"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <StatusBar backgroundColor="black" barStyle="light-content" hidden />
        <View style={styles.modalContainer}>
          {activeStory && (
            <>
              {/* Story Image Background */}
              <Image
                source={{ uri: activeStory.stories[currentStoryIndex].image }}
                style={styles.fullScreenStory}
                resizeMode="cover"
              />

              {/* Gradient Overlay */}
              <LinearGradient
                colors={['rgba(0,0,0,0.4)', 'transparent', 'rgba(0,0,0,0.4)']}
                style={styles.storyOverlay}
              />

              {/* Progress Bars */}
              <View style={styles.progressBarContainer}>
                {activeStory.stories.map((_, index) => (
                  <View key={index} style={styles.progressBarBackground}>
                    <Animated.View 
                      style={[
                        styles.progressBar,
                        { 
                          width: index === currentStoryIndex ? 
                            progressAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: ['0%', '100%']
                            }) :
                            index < currentStoryIndex ? '100%' : '0%'
                        }
                      ]}
                    />
                  </View>
                ))}
              </View>

              {/* Story Header */}
              <View style={styles.storyHeader}>
                <View style={styles.userInfo}>
                  <Image 
                    source={{ uri: activeStory.avatar }} 
                    style={styles.storyUserAvatar} 
                  />
                  <View style={styles.userTextInfo}>
                    <View style={styles.userNameContainer}>
                      <Text style={styles.storyUsernameText}>{activeStory.displayName}</Text>
                      {activeStory.isVerified && (
                        <Star size={14} color="#3897f0" fill="#3897f0" />
                      )}
                    </View>
                    <Text style={styles.storyTime}>
                      {getTimeAgo(activeStory.stories[currentStoryIndex].postedTime)}
                    </Text>
                  </View>
                </View>
                <View style={styles.headerActions}>
                  <TouchableOpacity 
                    onPress={() => setIsPaused(!isPaused)}
                    style={styles.pauseButton}
                  >
                    <Text style={styles.pauseButtonText}>{isPaused ? '▶️' : '⏸️'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => setShowOptions(!showOptions)}
                    style={styles.optionsButton}
                  >
                    <MoreHorizontal size={24} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <X size={28} color="white" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Story Footer - Only show for others' stories */}
              {!activeStory.isOwn && (
                <View style={styles.storyFooter}>
                  <View style={styles.replySection}>
                    <View style={styles.replyContainer}>
                      <TextInput
                        placeholder="Send message"
                        placeholderTextColor="rgba(255,255,255,0.8)"
                        style={styles.replyInput}
                        value={replyText}
                        onChangeText={setReplyText}
                      />
                      <TouchableOpacity onPress={sendReply} style={styles.sendButton}>
                        <Send size={20} color="white" />
                      </TouchableOpacity>
                    </View>
                    
                    <TouchableOpacity 
                      onPress={() => setShowReactions(!showReactions)}
                      style={styles.emojiButton}
                    >
                      <Smile size={28} color="white" />
                    </TouchableOpacity>

                    <TouchableOpacity 
                      onPress={() => sendQuickReaction('❤️')}
                      style={styles.likeButton}
                    >
                      <Heart size={28} color="white" />
                    </TouchableOpacity>
                  </View>

                  {showReactions && renderQuickReactions()}
                </View>
              )}

              {/* Viewers Count - Only show for own stories */}
              {activeStory.isOwn && (
                <TouchableOpacity 
                  style={styles.viewersCount} 
                  onPress={() => {
                    pauseStory();
                    setShowViewers(true);
                  }}
                >
                  <Eye size={16} color="white" />
                  <Text style={styles.viewersCountText}>
                    {activeStory.stories[currentStoryIndex].views}
                  </Text>
                </TouchableOpacity>
              )}

              {/* Navigation Areas */}
              <TouchableWithoutFeedback 
                onPressIn={handleLongPressStart}
                onPressOut={handleLongPressEnd}
                onPress={handlePrevStory}
              >
                <View style={styles.leftTouchArea} />
              </TouchableWithoutFeedback>
              
              <TouchableWithoutFeedback 
                onPressIn={handleLongPressStart}
                onPressOut={handleLongPressEnd}
                onPress={handleNextStory}
              >
                <View style={styles.rightTouchArea} />
              </TouchableWithoutFeedback>
            </>
          )}
        </View>

        {/* Options Modal */}
        {showOptions && (
          <View style={styles.optionsModalOverlay}>
            <TouchableWithoutFeedback onPress={() => setShowOptions(false)}>
              <View style={styles.modalBackdrop} />
            </TouchableWithoutFeedback>
            <View style={styles.optionsModal}>
              <View style={styles.optionsHeader}>
                <Text style={styles.optionsTitle}>Story Options</Text>
                <TouchableOpacity onPress={() => setShowOptions(false)}>
                  <X size={24} color="#666" />
                </TouchableOpacity>
              </View>
              <ScrollView>
                <TouchableOpacity style={styles.optionItem}>
                  <Share size={20} color="#333" />
                  <Text style={styles.optionText}>Share Story</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.optionItem}>
                  <Download size={20} color="#333" />
                  <Text style={styles.optionText}>Save to Device</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.optionItem}>
                  <MessageCircle size={20} color="#333" />
                  <Text style={styles.optionText}>Copy Story Link</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.optionItem, styles.reportOption]}>
                  <Flag size={20} color="#FF006E" />
                  <Text style={[styles.optionText, styles.reportText]}>Report Story</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        )}
      </Modal>

      {/* Viewers Modal - Only for own stories */}
      {activeStory?.isOwn && renderStoryViewers()}

      {/* Create Story Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={createStoryModal}
        onRequestClose={() => setCreateStoryModal(false)}
      >
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.createStoryContainer}
        >
          <SafeAreaView style={styles.createStorySafeArea}>
            <View style={styles.createStoryHeader}>
              <TouchableOpacity onPress={() => {
                setCreateStoryModal(false);
                setSelectedImage(null);
                setTextElements([]);
                setShowCreationTools(false);
              }}>
                <ArrowLeft size={28} color="white" />
              </TouchableOpacity>
              <Text style={styles.createStoryTitle}>Create Story</Text>
              <TouchableOpacity 
                onPress={postStory}
                style={styles.shareButton}
                disabled={!selectedImage && textElements.length === 0}
              >
                <Text style={[
                  styles.shareButtonText,
                  (!selectedImage && textElements.length === 0) && styles.shareButtonDisabled
                ]}>Share</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.createStoryContent}>
              {selectedImage ? (
                <View style={styles.imagePreviewContainer}>
                  <Image 
                    source={{ uri: selectedImage }} 
                    style={styles.storyPreview} 
                    resizeMode="cover"
                  />
                  {/* Render draggable text elements over image */}
                  {textElements.map(textElement => renderDraggableText(textElement))}
                </View>
              ) : textElements.length > 0 ? (
                <View style={styles.textOnlyStory}>
                  <LinearGradient
                    colors={['#FF006E', '#FFD60A', '#00D2FF']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.textOnlyBackground}
                  >
                    {textElements.map(textElement => renderDraggableText(textElement))}
                  </LinearGradient>
                </View>
              ) : (
                <View style={styles.emptyStoryContainer}>
                  <Camera size={80} color="rgba(255,255,255,0.5)" />
                  <Text style={styles.emptyStoryText}>Add a photo or text to get started</Text>
                  <TouchableOpacity 
                    style={styles.getStartedButton}
                    onPress={() => setShowCreationTools(true)}
                  >
                    <Text style={styles.getStartedButtonText}>Get Started</Text>
                  </TouchableOpacity>
                </View>
              )}

              <View style={styles.captionContainer}>
                <TextInput
                  placeholder="Add a caption..."
                  placeholderTextColor="rgba(255,255,255,0.7)"
                  style={styles.captionInput}
                  value={caption}
                  onChangeText={setCaption}
                  multiline
                  maxLength={200}
                />
                <Text style={styles.captionCounter}>{caption.length}/200</Text>
              </View>
            </View>

            {showCreationTools && renderCreationTools()}

            <View style={styles.createStoryFooter}>
              <TouchableOpacity 
                style={styles.footerButton}
                onPress={() => setShowCreationTools(!showCreationTools)}
              >
                <Plus size={24} color="white" />
                <Text style={styles.footerButtonText}>Tools</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.footerButton}
                onPress={pickImage}
              >
                <Camera size={24} color="white" />
                <Text style={styles.footerButtonText}>Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.footerButton}
                onPress={() => setShowTextEditor(true)}
              >
                <Type size={24} color="white" />
                <Text style={styles.footerButtonText}>Text</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </Modal>

      {/* Text Editor Modal */}
      {renderTextEditor()}
    </>
  );
};

export default Stories;

const styles = StyleSheet.create({
  storiesContainer: {
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  storiesGradient: {
    paddingHorizontal: 4,
  },
  storiesScrollContent: {
    paddingHorizontal: 8,
  },
  storyItem: {
    alignItems: 'center',
    marginHorizontal: 6,
    width: 72,
  },
  storyImageContainer: {
    width: 68,
    height: 68,
    borderRadius: 34,
    padding: 3,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  yourStoryBorder: {
    backgroundColor: '#f3f4f6',
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  unseenStoryBorder: {
    borderWidth: 3,
    borderColor: '#FF006E',
    borderStyle: 'solid',
  },
  seenStoryBorder: {
    borderWidth: 2,
    borderColor: '#d1d5db',
  },
  storyImage: {
    width: '100%',
    height: '100%',
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  addStoryButton: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#ffffff',
    elevation: 4,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
  liveIndicator: {
    position: 'absolute',
    bottom: -4,
    left: 0,
    right: 0,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  liveText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  storyUsername: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1f2937',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 16,
    width: '100%',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  storyOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  storyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 2,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  storyUserAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'white',
  },
  userTextInfo: {
    flex: 1,
  },
  userNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storyUsernameText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
    marginRight: 4,
  },
  storyTime: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pauseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pauseButtonText: {
    fontSize: 12,
  },
  optionsButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressBarContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingTop: 12,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 2,
    gap: 4,
  },
  progressBarBackground: {
    flex: 1,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 1.5,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 1.5,
  },
  fullScreenStory: {
    width: width,
    height: height,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  storyFooter: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    zIndex: 2,
  },
  replySection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  replyContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 24,
    paddingHorizontal: 16,
    backdropFilter: 'blur(10px)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  replyInput: {
    flex: 1,
    color: 'white',
    height: 48,
    fontSize: 16,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  likeButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  quickReactions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 12,
    alignSelf: 'center',
    gap: 16,
  },
  reactionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reactionEmoji: {
    fontSize: 24,
  },
  leftTouchArea: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: width * 0.4,
    zIndex: 1,
  },
  rightTouchArea: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    width: width * 0.4,
    zIndex: 1,
  },
  viewersCount: {
    position: 'absolute',
    bottom: 120,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 6,
    zIndex: 2,
  },
  viewersCountText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  optionsModalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  optionsModal: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: height * 0.6,
    paddingBottom: 20,
  },
  optionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 16,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  reportOption: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    marginTop: 8,
  },
  reportText: {
    color: '#FF006E',
  },
  viewersModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  viewersContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: height * 0.7,
    paddingBottom: 20,
  },
  viewersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  viewersTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  viewerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  viewerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  viewerInfo: {
    flex: 1,
  },
  viewerDisplayName: {
    fontWeight: '600',
    fontSize: 16,
    color: '#333',
  },
  viewerUsername: {
    color: '#666',
    fontSize: 14,
    marginTop: 2,
  },
  viewerTime: {
    color: '#999',
    fontSize: 12,
  },
  createStoryContainer: {
    flex: 1,
  },
  createStorySafeArea: {
    flex: 1,
  },
  createStoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.2)',
  },
  createStoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  shareButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  shareButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  shareButtonDisabled: {
    opacity: 0.5,
  },
  createStoryContent: {
    flex: 1,
    padding: 20,
  },
  imagePreviewContainer: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  storyPreview: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  textOnlyStory: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  textOnlyBackground: {
    flex: 1,
    position: 'relative',
  },
  emptyStoryContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  emptyStoryText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 16,
  },
  getStartedButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  getStartedButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  captionContainer: {
    marginTop: 20,
  },
  captionInput: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 16,
    color: 'white',
    fontSize: 16,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  captionCounter: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    textAlign: 'right',
    marginTop: 8,
  },
  creationToolsContainer: {
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  creationTool: {
    alignItems: 'center',
    marginHorizontal: 12,
    gap: 8,
  },
  creationToolIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  creationToolLabel: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  createStoryFooter: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  footerButton: {
    alignItems: 'center',
    gap: 8,
  },
  footerButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  draggableText: {
    position: 'absolute',
    minWidth: 100,
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textBackground: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minHeight: 40,
    justifyContent: 'center',
  },
  draggableTextContent: {
    textAlign: 'center',
    fontWeight: '600',
  },
  textDeleteButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textEditorOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  textEditorContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
    maxHeight: height * 0.6,
  },
  textEditorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  textEditorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  textEditorDone: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3897f0',
  },
  textEditorInput: {
    padding: 20,
    fontSize: 16,
    color: '#333',
    minHeight: 120,
    textAlignVertical: 'top',
  },
});