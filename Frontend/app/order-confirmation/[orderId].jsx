import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { getOrderById, generateInvoice } from '../../services/api';
import { colors } from '../../styles/colors';

export default function OrderConfirmationScreen() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams();

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => getOrderById(orderId),
    enabled: !!orderId
  });

  const handleGenerateInvoice = async () => {
    try {
      await generateInvoice(orderId);
      router.push({
        pathname: '/order/[orderId]',
        params: { orderId }
      });
    } catch (error) {
      console.error('Failed to generate invoice:', error);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Success Icon */}
        <View style={styles.successIcon}>
          <Ionicons name="checkmark-circle" size={80} color={colors.success} />
        </View>

        {/* Success Message */}
        <Text style={styles.successTitle}>Order Placed Successfully!</Text>
        <Text style={styles.successSubtitle}>
          Your order has been created and payment proof has been submitted.
        </Text>

        {/* Order Details */}
        <View style={styles.orderCard}>
          <Text style={styles.orderLabel}>Order Number</Text>
          <Text style={styles.orderValue}>{order?.orderNumber}</Text>

          <View style={styles.divider} />

          <Text style={styles.orderLabel}>Product</Text>
          <Text style={styles.orderValue}>
            {order?.mobileId?.brand} {order?.mobileId?.model}
          </Text>

          <View style={styles.divider} />

          <Text style={styles.orderLabel}>Amount</Text>
          <Text style={styles.orderValuePrice}>Rs. {order?.price.toLocaleString()}</Text>

          <View style={styles.divider} />

          <Text style={styles.orderLabel}>Payment Method</Text>
          <Text style={styles.orderValue}>
            {order?.paymentMethod === 'jazzcash' ? 'JazzCash' :
             order?.paymentMethod === 'easypaisa' ? 'EasyPaisa' :
             'Bank Transfer'}
          </Text>

          <View style={styles.divider} />

          <Text style={styles.orderLabel}>Payment Status</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>
              {order?.paymentStatus === 'pending' ? 'Pending Confirmation' :
               order?.paymentStatus === 'confirmed' ? 'Confirmed' : 'Failed'}
            </Text>
          </View>
        </View>

        {/* Next Steps */}
        <View style={styles.nextStepsCard}>
          <Text style={styles.nextStepsTitle}>What happens next?</Text>
          <View style={styles.stepItem}>
            <Ionicons name="time-outline" size={20} color={colors.primary} />
            <Text style={styles.stepText}>Seller will verify your payment</Text>
          </View>
          <View style={styles.stepItem}>
            <Ionicons name="cube-outline" size={20} color={colors.primary} />
            <Text style={styles.stepText}>Product will be shipped after confirmation</Text>
          </View>
          <View style={styles.stepItem}>
            <Ionicons name="notifications-outline" size={20} color={colors.primary} />
            <Text style={styles.stepText}>You will receive updates via notifications</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity style={styles.primaryButton} onPress={handleGenerateInvoice}>
          <Ionicons name="document-text-outline" size={20} color={colors.textLight} />
          <Text style={styles.primaryButtonText}>View Order Details</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.push('/(tabs)/orders')}
        >
          <Text style={styles.secondaryButtonText}>Go to My Orders</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tertiaryButton}
          onPress={() => router.push('/(tabs)/')}
        >
          <Text style={styles.tertiaryButtonText}>Continue Shopping</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    alignItems: 'center',
  },
  successIcon: {
    marginTop: 40,
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  orderCard: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  orderLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  orderValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  orderValuePrice: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 12,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.warningLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.warning,
  },
  nextStepsCard: {
    width: '100%',
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  nextStepsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepText: {
    fontSize: 14,
    color: colors.textPrimary,
    marginLeft: 12,
    flex: 1,
  },
  primaryButton: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textLight,
    marginLeft: 8,
  },
  secondaryButton: {
    width: '100%',
    backgroundColor: colors.surface,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
    marginBottom: 12,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  tertiaryButton: {
    width: '100%',
    paddingVertical: 16,
    alignItems: 'center',
  },
  tertiaryButtonText: {
    fontSize: 15,
    color: colors.textSecondary,
  },
});
