import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Search, Filter, Star, Clock, MapPin, Plus, Minus, ShoppingCart, Heart, MessageCircle } from 'lucide-react-native';
import { router } from 'expo-router';

const FOOD_CATEGORIES = [
  { id: '1', name: 'Pizza', emoji: '🍕', color: '#ff6b6b' },
  { id: '2', name: 'Burger', emoji: '🍔', color: '#4ecdc4' },
  { id: '3', name: 'Sushi', emoji: '🍣', color: '#45b7d1' },
  { id: '4', name: 'Pasta', emoji: '🍝', color: '#f9ca24' },
  { id: '5', name: 'Dessert', emoji: '🍰', color: '#f0932b' },
];

const RESTAURANTS = [
  {
    id: '1',
    name: 'Mario\'s Pizza Palace',
    image: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.8,
    deliveryTime: '25-35 min',
    deliveryFee: '$2.99',
    category: 'Italian',
    distance: '0.8 km',
    reviews: 1250,
    featured: true,
  },
  {
    id: '2',
    name: 'Burger Junction',
    image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.6,
    deliveryTime: '20-30 min',
    deliveryFee: '$1.99',
    category: 'American',
    distance: '1.2 km',
    reviews: 892,
    featured: false,
  },
];

const MENU_ITEMS = [
  {
    id: '1',
    name: 'Margherita Pizza',
    description: 'Fresh tomatoes, mozzarella, basil, olive oil',
    price: 18.99,
    image: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=300',
    category: 'Pizza',
    rating: 4.7,
    reviews: 234,
    popular: true,
  },
  {
    id: '2',
    name: 'Classic Cheeseburger',
    description: 'Beef patty, cheese, lettuce, tomato, onion',
    price: 14.99,
    image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=300',
    category: 'Burger',
    rating: 4.5,
    reviews: 156,
    popular: false,
  },
];

const FOOD_COMMENTS = [
  {
    id: '1',
    user: 'foodie_lover',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    comment: 'Best pizza in town! The crust is perfect 🍕',
    rating: 5,
    timeAgo: '2h',
  },
  {
    id: '2',
    user: 'hungry_guy',
    avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    comment: 'Quick delivery and hot food. Highly recommended!',
    rating: 4,
    timeAgo: '1d',
  },
];

