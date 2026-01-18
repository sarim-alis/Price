import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

const dummyCartItems = [
  { id: '1', name: 'Wireless Earbuds Pro 6', price: 832, quantity: 1, originalPrice: 2980, image: '' },
  { id: '2', name: 'Smart Watch Series 5', price: 2499, quantity: 2, originalPrice: 4999, image: '' },
];

export default function CartScreen() {
  const [cartItems, setCartItems] = useState(dummyCartItems);

  const updateQuantity = (id: string, increment: boolean) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + (increment ? 1 : -1)) }
          : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = cartItems.reduce(
    (sum, item) => sum + (item.originalPrice - item.price) * item.quantity,
    0
  );
  const shipping = subtotal > 500 ? 0 : 50;
  const total = subtotal + shipping;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cart ({cartItems.length})</Text>
        <TouchableOpacity>
          <MaterialCommunityIcons name="delete-sweep-outline" size={24} color="#FF1744" />
        </TouchableOpacity>
      </View>

      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={100} color="#ccc" />
          <Text style={styles.emptyText}>Your cart is empty</Text>
          <Text style={styles.emptySubtext}>Add items to get started</Text>
          <TouchableOpacity style={styles.shopButton}>
            <Text style={styles.shopButtonText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.cartItem}>
                <View style={styles.itemImageContainer}>
                  <View style={styles.itemImage} />
                </View>
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName} numberOfLines={2}>
                    {item.name}
                  </Text>
                  <View style={styles.priceRow}>
                    <Text style={styles.itemPrice}>Rs.{item.price}</Text>
                    <Text style={styles.originalPrice}>Rs.{item.originalPrice}</Text>
                  </View>
                  <View style={styles.savingsRow}>
                    <Text style={styles.savingsText}>
                      You save: Rs.{item.originalPrice - item.price}
                    </Text>
                  </View>
                  <View style={styles.itemActions}>
                    <View style={styles.quantityControl}>
                      <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => updateQuantity(item.id, false)}
                      >
                        <Ionicons name="remove" size={16} color="#333" />
                      </TouchableOpacity>
                      <Text style={styles.quantityText}>{item.quantity}</Text>
                      <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => updateQuantity(item.id, true)}
                      >
                        <Ionicons name="add" size={16} color="#333" />
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => removeItem(item.id)}
                    >
                      <Ionicons name="trash-outline" size={20} color="#FF1744" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
            contentContainerStyle={[styles.listContent, { paddingBottom: 70 }]}
          />

          {/* Voucher Section */}
          <View style={styles.voucherSection}>
            <MaterialCommunityIcons name="ticket-percent" size={24} color="#FF6D00" />
            <Text style={styles.voucherText}>Apply voucher code</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </View>

          {/* Price Summary */}
          <View style={styles.summarySection}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>Rs.{subtotal}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Discount</Text>
              <Text style={[styles.summaryValue, styles.discountValue]}>-Rs.{discount}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Shipping</Text>
              <Text style={styles.summaryValue}>
                {shipping === 0 ? 'FREE' : `Rs.${shipping}`}
              </Text>
            </View>
            {subtotal < 500 && (
              <View style={styles.freeShippingInfo}>
                <Ionicons name="information-circle" size={16} color="#42A5F5" />
                <Text style={styles.freeShippingText}>
                  Add Rs.{500 - subtotal} more for free shipping
                </Text>
              </View>
            )}
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>Rs.{total}</Text>
            </View>
          </View>

          {/* Checkout Button */}
          <View style={styles.checkoutSection}>
            <View style={styles.checkoutLeft}>
              <Text style={styles.checkoutTotal}>Rs.{total}</Text>
              <Text style={styles.checkoutSavings}>You save Rs.{discount}</Text>
            </View>
            <TouchableOpacity style={styles.checkoutButton}>
              <Text style={styles.checkoutButtonText}>Checkout</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  listContent: {
    paddingBottom: 16,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 12,
    padding: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  itemImageContainer: {
    width: 90,
    height: 90,
    marginRight: 12,
  },
  itemImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6D00',
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  savingsRow: {
    marginBottom: 8,
  },
  savingsText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
  },
  itemActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
  },
  quantityButton: {
    padding: 8,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    paddingHorizontal: 16,
  },
  deleteButton: {
    padding: 8,
  },
  voucherSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginTop: 12,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  voucherText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  summarySection: {
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginTop: 12,
    padding: 16,
    borderRadius: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 15,
    color: '#666',
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  discountValue: {
    color: '#4CAF50',
  },
  freeShippingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    gap: 8,
  },
  freeShippingText: {
    fontSize: 13,
    color: '#42A5F5',
    flex: 1,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6D00',
  },
  checkoutSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  checkoutLeft: {
    flex: 1,
  },
  checkoutTotal: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  checkoutSavings: {
    fontSize: 13,
    color: '#4CAF50',
    marginTop: 2,
  },
  checkoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6D00',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 10,
    gap: 8,
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  emptyText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#666',
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 15,
    color: '#999',
    marginTop: 8,
  },
  shopButton: {
    backgroundColor: '#FF6D00',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 24,
  },
  shopButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
