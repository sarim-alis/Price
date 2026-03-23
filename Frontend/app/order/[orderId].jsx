import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { getOrderById, generateInvoice } from '../../services/api';
import { colors } from '../../styles/colors';

export default function OrderDetailScreen() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams();
  const queryClient = useQueryClient();
  const [userRole, setUserRole] = React.useState(null);

  React.useEffect(() => {
    const getRole = async () => {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        setUserRole(user.role);
      }
    };
    getRole();
  }, []);

  const { data: order, isLoading, isError, error } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => getOrderById(orderId),
    enabled: !!orderId
  });

  const generateInvoiceMutation = useMutation({
    mutationFn: () => generateInvoice(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries(['order', orderId]);
      Alert.alert('Success', 'Invoice generated successfully!');
    },
    onError: (error) => {
      Alert.alert('Error', error.message || 'Failed to generate invoice');
    }
  });

  const handleDownloadInvoice = async () => {
    try {
      console.log('Starting invoice download for order:', orderId);
      
      const token = await AsyncStorage.getItem('token');
      console.log('Token retrieved:', token ? 'Yes' : 'No');
      
      // First, generate the invoice (this will create it if it doesn't exist)
      console.log('Generating invoice...');
      await generateInvoice(orderId);
      console.log('Invoice generated successfully');
      
      // Small delay to ensure PDF is written
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const url = `http://192.168.100.39:5000/api/orders/${orderId}/invoice/download`;
      console.log('Download URL:', url);
      
      // Download file to local storage
      const fileUri = `${FileSystem.documentDirectory}invoice-${orderId}.pdf`;
      console.log('File will be saved to:', fileUri);
      
      console.log('Starting download...');
      const downloadResult = await FileSystem.downloadAsync(
        url,
        fileUri,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      console.log('Download result:', downloadResult);
      console.log('Download status:', downloadResult.status);
      
      if (downloadResult.status === 200) {
        console.log('Download successful, preparing to share...');
        // Share the downloaded file
        const canShare = await Sharing.isAvailableAsync();
        console.log('Can share:', canShare);
        
        if (canShare) {
          await Sharing.shareAsync(downloadResult.uri);
          console.log('Share dialog opened');
        } else {
          Alert.alert('Success', `Invoice saved to: ${downloadResult.uri}`);
        }
      } else {
        console.error('Download failed with status:', downloadResult.status);
        throw new Error(`Failed to download invoice. Status: ${downloadResult.status}`);
      }
    } catch (error) {
      console.error('Download error:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      Alert.alert('Error', error.message || 'Failed to download invoice');
    }
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

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Order Details</Text>
          <View style={styles.headerRight} />
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
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Order Details</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.centered}>
          <Ionicons name="alert-circle-outline" size={64} color={colors.error} />
          <Text style={styles.errorText}>{error?.message || 'Failed to load order'}</Text>
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
        <Text style={styles.headerTitle}>Order Details</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content}>
        {/* Order Status */}
        <View style={styles.statusSection}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
            <Text style={styles.statusText}>{order.status.toUpperCase()}</Text>
          </View>
          <Text style={styles.orderNumber}>Order #{order.orderNumber}</Text>
          <Text style={styles.orderDate}>
            Placed on {new Date(order.createdAt).toLocaleDateString()}
          </Text>
        </View>

        {/* Product Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Product</Text>
          <View style={styles.productCard}>
            <Text style={styles.productName}>
              {order.mobileId?.brand} {order.mobileId?.model}
            </Text>
            <Text style={styles.productSpecs}>
              {order.mobileId?.ram}GB RAM • {order.mobileId?.storage}GB Storage
            </Text>
            <Text style={styles.productCondition}>
              Condition: {order.mobileId?.condition}
            </Text>
            <Text style={styles.productPrice}>Rs. {order.price.toLocaleString()}</Text>
          </View>
        </View>

        {/* Payment Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Information</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Payment Method</Text>
              <Text style={styles.infoValue}>
                {order.paymentMethod === 'jazzcash' ? 'JazzCash' :
                 order.paymentMethod === 'easypaisa' ? 'EasyPaisa' : 'Bank Transfer'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Payment Status</Text>
              <Text style={[styles.infoValue, { 
                color: order.paymentStatus === 'confirmed' ? colors.success : colors.warning 
              }]}>
                {order.paymentStatus === 'confirmed' ? 'Confirmed' : 'Pending'}
              </Text>
            </View>
            {order.paymentConfirmedAt && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Confirmed At</Text>
                <Text style={styles.infoValue}>
                  {new Date(order.paymentConfirmedAt).toLocaleString()}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Payment Proof */}
        {order.paymentProofUrl && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Proof</Text>
            <Image 
              source={{ uri: `http://192.168.100.39:5000${order.paymentProofUrl}` }}
              style={styles.paymentProofImage}
              resizeMode="contain"
            />
          </View>
        )}

        {/* Buyer/Seller Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {userRole === 'buyer' ? 'Seller Information' : 'Buyer Information'}
          </Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Name</Text>
              <Text style={styles.infoValue}>
                {userRole === 'buyer' ? order.sellerId?.name : order.buyerId?.name}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>
                {userRole === 'buyer' ? order.sellerId?.email : order.buyerId?.email}
              </Text>
            </View>
            {(userRole === 'buyer' ? order.sellerId?.phone : order.buyerId?.phone) && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Phone</Text>
                <Text style={styles.infoValue}>
                  {userRole === 'buyer' ? order.sellerId?.phone : order.buyerId?.phone}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Invoice Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Invoice</Text>
          <TouchableOpacity
            style={styles.downloadButton}
            onPress={handleDownloadInvoice}
          >
            <Ionicons name="download-outline" size={20} color={colors.textLight} />
            <Text style={styles.downloadButtonText}>Download Invoice PDF</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
    textAlign: 'center',
    marginTop: 16,
  },
  content: {
    flex: 1,
  },
  statusSection: {
    backgroundColor: colors.surface,
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 8,
    borderBottomColor: colors.backgroundDark,
  },
  statusBadge: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 12,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textLight,
  },
  orderNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
    color: colors.textSecondary,
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
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'right',
    flex: 1,
    marginLeft: 12,
  },
  paymentProofImage: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    backgroundColor: colors.backgroundDark,
  },
  invoiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 12,
  },
  invoiceButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 8,
  },
  downloadButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  downloadButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textLight,
    marginLeft: 8,
  },
});
