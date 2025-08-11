import React, { useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator, 
  StyleSheet, 
  Dimensions, 
  TextInput
} from 'react-native';
import { useFoods } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');
const CARD_MARGIN = 8;
const CARD_WIDTH = (width - CARD_MARGIN * 3) / 2;

const FoodScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);

  // React Query hooks
  const { data: foodsData, isLoading, isError, error } = useFoods();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  // Handle different response structures
  const foods = Array.isArray(foodsData) ? foodsData : (foodsData?.data || foodsData || []);

  const categories = ['All', ...new Set(foods.map(food => food.category))];

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSearch = () => {
    // Implement search functionality
    console.log('Searching for:', searchQuery);
  };

  const resetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleAddToCart = (foodItem: any) => {
    console.log('Adding food item to cart:', foodItem);
    
    if (!foodItem._id) {
      showToast('Invalid food item', 'error');
      return;
    }

    try {
      addToCart({
        _id: foodItem._id,
        name: foodItem.name,
        price: foodItem.price,
        image: foodItem.image,
      });
      showToast('Food Added', 'success');
    } catch (error) {
      console.error('Add to cart error:', error);
      showToast('Failed to add item to cart', 'error');
    }
  };

  // Filter foods based on selected category
  const filteredFoods = foods.filter(food => 
    selectedCategory === 'All' || food.category === selectedCategory
  );

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FF6B35" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Error: {(error as any)?.message || 'Failed to fetch foods'}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => window.location.reload()}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search Input */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search foods..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Categories Filter */}
      <View style={styles.filterSection}>
        <FlatList
          horizontal
          data={categories}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
          renderItem={({ item }) => (
            <TouchableOpacity
              key={item}
              onPress={() => handleCategoryChange(item)}
              style={[
                styles.categoryButton,
                selectedCategory === item && styles.selectedCategory
              ]}
            >
              <Text style={[
                styles.categoryText,
                selectedCategory === item && styles.selectedCategoryText
              ]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Food Grid */}
      <FlatList
        data={filteredFoods}
        numColumns={2}
        keyExtractor={(item) => item._id}
        columnWrapperStyle={styles.columnWrapper}
        ListHeaderComponent={
          <Text style={styles.itemCount}>
            {filteredFoods.length} {filteredFoods.length === 1 ? 'Item' : 'Items'} Found
          </Text>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No items match your filters</Text>
            <TouchableOpacity onPress={resetFilters} style={styles.resetButton}>
              <Text style={styles.resetButtonText}>Reset Filters</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.foodCard}>
            {/* Image Container with Cart Button */}
            <View style={styles.imageContainer}>
              {item.image && (
                <Image source={{ uri: item.image }} style={styles.foodImage} />
              )}
                             <TouchableOpacity
                 style={styles.cartButton}
                 onPress={() => handleAddToCart(item)}
                 disabled={!item.available}
               >
                <Icon
                  name="shopping-cart"
                  size={20}
                  color="#fff"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.foodDetails}>
              <View style={styles.namePriceContainer}>
                <Text style={styles.foodName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.foodPrice}>৳{item.price}</Text>
              </View>

              {!item.available && (
                <Text style={styles.unavailableText}>Unavailable</Text>
              )}
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    paddingHorizontal: 8,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 16,
    marginRight: 8,
    backgroundColor: '#fff',
    padding: 5
  },
  searchButton: {
    backgroundColor: '#22C55E',
    borderRadius: 14,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  filterSection: {
    paddingVertical: 12,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  categoriesContainer: {
    paddingRight: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#f2f2f2',
  },
  selectedCategory: {
    backgroundColor: '#22C55E',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
  },
  selectedCategoryText: {
    color: '#fff',
  },
  itemCount: {
    fontSize: 14,
    color: '#666',
    marginVertical: 12,
    paddingLeft: 8,
  },
  imageContainer: {
    position: 'relative',
  },
  foodImage: {
    width: '100%',
    height: CARD_WIDTH * 0.8,
    resizeMode: 'cover',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  resetButton: {
    backgroundColor: '#22C55E',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: CARD_MARGIN,
  },
  foodCard: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: CARD_MARGIN,
  },
  foodDetails: {
    padding: 12,
  },
  namePriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  foodName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  foodPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  unavailableText: {
    fontSize: 12,
    color: 'red',
  },
  cartButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#22C55E',
    borderRadius: 20,
    padding: 6,
    zIndex: 1,
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#22C55E',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FoodScreen;