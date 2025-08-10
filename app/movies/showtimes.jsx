import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, Clock, ChevronLeft } from 'lucide-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function ShowtimesScreen() {
  const { movie, theater } = useLocalSearchParams();
  const parsedMovie = JSON.parse(movie);
  const parsedTheater = JSON.parse(theater);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const router = useRouter();

  return (
    <LinearGradient colors={['#0f0c29', '#302b63']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Select Showtime</Text>
      </View>

      <ScrollView>
        <View style={styles.dateSelector}>
          <Calendar size={20} color="#fff" />
          <Text style={styles.dateText}>
            {selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </Text>
        </View>

        <View style={styles.timeSlots}>
          {parsedTheater.times.map(time => (
            <TouchableOpacity
              key={time}
              style={styles.timeSlot}
              onPress={() => router.push({
                pathname: '/movies/seats',
                params: { 
                  movie,
                  theater,
                  time,
                  date: selectedDate.toISOString()
                }
              })}
            >
              <Text style={styles.timeText}>{time}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}