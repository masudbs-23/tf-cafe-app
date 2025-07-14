import { useDispatch, useSelector } from 'react-redux';
import {
  removeFromCart,
  updateQuantity,
  clearCart
} from '../../redux/reducers/carts/cartsSlice';
import { RootState } from '../../redux/store';
import { TouchableOpacity, View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigationTypes';

const CartScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { totalQuantity, items, totalPrice } = useSelector((state: RootState) => state.carts);

  const handleRemove = (id: string) => {
    dispatch(removeFromCart(id));
  };

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity > 0) {
      dispatch(updateQuantity({ id, quantity: newQuantity }));
    } else {
      handleRemove(id);
    }
  };

  return (
    <View style={styles.container}>
      {items.length === 0 ? (
        <View style={styles.emptyCartContainer}>
          <View style={styles.emptyCartIcon}>
            <Icon name="shopping-cart" size={48} color="red" />
          </View>
          <Text style={styles.emptyCartTitle}>Your Cart is Empty</Text>


        </View>
      ) : (
        <>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Cart </Text>
              {items.length > 0 && (
                <TouchableOpacity
                  onPress={() => dispatch(clearCart())}
                  style={styles.clearAllButton}
                  activeOpacity={0.7}
                >
                  <Text style={styles.clearAllText}>Clear All</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Cart Items */}
            <View style={styles.itemsContainer}>
              {items.map(item => (
                <View key={item._id} style={styles.cartItem}>
                  <View style={styles.itemImageContainer}>
                    {item.image ? (
                      <Image
                        source={{ uri: item.image }}
                        style={styles.itemImage}
                        resizeMode="contain"
                      />
                    ) : (
                      <View style={styles.fallbackImage}>
                        <Icon name="shopping-bag" size={24} color="#9ca3af" />
                      </View>
                    )}
                  </View>

                  <View style={styles.itemDetails}>
                    <View style={styles.itemHeader}>
                      <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
                      <TouchableOpacity
                        onPress={() => handleRemove(item._id)}
                        activeOpacity={0.7}
                        style={styles.deleteButton}
                      >
                        <Icon name="times" size={18} color="#9ca3af" />
                      </TouchableOpacity>
                    </View>

                    <Text style={styles.itemPrice}>৳{item.price.toFixed(2)}</Text>

                    <View style={styles.quantityContainer}>
                      <View style={styles.quantityControls}>
                        <TouchableOpacity
                          onPress={() => handleQuantityChange(item._id, item.quantity - 1)}
                          style={styles.quantityButton}
                          activeOpacity={0.7}
                        >
                          <Icon name="minus" size={14} color="#4b5563" />
                        </TouchableOpacity>
                        <Text style={styles.quantityText}>{item.quantity}</Text>
                        <TouchableOpacity
                          onPress={() => handleQuantityChange(item._id, item.quantity + 1)}
                          style={styles.quantityButton}
                          activeOpacity={0.7}
                        >
                          <Icon name="plus" size={14} color="#4b5563" />
                        </TouchableOpacity>
                      </View>
                      <Text style={styles.itemTotalPrice}>৳{(item.price * item.quantity).toFixed(2)}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>

          {/* Checkout Footer */}
          <View style={styles.checkoutFooter}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total</Text>
              <Text style={styles.totalPrice}>৳{totalPrice.toFixed(2)}</Text>
            </View>

            {totalPrice < 500 && (
              <View style={styles.freeShippingBar}>
                <View style={[styles.progressBar, { width: `${(totalPrice / 500) * 100}%` }]} />
                <Text style={styles.freeShippingText}>
                  Add ৳{(500 - totalPrice).toFixed(2)} more for free shipping
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.checkoutButton}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('Checkout')}
            >
              <Text style={styles.checkoutText}>Proceed to Checkout</Text>

            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 120, // Space for fixed footer
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyCartIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f3e8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyCartTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyCartText: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 24,
  },
  continueShoppingButton: {
    backgroundColor: '#00b894',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#00b894',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  continueShoppingText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 24,
    backgroundColor: '#ffffff',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
  },
  clearAllButton: {
    padding: 8,
  },
  clearAllText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '500',
  },
  itemsContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
    paddingTop: 10
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,

  },
  itemImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f9fafb',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    overflow: 'hidden',
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  fallbackImage: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
    marginRight: 8,
  },
  itemPrice: {
    fontSize: 15,
    color: '#6b7280',
    marginBottom: 12,
  },
  deleteButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  quantityButton: {
    paddingHorizontal: 6,
  },
  quantityText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1f2937',
    marginHorizontal: 12,
  },
  itemTotalPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
  },
  deliveryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  deliveryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  deliveryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginLeft: 8,
  },
  deliveryText: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
    lineHeight: 20,
  },
  checkoutFooter: {
    position: 'absolute',
    bottom: 0,
    left: 10,
    right: 10,
    backgroundColor: '#ffffff',
    padding: 16,


  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#6b7280',
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  },
  freeShippingBar: {
    height: 36,
    backgroundColor: '#f3f4f6',
    borderRadius: 18,
    marginBottom: 16,
    justifyContent: 'center',
    paddingHorizontal: 16,
    overflow: 'hidden',
  },
  progressBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#00b894',
    opacity: 0.2,
  },
  freeShippingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#00b894',
  },
  checkoutButton: {
    backgroundColor: '#00b894',
    borderRadius: 12,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#00b894',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  checkoutText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CartScreen;