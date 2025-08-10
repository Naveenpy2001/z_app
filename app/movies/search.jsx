import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Search, X, ChevronLeft,ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const filteredMovies = MOVIES.filter(movie => 
    movie.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <LinearGradient colors={['#0f0c29', '#302b63']} style={styles.container}>
      <View style={styles.header}>
                <TouchableOpacity
                  onPress={() => router.push('/main-menu')}
                  style={styles.backButton}
                >
                  <ArrowLeft size={24} color="#ffffff" />
                </TouchableOpacity>
                
                <Text style={styles.headerTitle}>Zingsta Feed</Text>
                
                <View style={styles.headerActions}>
                  <TouchableOpacity
                    onPress={() => router.push('/messaging')}
                    style={styles.actionButton}
                  >
                    <MessageCircleHeart  size={24} color="#ffffff" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <Search size={24} color="#ffffff" />
                  </TouchableOpacity>
                </View>
              </View>
      <View style={styles.searchBar}> 
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft size={24} color="#fff" />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Search for movies..."
          placeholderTextColor="#888"
          value={query}
          onChangeText={setQuery}
          autoFocus
        />
        {query ? (
          <TouchableOpacity onPress={() => setQuery('')}>
            <X size={24} color="#fff" />
          </TouchableOpacity>
        ) : null}
      </View>

      <FlatList
        data={filteredMovies}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.resultItem}
            onPress={() => router.push({
              pathname: '/movies/theaters',
              params: { movie: JSON.stringify(item) }
            })}
          >
            <Text style={styles.resultText}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </LinearGradient>
  );
}



const styles = StyleSheet.create({

 header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 3,
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    padding: 8,
  },
  headerTitle: {
    color: '#ffffff',
    fontFamily: 'Inter-Bold',
    fontSize: 20,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 5,
    padding: 8,
    marginLeft: 8,                                                                                                                                                                                                                                                                                                                                              
  }

})