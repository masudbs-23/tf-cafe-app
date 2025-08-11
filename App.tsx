import 'react-native-gesture-handler';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './src/context/AuthContext';
import { OnboardingProvider } from './src/context/OnboardingContext';
import { CartProvider } from './src/context/CartContext';
import { ToastProvider } from './src/context/ToastContext';
import MainNavigator from './src/navigation/MainNavigator';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    },
    mutations: {
      retry: 1,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <OnboardingProvider>
          <AuthProvider>
            <CartProvider>
              <ToastProvider>
                <MainNavigator />
              </ToastProvider>
            </CartProvider>
          </AuthProvider>
        </OnboardingProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
};

export default App;
