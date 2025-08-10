import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Bookmark, 
  Star,
  TrendingUp,
  Users,
  Award,
  Zap
} from 'lucide-react-native';
import { Link } from 'expo-router';

const JobCard = ({ job }) => {
  const [isSaved, setIsSaved] = React.useState(false);

  return (
    <TouchableOpacity style={styles.container}>
      <LinearGradient
        colors={['#ffffff', '#f8fafc']}
        style={styles.cardGradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.companyInfo}>
            <View style={styles.logoContainer}>
              <Image source={{ uri: job.logo }} style={styles.logo} />
              {job.rating && (
                <View style={styles.ratingBadge}>
                  <Star size={10} color="#fbbf24" fill="#fbbf24" />
                  <Text style={styles.ratingText}>{job.rating}</Text>
                </View>
              )}
            </View>
            
            <View style={styles.titleContainer}>
              <View style={styles.titleRow}>
                <Text style={styles.title} numberOfLines={2}>
                  {job.title}
                </Text>
                {job.isUrgent && (
                  <View style={styles.urgentBadge}>
                    <Zap size={12} color="#fff" />
                    <Text style={styles.urgentText}>URGENT</Text>
                  </View>
                )}
              </View>
              <Text style={styles.company}>{job.company}</Text>
            </View>
          </View>
          
          <TouchableOpacity 
            onPress={() => setIsSaved(!isSaved)} 
            style={styles.saveButton}
          >
            <LinearGradient
              colors={isSaved ? ['#6366f1', '#4f46e5'] : ['transparent', 'transparent']}
              style={[styles.saveGradient, !isSaved && styles.saveBorder]}
            >
              <Bookmark 
                size={18} 
                color={isSaved ? '#fff' : '#6b7280'} 
                fill={isSaved ? '#fff' : 'none'} 
              />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Description */}
        <Text style={styles.description} numberOfLines={2}>
          {job.description}
        </Text>

        {/* Job Details */}
        <View style={styles.details}>
          <View style={styles.detailItem}>
            <MapPin size={14} color="#6b7280" />
            <Text style={styles.detailText}>
              {job.isRemote ? '🌍 Remote' : job.location}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <DollarSign size={14} color="#10b981" />
            <Text style={[styles.detailText, styles.salaryText]}>{job.salary}</Text>
          </View>
          <View style={styles.detailItem}>
            <Clock size={14} color="#f59e0b" />
            <Text style={styles.detailText}>{job.type}</Text>
          </View>
        </View>

        {/* Skills */}
        <View style={styles.skillsContainer}>
          {job.skills.slice(0, 3).map((skill, index) => (
            <LinearGradient
              key={index}
              colors={['#f0f7ff', '#e0f2fe']}
              style={styles.skillTag}
            >
              <Text style={styles.skillText}>{skill}</Text>
            </LinearGradient>
          ))}
          {job.skills.length > 3 && (
            <Text style={styles.moreSkills}>+{job.skills.length - 3} more</Text>
          )}
        </View>

        {/* Stats */}
        {(job.applicants || job.benefits) && (
          <View style={styles.statsContainer}>
            {job.applicants && (
              <View style={styles.statItem}>
                <Users size={12} color="#6b7280" />
                <Text style={styles.statText}>{job.applicants} applicants</Text>
              </View>
            )}
            {job.benefits && job.benefits.length > 0 && (
              <View style={styles.statItem}>
                <Award size={12} color="#10b981" />
                <Text style={styles.statText}>{job.benefits[0]}</Text>
              </View>
            )}
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.postedDate}>{job.postedDate}</Text>
          <Link href={`/job-apply/${job.id}`} asChild>
          <TouchableOpacity style={styles.applyButton}>
            <LinearGradient
              colors={['#4facfe', '#00f2fe']}
              style={styles.applyGradient}
            >
              <Text style={styles.applyButtonText}>Apply Now</Text>
              <TrendingUp size={14} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
          </Link>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    overflow: 'hidden',
  },
  cardGradient: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  companyInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  logoContainer: {
    position: 'relative',
    marginRight: 12,
  },
  logo: {
    width: 52,
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  ratingBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  ratingText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
    marginLeft: 2,
  },
  titleContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
    lineHeight: 24,
    flex: 1,
  },
  urgentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ef4444',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8,
  },
  urgentText: {
    fontSize: 9,
    fontFamily: 'Inter-Bold',
    color: '#fff',
    marginLeft: 2,
  },
  company: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
  saveButton: {
    marginLeft: 12,
  },
  saveGradient: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveBorder: {
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
  },
  description: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4b5563',
    lineHeight: 20,
    marginBottom: 16,
  },
  details: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
    backgroundColor: 'rgba(243, 244, 246, 0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  detailText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
    marginLeft: 4,
  },
  salaryText: {
    color: '#10b981',
    fontFamily: 'Inter-SemiBold',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  skillTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.2)',
  },
  skillText: {
    fontSize: 11,
    fontFamily: 'Inter-SemiBold',
    color: '#4f46e5',
  },
  moreSkills: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#9ca3af',
    alignSelf: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    backgroundColor: 'rgba(243, 244, 246, 0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statText: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
    marginLeft: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postedDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9ca3af',
  },
  applyButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  applyGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  applyButtonText: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginRight: 6,
  },
});

export default JobCard;