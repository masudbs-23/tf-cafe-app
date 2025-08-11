import React from 'react';
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const OrderHistoryScreen = () => {
  const navigation = useNavigation();

  // Dummy order data
  const orders = [
    {
      id: 'ORD001',
      date: '2024-01-15',
      status: 'Delivered',
      total: 1250.00,
      items: [
        { name: 'Chicken Burger', quantity: 2, price: 450.00 },
        { name: 'French Fries', quantity: 1, price: 200.00 },
        { name: 'Coca Cola', quantity: 2, price: 150.00 },
      ],
      deliveryAddress: 'Mirpur DOHS, Dhaka',
      paymentMethod: 'Cash on Delivery',
    },
    {
      id: 'ORD002',
      date: '2024-01-10',
      status: 'Delivered',
      total: 890.00,
      items: [
        { name: 'Pizza Margherita', quantity: 1, price: 650.00 },
        { name: 'Garlic Bread', quantity: 1, price: 240.00 },
      ],
      deliveryAddress: 'Mirpur DOHS, Dhaka',
      paymentMethod: 'bKash',
    },
    {
      id: 'ORD003',
      date: '2024-01-05',
      status: 'Cancelled',
      total: 750.00,
      items: [
        { name: 'Beef Steak', quantity: 1, price: 750.00 },
      ],
      deliveryAddress: 'Mirpur DOHS, Dhaka',
      paymentMethod: 'Cash on Delivery',
    },
    {
      id: 'ORD004',
      date: '2023-12-28',
      status: 'Delivered',
      total: 1200.00,
      items: [
        { name: 'Grilled Chicken', quantity: 1, price: 800.00 },
        { name: 'Mashed Potatoes', quantity: 1, price: 200.00 },
        { name: 'Green Salad', quantity: 1, price: 200.00 },
      ],
      deliveryAddress: 'Mirpur DOHS, Dhaka',
      paymentMethod: 'Cash on Delivery',
    },
    {
      id: 'ORD005',
      date: '2023-12-20',
      status: 'Delivered',
      total: 650.00,
      items: [
        { name: 'Fish & Chips', quantity: 1, price: 450.00 },
        { name: 'Onion Rings', quantity: 1, price: 200.00 },
      ],
      deliveryAddress: 'Mirpur DOHS, Dhaka',
      paymentMethod: 'bKash',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return '#22C55E';
      case 'Cancelled':
        return '#EF4444';
      case 'Processing':
        return '#F59E0B';
      default:
        return '#6B7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'check-circle';
      case 'Cancelled':
        return 'cancel';
      case 'Processing':
        return 'schedule';
      default:
        return 'info';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order History</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {orders.map((order, index) => (
          <View key={order.id} style={styles.orderCard}>
            {/* Order Header */}
            <View style={styles.orderHeader}>
              <View style={styles.orderInfo}>
                <Text style={styles.orderId}>#{order.id}</Text>
                <Text style={styles.orderDate}>{order.date}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) + '20' }]}>
                <Icon name={getStatusIcon(order.status)} size={16} color={getStatusColor(order.status)} />
                <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
                  {order.status}
                </Text>
              </View>
            </View>

            {/* Order Items */}
            <View style={styles.orderItems}>
              {order.items.map((item, itemIndex) => (
                <View key={itemIndex} style={styles.orderItem}>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemQuantity}>x{item.quantity}</Text>
                  </View>
                  <Text style={styles.itemPrice}>৳{item.price.toFixed(2)}</Text>
                </View>
              ))}
            </View>

            {/* Order Details */}
            <View style={styles.orderDetails}>
              <View style={styles.detailRow}>
                <Icon name="location-on" size={16} color="#666" />
                <Text style={styles.detailText} numberOfLines={1} ellipsizeMode="tail">
                  {order.deliveryAddress}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Icon name="payment" size={16} color="#666" />
                <Text style={styles.detailText}>{order.paymentMethod}</Text>
              </View>
            </View>

            {/* Order Total */}
            <View style={styles.orderTotal}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalAmount}>৳{order.total.toFixed(2)}</Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>Reorder</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]}>
                <Text style={styles.secondaryButtonText}>View Details</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
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
    padding: 16,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  orderItems: {
    marginBottom: 12,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  itemInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  itemQuantity: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  orderDetails: {
    marginBottom: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
  orderTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#22C55E',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#22C55E',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#22C55E',
  },
  secondaryButtonText: {
    color: '#22C55E',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default OrderHistoryScreen;
