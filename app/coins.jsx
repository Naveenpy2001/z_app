import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Share } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Gift, Ticket, Share2, Users, Zap } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CoinsScreen() {
  const [coins, setCoins] = useState(0);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const storedCoins = await AsyncStorage.getItem('userCoins');
      const storedHistory = await AsyncStorage.getItem('coinsHistory');
      
      if (storedCoins) setCoins(parseInt(storedCoins));
      if (storedHistory) setHistory(JSON.parse(storedHistory));
    };
    loadData();
  }, []);

  const addCoins = async (amount, reason) => {
    const newCoins = coins + amount;
    setCoins(newCoins);
    await AsyncStorage.setItem('userCoins', newCoins.toString());
    
    const newHistory = [
      {
        id: Date.now().toString(),
        amount,
        reason,
        date: new Date().toISOString(),
      },
      ...history,
    ].slice(0, 20); // Keep only last 20 items
    
    setHistory(newHistory);
    await AsyncStorage.setItem('coinsHistory', JSON.stringify(newHistory));
  };

  const redeemCoins = async (amount) => {
    if (coins >= amount) {
      const newCoins = coins - amount;
      setCoins(newCoins);
      await AsyncStorage.setItem('userCoins', newCoins.toString());
      
      const newHistory = [
        {
          id: Date.now().toString(),
          amount: -amount,
          reason: 'Redeemed for reward',
          date: new Date().toISOString(),
        },
        ...history,
      ].slice(0, 20);
      
      setHistory(newHistory);
      await AsyncStorage.setItem('coinsHistory', JSON.stringify(newHistory));
      alert(`Successfully redeemed ${amount} coins!`);
    } else {
      alert('Not enough coins!');
    }
  };

  const shareApp = async () => {
    try {
      await Share.share({
        message: 'Join me on Zingsta! Use my referral code to get bonus coins when you sign up: ZINGSTA123',
      });
      // Give coins for sharing
      addCoins(10, 'Shared app with friends');
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton}>
            <ChevronLeft size={28} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.title}>My Coins</Text>
          <View style={styles.headerRight} />
        </View>

        <View style={styles.coinBalanceContainer}>
          <Text style={styles.balanceLabel}>Your Balance</Text>
          <View style={styles.coinDisplay}>
            <Gift size={36} color="#FFD700" />
            <Text style={styles.coinAmount}>{coins}</Text>
          </View>
        </View>

        <ScrollView style={styles.content}>
          {/* Earn Coins Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Earn More Coins</Text>
            
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => addCoins(5, 'Daily check-in')}
            >
              <View style={styles.actionIcon}>
                <Zap size={24} color="#FFD700" />
              </View>
              <View style={styles.actionText}>
                <Text style={styles.actionTitle}>Daily Check-in</Text>
                <Text style={styles.actionSubtitle}>Get 5 coins every day</Text>
              </View>
              <Text style={styles.actionReward}>+5</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={shareApp}
            >
              <View style={styles.actionIcon}>
                <Share2 size={24} color="#FFD700" />
              </View>
              <View style={styles.actionText}>
                <Text style={styles.actionTitle}>Invite Friends</Text>
                <Text style={styles.actionSubtitle}>Get 10 coins per referral</Text>
              </View>
              <Text style={styles.actionReward}>+10</Text>
            </TouchableOpacity>
          </View>

          {/* Redeem Coins Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Redeem Coins</Text>
            
            <TouchableOpacity 
              style={styles.rewardCard}
              onPress={() => redeemCoins(50)}
            >
              <View style={styles.rewardIcon}>
                <Ticket size={28} color="#FFD700" />
              </View>
              <View style={styles.rewardText}>
                <Text style={styles.rewardTitle}>Movie Ticket Discount</Text>
                <Text style={styles.rewardSubtitle}>50 coins = ₹50 off</Text>
              </View>
              <Text style={styles.rewardCost}>50</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.rewardCard}
              onPress={() => redeemCoins(100)}
            >
              <View style={styles.rewardIcon}>
                <Gift size={28} color="#FFD700" />
              </View>
              <View style={styles.rewardText}>
                <Text style={styles.rewardTitle}>Food Delivery Voucher</Text>
                <Text style={styles.rewardSubtitle}>100 coins = ₹100 off</Text>
              </View>
              <Text style={styles.rewardCost}>100</Text>
            </TouchableOpacity>
          </View>

          {/* History Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            
            {history.length > 0 ? (
              history.map((item) => (
                <View key={item.id} style={styles.historyItem}>
                  <View style={styles.historyText}>
                    <Text style={styles.historyReason}>{item.reason}</Text>
                    <Text style={styles.historyDate}>
                      {new Date(item.date).toLocaleDateString()}
                    </Text>
                  </View>
                  <Text 
                    style={[
                      styles.historyAmount,
                      item.amount > 0 ? styles.positive : styles.negative
                    ]}
                  >
                    {item.amount > 0 ? '+' : ''}{item.amount}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.noHistory}>No activity yet</Text>
            )}
          </View>
        </ScrollView>
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
  coinBalanceContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  balanceLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 10,
  },
  coinDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coinAmount: {
    fontSize: 48,
    fontFamily: 'Inter-Bold',
    color: '#FFD700',
    marginLeft: 10,
  },
  content: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    marginBottom: 15,
    paddingLeft: 10,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
  },
  actionIcon: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderRadius: 12,
    padding: 10,
    marginRight: 15,
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginBottom: 3,
  },
  actionSubtitle: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  actionReward: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFD700',
  },
  rewardCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
  },
  rewardIcon: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderRadius: 12,
    padding: 10,
    marginRight: 15,
  },
  rewardText: {
    flex: 1,
  },
  rewardTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginBottom: 3,
  },
  rewardSubtitle: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  rewardCost: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFD700',
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  historyText: {
    flex: 1,
  },
  historyReason: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    color: '#ffffff',
    marginBottom: 3,
  },
  historyDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  historyAmount: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
  positive: {
    color: '#4CAF50',
  },
  negative: {
    color: '#F44336',
  },
  noHistory: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    paddingVertical: 20,
  },
});