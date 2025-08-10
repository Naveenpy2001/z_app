import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  TouchableWithoutFeedback,
  Image, 
  TextInput, 
  StyleSheet, 
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  FlatList,
  Modal,
  Dimensions,
  SafeAreaView,
  Animated
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  ArrowLeft, 
  Search, 
  Plus, 
  Send, 
  Camera, 
  Mic, 
  Image as ImageIcon,
  Smile,
  X,
  UserPlus
} from 'lucide-react-native';
import EmojiPicker from 'rn-emoji-keyboard';
import * as ImagePicker from 'expo-image-picker';

const { width, height } = Dimensions.get('window');

// Sample data
const USERS = [
  {
    id: '1',
    name: 'Sarah Wilson',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    isOnline: true,
  },
  {
    id: '2',
    name: 'Mike Johnson',
    avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    isOnline: false,
  },
  {
    id: '3',
    name: 'Emma Davis',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    isOnline: true,
  },
];

const CONVERSATIONS = [
  {
    id: '1',
    user: USERS[0],
    lastMessage: 'Hey! How are you doing?',
    time: '2m',
    unread: 2,
  },
  {
    id: '2',
    user: USERS[1],
    lastMessage: 'Thanks for sharing that post!',
    time: '1h',
    unread: 0,
  },
];

const MESSAGES = [
  {
    id: '1',
    text: 'Hey! How are you doing?',
    sender: 'other',
    time: '2:30 PM',
    type: 'text'
  },
  {
    id: '2',
    text: 'I\'m doing great! Just finished a new project. How about you?',
    sender: 'me',
    time: '2:32 PM',
    type: 'text'
  },
  {
    id: '3',
    text: 'That sounds awesome! I\'d love to see it sometime.',
    sender: 'other',
    time: '2:33 PM',
    type: 'text'
  },
];

const EMOJI_CATEGORIES = [
  'smileys',
  'people',
  'animals',
  'food',
  'activities',
  'travel',
  'objects',
  'symbols',
  'flags'
];

