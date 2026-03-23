import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSellerOrders, confirmPayment, updateOrderStatus } from '../../services/api';
import { colors } from '../../styles/colors';

export default function SellerOrdersScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedFilter, setSelectedFilter] = useState('all');

  const { data: orders = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ['sellerOrders', selectedFilter === 'all' ? undefined : selectedFilter],
    queryFn: () => getSellerOrders(selectedFilter === 'all' ? undefined : selectedFilter),
  });

  const confirmPaymentMutation = useMutation({
    mutationFn: confirmPayment,
    onSuccess: () => {
      queryClient.invalidateQueries(['sellerOrders']);
      Alert.alert('Success', 'Payment confirmed successfully');
    },
    onError: (error) => {
      Alert.alert('Error', error.message || 'Failed to confirm payment');
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ orderId, status }) => updateOrderStatus(orderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries(['sellerOrders']);
      Alert.alert('Success', 'Order status updated');
    },
    onError: (error) => {
      Alert.alert('Error', error.message || 'Failed to update status');
    }
  });

  const handleConfirmPayment = (orderId) => {
    Alert.alert(
      'Confirm Payment',
      'Have you received the payment from the buyer?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', onPress: () => confirmPaymentMutation.mutate(orderId) }
      ]
    );
  };

  const handleUpdateStatus = (orderId, currentStatus) => {
    const nextStatus = currentStatus === 'confirmed' ? 'shipped' : 'delivered';
    const statusText = nextStatus === 'shipped' ? 'Mark as Shipped' : 'Mark as Delivered';
    
    Alert.alert(
      'Update Status',
      `${statusText}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', onPress: () => updateStatusMutation.mutate({ orderId, status: nextStatus }) }
      ]
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return colors.warning;
      case 'confirmed': return colors.info;
      case 'shipped': return colors.primary;
      case 'delivered': return colors.success;
      case 'cancelled': return colors.error;
      default: return colors.textSecondary;
    }
  };

  const renderOrder = ({ item }) => (
    <View style={styles.orderCard}>
      <TouchableOpacity
        onPress={() => router.push({
          pathname: '/order/[orderId]',
          params: { orderId: item._id }
        })}
      >
        <View style={styles.orderHeader}>
          <Text style={styles.orderNumber}>#{item.orderNumber}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
              {item.status.toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.orderBody}>
          <Text style={styles.productName}>
            {item.mobileId?.brand} {item.mobileId?.model}
          </Text>
          <Text style={styles.buyerInfo}>
            Buyer: {item.buyerId?.name}
          </Text>
        </View>

        <View style={styles.orderFooter}>
          <View>
            <Text style={styles.priceLabel}>Amount</Text>
            <Text style={styles.price}>Rs. {item.price.toLocaleString()}</Text>
          </View>
          <View>
            <Text style={styles.paymentMethod}>
              {item.paymentMethod === 'jazzcash' ? 'JazzCash' :
               item.paymentMethod === 'easypaisa' ? 'EasyPaisa' : 'Bank Transfer'}
            </Text>
            <Text style={[styles.paymentStatus, { color: item.paymentStatus === 'confirmed' ? colors.success : colors.warning }]}>
              {item.paymentStatus === 'confirmed' ? 'Payment Confirmed' : 'Payment Pending'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Action Buttons */}
      {item.paymentStatus === 'pending' && item.paymentProofUrl && (
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleConfirmPayment(item._id)}
          disabled={confirmPaymentMutation.isPending}
        >
          {confirmPaymentMutation.isPending ? (
            <ActivityIndicator size="small" color={colors.textLight} />
          ) : (
            <>
              <Ionicons name="checkmark-circle-outline" size={18} color={colors.textLight} />
              <Text style={styles.actionButtonText}>Confirm Payment</Text>
            </>
          )}
        </TouchableOpacity>
      )}

      {item.paymentStatus === 'confirmed' && item.status === 'confirmed' && (
        <TouchableOpacity
          style={[styles.actionButton, styles.actionButtonSecondary]}
          onPress={() => handleUpdateStatus(item._id, item.status)}
          disabled={updateStatusMutation.isPending}
        >
          {updateStatusMutation.isPending ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <>
              <Ionicons name="cube-outline" size={18} color={colors.primary} />
              <Text style={styles.actionButtonTextSecondary}>Mark as Shipped</Text>
            </>
          )}
        </TouchableOpacity>
      )}

      {item.status === 'shipped' && (
        <TouchableOpacity
          style={[styles.actionButton, styles.actionButtonSecondary]}
          onPress={() => handleUpdateStatus(item._id, item.status)}
          disabled={updateStatusMutation.isPending}
        >
          {updateStatusMutation.isPending ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <>
              <Ionicons name="checkmark-done-outline" size={18} color={colors.primary} />
              <Text style={styles.actionButtonTextSecondary}>Mark as Delivered</Text>
            </>
          )}
        </TouchableOpacity>
      )}
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Orders</Text>
        </View>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Orders</Text>
        </View>
        <View style={styles.centered}>
          <Ionicons name="alert-circle-outline" size={64} color={colors.error} />
          <Text style={styles.errorText}>{error?.message || 'Failed to load orders'}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Orders</Text>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        {['all', 'pending', 'confirmed', 'shipped', 'delivered'].map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[styles.filterTab, selectedFilter === filter && styles.filterTabActive]}
            onPress={() => setSelectedFilter(filter)}
          >
            <Text style={[styles.filterText, selectedFilter === filter && styles.filterTextActive]}>
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item._id}
        renderItem={renderOrder}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} colors={[colors.primary]} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="receipt-outline" size={64} color={colors.textMuted} />
            <Text style={styles.emptyText}>No orders found</Text>
            <Text style={styles.emptySubtext}>
              {selectedFilter === 'all' 
                ? 'Orders from buyers will appear here'
                : `No ${selectedFilter} orders`}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
    textAlign: 'center',
    marginTop: 16,
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  retryButtonText: {
    color: colors.textLight,
    fontSize: 16,
    fontWeight: '600',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: colors.background,
  },
  filterTabActive: {
    backgroundColor: colors.primary,
  },
  filterText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  filterTextActive: {
    color: colors.textLight,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
  orderCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  orderBody: {
    marginBottom: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  buyerInfo: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  paymentMethod: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'right',
    marginBottom: 2,
  },
  paymentStatus: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'right',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  actionButtonSecondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  actionButtonText: {
    color: colors.textLight,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  actionButtonTextSecondary: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 8,
    textAlign: 'center',
  },
});
