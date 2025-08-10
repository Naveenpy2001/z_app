import React from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Star, MapPin, Users } from 'lucide-react-native';

const FEATURED_COMPANIES = [
  {
    id: '1',
    name: 'TechCorp Inc.',
    logo: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    rating: 4.8,
    employees: '1K-5K',
    location: 'San Francisco',
    openJobs: 23,
    industry: 'Technology',
  },
  {
    id: '2',
    name: 'Design Studio',
    logo: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    rating: 4.6,
    employees: '100-500',
    location: 'New York',
    openJobs: 12,
    industry: 'Design',
  },
  {
    id: '3',
    name: 'StartupXYZ',
    logo: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    rating: 4.4,
    employees: '50-100',
    location: 'Austin',
    openJobs: 8,
    industry: 'Fintech',
  },
];

export default function FeaturedCompanies() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Featured Companies</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
        {FEATURED_COMPANIES.map((company) => (
          <TouchableOpacity key={company.id} style={styles.companyCard}>
            <LinearGradient
              colors={['#ffffff', '#f8fafc']}
              style={styles.cardGradient}
            >
              <View style={styles.companyHeader}>
                <Image source={{ uri: company.logo }} style={styles.companyLogo} />
                <View style={styles.ratingContainer}>
                  <Star size={12} color="#fbbf24" fill="#fbbf24" />
                  <Text style={styles.rating}>{company.rating}</Text>
                </View>
              </View>
              
              <Text style={styles.companyName} numberOfLines={1}>
                {company.name}
              </Text>
              
              <Text style={styles.industry}>{company.industry}</Text>
              
              <View style={styles.companyDetails}>
                <View style={styles.detailItem}>
                  <MapPin size={10} color="#6b7280" />
                  <Text style={styles.detailText}>{company.location}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Users size={10} color="#6b7280" />
                  <Text style={styles.detailText}>{company.employees}</Text>
                </View>
              </View>
              
              <View style={styles.jobsIndicator}>
                <Text style={styles.jobsCount}>{company.openJobs} open positions</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    paddingVertical: 20,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
  },
  seeAll: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#6366f1',
  },
  scrollView: {
    paddingHorizontal: 16,
  },
  companyCard: {
    width: 160,
    marginRight: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  cardGradient: {
    padding: 16,
    height: 180,
  },
  companyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  companyLogo: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  rating: {
    fontSize: 11,
    fontFamily: 'Inter-SemiBold',
    color: '#f59e0b',
    marginLeft: 2,
  },
  companyName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
    marginBottom: 4,
  },
  industry: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6366f1',
    marginBottom: 12,
  },
  companyDetails: {
    gap: 6,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    marginLeft: 4,
  },
  jobsIndicator: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  jobsCount: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: '#6366f1',
  },
});