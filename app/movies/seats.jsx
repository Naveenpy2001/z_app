import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Chair, ChevronLeft } from 'lucide-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

const SEAT_ROWS = [
  ['A1', 'A2', 'A3', 'A4', 'A5'],
  ['B1', 'B2', 'B3', 'B4', 'B5'],
  // More rows...
];

export default function SeatsScreen() {
  const { movie, theater, time, date } = useLocalSearchParams();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const router = useRouter();

  const toggleSeat = (seat) => {
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seat));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  return (
    <LinearGradient colors={['#0f0c29', '#302b63']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Select Seats</Text>
      </View>

      <ScrollView>
        <View style={styles.screenIndicator}>
          <Text style={styles.screenText}>SCREEN</Text>
        </View>

        <View style={styles.seatsContainer}>
          {SEAT_ROWS.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
              {row.map(seat => (
                <TouchableOpacity
                  key={seat}
                  style={[
                    styles.seat,
                    selectedSeats.includes(seat) && styles.selectedSeat
                  ]}
                  onPress={() => toggleSeat(seat)}
                >
                  <Chair size={24} color={
                    selectedSeats.includes(seat) ? '#667eea' : '#555'
                  } />
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>

        <TouchableOpacity 
          style={styles.proceedButton}
          onPress={() => router.push({
            pathname: '/movies/payment',
            params: { 
              movie,
              theater,
              time,
              date,
              seats: JSON.stringify(selectedSeats)
            }
          })}
          disabled={selectedSeats.length === 0}
        >
          <Text style={styles.proceedText}>
            Proceed to Pay ({selectedSeats.length} seats)
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}