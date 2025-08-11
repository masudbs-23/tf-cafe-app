import React, { useState } from 'react';
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary, ImagePickerResponse, MediaType } from 'react-native-image-picker';

const SettingsScreen = () => {
  const navigation = useNavigation();

  // User profile state
  const [profileData, setProfileData] = useState({
    name: 'Masud Rana',
    email: 'masud@gmail.com',
    phone: '01952524063',
    address: 'Mirpur DOHS, Dhaka',
    avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
  });

  const [isEditing, setIsEditing] = useState(false);

  // Request permissions for Android
  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        let permission;
        if (Platform.Version >= 33) {
          permission = PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES;
        } else {
          permission = PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
        }

        const granted = await PermissionsAndroid.request(permission, {
          title: 'Storage Permission',
          message: 'This app needs access to your photos to select profile image.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        });
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  // Handle image picker
  const handleImagePicker = async () => {
    try {
      const hasPermission = await requestPermissions();
      if (!hasPermission) {
        Alert.alert(
          'Permission Required',
          'Please grant storage permission in your device settings to select images.',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Open Settings', onPress: () => {
                // You can add logic to open app settings here
                console.log('Open settings');
              }
            }
          ]
        );
        return;
      }

      const options = {
        mediaType: 'photo' as MediaType,
        includeBase64: false,
        maxHeight: 2000,
        maxWidth: 2000,
        quality: 0.8,
        selectionLimit: 1,
      };

      launchImageLibrary(options, (response: ImagePickerResponse) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.log('ImagePicker Error: ', response.errorMessage);
          Alert.alert('Error', 'Failed to pick image. Please try again.');
        } else if (response.assets && response.assets[0]) {
          const imageUri = response.assets[0].uri;
          if (imageUri) {
            setProfileData(prev => ({
              ...prev,
              avatar: imageUri,
            }));
            Alert.alert('Success', 'Profile image updated successfully!');
          }
        }
      });
    } catch (error) {
      console.log('Error in handleImagePicker: ', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  // Handle save changes
  const handleSave = () => {
    // Here you would typically save to backend
    Alert.alert('Success', 'Profile updated successfully!');
    setIsEditing(false);
  };

  // Handle cancel editing
  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original data if needed
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Image Section */}
        <View style={styles.profileImageSection}>
          <TouchableOpacity onPress={handleImagePicker} style={styles.imageContainer} activeOpacity={0.8}>
            <Image source={{ uri: profileData.avatar }} style={styles.profileImage} />
            <View style={styles.imageOverlay}>
              <Icon name="camera-alt" size={24} color="#fff" />
            </View>
          </TouchableOpacity>
          <Text style={styles.imageHint}>Tap to change photo</Text>
          <Text style={styles.imageSubHint}>Gallery will open to select image</Text>
        </View>

        {/* Profile Form */}
        <View style={styles.formSection}>
          {/* Name Field */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.disabledInput]}
              value={profileData.name}
              onChangeText={(text) => setProfileData(prev => ({ ...prev, name: text }))}
              editable={isEditing}
              placeholder="Enter your full name"
            />
          </View>

          {/* Email Field */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.disabledInput]}
              value={profileData.email}
              onChangeText={(text) => setProfileData(prev => ({ ...prev, email: text }))}
              editable={isEditing}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Phone Field */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.disabledInput]}
              value={profileData.phone}
              onChangeText={(text) => setProfileData(prev => ({ ...prev, phone: text }))}
              editable={isEditing}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
            />
          </View>

          {/* Address Field */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Delivery Address</Text>
            <TextInput
              style={[styles.input, styles.textArea, !isEditing && styles.disabledInput]}
              value={profileData.address}
              onChangeText={(text) => setProfileData(prev => ({ ...prev, address: text }))}
              editable={isEditing}
              placeholder="Enter your delivery address"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          {!isEditing ? (
            <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
              <Icon name="edit" size={20} color="#fff" />
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.editActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Icon name="check" size={20} color="#fff" />
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>


      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  profileImageSection: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#22C55E',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#22C55E',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  imageHint: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  imageSubHint: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  formSection: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    backgroundColor: '#f9fafb',
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  disabledInput: {
    backgroundColor: '#f3f4f6',
    color: '#666',
  },
  actionSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  editButton: {
    backgroundColor: '#22C55E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  editActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#666',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#22C55E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  settingsSection: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingTitle: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
});

export default SettingsScreen;
