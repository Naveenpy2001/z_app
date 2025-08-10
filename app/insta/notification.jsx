import React from 'react';
import {
  View,
  FlatList,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const dummyNotifications = [
  {
    id: '1',
    type: 'like',
    user: 'john_doe',
    avatar: 'https://randomuser.me/api/portraits/men/11.jpg',
    message: 'liked your post.',
    time: '2h',
  },
  {
    id: '2',
    type: 'follow',
    user: 'jane_smith',
    avatar: 'https://randomuser.me/api/portraits/women/21.jpg',
    message: 'started following you.',
    time: '4h',
  },
  {
    id: '3',
    type: 'comment',
    user: 'mike_dev',
    avatar: 'https://randomuser.me/api/portraits/men/31.jpg',
    message: 'commented: "Awesome post!"',
    time: '1d',
  },
  {
    id: '4',
    type: 'like',
    user: 'alex_lee',
    avatar: 'https://randomuser.me/api/portraits/men/41.jpg',
    message: 'liked your post.',
    time: '2d',
  },
  {
    id: '5',
    type: 'mention',
    user: 'sara_queen',
    avatar: 'https://randomuser.me/api/portraits/women/51.jpg',
    message: 'mentioned you in a comment.',
    time: '2d',
  },
  {
    id: '6',
    type: 'follow',
    user: 'brandon_x',
    avatar: 'https://randomuser.me/api/portraits/men/61.jpg',
    message: 'started following you.',
    time: '3d',
  },
  {
    id: '7',
    type: 'comment',
    user: 'kate_blossom',
    avatar: 'https://randomuser.me/api/portraits/women/71.jpg',
    message: 'commented: "Looks great!"',
    time: '4d',
  },
  {
    id: '8',
    type: 'like',
    user: 'zack_nova',
    avatar: 'https://randomuser.me/api/portraits/men/81.jpg',
    message: 'liked your reel.',
    time: '5d',
  },
  {
    id: '9',
    type: 'follow',
    user: 'emily_k',
    avatar: 'https://randomuser.me/api/portraits/women/91.jpg',
    message: 'started following you.',
    time: '6d',
  },
  {
    id: '10',
    type: 'comment',
    user: 'ron_fox',
    avatar: 'https://randomuser.me/api/portraits/men/99.jpg',
    message: 'commented: "🔥🔥🔥"',
    time: '1w',
  },
];


const NotificationsScreen = () => {
  const navigation = useNavigation();

  const renderItem = ({ item }) => (
    <View style={styles.notificationItem}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.textContainer}>
        <Text style={styles.notificationText}>
          <Text style={styles.username}>{item.user} </Text>
          {item.message}
        </Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>

      <FlatList
        data={dummyNotifications}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop:35
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  list: {
    paddingBottom: 20,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 10,
    borderBottomColor: '#f1f1f1',
    borderBottomWidth: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  notificationText: {
    fontSize: 15,
    color: '#333',
  },
  username: {
    fontWeight: 'bold',
    color: '#000',
  },
  time: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
});