export default function FoodScreen() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [showComments, setShowComments] = useState({});
  const [newComment, setNewComment] = useState('');
  const [userRating, setUserRating] = useState(0);

  const addToCart = (itemId) => {
    setCart(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }));
  };

  const removeFromCart = (itemId) => {
    setCart(prev => ({
      ...prev,
      [itemId]: Math.max((prev[itemId] || 0) - 1, 0)
    }));
  };

  const getTotalItems = () => {
    return Object.values(cart).reduce((sum, count) => sum + count, 0);
  };

  const toggleComments = (itemId) => {
    setShowComments(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const renderStars = (rating, onPress) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => onPress?.(star)}
            disabled={!onPress}
          >
            <Star
              size={16}
              color={star <= rating ? '#fbbf24' : '#d1d5db'}
              fill={star <= rating ? '#fbbf24' : 'none'}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <LinearGradient
      colors={['#ff9a9e', '#fecfef', '#fecfef']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <ArrowLeft size={24} color="#ffffff" />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Zingsta Food</Text>
          
          <TouchableOpacity style={styles.cartButton}>
            <ShoppingCart size={24} color="#ffffff" />
            {getTotalItems() > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{getTotalItems()}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color="#ffffff" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search restaurants or dishes..."
              placeholderTextColor="rgba(255,255,255,0.7)"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity style={styles.filterButton}>
              <Filter size={18} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Categories */}
          <View style={styles.categoriesContainer}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <TouchableOpacity
                onPress={() => setSelectedCategory('All')}
                style={[styles.categoryButton, selectedCategory === 'All' && styles.selectedCategory]}
              >
                <Text style={[styles.categoryText, selectedCategory === 'All' && styles.selectedCategoryText]}>
                  All
                </Text>
              </TouchableOpacity>
              {FOOD_CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  onPress={() => setSelectedCategory(category.name)}
                  style={[styles.categoryButton, selectedCategory === category.name && styles.selectedCategory]}
                >
                  <Text style={styles.categoryEmoji}>{category.emoji}</Text>
                  <Text style={[styles.categoryText, selectedCategory === category.name && styles.selectedCategoryText]}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Featured Restaurants */}
          <View style={styles.restaurantsContainer}>
            <Text style={styles.sectionTitle}>Featured Restaurants</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={true}>
              {RESTAURANTS.filter(r => r.featured).map((restaurant) => (
                <TouchableOpacity key={restaurant.id} style={styles.restaurantCard}>
                  <Image source={{ uri: restaurant.image }} style={styles.restaurantImage} />
                  <View style={styles.restaurantInfo}>
                    <Text style={styles.restaurantName}>{restaurant.name}</Text>
                    <Text style={styles.restaurantCategory}>{restaurant.category}</Text>
                    <View style={styles.restaurantDetails}>
                      <View style={styles.ratingContainer}>
                        <Star size={14} color="#fbbf24" fill="#fbbf24" />
                        <Text style={styles.ratingText}>{restaurant.rating}</Text>
                        <Text style={styles.reviewsText}>({restaurant.reviews})</Text>
                      </View>
                      <View style={styles.deliveryInfo}>
                        <Clock size={14} color="#6b7280" />
                        <Text style={styles.deliveryText}>{restaurant.deliveryTime}</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Popular Dishes */}
          <View style={styles.dishesContainer}>
            <Text style={styles.sectionTitle}>Popular Dishes</Text>
            {MENU_ITEMS.map((item) => (
              <View key={item.id} style={styles.dishCard}>
                <Image source={{ uri: item.image }} style={styles.dishImage} />
                <View style={styles.dishInfo}>
                  <View style={styles.dishHeader}>
                    <Text style={styles.dishName}>{item.name}</Text>
                    {item.popular && (
                      <View style={styles.popularBadge}>
                        <Text style={styles.popularText}>POPULAR</Text>
                      </View>
                    )}
                  </View>
                  
                  <Text style={styles.dishDescription}>{item.description}</Text>
                  
                  <View style={styles.dishRating}>
                    {renderStars(item.rating)}
                    <Text style={styles.dishRatingText}>
                      {item.rating} ({item.reviews} reviews)
                    </Text>
                  </View>
                  
                  <View style={styles.dishFooter}>
                    <Text style={styles.dishPrice}>${item.price}</Text>
                    <View style={styles.dishActions}>
                      <TouchableOpacity
                        onPress={() => toggleComments(item.id)}
                        style={styles.commentButton}
                      >
                        <MessageCircle size={16} color="#6366f1" />
                      </TouchableOpacity>
                      
                      <View style={styles.cartControls}>
                        {cart[item.id] > 0 && (
                          <TouchableOpacity
                            onPress={() => removeFromCart(item.id)}
                            style={styles.cartControlButton}
                          >
                            <Minus size={16} color="#ef4444" />
                          </TouchableOpacity>
                        )}
                        {cart[item.id] > 0 && (
                          <Text style={styles.cartCount}>{cart[item.id]}</Text>
                        )}
                        <TouchableOpacity
                          onPress={() => addToCart(item.id)}
                          style={[styles.cartControlButton, styles.addButton]}
                        >
                          <Plus size={16} color="#ffffff" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Comments Section */}
                {showComments[item.id] && (
                  <View style={styles.commentsSection}>
                    <Text style={styles.commentsTitle}>Reviews & Comments</Text>
                    
                    {/* Add Review */}
                    <View style={styles.addReviewContainer}>
                      <Text style={styles.addReviewTitle}>Rate this dish:</Text>
                      {renderStars(userRating, setUserRating)}
                      <TextInput
                        style={styles.commentInput}
                        placeholder="Write your review..."
                        placeholderTextColor="#9ca3af"
                        value={newComment}
                        onChangeText={setNewComment}
                        multiline
                      />
                      <TouchableOpacity style={styles.submitButton}>
                        <Text style={styles.submitButtonText}>Submit Review</Text>
                      </TouchableOpacity>
                    </View>

                    {/* Comments List */}
                    {FOOD_COMMENTS.map((comment) => (
                      <View key={comment.id} style={styles.commentItem}>
                        <Image source={{ uri: comment.avatar }} style={styles.commentAvatar} />
                        <View style={styles.commentContent}>
                          <View style={styles.commentHeader}>
                            <Text style={styles.commentUser}>{comment.user}</Text>
                            <Text style={styles.commentTime}>{comment.timeAgo}</Text>
                          </View>
                          {renderStars(comment.rating)}
                          <Text style={styles.commentText}>{comment.comment}</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 8,
  },
  headerTitle: {
    color: '#ffffff',
    fontFamily: 'Inter-Bold',
    fontSize: 20,
  },
  cartButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 8,
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#ffffff',
    fontFamily: 'Inter-Bold',
    fontSize: 12,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchBar: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    color: '#ffffff',
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    outline:'none'
  },
  filterButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 8,
  },
  content: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    marginHorizontal: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingTop: 20,
    paddingHorizontal:20
  },
  categoriesContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1f2937',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 12,
    marginLeft: 8,
  },
  selectedCategory: {
    backgroundColor: '#6366f1',
  },
  categoryEmoji: {
    fontSize: 18,
    marginRight: 6,
  },
  categoryText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#6b7280',
  },
  selectedCategoryText: {
    color: '#ffffff',
  },
  restaurantsContainer: {
    marginBottom: 24,
  },
  restaurantCard: {
    width: 280,
    backgroundColor: '#ebedee',
    borderRadius: 16,
    marginRight: 16,
    marginLeft: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  restaurantImage: {
    width: '100%',
    height: 160,
  },
  restaurantInfo: {
    padding: 16,
  },
  restaurantName: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  restaurantCategory: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    marginBottom: 12,
  },
  restaurantDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
    marginLeft: 4,
  },
  reviewsText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    marginLeft: 2,
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deliveryText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    marginLeft: 4,
  },
  dishesContainer: {
    paddingBottom: 100,
  },
  dishCard: {
    backgroundColor: '#f5f7fa',
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
    paddingHorizontal:10
  },
  dishImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    margin: 16,
  },
  dishInfo: {
    flex: 1,
    padding: 16,
    paddingLeft: 0,
  },
  dishHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dishName: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1f2937',
    flex: 1,
  },
  popularBadge: {
    backgroundColor: '#fbbf24',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  popularText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  dishDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    marginBottom: 8,
    lineHeight: 20,
  },
  dishRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 8,
  },
  dishRatingText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  dishFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dishPrice: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#6366f1',
  },
  dishActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentButton: {
    backgroundColor: '#f0f7ff',
    borderRadius: 12,
    padding: 8,
    marginRight: 12,
  },
  cartControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartControlButton: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 8,
    marginHorizontal: 4,
  },
  addButton: {
    backgroundColor: '#6366f1',
  },
  cartCount: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#1f2937',
    marginHorizontal: 8,
  },
  commentsSection: {
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    padding: 16,
  },
  commentsTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  addReviewContainer: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  addReviewTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
    marginBottom: 8,
  },
  commentInput: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    marginBottom: 12,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1f2937',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#6366f1',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#ffffff',
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  commentUser: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
  },
  commentTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  commentText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4b5563',
    marginTop: 4,
    lineHeight: 20,
  },
});