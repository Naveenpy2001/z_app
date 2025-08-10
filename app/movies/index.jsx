import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, FlatList, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Search, MapPin, Calendar, Clock, Ticket, Star } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {  useRouter } from 'expo-router';


const { width } = Dimensions.get('window');

const MOVIES = [
  {
    id: '1',
    title: 'Avengers: Endgame',
    genre: 'Action, Adventure',
    rating: 4.8,
    duration: '3h 1m',
    poster: 'https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_.jpg',
    theaters: [
      { id: '1', name: 'PVR Cinemas', location: 'Mall of India', times: ['10:00 AM', '1:30 PM', '4:45 PM', '8:00 PM'] },
      { id: '2', name: 'INOX', location: 'GIP Mall', times: ['11:15 AM', '2:30 PM', '5:45 PM', '9:00 PM'] },
    ],
  },
  {
    id: '2',
    title: 'Spider-Man: No Way Home',
    genre: 'Action, Adventure',
    rating: 4.7,
    duration: '2h 28m',
    poster: 'https://m.media-amazon.com/images/M/MV5BZWMyYzFjYTYtNTRjYi00OGExLWE2YzgtOGRmYjAxZTU3NzBiXkEyXkFqcGdeQXVyMzQ0MzA0NTM@._V1_FMjpg_UX1000_.jpg',
    theaters: [
      { id: '1', name: 'PVR Cinemas', location: 'Mall of India', times: ['9:30 AM', '12:45 PM', '4:00 PM', '7:15 PM'] },
      { id: '3', name: 'Cinepolis', location: 'Logix Mall', times: ['10:45 AM', '2:00 PM', '5:15 PM', '8:30 PM'] },
    ],
  },
  {
    id: '3',
    title: 'The Batman',
    genre: 'Action, Crime',
    rating: 4.5,
    duration: '2h 56m',
    poster: 'https://m.media-amazon.com/images/M/MV5BMDdmMTBiNTYtMDIzNi00NGVlLWIzMDYtZTk3MTQ3NGQxZGEwXkEyXkFqcGdeQXVyMzMwOTU5MDk@._V1_.jpg',
    theaters: [
      { id: '2', name: 'INOX', location: 'GIP Mall', times: ['10:30 AM', '2:00 PM', '5:30 PM', '9:00 PM'] },
      { id: '3', name: 'Cinepolis', location: 'Logix Mall', times: ['11:00 AM', '2:30 PM', '6:00 PM', '9:30 PM'] },
    ],
  },
  {
  id: '4',
  title: 'Inception',
  genre: 'Sci-Fi, Thriller',
  rating: 4.9,
  duration: '2h 28m',
  poster: 'https://m.media-amazon.com/images/I/51oDAD1fJBL._AC_.jpg',
  theaters: [
    { id: '1', name: 'PVR Cinemas', location: 'Mall of India', times: ['11:00 AM', '2:30 PM', '6:00 PM'] },
    { id: '3', name: 'Cinepolis', location: 'Logix Mall', times: ['10:15 AM', '1:45 PM', '5:00 PM'] },
  ],
}

];

