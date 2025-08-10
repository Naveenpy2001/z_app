import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import JobCard from './JobCard';
import JobCategories from './JobCategories';
import FeaturedCompanies from './FeaturedCompanies';

const MOCK_JOBS = [
  {
    id: '1',
    title: 'Senior React Native Developer',
    company: 'TechCorp Inc.',
    location: 'San Francisco, CA',
    salary: '$120k - $180k',
    type: 'Full-time',
    postedDate: '2 days ago',
    logo: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    description: 'We are looking for an experienced React Native developer to join our mobile team and build cutting-edge applications...',
    skills: ['React Native', 'JavaScript', 'TypeScript', 'Redux', 'GraphQL'],
    rating: 4.8,
    applicants: 127,
    isUrgent: true,
    isRemote: true,
    benefits: ['Health Insurance', 'Stock Options', 'Remote Work'],
  },
  {
    id: '2',
    title: 'UX/UI Designer',
    company: 'Design Studio Pro',
    location: 'New York, NY',
    salary: '$85k - $120k',
    type: 'Full-time',
    postedDate: '1 day ago',
    logo: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    description: 'Join our creative team to design beautiful and intuitive user experiences for our next-generation products...',
    skills: ['Figma', 'Sketch', 'Adobe XD', 'User Research', 'Prototyping'],
    rating: 4.6,
    applicants: 89,
    isUrgent: false,
    isRemote: false,
    benefits: ['Creative Environment', 'Learning Budget'],
  },
  {
    id: '3',
    title: 'Product Manager',
    company: 'StartupXYZ',
    location: 'Austin, TX',
    salary: '$100k - $140k',
    type: 'Full-time',
    postedDate: '3 days ago',
    logo: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    description: 'Lead product strategy and roadmap for our innovative mobile application with millions of users worldwide...',
    skills: ['Product Strategy', 'Analytics', 'Agile', 'Leadership', 'SQL'],
    rating: 4.4,
    applicants: 156,
    isUrgent: false,
    isRemote: true,
    benefits: ['Equity Package', 'Flexible Hours'],
  },
  {
    id: '4',
    title: 'Full Stack Developer',
    company: 'WebFlow Solutions',
    location: 'Remote',
    salary: '$90k - $130k',
    type: 'Full-time',
    postedDate: '1 week ago',
    logo: 'https://images.pexels.com/photos/3184317/pexels-photo-3184317.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    description: 'Build and maintain scalable web applications using modern technologies in a fast-paced startup environment...',
    skills: ['Node.js', 'React', 'MongoDB', 'AWS', 'Docker'],
    rating: 4.2,
    applicants: 203,
    isUrgent: false,
    isRemote: true,
    benefits: ['Remote First', 'Tech Allowance'],
  },
];

export default function JobsList() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <JobCategories />
      <FeaturedCompanies />
      <View style={styles.jobsContainer}>
        {MOCK_JOBS.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(248, 250, 252, 0.5)',
  },
  jobsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 120,
  },
});