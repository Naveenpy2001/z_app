import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Instagram, Film, UtensilsCrossed, User, Settings, LogOut, Gift } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const MENU_ITEMS = [
  {
    id: 'feed',
    title: 'Zingsta Feed',
    subtitle: 'Social Media & Stories',
    icon: Instagram,
    colors: ['#8E2DE2', '#4A00E0'],
    route: '/insta',
  },
  {
    id: 'movies',
    title: 'Movies',
    subtitle: 'Book Cinema Tickets',
    icon: Film,
    colors: ['#00C9FF', '#92FE9D'],
    route: '/movies',
  },
  // {
  //   id: 'food',
  //   title: 'Zingsta Food',
  //   subtitle: 'Order Delicious Meals',
  //   icon: UtensilsCrossed,
  //   colors: ['#F7971E', '#FFD200'],
  //   route: '/food',
  // },
];

export default function MainMenuScreen() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [coins, setCoins] = useState(0);
  const scaleAnims = useRef(
    MENU_ITEMS.reduce((acc, item) => {
      acc[item.id] = new Animated.Value(1);
      return acc;
    }, {})
  ).current;

  React.useEffect(() => {
    const loadCoins = async () => {
      const storedCoins = await AsyncStorage.getItem('userCoins');
      if (storedCoins) {
        setCoins(parseInt(storedCoins));
      }
    };
    loadCoins();
  }, []);

  const handlePress = (item) => {
    setSelectedItem(item.id);

    Animated.sequence([
      Animated.timing(scaleAnims[item.id], {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnims[item.id], {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      router.push(item.route);
      setSelectedItem(null);
    });
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      router.replace('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <LinearGradient
      colors={['#0f0c29', '#302b63', '#24243e']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.welcomeText}>Welcome to</Text>
            <Text style={styles.appTitle}>Zingsta</Text>
            <Text style={styles.subtitle}>Fulfilling Your Needs</Text>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.coinContainer}
              onPress={() => router.push('/coins')}
            >
              <Gift size={20} color="#FFD700" />
              <Text style={styles.coinText}>{coins}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton} onPress={() => router.push('/profile')}>
              <User size={24} color="#ffffff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton} onPress={handleLogout}>
              <LogOut size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.menuContainer}>
          {MENU_ITEMS.map((item) => (
            <Animated.View
              key={item.id}
              style={[
                styles.menuItemContainer,
                {
                  transform: [{ scale: scaleAnims[item.id] }],
                },
              ]}
            >
              <TouchableOpacity
                onPress={() => handlePress(item)}
                style={styles.menuItem}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={item.colors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.menuGradient}
                >
                  <View style={styles.menuContent}>
                    <View style={styles.iconContainer}>
                      <item.icon size={36} color="#ffffff" />
                    </View>

                    <View style={styles.textContainer}>
                      <Text style={styles.menuTitle}>{item.title}</Text>
                      <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                    </View>

                    <View style={styles.arrowContainer}>
                      <View style={styles.arrow} />
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Connect • Entertain • Dine — All in One Place</Text>
          <Text style={styles.versionText}>Zingsta v1.1.0</Text>
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
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
  headerContent: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 4,
  },
  appTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coinContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
  },
  coinText: {
    color: '#FFD700',
    fontWeight: 'bold',
    marginLeft: 6,
  },
  headerButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 10,
    borderRadius: 20,
    marginLeft: 8,
  },
  menuContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  menuItemContainer: {
    marginBottom: 16,
  },
  menuItem: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  menuGradient: {
    padding: 20,
    borderRadius: 20,
  },
  menuContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 12,
    borderRadius: 25,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  menuSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  arrowContainer: {
    marginLeft: 10,
  },
  arrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderTopWidth: 6,
    borderBottomWidth: 6,
    borderLeftColor: '#fff',
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  versionText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
  },
});