export default function MoviesScreen() {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedTheater, setSelectedTheater] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [coins, setCoins] = useState(0);

  const router = useRouter();

  useEffect(() => {
    const loadCoins = async () => {
      const storedCoins = await AsyncStorage.getItem('userCoins');
      if (storedCoins) {
        setCoins(parseInt(storedCoins));
      }
    };
    loadCoins();
  }, []);

  const handleBookTicket = async () => {
    if (!selectedMovie || !selectedTheater || !selectedTime) {
      alert('Please select movie, theater and show time');
      return;
    }
    
    // Deduct coins if user wants to apply discount
    const applyDiscount = coins >= 50;
    if (applyDiscount) {
      const newCoins = coins - 50;
      setCoins(newCoins);
      await AsyncStorage.setItem('userCoins', newCoins.toString());
      
      const history = JSON.parse(await AsyncStorage.getItem('coinsHistory') || []);
      const newHistory = [
        {
          id: Date.now().toString(),
          amount: -50,
          reason: 'Movie ticket discount',
          date: new Date().toISOString(),
        },
        ...history,
      ].slice(0, 20);
      
      await AsyncStorage.setItem('coinsHistory', JSON.stringify(newHistory));
    }
    
    router.push({
      pathname: '/movies/booking',
      params: {
        movie: JSON.stringify(selectedMovie),
        theater: JSON.stringify(selectedTheater),
        time: selectedTime,
        date,
        discountApplied: applyDiscount,
      },
    });
  };

  return (
    <LinearGradient colors={['#0f0c29', '#302b63', '#24243e']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.push("/main-menu")}>
            <ChevronLeft size={28} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.title}>Movie Tickets</Text>
          <TouchableOpacity style={styles.searchButton}>
            <Search size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {!selectedMovie ? (
          <ScrollView style={styles.content}>
            <Text style={styles.sectionTitle}>Now Showing</Text>
            <FlatList
              data={MOVIES}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.movieCard}
                  onPress={() => setSelectedMovie(item)}
                >
                  <Image 
                    source={{ uri: item.poster }} 
                    style={styles.moviePoster}
                    resizeMode="cover"
                  />
                  <View style={styles.movieInfo}>
                    <Text style={styles.movieTitle} numberOfLines={1}>{item.title}</Text>
                    <View style={styles.movieMeta}>
                      <Star size={16} color="#FFD700" />
                      <Text style={styles.movieRating}>{item.rating}</Text>
                      <Text style={styles.movieDuration}>{item.duration}</Text>
                    </View>
                    <Text style={styles.movieGenre}>{item.genre}</Text>
                  </View>
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.movieList}
            />

            <Text style={styles.sectionTitle}>Coming Soon</Text>
            <View style={styles.comingSoonContainer}>
              <Text style={styles.comingSoonText}>More movies coming next week!</Text>
            </View>
          </ScrollView>
        ) : (
          <ScrollView style={styles.content}>
            <View style={styles.movieHeader}>
              <Image 
                source={{ uri: selectedMovie.poster }} 
                style={styles.selectedMoviePoster}
                resizeMode="cover"
              />
              <View style={styles.movieHeaderInfo}>
                <Text style={styles.selectedMovieTitle}>{selectedMovie.title}</Text>
                <View style={styles.movieHeaderMeta}>
                  <Star size={18} color="#FFD700" />
                  <Text style={styles.selectedMovieRating}>{selectedMovie.rating}</Text>
                  <Text style={styles.selectedMovieDuration}>{selectedMovie.duration}</Text>
                </View>
                <Text style={styles.selectedMovieGenre}>{selectedMovie.genre}</Text>
              </View>
            </View>

            <View style={styles.dateSelector}>
              <Calendar size={20} color="#ffffff" />
              <Text style={styles.dateText}>{new Date(date).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })}</Text>
            </View>

            <Text style={styles.sectionTitle}>Select Theater</Text>
            {selectedMovie.theaters.map((theater) => (
              <TouchableOpacity
                key={theater.id}
                style={[
                  styles.theaterCard,
                  selectedTheater?.id === theater.id && styles.selectedTheater,
                ]}
                onPress={() => {
                  setSelectedTheater(theater);
                  setSelectedTime(null);
                }}
              >
                <View style={styles.theaterInfo}>
                  <Text style={styles.theaterName}>{theater.name}</Text>
                  <View style={styles.theaterLocation}>
                    <MapPin size={16} color="#ffffff" />
                    <Text style={styles.theaterLocationText}>{theater.location}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}

            {selectedTheater && (
              <>
                <Text style={styles.sectionTitle}>Select Show Time</Text>
                <View style={styles.timeSlots}>
                  {selectedTheater.times.map((time) => (
                    <TouchableOpacity
                      key={time}
                      style={[
                        styles.timeSlot,
                        selectedTime === time && styles.selectedTimeSlot,
                      ]}
                      onPress={() => setSelectedTime(time)}
                    >
                      <Text style={styles.timeSlotText}>{time}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}

            {coins >= 50 && (
              <View style={styles.discountBanner}>
                <Ticket size={20} color="#FFD700" />
                <Text style={styles.discountText}>Use 50 coins to get ₹50 off</Text>
              </View>
            )}

            <TouchableOpacity 
              style={styles.bookButton}
              onPress={handleBookTicket}
            >
              <Text style={styles.bookButtonText}>
                {selectedTheater && selectedTime ? 
                  `Book Tickets - ₹${coins >= 50 ? '150' : '200'}` : 
                  'Select Show Time'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  searchButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    marginVertical: 15,
  },
  movieList: {
    paddingBottom: 10,
  },
  movieCard: {
    width: width * 0.4,
    marginRight: 15,
  },
  moviePoster: {
    width: '100%',
    height: width * 0.6,
    borderRadius: 12,
  },
  movieInfo: {
    marginTop: 10,
  },
  movieTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  movieMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  movieRating: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#FFD700',
    marginLeft: 5,
    marginRight: 10,
  },
  movieDuration: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  movieGenre: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 3,
  },
  comingSoonContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
  },
  comingSoonText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  movieHeader: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  selectedMoviePoster: {
    width: 100,
    height: 150,
    borderRadius: 8,
  },
  movieHeaderInfo: {
    flex: 1,
    marginLeft: 15,
  },
  selectedMovieTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  movieHeaderMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  selectedMovieRating: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FFD700',
    marginLeft: 5,
    marginRight: 15,
  },
  selectedMovieDuration: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  selectedMovieGenre: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  dateText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginLeft: 10,
  },
  theaterCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  selectedTheater: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: '#667eea',
  },
  theaterInfo: {
    flexDirection: 'column',
  },
  theaterName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginBottom: 5,
  },
  theaterLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  theaterLocationText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.7)',
    marginLeft: 5,
  },
  timeSlots: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  timeSlot: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginRight: 10,
    marginBottom: 10,
  },
  selectedTimeSlot: {
    backgroundColor: '#667eea',
  },
  timeSlotText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#ffffff',
  },
  discountBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.5)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  discountText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFD700',
    marginLeft: 10,
  },
  bookButton: {
    backgroundColor: '#667eea',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 30,
  },
  bookButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
});