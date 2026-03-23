import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getMobileById, createOrder } from '../../services/api';
import { colors } from '../../styles/colors';

export default function CheckoutScreen() {
  const router = useRouter();
  const { mobileId } = useLocalSearchParams();
  const [selectedPayment, setSelectedPayment] = useState('jazzcash');

  const { data: mobile, isLoading } = useQuery({
    queryKey: ['mobile', mobileId],
    queryFn: () => getMobileById(mobileId),
    enabled: !!mobileId
  });

  const createOrderMutation = useMutation({
    mutationFn: ({ mobileId, paymentMethod }) => createOrder(mobileId, paymentMethod, {}),
    onSuccess: (order) => {
      router.push({
        pathname: '/payment-instructions/[orderId]',
        params: { orderId: order._id }
      });
    },
    onError: (error) => {
      Alert.alert('Error', error.message || 'Failed to create order');
    }
  });

  const handleCheckout = () => {
    if (!selectedPayment) {
      Alert.alert('Error', 'Please select a payment method');
      return;
    }

    Alert.alert(
      'Confirm Order',
      `You are about to place an order for Rs. ${mobile?.price.toLocaleString()}. Continue?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => createOrderMutation.mutate({ mobileId, paymentMethod: selectedPayment })
        }
      ]
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Checkout</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content}>
        {/* Product Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Product Summary</Text>
          <View style={styles.productCard}>
            <Text style={styles.productName}>{mobile?.brand} {mobile?.model}</Text>
            <Text style={styles.productSpecs}>
              {mobile?.ram}GB RAM • {mobile?.storage}GB Storage
            </Text>
            <Text style={styles.productCondition}>Condition: {mobile?.condition}</Text>
            <Text style={styles.productPrice}>Rs. {mobile?.price.toLocaleString()}</Text>
          </View>
        </View>

        {/* Payment Method Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Payment Method</Text>
          
          <TouchableOpacity
            style={[styles.paymentOption, selectedPayment === 'jazzcash' && styles.paymentOptionSelected]}
            onPress={() => setSelectedPayment('jazzcash')}
          >
            <View style={styles.paymentOptionContent}>
              <Ionicons 
                name={selectedPayment === 'jazzcash' ? 'radio-button-on' : 'radio-button-off'} 
                size={24} 
                color={selectedPayment === 'jazzcash' ? colors.primary : colors.textMuted} 
              />
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentName}>JazzCash</Text>
                <Text style={styles.paymentDesc}>Mobile wallet payment</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.paymentOption, selectedPayment === 'easypaisa' && styles.paymentOptionSelected]}
            onPress={() => setSelectedPayment('easypaisa')}
          >
            <View style={styles.paymentOptionContent}>
              <Ionicons 
                name={selectedPayment === 'easypaisa' ? 'radio-button-on' : 'radio-button-off'} 
                size={24} 
                color={selectedPayment === 'easypaisa' ? colors.primary : colors.textMuted} 
              />
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentName}>EasyPaisa</Text>
                <Text style={styles.paymentDesc}>Mobile wallet payment</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.paymentOption, selectedPayment === 'bank_transfer' && styles.paymentOptionSelected]}
            onPress={() => setSelectedPayment('bank_transfer')}
          >
            <View style={styles.paymentOptionContent}>
              <Ionicons 
                name={selectedPayment === 'bank_transfer' ? 'radio-button-on' : 'radio-button-off'} 
                size={24} 
                color={selectedPayment === 'bank_transfer' ? colors.primary : colors.textMuted} 
              />
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentName}>Bank Transfer</Text>
                <Text style={styles.paymentDesc}>Direct bank account transfer</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Order Total */}
        <View style={styles.section}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalAmount}>Rs. {mobile?.price.toLocaleString()}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Checkout Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.checkoutButton, createOrderMutation.isPending && styles.checkoutButtonDisabled]}
          onPress={handleCheckout}
          disabled={createOrderMutation.isPending}
        >
          {createOrderMutation.isPending ? (
            <ActivityIndicator color={colors.textLight} />
          ) : (
            <Text style={styles.checkoutButtonText}>Place Order</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  headerRight: {
    width: 32,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
    borderBottomWidth: 8,
    borderBottomColor: colors.backgroundDark,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  productCard: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  productSpecs: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  productCondition: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },
  paymentOption: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: 12,
  },
  paymentOptionSelected: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  paymentOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentInfo: {
    marginLeft: 12,
    flex: 1,
  },
  paymentName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  paymentDesc: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
  },
  footer: {
    padding: 16,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  checkoutButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkoutButtonDisabled: {
    opacity: 0.6,
  },
  checkoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textLight,
  },
});
