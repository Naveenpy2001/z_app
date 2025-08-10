import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function LoginScreen() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [facebookLoading, setFacebookLoading] = useState(false);

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      await AsyncStorage.setItem('user', JSON.stringify({
        fullName: 'John Doe',
        email: formData.email,
        isLoggedIn: true,
      }));

      router.replace('/splash');
    } catch (error) {
      Alert.alert('Error', 'Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      Alert.alert('Success', 'Google login clicked (demo)');
    } catch (error) {
      Alert.alert('Error', 'Google login failed (demo)');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    setFacebookLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      Alert.alert('Success', 'Facebook login clicked (demo)');
    } catch (error) {
      Alert.alert('Error', 'Facebook login failed (demo)');
    } finally {
      setFacebookLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#0f0c29', '#302b63', '#24243e']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <ArrowLeft size={24} color="#ffffff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Welcome Back</Text>
            <View style={styles.headerSpacer} />
          </View>

          <View style={styles.content}>
            {/* Form */}
            <View style={styles.formContainer}>
              {/* Email */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email</Text>
                <View style={styles.inputContainer}>
                  <Mail size={20} color="#ffffff" />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter your email"
                    placeholderTextColor="rgba(255,255,255,0.7)"
                    value={formData.email}
                    onChangeText={(text) => setFormData({...formData, email: text})}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              {/* Password */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Password</Text>
                <View style={styles.inputContainer}>
                  <Lock size={20} color="#ffffff" />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter your password"
                    placeholderTextColor="rgba(255,255,255,0.7)"
                    value={formData.password}
                    onChangeText={(text) => setFormData({...formData, password: text})}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    {showPassword ? 
                      <EyeOff size={20} color="#ffffff" /> : 
                      <Eye size={20} color="#ffffff" />
                    }
                  </TouchableOpacity>
                </View>
              </View>

              {/* Forgot Password */}
              <TouchableOpacity style={styles.forgotPassword} onPress={() => router.push('/auth/forgot')}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>

              {/* Login Button */}
              <TouchableOpacity
                onPress={handleLogin}
                disabled={isLoading}
                style={styles.loginButton}
              >
                <LinearGradient
                  colors={['#ffffff', '#f8fafc']}
                  style={styles.buttonGradient}
                >
                  {isLoading ? (
                    <Text style={styles.buttonText}>Signing In...</Text>
                  ) : (
                    <>
                      <LogIn size={20} color="#374151" />
                      <Text style={styles.buttonText}>Sign In</Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Social Login Buttons */}
              <View style={styles.socialButtonsContainer}>
                {/* Google Button */}
                <TouchableOpacity
                  onPress={handleGoogleLogin}
                  disabled={googleLoading}
                  style={[styles.socialButton, styles.googleButton]}
                >
                  <Image
                    source={require('../../assets/google.png')}
                    style={styles.socialIcon}
                  />
                  {googleLoading ? (
                    <Text style={styles.socialButtonText}>Signing in...</Text>
                  ) : (
                    <Text style={styles.socialButtonText}>Continue with Google</Text>
                  )}
                </TouchableOpacity>

                {/* Facebook Button */}
                <TouchableOpacity
                  onPress={handleFacebookLogin}
                  disabled={facebookLoading}
                  style={[styles.socialButton, styles.facebookButton]}
                >
                  <Image
                    source={require('../../assets/facebook1.png')}
                    style={styles.socialIcon}
                  />
                  {facebookLoading ? (
                    <Text style={styles.socialButtonText}>Signing in...</Text>
                  ) : (
                    <Text style={styles.socialButtonText}>Continue with Facebook</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Sign Up Link */}
            <TouchableOpacity
              onPress={() => router.push('/auth/signup')}
              style={styles.signupLink}
            >
              <Text style={styles.signupLinkText}>
                Don't have an account? <Text style={styles.signupLinkBold}>Sign Up</Text>
              </Text>
            </TouchableOpacity>
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
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    marginTop: 10
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 12,
  },
  headerTitle: {
    color: '#ffffff',
    fontFamily: 'Inter-Bold',
    fontSize: 20,
  },
  headerSpacer: {
    width: 48,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 32,
    marginTop: 30
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    color: '#ffffff',
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginBottom: 8,
  },
  inputContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    padding: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    marginLeft: 12,
    color: '#ffffff',
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  forgotPassword: {
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  loginButton: {
    width: '100%',
    marginBottom: 16,
  },
  buttonGradient: {
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#374151',
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    marginLeft: 8,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  dividerText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginHorizontal: 10,
  },
  socialButtonsContainer: {
    marginTop: 14,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
  },
  googleButton: {
    backgroundColor: '#ffffff',
  },
  facebookButton: {
    backgroundColor: '#1877F2',
  },
  socialIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
    borderRadius:50
  },
  socialButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  signupLink: {
    alignItems: 'center',
  },
  signupLinkText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  signupLinkBold: {
    fontFamily: 'Inter-Bold',
  },
});