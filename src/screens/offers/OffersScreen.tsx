import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

// Dummy data for offers with valid image URLs
const OFFERS_DATA = [
  {
    id: '1',
    title: 'Family Combo',
    description: 'Get 20% off on family combos this weekend',
    imageUrl: 'https://static.vecteezy.com/system/resources/thumbnails/015/681/956/small_2x/mexican-food-service-offer-web-page-landing-banner-with-promo-illustration-discount-coupon-vector.jpg',
  },
  {
    id: '2',
    title: 'Weekend Special',
    description: 'Buy one pizza get one free every Saturday',
    imageUrl: 'https://www.bdtask.com/blog/assets/plugins/ckfinder/core/connector/php/uploads/images/keep-an-attractive-and-creative-name-of-your-food-combo.jpg',
  },
  {
    id: '3',
    title: 'Happy Hour',
    description: '50% off on all drinks from 4-6pm',
    imageUrl: 'https://freedesignfile.com/upload/2018/09/Fast-food-menu-discount-template-vector-04.jpg',
  },
  {
    id: '4',
    title: 'Lunch Deal',
    description: 'Special lunch menu at discounted prices',
    imageUrl: 'https://d1csarkz8obe9u.cloudfront.net/posterpreviews/special-food-menu-offer-design-template-b17c332461addb53ae11d1a50da8a825_screen.jpg?ts=1690115421',
  },
];

const OffersScreen = () => {
  const renderOfferItem = ({ item }: { item: typeof OFFERS_DATA[0] }) => (
    <TouchableOpacity style={styles.offerItem}>
      <Image source={{ uri: item.imageUrl }} style={styles.offerImage} />
      <View style={styles.offerTextContainer}>
        <Text style={styles.offerTitle}>{item.title}</Text>
        <Text style={styles.offerDescription} numberOfLines={2}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={OFFERS_DATA}
        renderItem={renderOfferItem}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        snapToAlignment="center"
        decelerationRate="fast"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    paddingVertical: 16,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 20,
    marginBottom: 12,
  },
  offerItem: {
    width: Dimensions.get('window').width - 80,
    height: 180,
    marginHorizontal: 10,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  offerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  offerTextContainer: {
    padding: 12,
  },
  offerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  offerDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 16,
  },
});

export default OffersScreen;