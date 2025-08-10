import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CreditCard, ChevronLeft, Ticket } from 'lucide-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function PaymentScreen() {
  const { movie, theater, time, date, seats } = useLocalSearchParams();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const router = useRouter();

  const parsedSeats = JSON.parse(seats);
  const totalPrice = parsedSeats.length * 200; // 200 per seat

  return (
    <LinearGradient colors={['#0f0c29', '#302b63']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Payment</Text>
      </View>

      <ScrollView>
        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          <Text style={styles.summaryText}>{parsedSeats.length} Tickets</Text>
          <Text style={styles.summaryText}>₹{totalPrice}</Text>
        </View>

        <View style={styles.paymentMethods}>
          <TouchableOpacity 
            style={[
              styles.method,
              paymentMethod === 'card' && styles.selectedMethod
            ]}
            onPress={() => setPaymentMethod('card')}
          >
            <CreditCard size={24} color="#fff" />
            <Text style={styles.methodText}>Credit/Debit Card</Text>
          </TouchableOpacity>
          
          {/* Other payment methods */}
        </View>

        <TouchableOpacity 
          style={styles.payButton}
          onPress={() => router.push({
            pathname: '/movies/confirmation',
            params: { 
              movie,
              theater,
              time,
              date,
              seats,
              amount: totalPrice.toString()
            }
          })}
        >
          <Text style={styles.payText}>Pay ₹{totalPrice}</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}