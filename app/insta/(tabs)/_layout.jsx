// app/(tabs)/_layout.jsx
import { Tabs, useRouter } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {
  Bell,
  MessageCircle,
  Home,
  Search,
  PlusCircle,
  Film,
  User,
  BadgePlus 
} from 'lucide-react-native';
import React, { useState, useEffect, useRef } from 'react';


export default function TabsLayout() {
  const router = useRouter();

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#6366f1',
          tabBarStyle: styles.tabBar,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({ color }) => <Home color={color} size={24} />,
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            tabBarLabel: 'Search',
            tabBarIcon: ({ color }) => <Search color={color} size={24} />,
          }}
        />
        <Tabs.Screen
          name="create"
          options={{
            tabBarLabel: '',
            tabBarIcon: ({ color }) => <BadgePlus  color={color} size={32} />,
          }}
        />
        <Tabs.Screen
          name="reels"
          options={{
            tabBarLabel: 'Reels',
            tabBarIcon: ({ color }) => <Film color={color} size={24} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            tabBarLabel: 'Profile',
            tabBarIcon: ({ color }) => <User color={color} size={24} />,
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  topHeader: {
    backgroundColor: '#6366f1',
    paddingTop: 40,
    paddingBottom: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  icon: {
    marginLeft: 16,
  },
  tabBar: {
    backgroundColor: 'white',
    height: 60,
    borderTopWidth: 0.3,
    borderTopColor: '#d1d5db',
  },
});
