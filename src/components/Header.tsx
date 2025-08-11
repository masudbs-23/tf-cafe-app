import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
  Platform,
  StatusBar,
  SafeAreaView,
  ImageSourcePropType,
} from 'react-native';
// import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const Header = () => {
  // Dummy data with proper typing
  const userData = {
    location: 'Dhaka, Bangladesh',
    name: 'John Doe',
    avatar: { uri: 'https://randomuser.me/api/portraits/men/1.jpg' } as ImageSourcePropType,
    promo: {
      text: 'Get 50% off on your first order!',
      cta: 'ORDER NOW'
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} >
      <View style={styles.container}>
        {/* Top Row */}
        < View style={styles.topRow} >
          <TouchableOpacity style={styles.locationContainer} activeOpacity={0.8} >
            {/* <Ionicons name="location-sharp" size={22} color="#FF6B6B" /> */}
            <Text style={styles.locationText} numberOfLines={1} >
              {userData.location}
            </Text>
            {/* < MaterialIcons name="keyboard-arrow-down" size={22} color="#FF6B6B" /> */}
          </TouchableOpacity>

          < TouchableOpacity style={styles.profileContainer} activeOpacity={0.8} >
            <Image source={userData.avatar} style={styles.profileImage} />
          </TouchableOpacity>
        </View>

        {/* Promo Banner */}
        <View style={styles.promoContainer}>
          <Text style={styles.promoText}> {userData.promo.text} </Text>
          < TouchableOpacity style={styles.promoButton} activeOpacity={0.7} >
            <Text style={styles.promoButtonText}> {userData.promo.cta} </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

// Optimized styles with TypeScript
const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#FFF',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    backgroundColor: '#FFF',
    paddingHorizontal: width * 0.05,
    paddingBottom: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EEE',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: width * 0.7,
  },
  locationText: {
    marginHorizontal: 5,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  profileContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#EEE',
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  promoContainer: {
    backgroundColor: '#FF6B6B',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  promoText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    flexShrink: 1,
    marginRight: 10,
  },
  promoButton: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  promoButtonText: {
    color: '#FF6B6B',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default Header;