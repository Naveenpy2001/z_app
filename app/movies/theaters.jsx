import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MapPin, ChevronLeft } from 'lucide-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function TheatersScreen() {
  const { movie } = useLocalSearchParams();
  const parsedMovie = JSON.parse(movie);
  const router = useRouter();

  return (
    <LinearGradient colors={['#0f0c29', '#302b63']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Select Theater</Text>
      </View>

      <ScrollView>
        <Text style={styles.movieTitle}>{parsedMovie.title}</Text>
        
        {parsedMovie.theaters.map(theater => (
          <TouchableOpacity 
            key={theater.id}
            style={styles.theaterCard}
            onPress={() => router.push({
              pathname: '/movies/showtimes',
              params: { 
                movie,
                theater: JSON.stringify(theater)
              }
            })}
          >
            <Text style={styles.theaterName}>{theater.name}</Text>
            <View style={styles.location}>
              <MapPin size={16} color="#667eea" />
              <Text style={styles.locationText}>{theater.location}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </LinearGradient>
  );
}