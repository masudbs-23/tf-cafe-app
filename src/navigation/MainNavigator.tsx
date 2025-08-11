import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';
import { useOnboarding } from '../context/OnboardingContext';
import CustomSplashScreen from '../components/CustomSplashScreen';

// Screens
import OnboardingScreen from '../screens/onboarding/OnboardingScreen';
import AuthNavigator from './AuthNavigator';
import BottomTabNavigator from './BottomTabNavigator';

const Stack = createStackNavigator();

const MainNavigator: React.FC = () => {
  const { state: authState } = useAuth();
  const { isFirstTime } = useOnboarding();
  const [showSplash, setShowSplash] = useState(true);

  // Show splash screen for 3 seconds on every app launch
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Show custom splash screen
  if (showSplash) {
    return <CustomSplashScreen onFinish={() => setShowSplash(false)} />;
  }

  // Show loading while auth state is loading
  if (authState.isLoading) {
    return <CustomSplashScreen onFinish={() => {}} />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {isFirstTime ? (
          // First time user flow
          <>
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Auth" component={AuthNavigator} />
          </>
        ) : authState.isAuthenticated ? (
          // Authenticated user flow
          <>
            <Stack.Screen name="Main" component={BottomTabNavigator} />
          </>
        ) : (
          // Non-authenticated user flow
          <>
            <Stack.Screen name="Auth" component={AuthNavigator} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigator;