import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import { getOrderById, uploadPaymentProof } from '../../services/api';
import { colors } from '../../styles/colors';

export default function PaymentInstructionsScreen() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams();
  const queryClient = useQueryClient();
  const [selectedImage, setSelectedImage] = useState(null);

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => getOrderById(orderId),
    enabled: !!orderId
  });

  const uploadMutation = useMutation({
    mutationFn: (imageFile) => {
      console.log('Starting upload mutation with:', imageFile);
      console.log('Order ID:', orderId);
      return uploadPaymentProof(orderId, imageFile);
    },
    onSuccess: () => {
      console.log('Upload successful!');
      queryClient.invalidateQueries(['order', orderId]);
      Alert.alert(
        'Success',
        'Payment proof uploaded successfully! The seller will confirm your payment soon.',
        [
          {
            text: 'OK',
            onPress: () => router.push({
              pathname: '/order-confirmation/[orderId]',
              params: { orderId }
            })
          }
        ]
      );
    },
    onError: (error) => {
      console.error('Upload mutation error:', error);
      Alert.alert('Error', error.message || 'Failed to upload payment proof');
    }
  });

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant camera roll permissions to upload payment proof');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0]);
    }
  };

  const handleUpload = () => {
    if (!selectedImage) {
      Alert.alert('Error', 'Please select a payment proof image');
      return;
    }

    uploadMutation.mutate(selectedImage);
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

  const getPaymentInstructions = () => {
    switch (order?.paymentMethod) {
      case 'jazzcash':
        return {
          title: 'JazzCash Payment',
          icon: 'phone-portrait-outline',
          instructions: [
            'Open your JazzCash app',
            'Select "Send Money"',
            `Send Rs. ${order?.price.toLocaleString()} to the seller's JazzCash number`,
            'Take a screenshot of the transaction',
            'Upload the screenshot below'
          ],
          accountInfo: order?.sellerPaymentInfo?.jazzcashNumber || 'Contact seller for number'
        };
      case 'easypaisa':
        return {
          title: 'EasyPaisa Payment',
          icon: 'phone-portrait-outline',
          instructions: [
            'Open your EasyPaisa app',
            'Select "Send Money"',
            `Send Rs. ${order?.price.toLocaleString()} to the seller's EasyPaisa number`,
            'Take a screenshot of the transaction',
            'Upload the screenshot below'
          ],
          accountInfo: order?.sellerPaymentInfo?.easypaisaNumber || 'Contact seller for number'
        };
      case 'bank_transfer':
        return {
          title: 'Bank Transfer',
          icon: 'business-outline',
          instructions: [
            'Transfer the amount to seller bank account',
            `Amount: Rs. ${order?.price.toLocaleString()}`,
            'Take a screenshot or photo of the transaction receipt',
            'Upload it below'
          ],
          accountInfo: order?.sellerPaymentInfo?.bankName 
            ? `${order.sellerPaymentInfo.bankName} - ${order.sellerPaymentInfo.accountNumber}`
            : 'Contact seller for bank details'
        };
      default:
        return null;
    }
  };

  const paymentInfo = getPaymentInstructions();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Instructions</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content}>
        {/* Order Info */}
        <View style={styles.section}>
          <Text style={styles.orderNumber}>Order #{order?.orderNumber}</Text>
          <Text style={styles.productName}>
            {order?.mobileId?.brand} {order?.mobileId?.model}
          </Text>
          <Text style={styles.amount}>Amount: Rs. {order?.price.toLocaleString()}</Text>
        </View>

        {/* Payment Instructions */}
        <View style={styles.section}>
          <View style={styles.instructionHeader}>
            <Ionicons name={paymentInfo?.icon} size={32} color={colors.primary} />
            <Text style={styles.instructionTitle}>{paymentInfo?.title}</Text>
          </View>

          <View style={styles.accountInfoBox}>
            <Text style={styles.accountInfoLabel}>Seller's Account</Text>
            <Text style={styles.accountInfoValue}>{paymentInfo?.accountInfo}</Text>
          </View>

          <View style={styles.stepsList}>
            {paymentInfo?.instructions.map((instruction, index) => (
              <View key={index} style={styles.stepItem}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.stepText}>{instruction}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Upload Payment Proof */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upload Payment Proof</Text>
          
          {selectedImage ? (
            <View style={styles.imagePreview}>
              <Image source={{ uri: selectedImage.uri }} style={styles.previewImage} />
              <TouchableOpacity style={styles.changeImageButton} onPress={pickImage}>
                <Text style={styles.changeImageText}>Change Image</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.uploadBox} onPress={pickImage}>
              <Ionicons name="cloud-upload-outline" size={48} color={colors.textMuted} />
              <Text style={styles.uploadText}>Tap to select image</Text>
              <Text style={styles.uploadSubtext}>Screenshot or photo of transaction</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Seller Contact */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Seller Information</Text>
          <View style={styles.sellerCard}>
            <Text style={styles.sellerName}>{order?.sellerId?.name}</Text>
            <Text style={styles.sellerContact}>{order?.sellerId?.phone}</Text>
            <Text style={styles.sellerEmail}>{order?.sellerId?.email}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.submitButton, (!selectedImage || uploadMutation.isPending) && styles.submitButtonDisabled]}
          onPress={handleUpload}
          disabled={!selectedImage || uploadMutation.isPending}
        >
          {uploadMutation.isPending ? (
            <ActivityIndicator color={colors.textLight} />
          ) : (
            <Text style={styles.submitButtonText}>Submit Payment Proof</Text>
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
  orderNumber: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  amount: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },
  instructionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  instructionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginLeft: 12,
  },
  accountInfoBox: {
    backgroundColor: colors.primaryLight,
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  accountInfoLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  accountInfoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  stepsList: {
    marginTop: 8,
  },
  stepItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textLight,
  },
  stepText: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  uploadBox: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.borderLight,
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 32,
    alignItems: 'center',
  },
  uploadText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 12,
  },
  uploadSubtext: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  imagePreview: {
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    marginBottom: 12,
  },
  changeImageButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  changeImageText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  sellerCard: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  sellerContact: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  sellerEmail: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  footer: {
    padding: 16,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  submitButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textLight,
  },
});
