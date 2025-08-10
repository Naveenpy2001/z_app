import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, CheckCircle, Ticket, MapPin, Calendar, Clock } from 'lucide-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function BookingConfirmation() {
  const router = useRouter();
  const { movie, theater, time, date, discountApplied } = useLocalSearchParams();
  
  const parsedMovie = JSON.parse(movie);
  const parsedTheater = JSON.parse(theater);

  return (
    <LinearGradient colors={['#0f0c29', '#302b63', '#24243e']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.push("/movies")}
          >
            <ChevronLeft size={28} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.title}>Booking Confirmed</Text>
          <View style={styles.headerRight} />
        </View>

        <View style={styles.content}>
          <View style={styles.confirmationIcon}>
            <CheckCircle size={80} color="#4CAF50" />
          </View>
          
          <Text style={styles.confirmationText}>Your tickets have been booked successfully!</Text>
          
          <View style={styles.ticketCard}>
            <View style={styles.ticketHeader}>
              <Image 
                source={{ uri: parsedMovie.poster }} 
                style={styles.ticketMoviePoster}
                resizeMode="cover"
              />
              <View style={styles.ticketMovieInfo}>
                <Text style={styles.ticketMovieTitle}>{parsedMovie.title}</Text>
                <Text style={styles.ticketMovieDuration}>{parsedMovie.duration}</Text>
              </View>
            </View>
            
            <View style={styles.ticketDetails}>
              <View style={styles.ticketDetailRow}>
                <MapPin size={20} color="#667eea" />
                <Text style={styles.ticketDetailText}>{parsedTheater.name}</Text>
              </View>
              <View style={styles.ticketDetailRow}>
                <MapPin size={20} color="#667eea" />
                <Text style={styles.ticketDetailText}>{parsedTheater.location}</Text>
              </View>
              <View style={styles.ticketDetailRow}>
                <Calendar size={20} color="#667eea" />
                <Text style={styles.ticketDetailText}>
                  {new Date(date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}
                </Text>
              </View>
              <View style={styles.ticketDetailRow}>
                <Clock size={20} color="#667eea" />
                <Text style={styles.ticketDetailText}>{time}</Text>
              </View>
            </View>
            
            <View style={styles.ticketFooter}>
              <Ticket size={24} color="#667eea" />
              <Text style={styles.ticketId}>TXN-{Math.random().toString(36).substring(2, 10).toUpperCase()}</Text>
            </View>
          </View>
          
          {discountApplied === 'true' && (
            <View style={styles.discountApplied}>
              <Text style={styles.discountAppliedText}>₹50 discount applied (50 coins used)</Text>
            </View>
          )}
          
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Total Paid:</Text>
            <Text style={styles.priceAmount}>₹{discountApplied === 'true' ? '150' : '200'}</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.doneButton}
            onPress={() => router.replace('/')}
          >
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
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
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  confirmationIcon: {
    marginBottom: 20,
  },
  confirmationText: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 30,
  },
  ticketCard: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
  },
  ticketHeader: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  ticketMoviePoster: {
    width: 80,
    height: 120,
    borderRadius: 8,
  },
  ticketMovieInfo: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  ticketMovieTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  ticketMovieDuration: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  ticketDetails: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    paddingTop: 15,
  },
  ticketDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ticketDetailText: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    color: '#ffffff',
    marginLeft: 10,
  },
  ticketFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    paddingTop: 15,
    marginTop: 15,
  },
  ticketId: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#667eea',
    marginLeft: 10,
  },
  discountApplied: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  discountAppliedText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#4CAF50',
    textAlign: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  priceLabel: {
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    color: '#ffffff',
  },
  priceAmount: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  doneButton: {
    backgroundColor: '#667eea',
    borderRadius: 8,
    padding: 16,
    width: '100%',
    alignItems: 'center',
  },
  doneButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
});
