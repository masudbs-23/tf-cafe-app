import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { publicPost } from '../services/apiCaller';

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isOtpSent: boolean;
  isOtpVerified: boolean;
  registeredEmail: string | null;
}

// Action types
export type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_TOKEN'; payload: string | null }
  | { type: 'SET_OTP_SENT'; payload: boolean }
  | { type: 'SET_OTP_VERIFIED'; payload: boolean }
  | { type: 'SET_REGISTERED_EMAIL'; payload: string | null }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGOUT' }
  | { type: 'REGISTER_SUCCESS'; payload: { user: User; token: string } };

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  isOtpSent: false,
  isOtpVerified: false,
  registeredEmail: null,
};

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload, isAuthenticated: !!action.payload };
    case 'SET_TOKEN':
      return { ...state, token: action.payload };
    case 'SET_OTP_SENT':
      return { ...state, isOtpSent: action.payload };
    case 'SET_OTP_VERIFIED':
      return { ...state, isOtpVerified: action.payload };
    case 'SET_REGISTERED_EMAIL':
      return { ...state, registeredEmail: action.payload };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        isOtpSent: false,
        isOtpVerified: false,
        registeredEmail: null,
      };
    default:
      return state;
  }
};

// Context
interface AuthContextType {
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: { name: string; email: string; password: string; phone?: string }) => Promise<void>;
  logout: () => Promise<void>;
  sendOtp: (email: string) => Promise<void>;
  verifyOtp: (email: string, otp: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load stored auth data on app start
  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        const storedToken = await AsyncStorage.getItem('token');
        const storedOtpSent = await AsyncStorage.getItem('isOtpSent');
        const storedOtpVerified = await AsyncStorage.getItem('isOtpVerified');
        const storedEmail = await AsyncStorage.getItem('registeredEmail');

        if (storedUser && storedToken) {
          dispatch({ type: 'SET_USER', payload: JSON.parse(storedUser) });
          dispatch({ type: 'SET_TOKEN', payload: storedToken });
        }

        if (storedOtpSent) {
          dispatch({ type: 'SET_OTP_SENT', payload: JSON.parse(storedOtpSent) });
        }

        if (storedOtpVerified) {
          dispatch({ type: 'SET_OTP_VERIFIED', payload: JSON.parse(storedOtpVerified) });
        }

        if (storedEmail) {
          dispatch({ type: 'SET_REGISTERED_EMAIL', payload: storedEmail });
        }
      } catch (error) {
        console.error('Error loading stored auth data:', error);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    loadStoredAuth();
  }, []);

  // Save auth data to storage
  const saveToStorage = async (key: string, value: any) => {
    try {
      await AsyncStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving ${key} to storage:`, error);
    }
  };

  // Remove auth data from storage
  const removeFromStorage = async (key: string) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key} from storage:`, error);
    }
  };

  // Login function
  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      // Use actual API call
      const response = await publicPost('/login', { email, password });

      // Handle the actual API response format
      if (response.token) {
        // Create a user object from the available data
        const user: User = {
          id: '', // We'll need to decode the token or get user info separately
          name: email.split('@')[0], // Temporary name from email
          email: email,
        };

        await saveToStorage('user', user);
        await saveToStorage('token', response.token);

        dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token: response.token } });
      } else if (response.success && response.data) {
        // Fallback for other response formats
        const { user, token } = response.data;

        await saveToStorage('user', user);
        await saveToStorage('token', token);

        dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
      } else if (response.user && response.token) {
        // Alternative response format
        const { user, token } = response;

        await saveToStorage('user', user);
        await saveToStorage('token', token);

        dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
      } else {
        throw new Error(response.message || response.error || 'Login failed');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      let errorMessage = 'Login failed. Please try again.';

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Register function
  const register = async (userData: { name: string; email: string; password: string; phone?: string }) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      // Use actual API call
      const response = await publicPost('/auth/register', userData);

      // Handle different response formats
      if (response.success && response.data) {
        const { user, token } = response.data;

        await saveToStorage('user', user);
        await saveToStorage('token', token);

        dispatch({ type: 'REGISTER_SUCCESS', payload: { user, token } });
      } else if (response.user && response.token) {
        // Alternative response format
        const { user, token } = response;

        await saveToStorage('user', user);
        await saveToStorage('token', token);

        dispatch({ type: 'REGISTER_SUCCESS', payload: { user, token } });
      } else {
        throw new Error(response.message || response.error || 'Registration failed');
      }
    } catch (error: any) {
      console.error('Register error:', error);
      let errorMessage = 'Registration failed. Please try again.';

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await removeFromStorage('user');
      await removeFromStorage('token');
      await removeFromStorage('isOtpSent');
      await removeFromStorage('isOtpVerified');
      await removeFromStorage('registeredEmail');

      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Send OTP function
  const sendOtp = async (email: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      // Use actual API call
      const response = await publicPost('/auth/send-otp', { email });

      if (response.success || response.message) {
        await saveToStorage('isOtpSent', true);
        await saveToStorage('registeredEmail', email);

        dispatch({ type: 'SET_OTP_SENT', payload: true });
        dispatch({ type: 'SET_REGISTERED_EMAIL', payload: email });
      } else {
        throw new Error(response.message || response.error || 'Failed to send OTP');
      }
    } catch (error: any) {
      console.error('Send OTP error:', error);
      let errorMessage = 'Failed to send OTP. Please try again.';

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Verify OTP function
  const verifyOtp = async (email: string, otp: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      // Use actual API call
      const response = await publicPost('/auth/verify-otp', { email, otp });

      if (response.success || response.message) {
        await saveToStorage('isOtpVerified', true);

        dispatch({ type: 'SET_OTP_VERIFIED', payload: true });
      } else {
        throw new Error(response.message || response.error || 'Invalid OTP');
      }
    } catch (error: any) {
      console.error('Verify OTP error:', error);
      let errorMessage = 'Invalid OTP. Please try again.';

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const value: AuthContextType = {
    state,
    dispatch,
    login,
    register,
    logout,
    sendOtp,
    verifyOtp,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
