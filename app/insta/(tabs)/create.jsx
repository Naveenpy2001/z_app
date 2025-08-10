import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
  ScrollView,
  TextInput,
  Modal,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Alert,
  Animated,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const STORY_DURATION_LIMIT = 15000; // 15 seconds
const REEL_DURATION_LIMIT = 90000; // 90 seconds

const filters = [
  { name: 'Normal', value: 'normal' },
  { name: 'Clarendon', value: 'clarendon' },
  { name: 'Gingham', value: 'gingham' },
  { name: 'Moon', value: 'moon' },
  { name: 'Lark', value: 'lark' },
  { name: 'Juno', value: 'juno' },
  { name: 'Ludwig', value: 'ludwig' },
  { name: 'Valencia', value: 'valencia' },
  { name: 'X-Pro II', value: 'xpro' },
];

// Demo images for gallery
const demoImages = [
  'https://picsum.photos/400/400?random=1',
  'https://picsum.photos/400/400?random=2',
  'https://picsum.photos/400/400?random=3',
  'https://picsum.photos/400/400?random=4',
  'https://picsum.photos/400/400?random=5',
];

// Simple Icon Components
const CloseIcon = () => (
  <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>×</Text>
);

const FlashIcon = ({ mode }) => (
  <Text style={{ color: 'white', fontSize: 18 }}>
    {mode === 'off' ? '⚡︎' : mode === 'on' ? '⚡' : '🔦'}
  </Text>
);

const SettingsIcon = () => (
  <Text style={{ color: 'white', fontSize: 18 }}>⚙</Text>
);

const GalleryIcon = () => (
  <Text style={{ color: 'white', fontSize: 18 }}>🖼</Text>
);

const FlipIcon = () => (
  <Text style={{ color: 'white', fontSize: 18 }}>🔄</Text>
);

const BackIcon = () => (
  <Text style={{ color: 'black', fontSize: 24 }}>←</Text>
);

const FilterIcon = () => (
  <Text style={{ color: 'black', fontSize: 18 }}>🎨</Text>
);

const LocationIcon = () => (
  <Text style={{ color: 'black', fontSize: 18 }}>📍</Text>
);

const PeopleIcon = () => (
  <Text style={{ color: 'black', fontSize: 18 }}>👥</Text>
);

const MusicIcon = () => (
  <Text style={{ color: 'black', fontSize: 18 }}>🎵</Text>
);

const ChevronIcon = () => (
  <Text style={{ color: '#666', fontSize: 16 }}>›</Text>
);

