import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '../../context/CartContext';
import { useCreateOrder } from '../../services/api';
import { useToast } from '../../context/ToastContext';

const CheckoutScreen = () => {
  const navigation = useNavigation();
  const { state: cartState, clearCart } = useCart();
  const createOrderMutation = useCreateOrder();
  const { showToast } = useToast();

  const items = cartState.items;
  const totalPrice = cartState.totalAmount;

  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [deliveryDetails, setDeliveryDetails] = useState({
    name: '',
    phone: '',
    address: '',
    specialInstructions: ''
  });

  const handleCheckout = () => {
    if (!deliveryDetails.name || !deliveryDetails.phone || !deliveryDetails.address) {
      showToast('Please fill in all required delivery details', 'error');
      return;
    }

    const orderData = {
      items,
      totalPrice,
      paymentMethod,
      deliveryDetails
    };

    createOrderMutation.mutate(orderData, {
      onSuccess: () => {
        showToast('Order placed successfully! You will receive a confirmation shortly.', 'success');
        clearCart();
        navigation.navigate('Main');
      },
      onError: (error) => {
        showToast('Failed to place order. Please try again.', 'error');
      }
    });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={20} color="#333" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Checkout</Text>
        </View>
        {/* This empty view balances the back button and keeps title centered */}
        <View style={styles.backButton} />
      </View>

      {/* Delivery Information Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Icon name="map-marker" size={20} color="#ef4444" />
          <Text style={styles.sectionTitle}>Delivery Information</Text>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Full Name <Text style={styles.required}>*</Text></Text>
          <TextInput
            style={styles.input}
            placeholder="John Doe"
            value={deliveryDetails.name}
            onChangeText={(text) => setDeliveryDetails({ ...deliveryDetails, name: text })}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Phone Number <Text style={styles.required}>*</Text></Text>
          <TextInput
            style={styles.input}
            placeholder="01XXXXXXXXX"
            keyboardType="phone-pad"
            value={deliveryDetails.phone}
            onChangeText={(text) => setDeliveryDetails({ ...deliveryDetails, phone: text })}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Delivery Address <Text style={styles.required}>*</Text></Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="House #, Road #, Area, City"
            multiline
            numberOfLines={3}
            value={deliveryDetails.address}
            onChangeText={(text) => setDeliveryDetails({ ...deliveryDetails, address: text })}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Special Instructions</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Any special delivery instructions?"
            multiline
            numberOfLines={2}
            value={deliveryDetails.specialInstructions}
            onChangeText={(text) => setDeliveryDetails({ ...deliveryDetails, specialInstructions: text })}
          />
        </View>
      </View>

      {/* Payment Method Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Icon name="credit-card" size={20} color="#ef4444" />
          <Text style={styles.sectionTitle}>Payment Method</Text>
        </View>

        <TouchableOpacity
          style={[styles.paymentOption, paymentMethod === 'cash' && styles.paymentOptionSelected]}
          onPress={() => setPaymentMethod('cash')}
        >
          <View style={styles.paymentRadio}>
            {paymentMethod === 'cash' && <View style={styles.paymentRadioSelected} />}
          </View>
          <Icon name="money" size={24} color="#10b981" style={styles.paymentIcon} />
          <Text style={styles.paymentText}>Cash on Delivery</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.paymentOption, paymentMethod === 'bkash' && styles.paymentOptionSelected]}
          onPress={() => setPaymentMethod('bkash')}
        >
          <View style={styles.paymentRadio}>
            {paymentMethod === 'bkash' && <View style={styles.paymentRadioSelected} />}
          </View>
          <Image
            source={{ uri: 'https://pngsource.in/assets/thumbnails/BKash-Logo-icon-Pngsource-V833RDST.png' }}
            style={styles.paymentImage}
          />
          <Text style={styles.paymentText}>bKash</Text>
        </TouchableOpacity>
      </View>

      {/* Order Summary Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Icon name="shopping-bag" size={20} color="#ef4444" />
          <Text style={styles.sectionTitle}>Order Summary</Text>
        </View>

        <View style={styles.orderItems}>
          {items.map(item => (
            <View key={item._id} style={styles.orderItem}>
              <Text style={styles.orderItemName}>
                {item.name} × {item.quantity}
              </Text>
              <Text style={styles.orderItemPrice}>৳{(item.price * item.quantity).toFixed(2)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.divider} />

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>৳{totalPrice.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Delivery Fee</Text>
          <Text style={styles.summaryValue}>৳ 0.00</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Tax</Text>
          <Text style={styles.summaryValue}>৳0.00</Text>
        </View>

        <View style={styles.divider} />

        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>
            ৳{(totalPrice >= 500 ? totalPrice : totalPrice).toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Checkout Button */}
      <TouchableOpacity
        style={styles.checkoutButton}
        onPress={handleCheckout}
        disabled={createOrderMutation.isPending}
      >
        <Text style={styles.checkoutText}>
          {createOrderMutation.isPending ? 'Placing Order...' : 'Place Order'}
        </Text>
        {!createOrderMutation.isPending && <Icon name="arrow-right" size={16} color="#ffffff" />}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContainer: {
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 16,
  },
  backButton: {
    width: 20,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 8,
    margin: 10,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '400',
    marginLeft: 8,
    color: '#1e293b',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#64748b',
  },
  required: {
    color: '#ef4444',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f8fafc',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 12,
  },
  paymentOptionSelected: {
    borderColor: '#3b82f6',
    backgroundColor: '#f0f9ff',
  },
  paymentRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  paymentRadioSelected: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#3b82f6',
  },
  paymentIcon: {
    marginRight: 12,
  },
  paymentImage: {
    width: 24,
    height: 24,
    marginRight: 12,
    resizeMode: 'contain',
  },
  paymentText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
  },
  orderItems: {
    marginBottom: 12,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  orderItemName: {
    fontSize: 14,
    color: '#64748b',
  },
  orderItemPrice: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  summaryValue: {
    fontSize: 14,
    color: '#1e293b',
  },
  totalRow: {
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  checkoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#22C55E',
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 8,
  },
  checkoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
});

export default CheckoutScreen;