import React, { useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator, StyleSheet, Dimensions, TextInput } from 'react-native';
import { useGetFoodsQuery } from '../../redux/reducers/foods/foodApi';
import { setFilters } from '../../redux/reducers/foods/foodSlice';
import { AppDispatch, RootState } from '../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { addToCartAndPersist } from '../../redux/reducers/carts/cartsSlice';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');
const CARD_MARGIN = 8;
const CARD_WIDTH = (width - CARD_MARGIN * 3) / 2;

const FoodScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const filters = useSelector((state: RootState) => state.foods.filters);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // RTK Query to fetch foods
  const { data: foods = [], isLoading, isError, error } = useGetFoodsQuery(filters);

  const categories = ['All', ...new Set(foods.map(food => food.category))];

  const handleCategoryChange = (category: string) => {
    dispatch(setFilters({
      ...filters,
      category: category === 'All' ? '' : category
    }));
  };

  const handleSearch = () => {
    dispatch(setFilters({
      ...filters,
      search: searchQuery
    }));
  };

  const resetFilters = () => {
    const defaultFilters = {
      category: "",
      minPrice: 0,
      maxPrice: 1000,
      sortBy: "",
      search: ""
    };
    dispatch(setFilters(defaultFilters));
    setSearchQuery('');
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleAddToCart = (foodItem: any) => {
    dispatch(addToCartAndPersist(foodItem));
  };


  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <Text>Error: {(error as any)?.data?.message || 'Failed to fetch foods'}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search Input */}
      {/* <View style={styles.searchContainer}>
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
      </View> */}

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
                (filters.category === item || (item === 'All' && !filters.category)) &&
                styles.selectedCategory
              ]}
            >
              <Text style={[
                styles.categoryText,
                (filters.category === item || (item === 'All' && !filters.category)) &&
                styles.selectedCategoryText
              ]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Food Grid */}
      <FlatList
        data={foods}
        numColumns={2}
        keyExtractor={(item) => item._id}
        columnWrapperStyle={styles.columnWrapper}
        ListHeaderComponent={
          <Text style={styles.itemCount}>
            {foods.length} {foods.length === 1 ? 'Item' : 'Items'} Found
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
    </View >
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
    // backgroundColor: '#fff',
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
    backgroundColor: '#00b894',
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
    // backgroundColor: '#fff',
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
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
    backgroundColor: '#00b894',
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
    backgroundColor: '#000',
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
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 1,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 20,
    padding: 4,
  },
  favoriteIcon: {
    fontSize: 20,
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
  disabledButton: {
    backgroundColor: '#ccc',
  },
  cartButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#00b894',
    borderRadius: 20,
    padding: 6,
    zIndex: 1,
  },
  cartButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default FoodScreen;