import React from 'react';
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../../context/AuthContext';

const ProfileScreen = () => {
  const { logout } = useAuth();
  
  const staticUserData = {
    name: 'Masud Rana',
    email: 'masud@gmail.com',
    phone: '01952524063',
    address: 'Mirpur DOHS',
    loyaltyPoints: 850,
    avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
    paymentMethods: 2,
    recentOrders: 12,
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: () => logout()
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Profile Header Section */}
        <View style={styles.header}>
          <Image
            source={{ uri: staticUserData.avatar }}
            style={styles.avatar}
          />
          <Text style={styles.userName}>{staticUserData.name}</Text>
          <Text style={styles.userEmail}>{staticUserData.email}</Text>

          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Options Section */}
        <View style={styles.menuSection}>
          {/* Order History */}
          <View style={styles.profileItem}>
            <View style={styles.itemLeft}>
              <Icon name="history" size={24} color="#22C55E" />
              <Text style={styles.itemTitle}>Order History</Text>
            </View>
            <View style={styles.itemRight}>
              <Text style={styles.itemValue}>{staticUserData.recentOrders} orders</Text>
            </View>
          </View>

          {/* Payment Methods */}
          <View style={styles.profileItem}>
            <View style={styles.itemLeft}>
              <Icon name="credit-card" size={24} color="#22C55E" />
              <Text style={styles.itemTitle}>Payment Methods</Text>
            </View>
            <View style={styles.itemRight}>
              <Text style={styles.itemValue}>{staticUserData.paymentMethods} cards</Text>
            </View>
          </View>

          {/* Delivery Address */}
          <View style={styles.profileItem}>
            <View style={styles.itemLeft}>
              <Icon name="location-on" size={24} color="#22C55E" />
              <Text style={styles.itemTitle}>Delivery Address</Text>
            </View>
            <View style={styles.itemRight}>
              <Text style={styles.itemValue} numberOfLines={1} ellipsizeMode="tail">
                {staticUserData.address}
              </Text>
            </View>
          </View>

          {/* Settings */}
          <View style={[styles.profileItem, { borderBottomWidth: 0 }]}>
            <View style={styles.itemLeft}>
              <Icon name="settings" size={24} color="#22C55E" />
              <Text style={styles.itemTitle}>Settings</Text>
            </View>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: '#fff',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    borderRadius: 12,
    padding: 16,
    margin: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#FF6B6B',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  editButton: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
  editButtonText: {
    color: '#FF6B6B',
    fontWeight: '500',
  },
  loyaltyCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 24,
  },
  loyaltyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  loyaltyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
    color: '#333',
  },
  loyaltyPoints: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginVertical: 8,
  },
  loyaltySubtext: {
    fontSize: 14,
    color: '#666',
  },
  menuSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 24,
    overflow: 'hidden',
  },
  profileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemTitle: {
    fontSize: 16,
    marginLeft: 12,
    color: '#333',
  },
  itemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemValue: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  logoutButton: {
    marginHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default ProfileScreen;