import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Animated, StyleSheet, Platform, Keyboard, ScrollView, Alert } from 'react-native';
import { Camera, ChevronRight, Mic, Video as VideoIcon, Image as ImageIcon, Send, X, Plus, Tag, Hash, AtSign, Play, Pause } from 'lucide-react-native';
import { Audio } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const CreatePost = () => {
  // Post states
  const [postText, setPostText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [hashtags, setHashtags] = useState([]);
  const [mentions, setMentions] = useState([]);
  
  // Media states - Support multiple media
  const [selectedMedia, setSelectedMedia] = useState([]); // Array of media objects
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  
  // Audio states
  const [isRecording, setIsRecording] = useState(false);
  const [recordURI, setRecordURI] = useState(null);
  const [audioDuration, setAudioDuration] = useState(0);
  const [hasRecordedAudio, setHasRecordedAudio] = useState(false);
  const [audioCaption, setAudioCaption] = useState('');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  
  // Caption and tagging states
  const [showCaptionInput, setShowCaptionInput] = useState(false);
  const [currentCaption, setCurrentCaption] = useState('');
  const [currentTags, setCurrentTags] = useState('');
  
  const recordingRef = useRef(null);
  const audioRef = useRef(null);
  const animatedBars = useRef([
    new Animated.Value(1),
    new Animated.Value(1),
    new Animated.Value(1),
    new Animated.Value(1),
    new Animated.Value(1),
  ]).current;
  
  const submitButtonWidth = new Animated.Value(
    postText.length > 0 || hasRecordedAudio || selectedMedia.length > 0 ? 80 : 0
  );

  // Animate audio wave bars when recording
  useEffect(() => {
    if (isRecording) {
      const animateWave = () => {
        const animations = animatedBars.map((bar) => 
          Animated.sequence([
            Animated.timing(bar, {
              toValue: Math.random() * 2 + 0.5,
              duration: 200,
              useNativeDriver: false,
            }),
            Animated.timing(bar, {
              toValue: 1,
              duration: 200,
              useNativeDriver: false,
            }),
          ])
        );
        
        Animated.stagger(50, animations).start(() => {
          if (isRecording) animateWave();
        });
      };
      animateWave();
    }
  }, [isRecording]);

  useEffect(() => {
    Animated.timing(submitButtonWidth, {
      toValue: postText.length > 0 || hasRecordedAudio || selectedMedia.length > 0 ? 80 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [postText, hasRecordedAudio, selectedMedia]);

  // Extract hashtags and mentions from text
  useEffect(() => {
    const text = postText + ' ' + audioCaption;
    const newHashtags = text.match(/#\w+/g) || [];
    const newMentions = text.match(/@\w+/g) || [];
    
    setHashtags([...new Set(newHashtags)]);
    setMentions([...new Set(newMentions)]);
  }, [postText, audioCaption]);

  const formatDuration = (ms) => {
    const totalSec = Math.floor(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  // Image Picker - Support multiple selection
  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'We need camera roll permissions to select images!');
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        allowsMultipleSelection: false, // We'll handle multiple by allowing user to add more
      });

      if (!result.canceled) {
        const newMedia = {
          type: 'image',
          uri: result.assets[0].uri,
          caption: '',
          tags: [],
        };
        setSelectedMedia([...selectedMedia, newMedia]);
        // Clear audio if image is selected
        if (hasRecordedAudio) {
          setRecordURI(null);
          setHasRecordedAudio(false);
          setAudioCaption('');
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  // Video Picker
  const pickVideo = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'We need camera roll permissions to select videos!');
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 0.8,
        videoMaxDuration: 60, // 1 minute max
      });

      if (!result.canceled) {
        const newMedia = {
          type: 'video',
          uri: result.assets[0].uri,
          caption: '',
          tags: [],
          duration: result.assets[0].duration,
        };
        setSelectedMedia([...selectedMedia, newMedia]);
        // Clear audio if video is selected
        if (hasRecordedAudio) {
          setRecordURI(null);
          setHasRecordedAudio(false);
          setAudioCaption('');
        }
      }
    } catch (error) {
      console.error('Error picking video:', error);
    }
  };

  // Audio Recording
  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== 'granted') {
        Alert.alert('Permission needed', 'We need microphone permissions to record audio!');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY,
        (status) => setAudioDuration(status.durationMillis || 0)
      );

      recordingRef.current = recording;
      setIsRecording(true);
      setHasRecordedAudio(false);
      setAudioDuration(0);
      // Clear media if audio is being recorded
      setSelectedMedia([]);
    } catch (err) {
      console.error('Failed to start recording', err);
      Alert.alert('Error', 'Failed to start recording');
    }
  };

  const stopRecording = async () => {
    try {
      if (!recordingRef.current) return;
      
      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      
      setRecordURI(uri);
      setIsRecording(false);
      setHasRecordedAudio(true);
      
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  };

  const playAudio = async () => {
    try {
      if (!recordURI) return;

      if (audioRef.current) {
        await audioRef.current.unloadAsync();
      }

      const { sound } = await Audio.Sound.createAsync({ uri: recordURI });
      audioRef.current = sound;
      
      setIsPlayingAudio(true);
      await sound.playAsync();
      
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setIsPlayingAudio(false);
        }
      });
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsPlayingAudio(false);
    }
  };

  const handleAudioPress = () => {
    if (isRecording) {
      stopRecording();
    } else if (!hasRecordedAudio) {
      startRecording();
    }
  };

  const addCaptionToMedia = (index) => {
    setCurrentMediaIndex(index);
    setCurrentCaption(selectedMedia[index].caption || '');
    setCurrentTags(selectedMedia[index].tags?.join(' ') || '');
    setShowCaptionInput(true);
  };

  const saveCaptionAndTags = () => {
    const updatedMedia = [...selectedMedia];
    updatedMedia[currentMediaIndex] = {
      ...updatedMedia[currentMediaIndex],
      caption: currentCaption,
      tags: currentTags.split(' ').filter(tag => tag.trim()),
    };
    setSelectedMedia(updatedMedia);
    setShowCaptionInput(false);
    setCurrentCaption('');
    setCurrentTags('');
  };

  const removeMedia = (index) => {
    const updatedMedia = selectedMedia.filter((_, i) => i !== index);
    setSelectedMedia(updatedMedia);
  };

  const removeAudio = () => {
    setRecordURI(null);
    setHasRecordedAudio(false);
    setAudioDuration(0);
    setAudioCaption('');
    if (audioRef.current) {
      audioRef.current.unloadAsync();
    }
  };

  const handlePost = () => {
    if (!postText.trim() && !hasRecordedAudio && selectedMedia.length === 0) {
      Alert.alert('Empty Post', 'Please add some content to your post');
      return;
    }

    const postData = {
      text: postText,
      media: selectedMedia,
      audio: recordURI ? {
        uri: recordURI,
        duration: audioDuration,
        caption: audioCaption,
      } : null,
      hashtags,
      mentions,
      timestamp: new Date().toISOString(),
    };

    console.log('Posting:', postData);
    
    // Reset all states
    setPostText('');
    setSelectedMedia([]);
    setRecordURI(null);
    setHasRecordedAudio(false);
    setAudioDuration(0);
    setAudioCaption('');
    setIsPlayingAudio(false);
    if (audioRef.current) {
      audioRef.current.unloadAsync();
    }
  };

  return (
    <KeyboardAwareScrollView
      extraScrollHeight={100}
      enableOnAndroid={true}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.createPostContainer}>
        <View style={styles.createPostContent}>
          <Image 
            source={{ uri: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2' }}
            style={styles.userAvatar}
          />

          {!isRecording && !hasRecordedAudio ? (
            <View style={{ flex: 1 }}>
              <TextInput
                style={[styles.createPostInput, { 
                  height: postText.length > 40 ? 100 : 50,
                  marginBottom: selectedMedia.length > 0 ? 10 : 0 
                }]}
                placeholder="What's on your mind?"
                placeholderTextColor="#9ca3af"
                multiline
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onChangeText={setPostText}
                value={postText}
              />
              
              {/* Multiple Media Preview */}
              {selectedMedia.length > 0 && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mediaContainer}>
                  {selectedMedia.map((media, index) => (
                    <View key={index} style={styles.mediaPreviewContainer}>
                      {media.type === 'image' ? (
                        <Image source={{ uri: media.uri }} style={styles.mediaPreview} />
                      ) : (
                        <View style={styles.videoPreviewContainer}>
                          <Image source={{ uri: media.uri }} style={styles.mediaPreview} />
                          <View style={styles.videoOverlay}>
                            <VideoIcon size={24} color="#fff" />
                          </View>
                        </View>
                      )}
                      
                      <TouchableOpacity 
                        style={styles.removeMediaButton} 
                        onPress={() => removeMedia(index)}
                      >
                        <X size={16} color="#fff" />
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        style={styles.addCaptionButton}
                        onPress={() => addCaptionToMedia(index)}
                      >
                        <Tag size={16} color="#fff" />
                      </TouchableOpacity>
                      
                      {media.caption && (
                        <View style={styles.captionIndicator}>
                          <Text style={styles.captionIndicatorText}>Caption added</Text>
                        </View>
                      )}
                    </View>
                  ))}
                </ScrollView>
              )}
            </View>
          ) : (
            <View style={styles.audioContainer}>
              <View style={styles.audioHeader}>
                <Text style={styles.audioText}>
                  {isRecording ? 'Recording audio...' : 'Audio recorded'}
                </Text>
                {hasRecordedAudio && (
                  <TouchableOpacity 
                    style={styles.playButton}
                    onPress={playAudio}
                    disabled={isPlayingAudio}
                  >
                    {isPlayingAudio ? (
                      <Pause size={16} color="#9b59b6" />
                    ) : (
                      <Play size={16} color="#9b59b6" />
                    )}
                  </TouchableOpacity>
                )}
              </View>
              
              <View style={styles.audioWave}>
                {animatedBars.map((bar, index) => (
                  <Animated.View
                    key={index}
                    style={[
                      styles.audioWaveBar,
                      {
                        transform: [{ scaleY: isRecording ? bar : 1 }],
                        height: isRecording ? 20 : [15, 25, 35, 25, 15][index],
                      },
                    ]}
                  />
                ))}
              </View>
              
              <View style={styles.audioFooter}>
                <Text style={styles.audioDuration}>
                  {formatDuration(audioDuration)}
                </Text>
                <TouchableOpacity onPress={removeAudio}>
                  <X size={16} color="#ef4444" />
                </TouchableOpacity>
              </View>
              
              {hasRecordedAudio && (
                <TextInput
                  style={styles.audioCaptionInput}
                  placeholder="Add a caption to your audio..."
                  placeholderTextColor="#9ca3af"
                  value={audioCaption}
                  onChangeText={setAudioCaption}
                  multiline
                />
              )}
            </View>
          )}

          {(postText.length > 0 || hasRecordedAudio || selectedMedia.length > 0) && (
            <Animated.View style={[styles.submitButton, { width: submitButtonWidth }]}>
              <TouchableOpacity 
                style={styles.submitButtonInner}
                onPress={handlePost}
              >
                <Text style={styles.submitButtonText}>Post</Text>
                <ChevronRight size={16} color="#fff" />
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>

        {/* Tags display */}
        {(hashtags.length > 0 || mentions.length > 0) && (
          <View style={styles.tagsContainer}>
            {hashtags.map((tag, index) => (
              <View key={`tag-${index}`} style={styles.tagChip}>
                <Hash size={12} color="#3b82f6" />
                <Text style={styles.tag}>{tag.substring(1)}</Text>
              </View>
            ))}
            {mentions.map((mention, index) => (
              <View key={`mention-${index}`} style={styles.mentionChip}>
                <AtSign size={12} color="#10b981" />
                <Text style={styles.mention}>{mention.substring(1)}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Action buttons */}
        <View style={styles.createPostActions}>
          <TouchableOpacity 
            style={[styles.createActionButton, { backgroundColor: '#ffe6e6' }]}
            onPress={pickImage}
          >
            <ImageIcon size={20} color="#ff4d4d" />
            <Text style={styles.createActionText}>
              {selectedMedia.length > 0 ? `Photo (${selectedMedia.filter(m => m.type === 'image').length})` : 'Photo'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.createActionButton, { backgroundColor: '#e6f7ff' }]}
            onPress={pickVideo}
          >
            <VideoIcon size={20} color="#1e90ff" />
            <Text style={styles.createActionText}>
              {selectedMedia.length > 0 ? `Video (${selectedMedia.filter(m => m.type === 'video').length})` : 'Video'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.createActionButton, 
              { 
                backgroundColor: '#f0e6ff',
                borderWidth: isRecording || hasRecordedAudio ? 2 : 0,
                borderColor: '#9b59b6'
              }
            ]}
            onPress={handleAudioPress}
            disabled={selectedMedia.length > 0}
          >
            <Mic size={20} color={selectedMedia.length > 0 ? "#ccc" : "#9b59b6"} />
            <Text style={[styles.createActionText, { 
              color: selectedMedia.length > 0 ? "#ccc" : "#4b5563" 
            }]}>
              {isRecording ? 'Stop' : hasRecordedAudio ? 'Recorded' : 'Audio'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Caption and Tags Modal */}
        {showCaptionInput && (
          <View style={styles.captionModal}>
            <View style={styles.captionModalContent}>
              <Text style={styles.captionModalTitle}>Add Caption & Tags</Text>
              
              <TextInput
                style={styles.captionModalInput}
                placeholder="Write a caption..."
                placeholderTextColor="#9ca3af"
                value={currentCaption}
                onChangeText={setCurrentCaption}
                multiline
              />
              
              <TextInput
                style={styles.captionModalInput}
                placeholder="Add tags (space separated): #hashtag @mention"
                placeholderTextColor="#9ca3af"
                value={currentTags}
                onChangeText={setCurrentTags}
              />
              
              <View style={styles.captionModalButtons}>
                <TouchableOpacity 
                  style={styles.captionModalButton}
                  onPress={() => setShowCaptionInput(false)}
                >
                  <Text style={styles.captionModalButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.captionModalButton, styles.captionModalSaveButton]}
                  onPress={saveCaptionAndTags}
                >
                  <Text style={[styles.captionModalButtonText, { color: '#fff' }]}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  createPostContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  createPostContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  createPostInput: {
    flex: 1,
    backgroundColor: '#f9fafb',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
    maxHeight: 150,
  },
  submitButton: {
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    marginLeft: 8,
  },
  submitButtonInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b82f6',
    paddingHorizontal: 12,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginRight: 4,
  },
  mediaContainer: {
    marginTop: 8,
  },
  mediaPreviewContainer: {
    position: 'relative',
    marginRight: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  mediaPreview: {
    width: 120,
    height: 120,
    borderRadius: 12,
  },
  videoPreviewContainer: {
    position: 'relative',
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeMediaButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 12,
    padding: 4,
  },
  addCaptionButton: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: 'rgba(59, 130, 246, 0.8)',
    borderRadius: 12,
    padding: 4,
  },
  captionIndicator: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.9)',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  captionIndicatorText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '500',
  },
  audioContainer: {
    flex: 1,
    backgroundColor: '#f9fafb',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  audioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  audioText: {
    color: '#6b7280',
    fontWeight: '500',
  },
  playButton: {
    padding: 4,
  },
  audioWave: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 40,
    marginVertical: 12,
    justifyContent: 'center',
  },
  audioWaveBar: {
    width: 4,
    backgroundColor: '#9b59b6',
    marginRight: 3,
    borderRadius: 2,
  },
  audioFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  audioDuration: {
    color: '#9ca3af',
    fontSize: 12,
    fontWeight: '500',
  },
  audioCaptionInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    maxHeight: 80,
  },
  createPostActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 12,
    marginTop: 8,
  },
  createActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    flex: 1,
    marginHorizontal: 4,
    justifyContent: 'center',
  },
  createActionText: {
    marginLeft: 6,
    color: '#4b5563',
    fontWeight: '500',
    fontSize: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 4,
  },
  mentionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 4,
  },
  tag: {
    color: '#3b82f6',
    fontWeight: '500',
    fontSize: 12,
    marginLeft: 2,
  },
  mention: {
    color: '#10b981',
    fontWeight: '500',
    fontSize: 12,
    marginLeft: 2,
  },
  captionModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  captionModalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  captionModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
    textAlign: 'center',
  },
  captionModalInput: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    maxHeight: 100,
  },
  captionModalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  captionModalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  captionModalSaveButton: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  captionModalButtonText: {
    fontWeight: '600',
    color: '#6b7280',
  },
});

export default CreatePost;