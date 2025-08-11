import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Platform,
  SafeAreaView,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
  TextInput as RNTextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigationTypes';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

type OtpNavigationProp = StackNavigationProp<RootStackParamList, 'VerifyOTP'>;

const OtpScreen: React.FC = () => {
  const navigation = useNavigation<OtpNavigationProp>();
  const { verifyOtp, sendOtp, state } = useAuth();
  const { showToast } = useToast();
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [timer, setTimer] = useState<number>(60);
  const [isResendDisabled, setIsResendDisabled] = useState<boolean>(true);
  const inputRefs = useRef<Array<RNTextInput | null>>([]);

  // Check if all OTP digits are entered
  const isOtpComplete = otp.every(digit => digit !== '');

  // Setup timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0 && isResendDisabled) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    } else if (timer === 0) {
      setIsResendDisabled(false);
    }

    return () => clearInterval(interval);
  }, [timer, isResendDisabled]);

  // Handle OTP verification response
  useEffect(() => {
    if (state.isOtpVerified) {
      navigation.navigate('Login');
    }
  }, [state.isOtpVerified, navigation]);

  const handleOtpChange = (text: string, index: number) => {
    // Only allow numbers
    const numericText = text.replace(/[^0-9]/g, '');

    const newOtp = [...otp];
    newOtp[index] = numericText;
    setOtp(newOtp);

    if (numericText && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (numericText && index === 5) {
      Keyboard.dismiss();
    }
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number
  ) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    if (!isOtpComplete) return;

    const enteredOtp = otp.join('');
    if (state.registeredEmail) {
      try {
        await verifyOtp(state.registeredEmail, enteredOtp);
      } catch (error) {
        showToast('Invalid OTP. Please try again.', 'error');
      }
    } else {
      showToast('Email not found. Please try registering again.', 'error');
    }
  };

  const handleResendOtp = async () => {
    if (!state.registeredEmail) {
      showToast('Email not found. Please try registering again.', 'error');
      return;
    }

    try {
      await sendOtp(state.registeredEmail);
      setTimer(60);
      setIsResendDisabled(true);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
      showToast('A new OTP has been sent to your email', 'success');
    } catch (error) {
      showToast('Failed to resend OTP. Please try again.', 'error');
    }
  };

  const handleGoBack = () => {
    navigation.navigate('Register');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack}>
          <Text style={styles.backButton}>Go Back</Text>
        </TouchableOpacity>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Enter Verification Code</Text>
        <Text style={styles.subtitle}>
          We've sent a 6-digit code to{' '}
          <Text style={styles.emailText}>{state.registeredEmail}</Text>
        </Text>

        <View style={styles.otpContainer}>
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={styles.otpInput}
              keyboardType="number-pad"
              maxLength={1}
              value={otp[index]}
              onChangeText={(text) => handleOtpChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              selectTextOnFocus
              autoFocus={index === 0}
            />
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.verifyButton,
            { backgroundColor: isOtpComplete ? '#22C55E' : '#cccccc' }
          ]}
          onPress={handleVerify}
          activeOpacity={0.8}
          disabled={!isOtpComplete || state.isLoading}
        >
          <Text style={styles.verifyButtonText}>
            {state.isLoading ? 'Verifying...' : 'Verify'}
          </Text>
        </TouchableOpacity>

        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>
            Didn't receive code?{' '}
            {isResendDisabled ? (
              <Text style={styles.timerText}>Resend in {timer}s</Text>
            ) : (
              <TouchableOpacity onPress={handleResendOtp} disabled={state.isLoading}>
                <Text style={styles.resendLink}>Resend now</Text>
              </TouchableOpacity>
            )}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 35,
    paddingLeft: 18,
  },
  backButton: {
    fontSize: 16,
    color: '#22C55E',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'left',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 40,
    textAlign: 'left',
  },
  emailText: {
    color: '#22C55E'
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 40,
  },
  otpInput: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  verifyButton: {
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resendContainer: {
    marginTop: 20,
  },
  resendText: {
    color: '#666',
    textAlign: 'center',
  },
  resendLink: {
    color: '#22C55E',
    fontWeight: 'bold',
  },
  timerText: {
    color: '#999',
  },
});

export default OtpScreen;