export default function InstagramCamera() {
  // Camera states
  const [cameraType, setCameraType] = useState('back');
  const [flashMode, setFlashMode] = useState('off');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  
  // Media states
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [mediaType, setMediaType] = useState('photo'); // 'photo', 'video', 'story', 'reel'
  
  // UI states
  const [showCamera, setShowCamera] = useState(true);
  const [showGallery, setShowGallery] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('normal');
  const [showPostOptions, setShowPostOptions] = useState(false);
  const [caption, setCaption] = useState('');
  
  // Refs
  const recordingTimer = useRef(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isRecording) {
      recordingTimer.current = setInterval(() => {
        setRecordingTime((prev) => {
          const newTime = prev + 100;
          const limit = mediaType === 'story' ? STORY_DURATION_LIMIT : REEL_DURATION_LIMIT;
          
          if (newTime >= limit) {
            stopRecording();
            return 0;
          }
          return newTime;
        });
      }, 100);
    } else {
      clearInterval(recordingTimer.current);
      setRecordingTime(0);
    }

    return () => clearInterval(recordingTimer.current);
  }, [isRecording, mediaType]);

  const takePicture = async () => {
    try {
      // Animate capture button
      Animated.sequence([
        Animated.timing(scaleAnim, { duration: 100, toValue: 0.8, useNativeDriver: true }),
        Animated.timing(scaleAnim, { duration: 100, toValue: 1, useNativeDriver: true }),
      ]).start();

      // Use a demo image for this example
      const demoImageUri = demoImages[Math.floor(Math.random() * demoImages.length)];
      
      const newMedia = {
        uri: demoImageUri,
        type: 'photo',
        timestamp: Date.now(),
        filter: selectedFilter,
      };
      
      setSelectedMedia([newMedia]);
      setShowCamera(false);
      setShowPostOptions(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to take picture');
    }
  };

  const startRecording = async () => {
    try {
      setIsRecording(true);
      Alert.alert('Recording', 'Recording started (demo mode)');
      
      // Auto-stop after duration limit
      setTimeout(() => {
        if (isRecording) {
          stopRecording();
        }
      }, mediaType === 'story' ? 15000 : 90000);
    } catch (error) {
      Alert.alert('Error', 'Failed to start recording');
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    
    // Use demo image to represent video
    const demoVideoUri = demoImages[Math.floor(Math.random() * demoImages.length)];
    
    const newMedia = {
      uri: demoVideoUri,
      type: 'video',
      duration: recordingTime,
      timestamp: Date.now(),
      filter: selectedFilter,
    };
    
    setSelectedMedia([newMedia]);
    setShowCamera(false);
    setShowPostOptions(true);
    Alert.alert('Recording', 'Recording stopped');
  };

  const selectFromGallery = async () => {
    // In a real app, you would use react-native-image-picker or expo-image-picker
    const randomImage = demoImages[Math.floor(Math.random() * demoImages.length)];
    
    const newMedia = [{
      uri: randomImage,
      type: 'photo',
      timestamp: Date.now(),
      filter: selectedFilter,
    }];
    
    setSelectedMedia(newMedia);
    setShowGallery(false);
    setShowPostOptions(true);
  };

  const toggleCameraType = () => {
    setCameraType(cameraType === 'back' ? 'front' : 'back');
    Alert.alert('Camera', `Switched to ${cameraType === 'back' ? 'front' : 'back'} camera`);
  };

  const toggleFlash = () => {
    const newMode = flashMode === 'off' ? 'on' : flashMode === 'on' ? 'auto' : 'off';
    setFlashMode(newMode);
    Alert.alert('Flash', `Flash set to ${newMode}`);
  };

  const formatTime = (time) => {
    const seconds = Math.floor(time / 1000);
    const minutes = Math.floor(seconds / 60);
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  const renderCameraScreen = () => (
    <View style={styles.cameraContainer}>
      <StatusBar hidden />
      <View style={styles.camera}>
        {/* Demo camera preview */}
        <View style={styles.demoCamera}>
          <Text style={styles.demoText}>📷 Camera Preview</Text>
          <Text style={styles.demoSubtext}>Live camera view would appear here</Text>
          <Text style={styles.demoSubtext}>
            Using {cameraType} camera with {flashMode} flash
          </Text>
        </View>
        
        {/* Top Controls */}
        <View style={styles.topControls}>
          <TouchableOpacity onPress={() => setShowCamera(false)} style={styles.controlButton}>
            <CloseIcon />
          </TouchableOpacity>
          
          <View style={styles.topRightControls}>
            <TouchableOpacity onPress={toggleFlash} style={styles.controlButton}>
              <FlashIcon mode={flashMode} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.controlButton}
              onPress={() => Alert.alert('Settings', 'Camera settings would open here')}
            >
              <SettingsIcon />
            </TouchableOpacity>
          </View>
        </View>

        {/* Recording Timer */}
        {isRecording && (
          <View style={styles.recordingIndicator}>
            <View style={styles.recordingDot} />
            <Text style={styles.recordingTime}>{formatTime(recordingTime)}</Text>
          </View>
        )}

        {/* Mode Selector */}
        <View style={styles.modeSelector}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {['STORY', 'PHOTO', 'VIDEO', 'REEL'].map((mode) => (
              <TouchableOpacity
                key={mode}
                onPress={() => setMediaType(mode.toLowerCase())}
                style={[
                  styles.modeButton,
                  mediaType === mode.toLowerCase() && styles.activeModeButton,
                ]}
              >
                <Text
                  style={[
                    styles.modeText,
                    mediaType === mode.toLowerCase() && styles.activeModeText,
                  ]}
                >
                  {mode}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Bottom Controls */}
        <View style={styles.bottomControls}>
          <TouchableOpacity onPress={() => setShowGallery(true)} style={styles.galleryButton}>
            <GalleryIcon />
          </TouchableOpacity>

          <View style={styles.captureButtonContainer}>
            {mediaType === 'photo' ? (
              <Animated.View style={[styles.captureButton, { transform: [{ scale: scaleAnim }] }]}>
                <TouchableOpacity onPress={takePicture} style={styles.captureButtonInner}>
                  <View style={styles.captureButtonCenter} />
                </TouchableOpacity>
              </Animated.View>
            ) : (
              <TouchableOpacity
                onPress={isRecording ? stopRecording : startRecording}
                style={[
                  styles.captureButton,
                  isRecording && styles.recordingCaptureButton,
                ]}
              >
                <View style={[
                  styles.captureButtonInner,
                  isRecording && styles.recordingCaptureButtonInner,
                ]}>
                  {isRecording ? (
                    <View style={styles.stopIcon} />
                  ) : (
                    <View style={styles.recordIcon} />
                  )}
                </View>
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity onPress={toggleCameraType} style={styles.flipButton}>
            <FlipIcon />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderGallery = () => (
    <Modal visible={showGallery} animationType="slide">
      <SafeAreaView style={styles.galleryContainer}>
        <View style={styles.galleryHeader}>
          <TouchableOpacity onPress={() => setShowGallery(false)}>
            <Text style={{ color: 'black', fontSize: 24 }}>×</Text>
          </TouchableOpacity>
          <Text style={styles.galleryTitle}>Select Photos</Text>
          <TouchableOpacity onPress={selectFromGallery}>
            <Text style={styles.selectButton}>Select</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.galleryContent}>
          <TouchableOpacity onPress={selectFromGallery} style={styles.selectFromGalleryButton}>
            <GalleryIcon />
            <Text style={styles.selectFromGalleryText}>Choose from Library</Text>
            <Text style={styles.gallerySubtext}>Tap to select demo image</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );

  const renderPostOptions = () => (
    <Modal visible={showPostOptions} animationType="slide">
      <SafeAreaView style={styles.postContainer}>
        <View style={styles.postHeader}>
          <TouchableOpacity onPress={() => setShowPostOptions(false)}>
            <BackIcon />
          </TouchableOpacity>
          <Text style={styles.postTitle}>New Post</Text>
          <TouchableOpacity onPress={() => {
            Alert.alert('Success', 'Post shared!');
            setShowPostOptions(false);
            setShowCamera(true);
            setSelectedMedia([]);
            setCaption('');
          }}>
            <Text style={styles.shareButton}>Share</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.postContent}>
          {/* Media Preview */}
          <View style={styles.mediaPreviewContainer}>
            {selectedMedia.length > 0 && selectedMedia[currentMediaIndex] && (
              <Image
                source={{ uri: selectedMedia[currentMediaIndex].uri }}
                style={styles.mediaPreview}
              />
            )}
            
            {/* Multiple Media Indicator */}
            {selectedMedia.length > 1 && (
              <View style={styles.mediaIndicator}>
                <Text style={styles.mediaCount}>
                  {currentMediaIndex + 1}/{selectedMedia.length}
                </Text>
              </View>
            )}
          </View>

          {/* Filter Button */}
          <TouchableOpacity
            onPress={() => setShowFilters(true)}
            style={styles.filterToggleButton}
          >
            <FilterIcon />
            <Text style={styles.filterToggleText}>Filters</Text>
          </TouchableOpacity>

          {/* Caption Input */}
          <View style={styles.captionSection}>
            <TextInput
              placeholder="Write a caption..."
              value={caption}
              onChangeText={setCaption}
              style={styles.captionInput}
              multiline
              maxLength={2200}
            />
            <View style={styles.captionActions}>
              <Text style={styles.characterCount}>{caption.length}/2200</Text>
            </View>
          </View>

          {/* Options */}
          <View style={styles.optionsSection}>
            <TouchableOpacity 
              style={styles.option}
              onPress={() => Alert.alert('Location', 'Add location feature would open here')}
            >
              <LocationIcon />
              <Text style={styles.optionText}>Add Location</Text>
              <ChevronIcon />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.option}
              onPress={() => Alert.alert('Tag People', 'Tag people feature would open here')}
            >
              <PeopleIcon />
              <Text style={styles.optionText}>Tag People</Text>
              <ChevronIcon />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.option}
              onPress={() => Alert.alert('Music', 'Add music feature would open here')}
            >
              <MusicIcon />
              <Text style={styles.optionText}>Add Music</Text>
              <ChevronIcon />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.option}
              onPress={() => Alert.alert('Accessibility', 'Accessibility options would open here')}
            >
              <Text style={{ color: 'black', fontSize: 18 }}>♿</Text>
              <Text style={styles.optionText}>Accessibility</Text>
              <ChevronIcon />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.option}
              onPress={() => Alert.alert('Settings', 'Advanced settings would open here')}
            >
              <Text style={{ color: 'black', fontSize: 18 }}>⚙</Text>
              <Text style={styles.optionText}>Advanced Settings</Text>
              <ChevronIcon />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  const renderFilters = () => (
    <Modal visible={showFilters} animationType="slide">
      <SafeAreaView style={styles.filterContainer}>
        <View style={styles.filterHeader}>
          <TouchableOpacity onPress={() => setShowFilters(false)}>
            <Text style={{ color: 'black', fontSize: 24 }}>×</Text>
          </TouchableOpacity>
          <Text style={styles.filterTitle}>Filters</Text>
          <TouchableOpacity onPress={() => setShowFilters(false)}>
            <Text style={styles.filterDone}>Done</Text>
          </TouchableOpacity>
        </View>

        {/* Filter Preview */}
        <View style={styles.filterPreviewContainer}>
          {selectedMedia[currentMediaIndex] && (
            <Image
              source={{ uri: selectedMedia[currentMediaIndex].uri }}
              style={styles.filterPreview}
            />
          )}
        </View>

        {/* Filter List */}
        <FlatList
          data={filters}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.value}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setSelectedFilter(item.value)}
              style={styles.filterItem}
            >
              <View style={[
                styles.filterThumbnail,
                selectedFilter === item.value && styles.selectedFilterThumbnail,
              ]}>
                {selectedMedia[currentMediaIndex] && (
                  <Image
                    source={{ uri: selectedMedia[currentMediaIndex].uri }}
                    style={styles.filterThumbnailImage}
                  />
                )}
              </View>
              <Text style={styles.filterName}>{item.name}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.filtersList}
        />
      </SafeAreaView>
    </Modal>
  );

  return (
    <View style={styles.container}>
      {showCamera && renderCameraScreen()}
      {renderGallery()}
      {renderPostOptions()}
      {renderFilters()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  
  // Camera styles
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
    position: 'relative',
  },
  demoCamera: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  demoText: {
    color: 'white',
    fontSize: 24,
    marginBottom: 10,
  },
  demoSubtext: {
    color: '#ccc',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 5,
  },
  topControls: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 1,
  },
  topRightControls: {
    flexDirection: 'row',
    gap: 15,
  },
  controlButton: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 20,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordingIndicator: {
    position: 'absolute',
    top: 100,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'red',
    marginRight: 8,
  },
  recordingTime: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  modeSelector: {
    position: 'absolute',
    bottom: 180,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
  modeButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginRight: 15,
  },
  activeModeButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 15,
  },
  modeText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    fontWeight: '600',
  },
  activeModeText: {
    color: 'white',
  },
  bottomControls: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  galleryButton: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 20,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButtonContainer: {
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'white',
  },
  recordingCaptureButton: {
    backgroundColor: 'rgba(255,0,0,0.3)',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingCaptureButtonInner: {
    backgroundColor: 'red',
  },
  captureButtonCenter: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
  },
  recordIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'red',
  },
  stopIcon: {
    width: 30,
    height: 30,
    backgroundColor: 'white',
  },
  flipButton: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 20,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Gallery styles
  galleryContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  galleryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  galleryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'black',
  },
  selectButton: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  galleryContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  selectFromGalleryButton: {
    alignItems: 'center',
    padding: 40,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
    borderRadius: 12,
    width: '100%',
  },
  selectFromGalleryText: {
    marginTop: 12,
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  gallerySubtext: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },

  // Post options styles
  postContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  postTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'black',
  },
  shareButton: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  postContent: {
    flex: 1,
  },
  mediaPreviewContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#f8f8f8',
    position: 'relative',
  },
  mediaPreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  mediaIndicator: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  mediaCount: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  filterToggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  filterToggleText: {
    marginLeft: 12,
    fontSize: 16,
    color: 'black',
  },
  captionSection: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  captionInput: {
    fontSize: 16,
    minHeight: 60,
    textAlignVertical: 'top',
    color: 'black',
  },
  captionActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  characterCount: {
    fontSize: 12,
    color: '#666',
  },
  optionsSection: {
    paddingHorizontal: 20,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
    color: 'black',
  },

  // Filter styles
  filterContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'black',
  },
  filterDone: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  filterPreviewContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#f8f8f8',
  },
  filterPreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  filtersList: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  filterItem: {
    alignItems: 'center',
    marginRight: 20,
  },
  filterThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedFilterThumbnail: {
    borderColor: '#007AFF',
  },
  filterThumbnailImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  filterName: {
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center',
    color: 'black',
  },
});