import {
  View,
  TextInput,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  RefreshControl
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';

// Mock data
const dummyPosts = Array.from({ length: 20 }, (_, i) => ({
  id: `post_${i}`,
  image: `https://source.unsplash.com/random/400x400?sig=${i}`,
}));

const dummyProfiles = Array.from({ length: 10 }, (_, i) => ({
  id: `user_${i}`,
  username: `user${i}`,
  name: i % 2 === 0 ? `John Doe ${i}` : `Jane Smith ${i}`,
  avatar: `https://source.unsplash.com/random/400x400?sig=${i + 100}`,
  isVerified: i % 3 === 0,
  type: 'profile',
}));

const dummyHashtags = Array.from({ length: 5 }, (_, i) => ({
  id: `tag_${i}`,
  name: i % 2 === 0 ? `trending${i}` : `viral${i}`,
  postsCount: Math.floor(Math.random() * 10000),
  type: 'hashtag',
}));

const recentSearches = [...dummyProfiles.slice(0, 3), ...dummyHashtags.slice(0, 2)];

export default function Search() {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchHistory, setSearchHistory] = useState(recentSearches);
  const [searchResults, setSearchResults] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (query.length > 0) {
      const profileResults = dummyProfiles.filter(profile =>
        profile.username.toLowerCase().includes(query.toLowerCase()) ||
        profile.name.toLowerCase().includes(query.toLowerCase())
      );

      const hashtagResults = dummyHashtags.filter(hashtag =>
        hashtag.name.toLowerCase().includes(query.toLowerCase())
      );

      setSearchResults([...profileResults, ...hashtagResults]);
    } else {
      setSearchResults([]);
    }
  }, [query]);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate network request
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleClear = () => {
    setQuery('');
  };

  const handleSearchFocus = () => {
    setIsSearching(true);
  };

  const handleSearchSubmit = () => {
    if (query.trim()) {
      const newSearchItem = query.startsWith('#')
        ? dummyHashtags.find(tag => tag.name === query.replace('#', '')) || {
            id: `new_tag_${Date.now()}`,
            name: query.replace('#', ''),
            postsCount: 0,
            type: 'hashtag',
          }
        : dummyProfiles.find(profile => profile.username === query) || {
            id: `new_profile_${Date.now()}`,
            username: query,
            name: query,
            avatar: '',
            isVerified: false,
            type: 'profile',
          };

      if (
        !searchHistory.some(
          item =>
            (item.type === 'profile' && item.username === newSearchItem.username) ||
            (item.type === 'hashtag' && item.name === newSearchItem.name)
        )
      ) {
        setSearchHistory([newSearchItem, ...searchHistory].slice(0, 10));
      }
    }
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
  };

  const handleBack = () => {
    setIsSearching(false);
    setQuery('');
    setSearchResults([]);
  };

  const renderSearchItem = ({ item }) => {
    if (item.type === 'profile') {
      return (
        <TouchableOpacity style={styles.profileItem}>
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
          <View style={styles.profileInfo}>
            <Text style={styles.username}>
              {item.username}
              {item.isVerified && (
                <Ionicons
                  name="checkmark-circle"
                  size={14}
                  color="#3897f0"
                  style={{ marginLeft: 4 }}
                />
              )}
            </Text>
            <Text style={styles.name}>{item.name}</Text>
          </View>
        </TouchableOpacity>
      );
    } else if (item.type === 'hashtag') {
      return (
        <TouchableOpacity style={styles.hashtagItem}>
          <Ionicons name="pricetag-outline" size={24} color="#333" style={styles.hashtagIcon} />
          <View style={styles.hashtagInfo}>
            <Text style={styles.hashtagName}>#{item.name}</Text>
            <Text style={styles.hashtagPosts}>{item.postsCount} posts</Text>
          </View>
        </TouchableOpacity>
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <View style={styles.header}>
          {isSearching ? (
            <>
              <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="#333" />
              </TouchableOpacity>
              <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
                <TextInput
                  placeholder="Search profiles and hashtags..."
                  value={query}
                  onChangeText={setQuery}
                  style={styles.searchInput}
                  autoFocus={true}
                  onFocus={handleSearchFocus}
                  onSubmitEditing={handleSearchSubmit}
                />
                {query.length > 0 && (
                  <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
                    <Ionicons name="close-circle" size={20} color="#999" />
                  </TouchableOpacity>
                )}
              </View>
            </>
          ) : (
            <TouchableOpacity 
              style={styles.searchContainer}
              onPress={() => setIsSearching(true)}
            >
              <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
              <Text style={styles.searchPlaceholder}>Search profiles and hashtags...</Text>
            </TouchableOpacity>
          )}
        </View>

        {isSearching ? (
          query.length > 0 ? (
            <FlatList
              data={searchResults}
              keyExtractor={item => item.id}
              renderItem={renderSearchItem}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No results found</Text>
                </View>
              }
            />
          ) : (
            <ScrollView>
              {searchHistory.length > 0 && (
                <View style={styles.historyContainer}>
                  <View style={styles.historyHeader}>
                    <Text style={styles.sectionTitle}>Recent Searches</Text>
                    <TouchableOpacity onPress={clearSearchHistory}>
                      <Text style={styles.clearHistoryText}>Clear all</Text>
                    </TouchableOpacity>
                  </View>
                  <FlatList
                    data={searchHistory}
                    keyExtractor={item => item.id}
                    renderItem={renderSearchItem}
                    scrollEnabled={false}
                  />
                </View>
              )}
            </ScrollView>
          )
        ) : (
          <FlatList
            data={dummyPosts}
            numColumns={3}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <Image source={{ uri: item.image }} style={styles.gridImage} />
            )}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#000"
              />
            }
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 38
  },
  keyboardAvoidingView: {
    flex: 1
  },
  header: {
    paddingHorizontal: 10,
    paddingTop: 15,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    paddingRight: 10,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 40,
  },
  searchPlaceholder: {
    color: '#999',
    fontSize: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
  },
  clearButton: {
    padding: 5,
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  profileInfo: {
    flex: 1,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  name: {
    color: '#666',
    fontSize: 14,
  },
  hashtagItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  hashtagIcon: {
    marginRight: 15,
  },
  hashtagInfo: {
    flex: 1,
  },
  hashtagName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  hashtagPosts: {
    color: '#666',
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  historyContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  clearHistoryText: {
    color: '#3897f0',
    fontWeight: 'bold',
  },
  gridImage: {
    width: '33.33%',
    aspectRatio: 1,
    margin: 0.5,
  },
});