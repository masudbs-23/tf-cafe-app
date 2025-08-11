# FoodApp - React Native Project

A modern food delivery app built with React Native, featuring Context API for state management, React Query for API calls, and a complete authentication flow with onboarding.

## 🚀 Features

- **Context API Authentication**: Complete auth flow with login, register, and OTP verification
- **React Query Integration**: Efficient API calls with caching and state management
- **Onboarding Screen**: First-time user experience with beautiful animations
- **Splash Screen**: Professional app launch experience
- **Modern UI/UX**: Clean and intuitive design with consistent theming
- **TypeScript**: Full type safety throughout the application
- **AsyncStorage**: Persistent data storage for user preferences

## 📱 Screens

### Authentication Flow
- **Splash Screen**: App launch with animated logo
- **Onboarding**: First-time user introduction (shows only on first install)
- **Login Screen**: User authentication with email/password
- **Register Screen**: New user registration with OTP verification
- **OTP Verification**: 6-digit code verification

### Main App
- **Home**: Food listing with categories and search
- **Cart**: Shopping cart management
- **Profile**: User profile and settings
- **Orders**: Order history and tracking

## 🛠 Tech Stack

- **React Native**: 0.80.1
- **TypeScript**: Full type safety
- **React Query**: API state management and caching
- **Context API**: Global state management
- **React Navigation**: Navigation between screens
- **AsyncStorage**: Local data persistence
- **Vector Icons**: Beautiful iconography

## 📦 Dependencies

### Core Dependencies
```json
{
  "@tanstack/react-query": "^5.0.0",
  "@react-native-async-storage/async-storage": "^2.2.0",
  "@react-navigation/native": "^7.1.14",
  "@react-navigation/stack": "^7.4.2",
  "@react-navigation/bottom-tabs": "^7.4.2",
  "react-native-splash-screen": "^3.3.0"
}
```

## 🏗 Project Structure

```
src/
├── context/
│   ├── AuthContext.tsx          # Authentication state management
│   └── OnboardingContext.tsx    # Onboarding state management
├── services/
│   ├── api.ts                   # React Query API hooks
│   ├── apiCaller.ts             # Axios API client
│   └── queryClient.ts           # React Query configuration
├── screens/
│   ├── auth/
│   │   ├── LoginScreen.tsx      # Login screen
│   │   ├── RegisterScreen.tsx   # Registration screen
│   │   └── OtpScreen.tsx        # OTP verification
│   ├── onboarding/
│   │   └── OnboardingScreen.tsx # First-time user onboarding
│   ├── splash/
│   │   └── SplashScreen.tsx     # App splash screen
│   └── foods/
│       └── FoodScreen.tsx       # Food listing with React Query
├── navigation/
│   ├── MainNavigator.tsx        # Main navigation logic
│   ├── AuthNavigator.tsx        # Authentication navigation
│   └── BottomTabNavigator.tsx   # Bottom tab navigation
└── types/
    └── navigationTypes.ts       # Navigation type definitions
```

## 🔧 Setup Instructions

### Prerequisites
- Node.js >= 18
- React Native CLI
- Android Studio / Xcode

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd AwesomeProject
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install iOS dependencies (iOS only)**
   ```bash
   cd ios && pod install && cd ..
   ```

4. **Run the app**
   ```bash
   # Android
   npm run android
   
   # iOS
   npm run ios
   ```

## 🔄 Migration from Redux

This project has been migrated from Redux to Context API for better performance and simpler state management:

### Changes Made:
- ✅ Replaced Redux store with Context API
- ✅ Migrated authentication logic to AuthContext
- ✅ Implemented React Query for API calls
- ✅ Added onboarding flow with OnboardingContext
- ✅ Updated all screens to use new state management
- ✅ Removed Redux dependencies

### Benefits:
- **Simpler State Management**: No need for actions, reducers, and middleware
- **Better Performance**: Context API is more efficient for smaller state trees
- **Easier Testing**: Simpler to test components with Context
- **Modern Approach**: Using React's built-in features

## 🎨 Theming

The app uses a consistent color scheme:
- **Primary**: #FF6B35 (Orange)
- **Background**: #f8f9fa (Light Gray)
- **Text**: #333333 (Dark Gray)
- **Secondary Text**: #666666 (Medium Gray)

## 📱 App Flow

1. **First Launch**: Splash → Onboarding → Auth
2. **Subsequent Launches**: Splash → Auth (if not logged in) or Main App
3. **Authentication**: Login/Register → OTP Verification → Main App

## 🔐 Authentication Flow

1. **Registration**: Email + Password → OTP Verification → Login
2. **Login**: Email + Password → Main App
3. **OTP Verification**: 6-digit code sent to email
4. **Session Management**: Automatic token refresh and persistence

## 🚀 API Integration

The app uses React Query for efficient API calls:
- **Automatic Caching**: Reduces unnecessary API calls
- **Background Updates**: Keeps data fresh
- **Error Handling**: Built-in error states and retry logic
- **Optimistic Updates**: Immediate UI feedback

## 📝 Environment Setup

Create a `.env` file for API configuration:
```env
API_BASE_URL=https://your-api-url.com/api
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage
```

## 📦 Build

### Android
```bash
cd android
./gradlew assembleRelease
```

### iOS
```bash
cd ios
xcodebuild -workspace AwesomeProject.xcworkspace -scheme AwesomeProject -configuration Release
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please open an issue in the repository.

---

**Note**: This project has been completely refactored to use modern React Native patterns with Context API and React Query for better performance and maintainability.