export default function MessagingScreen() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState(MESSAGES);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const scrollViewRef = useRef();
  const inputRef = useRef();
  const slideAnim = useRef(new Animated.Value(height)).current;

  // Request media permissions
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need media permissions to make this work!');
      }
    })();
  }, []);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'text'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    scrollToBottom();
  };

  const handlePickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const message = {
        id: Date.now().toString(),
        media: result.assets[0].uri,
        sender: 'me',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'image'
      };
      setMessages(prev => [...prev, message]);
      scrollToBottom();
    }
  };

  const handleEmojiSelect = (emoji) => {
    setNewMessage(prev => prev + emoji.emoji);
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const toggleNewChatModal = () => {
    if (showNewChatModal) {
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setShowNewChatModal(false));
    } else {
      setShowNewChatModal(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const toggleUserSelection = (user) => {
    setSelectedUsers(prev => 
      prev.some(u => u.id === user.id) 
        ? prev.filter(u => u.id !== user.id) 
        : [...prev, user]
    );
  };

  const startNewChat = () => {
    if (selectedUsers.length === 0) return;
    
    // In a real app, you would create a new conversation here
    // For demo purposes, we'll just select the first user
    setSelectedChat(selectedUsers[0].id);
    setSelectedUsers([]);
    toggleNewChatModal();
  };

  const filteredUsers = USERS.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderMessageItem = ({ item }) => {
    if (item.type === 'image') {
      return (
        <View style={[
          styles.messageItem,
          item.sender === 'me' ? styles.myMessage : styles.otherMessage
        ]}>
          <View style={[
            styles.messageBubble,
            item.sender === 'me' ? styles.myBubble : styles.otherBubble
          ]}>
            <Image 
              source={{ uri: item.media }} 
              style={styles.mediaMessage} 
              resizeMode="cover"
            />
          </View>
          <Text style={styles.messageTime}>{item.time}</Text>
        </View>
      );
    }

    return (
      <View style={[
        styles.messageItem,
        item.sender === 'me' ? styles.myMessage : styles.otherMessage
      ]}>
        <View style={[
          styles.messageBubble,
          item.sender === 'me' ? styles.myBubble : styles.otherBubble
        ]}>
          <Text style={[
            styles.messageText,
            item.sender === 'me' ? styles.myMessageText : styles.otherMessageText
          ]}>
            {item.text}
          </Text>
        </View>
        <Text style={styles.messageTime}>{item.time}</Text>
      </View>
    );
  };

  if (selectedChat) {
    const chat = CONVERSATIONS.find(c => c.id === selectedChat) || 
                 { user: selectedUsers[0], lastMessage: '', time: 'Now' };

    return (
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.container}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.flex}
          keyboardVerticalOffset={90}
        >
          <SafeAreaView style={styles.safeArea}>
            {/* Chat Header */}
            <View style={styles.chatHeader}>
              <TouchableOpacity
                onPress={() => setSelectedChat(null)}
                style={styles.backButton}
              >
                <ArrowLeft size={24} color="#ffffff" />
              </TouchableOpacity>
              <View style={styles.chatUserInfo}>
                <Image 
                  source={{ uri: chat.user.avatar }} 
                  style={styles.chatAvatar} 
                />
                <View>
                  <Text style={styles.chatUserName}>{chat.user.name}</Text>
                  <Text style={styles.chatUserStatus}>
                    {chat.user.isOnline ? 'Online' : 'Offline'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Messages */}
            <FlatList
              ref={scrollViewRef}
              data={messages}
              renderItem={renderMessageItem}
              keyExtractor={item => item.id}
              style={styles.messagesContainer}
              contentContainerStyle={styles.messagesContent}
              onContentSizeChange={scrollToBottom}
              showsVerticalScrollIndicator={false}
            />

            {/* Emoji Picker */}
            <EmojiPicker
              open={showEmojiPicker}
              onClose={() => setShowEmojiPicker(false)}
              onEmojiSelected={handleEmojiSelect}
              categories={EMOJI_CATEGORIES}
              theme={{
                knob: '#6366f1',
                container: '#f8fafc',
                header: '#6366f1',
                skinTonesContainer: '#e2e8f0',
                category: {
                  icon: '#6366f1',
                  iconActive: '#ffffff',
                  container: '#6366f1',
                  containerActive: '#4f46e5'
                }
              }}
            />

            {/* Message Input */}
            <View style={styles.messageInput}>
              <TouchableOpacity 
                onPress={() => setShowEmojiPicker(true)}
                style={styles.inputButton}
              >
                <Smile size={24} color="#6366f1" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={handlePickImage}
                style={styles.inputButton}
              >
                <ImageIcon size={24} color="#6366f1" />
              </TouchableOpacity>
              
              <View style={styles.textInputContainer}>
                <TextInput
                  ref={inputRef}
                  style={styles.textInput}
                  placeholder="Type a message..."
                  placeholderTextColor="#9ca3af"
                  value={newMessage}
                  onChangeText={setNewMessage}
                  multiline
                  onFocus={() => setShowEmojiPicker(false)}
                />
              </View>
              
              <TouchableOpacity
                onPress={sendMessage}
                style={[styles.sendButton, !newMessage.trim() && styles.sendButtonDisabled]}
              >
                <Send size={20} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <ArrowLeft size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Messages</Text>
          <TouchableOpacity 
            onPress={toggleNewChatModal}
            style={styles.newChatButton}
          >
            <UserPlus size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color="#ffffff" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search conversations..."
              placeholderTextColor="rgba(255,255,255,0.7)"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Conversations */}
        <FlatList
          data={CONVERSATIONS}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setSelectedChat(item.id)}
              style={styles.conversationItem}
            >
              <View style={styles.avatarContainer}>
                <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
                {item.user.isOnline && <View style={styles.onlineIndicator} />}
              </View>
              <View style={styles.conversationContent}>
                <View style={styles.conversationHeader}>
                  <Text style={styles.userName}>{item.user.name}</Text>
                  <Text style={styles.messageTime}>{item.time}</Text>
                </View>
                <View style={styles.conversationFooter}>
                  <Text style={styles.lastMessage} numberOfLines={1}>
                    {item.lastMessage}
                  </Text>
                  {item.unread > 0 && (
                    <View style={styles.unreadBadge}>
                      <Text style={styles.unreadText}>{item.unread}</Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.id}
          style={styles.conversationsList}
          contentContainerStyle={styles.conversationsContent}
          showsVerticalScrollIndicator={false}
        />

        {/* New Chat Modal */}
        <Modal
          visible={showNewChatModal}
          transparent
          animationType="none"
          onRequestClose={toggleNewChatModal}
        >
          <TouchableWithoutFeedback onPress={toggleNewChatModal}>
            <View style={styles.modalOverlay} />
          </TouchableWithoutFeedback>
          
          <Animated.View style={[styles.newChatModal, { transform: [{ translateY: slideAnim }] }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Conversation</Text>
              <TouchableOpacity onPress={toggleNewChatModal}>
                <X size={24} color="#6366f1" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.searchContainer}>
              <View style={styles.searchBar}>
                <Search size={20} color="#6366f1" />
                <TextInput
                  style={[styles.searchInput, { color: '#1f2937' }]}
                  placeholder="Search contacts..."
                  placeholderTextColor="#9ca3af"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
            </View>
            
            <ScrollView style={styles.contactsList}>
              {filteredUsers.map(user => (
                <TouchableOpacity
                  key={user.id}
                  onPress={() => toggleUserSelection(user)}
                  style={styles.contactItem}
                >
                  <View style={styles.avatarContainer}>
                    <Image source={{ uri: user.avatar }} style={styles.avatar} />
                    {user.isOnline && <View style={styles.onlineIndicator} />}
                  </View>
                  <Text style={styles.contactName}>{user.name}</Text>
                  {selectedUsers.some(u => u.id === user.id) && (
                    <View style={styles.selectedIndicator} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            <TouchableOpacity
              onPress={startNewChat}
              style={[styles.startChatButton, selectedUsers.length === 0 && styles.disabledButton]}
              disabled={selectedUsers.length === 0}
            >
              <Text style={styles.startChatText}>
                {selectedUsers.length > 1 ? 
                  `Start Group Chat (${selectedUsers.length})` : 
                  'Start Chat'}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 8,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  newChatButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 8,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchBar: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    color: '#ffffff',
    fontSize: 16,
  },
  conversationsList: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  conversationsContent: {
    paddingTop: 16,
    paddingBottom: 20,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    backgroundColor: '#10b981',
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  messageTime: {
    fontSize: 12,
    color: '#6b7280',
  },
  conversationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 14,
    color: '#6b7280',
    flex: 1,
  },
  unreadBadge: {
    backgroundColor: '#ef4444',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8,
  },
  unreadText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  chatUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  chatAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  chatUserName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  chatUserStatus: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  messagesContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  messageItem: {
    marginBottom: 16,
  },
  myMessage: {
    alignItems: 'flex-end',
  },
  otherMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    borderRadius: 20,
    padding: 12,
  },
  myBubble: {
    backgroundColor: '#6366f1',
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: '#f3f4f6',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  myMessageText: {
    color: '#ffffff',
  },
  otherMessageText: {
    color: '#1f2937',
  },
  mediaMessage: {
    width: 200,
    height: 200,
    borderRadius: 12,
  },
  messageInput: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  inputButton: {
    padding: 8,
    marginRight: 8,
  },
  textInputContainer: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 120,
  },
  textInput: {
    fontSize: 16,
    color: '#1f2937',
    padding: 0,
  },
  sendButton: {
    backgroundColor: '#6366f1',
    borderRadius: 20,
    padding: 12,
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: '#d1d5db',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  newChatModal: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.85,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 0,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  contactsList: {
    flex: 1,
    marginBottom: 20,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  contactName: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
    marginLeft: 16,
  },
  selectedIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#6366f1',
    borderWidth: 4,
    borderColor: '#e0e7ff',
  },
  startChatButton: {
    backgroundColor: '#6366f1',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: '#d1d5db',
  },
  startChatText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});