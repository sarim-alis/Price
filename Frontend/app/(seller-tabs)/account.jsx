// Imports.
import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator, Image, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from "react-native-toast-message";
import * as ImagePicker from 'expo-image-picker';
import { colors } from "../../styles/colors";
import { sellerAccountStyles as styles } from "../../styles/seller-account";
import { getProfile, updateProfile } from "../../services/api";
import { logout } from "../../services/auth";


// Frontend.
export default function SellerAccount() {
  const router = useRouter();
  const queryClient = useQueryClient();
  
  // States.
  const [isEditing, setIsEditing] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingField, setEditingField] = useState('');
  const [editValue, setEditValue] = useState('');
  const [imagePickerVisible, setImagePickerVisible] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  // Form state.
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    profileImage: '',
    shopName: '',
    shopPic: '',
    address: '',
    bankDetail: '',
    easypaisaDetail: '',
    jazzcashDetail: '',
    cnic: ''
  });

  // Query.
  const { data: userProfile, isLoading: profileLoading, refetch: refetchProfile } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  });

  // Update profile.
  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      Toast.show({ type: "success", text1: "Success", text2: "Profile updated successfully!" });
      setEditModalVisible(false);
      setImagePickerVisible(false);
      refetchProfile();
    },
    onError: (error) => {
      Toast.show({ type: "error", text1: "Error", text2: error.message });
    }
  });

  // Update form data.
  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || '',
        email: userProfile.email || '',
        phone: userProfile.phone || '',
        profileImage: userProfile.profileImage || '',
        shopName: userProfile.seller?.shopName || '',
        shopPic: userProfile.seller?.shopPic || '',
        address: userProfile.seller?.address || '',
        bankDetail: userProfile.seller?.bankDetail || '',
        easypaisaDetail: userProfile.seller?.easypaisaDetail || '',
        jazzcashDetail: userProfile.seller?.jazzcashDetail || '',
        cnic: userProfile.seller?.cnic || ''
      });
    }
  }, [userProfile]);

  // Handle logout.
  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await logout();
            router.replace("/login");
          }
        }
      ]
    );
  };

  // Handle switch role.
  const handleSwitchRole = () => {
    Alert.alert(
      "Switch Role",
      "Are you sure you want to switch to buyer mode?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Switch",
          onPress: () => router.replace("/role-selection")
        }
      ]
    );
  };

  // Edit modal.
  const openEditModal = (field, currentValue) => {
    setEditingField(field);
    setEditValue(currentValue || '');
    setEditModalVisible(true);
  };

  // Handle save edit.
  const handleSaveEdit = () => {
    if (!editValue.trim()) {
      Toast.show({ type: "error", text1: "Error", text2: "Field cannot be empty" });
      return;
    }

    const updateData = {};
    updateData[editingField] = editValue.trim();
    updateProfileMutation.mutate(updateData);
  };

  const getProfileInitials = (name) => { return name ? name.charAt(0).toUpperCase() : 'S';};

  // Upload cloudinary.
  const uploadToCloudinary = async (imageUri) => {
    const uploadPreset = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'villas';
    const cloudName = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dgk3gaml0';
    
    
    if (cloudName === 'YOUR_CLOUD_NAME') {
      throw new Error('Please set your actual Cloudinary cloud name in environment variables');
    }
    
    const data = new FormData();
    data.append('file', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'upload.jpg',
    });
    data.append('upload_preset', uploadPreset);
    data.append('cloud_name', cloudName);

    try {
      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
      
      const response = await fetch(cloudinaryUrl, {
        method: 'POST',
        body: data,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error?.message || 'Cloudinary upload failed');
      }
      
      return result.secure_url;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw error;
    }
  };

  // Image picker option.
  const showImagePickerOptions = (field) => {
    setEditingField(field);
    setImagePickerVisible(true);
  };

  const pickImageFromGallery = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Toast.show({ type: "error", text1: "Permission Denied", text2: "Please allow gallery access" });
        setImagePickerVisible(false);
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({ 
        mediaTypes: 'images', 
        allowsEditing: true, 
        aspect: [1, 1], 
        quality: 0.8 
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        await handleImageUpload(result.assets[0].uri);
      } else {
        console.log('Image selection canceled');
      }
    } catch (error) {
      Toast.show({ type: "error", text1: "Error", text2: `Failed to pick image: ${error.message}` });
    }
    setImagePickerVisible(false);
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Toast.show({ type: "error", text1: "Permission Denied", text2: "Please allow camera access" });
        setImagePickerVisible(false);
        return;
      }

      const result = await ImagePicker.launchCameraAsync({ 
        mediaTypes: 'images', 
        allowsEditing: true, 
        aspect: [1, 1], 
        quality: 0.8 
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        await handleImageUpload(result.assets[0].uri);
      } else {
        console.log('Photo capture canceled');
      }
    } catch (error) {
      Toast.show({ type: "error", text1: "Error", text2: `Failed to take photo: ${error.message}` });
    }
    setImagePickerVisible(false);
  };

  const handleImageUpload = async (imageUri) => {
    setUploadingImage(true);
    try {
      const imageUrl = await uploadToCloudinary(imageUri);
      console.log('Cloudinary URL received:', imageUrl);
      
      const updateData = {};
      updateData[editingField] = imageUrl;
      console.log('Update data:', updateData);
      
      updateProfileMutation.mutate(updateData);
    } catch (error) {
      Toast.show({ type: "error", text1: "Error", text2: "Failed to upload image" });
    } finally {
      setUploadingImage(false);
    }
  };
  const renderProfileImage = () => {
    if (formData.profileImage) {
      return (
        <Image source={{ uri: formData.profileImage }} style={styles.profileImage} />
      );
    }
    return (
      <View style={[styles.profileImage, styles.profileImagePlaceholder]}>
        <Text style={styles.profileInitials}>
          {getProfileInitials(formData.name)}
        </Text>
      </View>
    );
  };

  const renderShopImage = () => {
    if (formData.shopPic) {
      return (
        <Image source={{ uri: formData.shopPic }} style={styles.shopImage} />
      );
    }
    return (
      <View style={[styles.shopImage, styles.shopImagePlaceholder]}>
        <Ionicons name="storefront" size={24} color={colors.textMuted} />
      </View>
    );
  };

  const renderEditableField = (title, value, field, icon) => (
    <TouchableOpacity 
      style={styles.detailItem}
      onPress={() => openEditModal(field, value)}
    >
      <View style={styles.detailIcon}>
        <Ionicons name={icon} size={20} color={colors.primary} />
      </View>
      <View style={styles.detailContent}>
        <Text style={styles.detailLabel}>{title}</Text>
        <Text style={styles.detailValue}>{value || 'Not set'}</Text>
      </View>
      <Ionicons name="create-outline" size={20} color={colors.textMuted} />
    </TouchableOpacity>
  );

  if (profileLoading) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Account</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* Profile Section */}
        <View style={styles.profileCard}>
          <TouchableOpacity onPress={() => showImagePickerOptions('profileImage')}>
            {renderProfileImage()}
            <View style={styles.cameraOverlay}>
              {uploadingImage && editingField === 'profileImage' ? (
                <ActivityIndicator size="small" color={colors.textLight} />
              ) : (
                <Ionicons name="camera" size={20} color={colors.textLight} />
              )}
            </View>
          </TouchableOpacity>
          <Text style={styles.userName}>{formData.name}</Text>
          <Text style={styles.userEmail}>{formData.email}</Text>
          <View style={styles.roleBadge}>
            <Ionicons name="storefront" size={16} color={colors.success} />
            <Text style={styles.roleText}>Seller Account</Text>
          </View>
        </View>

        {/* Personal Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          {renderEditableField('Full Name', formData.name, 'name', 'person-outline')}
          {renderEditableField('Phone', formData.phone, 'phone', 'call-outline')}
          {renderEditableField('CNIC', formData.cnic, 'cnic', 'card-outline')}
        </View>

        {/* Shop Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shop Information</Text>
          
          <TouchableOpacity style={styles.shopImageContainer} onPress={() => showImagePickerOptions('shopPic')}>
            {renderShopImage()}
            <View style={styles.cameraOverlay}>
              {uploadingImage && editingField === 'shopPic' ? (
                <ActivityIndicator size="small" color={colors.textLight} />
              ) : (
                <Ionicons name="camera" size={20} color={colors.textLight} />
              )}
            </View>
          </TouchableOpacity>

          {renderEditableField('Shop Name', formData.shopName, 'shopName', 'storefront-outline')}
          {renderEditableField('Address', formData.address, 'address', 'location-outline')}
        </View>

        {/* Payment Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Methods</Text>
          {renderEditableField('Bank Account', formData.bankDetail, 'bankDetail', 'card-outline')}
          {renderEditableField('EasyPaisa', formData.easypaisaDetail, 'easypaisaDetail', 'wallet-outline')}
          {renderEditableField('JazzCash', formData.jazzcashDetail, 'jazzcashDetail', 'wallet-outline')}
        </View>

        {/* Actions */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.switchButton} onPress={handleSwitchRole}>
            <Ionicons name="swap-horizontal" size={20} color={colors.primary} />
            <Text style={styles.switchButtonText}>Switch to Buyer Mode</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color={colors.error} />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Edit Modal */}
      <Modal visible={editModalVisible} transparent={true} animationType="slide" onRequestClose={() => setEditModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Edit {editingField.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <TextInput style={styles.modalInput} value={editValue} onChangeText={setEditValue} placeholder={`Enter ${editingField}`} multiline={editingField === 'address'} numberOfLines={editingField === 'address' ? 3 : 1} autoFocus />

            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.modalButton, styles.modalCancelButton]} onPress={() => setEditModalVisible(false)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.modalSaveButton]} onPress={handleSaveEdit} disabled={updateProfileMutation.isLoading}>
                {updateProfileMutation.isLoading ? (
                  <ActivityIndicator size="small" color={colors.textLight} />
                ) : (
                  <Text style={styles.modalSaveText}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Image Picker Modal */}
      <Modal visible={imagePickerVisible} transparent={true} animationType="slide" onRequestClose={() => setImagePickerVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Choose Image</Text>
              <TouchableOpacity onPress={() => setImagePickerVisible(false)}>
                <Ionicons name="close" size={24} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <View style={styles.imagePickerOptions}>
              <TouchableOpacity style={styles.imagePickerOption} onPress={pickImageFromGallery}>
                <Ionicons name="images" size={24} color={colors.primary} />
                <Text style={styles.imagePickerText}>Choose from Gallery</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.imagePickerOption} onPress={takePhoto}>
                <Ionicons name="camera" size={24} color={colors.primary} />
                <Text style={styles.imagePickerText}>Take Photo</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
