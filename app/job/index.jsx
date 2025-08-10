import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, StyleSheet, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Search, Bell, Bookmark, Filter, ChevronRight } from 'lucide-react-native';
import JobHeader from './JobsHeader';
import JobCategories from './JobCategories';
import FeaturedCompanies from './FeaturedCompanies';
import JobList from './JobsList';
import JobCard from './JobCard';

const JobIndex = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Recommended');

  const tabs = ['Recommended', 'Recent', 'Saved'];

  const featuredCompanies = [
    {
      id: '1',
      name: 'Google',
      logo: 'https://logo.clearbit.com/google.com',
      jobs: 124,
      rating: 4.5,
    },
    {
      id: '2',
      name: 'Amazon',
      logo: 'https://logo.clearbit.com/amazon.com',
      jobs: 89,
      rating: 4.2,
    },
    {
      id: '3',
      name: 'Microsoft',
      logo: 'https://logo.clearbit.com/microsoft.com',
      jobs: 76,
      rating: 4.4,
    },
  ];

  const jobCategories = [
    { id: '1', name: 'IT/Software', icon: '💻', jobs: 1250 },
    { id: '2', name: 'Marketing', icon: '📈', jobs: 890 },
    { id: '3', name: 'Finance', icon: '💰', jobs: 760 },
    { id: '4', name: 'Healthcare', icon: '🏥', jobs: 540 },
    { id: '5', name: 'Education', icon: '📚', jobs: 430 },
  ];

  const jobs = [
    {
      id: '1',
      title: 'Senior React Native Developer',
      company: 'Tech Solutions Inc.',
      location: 'Bangalore, India',
      salary: '₹12L - ₹18L PA',
      experience: '3-5 years',
      type: 'Full-time',
      posted: '2d ago',
      logo: 'https://randomuser.me/api/portraits/lego/1.jpg',
      skills: ['React Native', 'JavaScript', 'Redux'],
    },
    {
      id: '2',
      title: 'UX Designer',
      company: 'Creative Minds',
      location: 'Remote',
      salary: '₹8L - ₹12L PA',
      experience: '2-4 years',
      type: 'Full-time',
      posted: '1d ago',
      logo: 'https://randomuser.me/api/portraits/lego/2.jpg',
      skills: ['Figma', 'UI/UX', 'Prototyping'],
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <JobHeader 
        onNotificationPress={() => console.log('Notifications pressed')}
        onBookmarkPress={() => console.log('Bookmarks pressed')}
      />

      {/* Search Bar */}
      

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Categories */}
        <JobCategories categories={jobCategories} />

        {/* Featured Companies */}
        <FeaturedCompanies companies={featuredCompanies} />

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Job Listings */}
        <JobList>
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onPress={() => console.log(`Job ${job.id} pressed`)}
              onSavePress={() => console.log(`Job ${job.id} saved`)}
            />
          ))}
        </JobList>

        {/* View All Button */}
        <TouchableOpacity style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>View all jobs</Text>
          <ChevronRight size={16} color="#2563eb" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchBar: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#333',
  },
  filterButton: {
    backgroundColor: '#2563eb',
    borderRadius: 6,
    padding: 6,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    marginHorizontal: 16,
    marginTop: 16,
  },
  tab: {
    paddingBottom: 12,
    marginRight: 24,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#2563eb',
  },
  tabText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#2563eb',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginBottom: 16,
  },
  viewAllText: {
    color: '#2563eb',
    fontWeight: '600',
    marginRight: 4,
  },
});

export default JobIndex;