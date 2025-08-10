import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CheckCircle, Ticket, MapPin, Calendar, Clock, Chair } from 'lucide-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function ConfirmationScreen() {
  const { movie, theater, time, date, seats, amount } = useLocalSearchParams();
  const router = useRouter();
  
  const parsedMovie = JSON.parse(movie);
  const parsedTheater = JSON.parse(theater);
  const parsedSeats = JSON.parse(seats);

  return (
    <LinearGradient colors={['#0f0c29', '#302b63']} style={styles.container}>
      <View style={styles.content}>
        <CheckCircle size={80} color="#4CAF50" />
        <Text style={styles.title}>Booking Confirmed!</Text>
        
        <View style={styles.ticket}>
          <Image source={{ uri: parsedMovie.poster }} style={styles.poster} />
          
          <View style={styles.details}>
            <Text style={styles.movieTitle}>{parsedMovie.title}</Text>
            
            <View style={styles.detailRow}>
              <MapPin size={18} color="#667eea" />
              <Text style={styles.detailText}>{parsedTheater.name}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Calendar size={18} color="#667eea" />
              <Text style={styles.detailText}>
                {new Date(date).toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <Clock size={18} color="#667eea" />
              <Text style={styles.detailText}>{time}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Chair size={18} color="#667eea" />
              <Text style={styles.detailText}>
                {parsedSeats.join(', ')}
              </Text>
            </View>
          </View>
        </View>
        
        <Text style={styles.amount}>Amount Paid: ₹{amount}</Text>
        
        <TouchableOpacity 
          style={styles.homeButton}
          onPress={() => router.replace('/')}
        >
          <Text style={styles.homeButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}