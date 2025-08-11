import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  ImageBackground, 
  KeyboardAvoidingView, 
  Platform
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigationTypes';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

type RegisterNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<RegisterNavigationProp>();
  const { register, state } = useAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');

  const handleRegister = async () => {
    if (!email || !password || !name) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    try {
      await register({ name, email, password });
      showToast('Registration successful!', 'success');
    } catch (error: any) {
      showToast(error.message || 'Registration failed. Please try again.', 'error');
    }
  };

  useEffect(() => {
    if (state.isAuthenticated) {
      navigation.replace('Main');
    }
  }, [state.isAuthenticated, navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <Spinner
        visible={state.isLoading}
        textContent={'Creating account...'}
        textStyle={styles.spinnerText}
        overlayColor="rgba(0, 0, 0, 0.7)"
        color="#22C55E"
        size="large"
      />
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' }}
        style={styles.backgroundImage}
        blurRadius={3}
      >
        <View style={styles.overlay} />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
        >
          <View style={styles.content}>
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <View style={styles.logoCircle}>
                  <Text style={styles.logoIcon}>🍕</Text>
                </View>
                <Text style={styles.logoTitle}>FoodApp</Text>
              </View>
            </View>
            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  placeholderTextColor="#999"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="#999"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#999"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>
              <TouchableOpacity
                style={[
                  styles.registerButton,
                  (!email || !password || !name) && styles.registerButtonInactive
                ]}
                onPress={handleRegister}
                disabled={state.isLoading || !email || !password || !name}
              >
                <Text style={[
                  styles.registerButtonText,
                  (!email || !password || !name) && styles.registerButtonTextInactive
                ]}>Create Account</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton} disabled={state.isLoading}>
                <Text style={styles.socialButtonText}>Continue with Facebook</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton} disabled={state.isLoading}>
                <Text style={styles.socialButtonText}>Continue with Google</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account?</Text>
              <TouchableOpacity disabled={state.isLoading} onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginText}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 25,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  logoCircle: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: '#22C55E',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    shadowColor: '#22C55E',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  logoIcon: {
    fontSize: 24,
  },
  logoTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
  form: {
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    height: 50,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#333',
  },
  registerButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#22C55E',
    height: 50,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#22C55E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 10,
  },
  registerButtonInactive: {
    backgroundColor: '#9CA3AF',
    shadowColor: '#9CA3AF',
    shadowOpacity: 0.3,
  },
  registerButtonTextInactive: {
    color: '#E5E7EB',
  },
  socialButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    height: 50,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#eee',
  },
  socialButtonText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  footerText: {
    color: 'rgba(255,255,255,0.8)',
    marginRight: 5,
  },
  loginText: {
    color: '#22C55E',
    fontWeight: '600',
  },
  spinnerText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default RegisterScreen;
