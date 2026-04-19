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
import { buyerAccountStyles as styles } from "../../styles/buyer-account";
import { getProfile, updateProfile } from "../../services/api";
import { logout } from "../../services/auth";

// Frontend.
export default function AccountScreen() {
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
    profileImage: '',
  });

  // Query.
  const { data: userProfile, isLoading: profileLoading, refetch: refetchProfile } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  });

  // Update profile.
  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      Toast.show({ type: "success", text1: "Success", text2: "Profile updated successfully!" });
      refetchProfile();
      setEditModalVisible(false);
    },
    onError: (error) => {
      Toast.show({ type: "error", text1: "Error", text2: error.message || "Failed to update profile" });
    }
  });

  // Update form data when profile loads.
  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || '',
        email: userProfile.email || '',
        profileImage: userProfile.profileImage || '',
      });
    }
  }, [userProfile]);

  // Cloudinary upload function
  const uploadToCloudinary = async (imageUri) => {
    const uploadPreset = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'villas';
    const cloudName = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dgk3gaml0';
    
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

  // Image picker functions
  const showImagePickerOptions = () => {
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
      }
    } catch (error) {
      Toast.show({ type: "error", text1: "Error", text2: "Failed to pick image" });
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
      }
    } catch (error) {
      Toast.show({ type: "error", text1: "Error", text2: "Failed to take photo" });
    }
    setImagePickerVisible(false);
  };

  const handleImageUpload = async (imageUri) => {
    setUploadingImage(true);
    try {
      const imageUrl = await uploadToCloudinary(imageUri);
      setFormData(prev => ({ ...prev, profileImage: imageUrl }));
      Toast.show({ type: "success", text1: "Success", text2: "Image uploaded successfully!" });
    } catch (error) {
      Toast.show({ type: "error", text1: "Error", text2: "Failed to upload image" });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleEditField = (field, currentValue) => {
    setEditingField(field);
    setEditValue(currentValue);
    setEditModalVisible(true);
  };

  const handleSaveEdit = () => {
    if (!editValue.trim()) {
      Toast.show({ type: "error", text1: "Error", text2: "Field cannot be empty" });
      return;
    }

    updateProfileMutation.mutate({
      [editingField]: editValue.trim()
    });
  };

  const handleLogout = () => {
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
            router.replace('/login');
          }
        }
      ]
    );
  };

  const handleSwitchToSeller = () => {
    router.push('/(seller-tabs)/dashboard');
  };

  if (profileLoading) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.centered}>
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
          <TouchableOpacity style={styles.profileImageContainer} onPress={showImagePickerOptions}>
            {formData.profileImage && formData.profileImage.trim() !== '' ? (
              <Image source={{ uri: formData.profileImage }} style={styles.profileImage} />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <Ionicons name="person" size={40} color={colors.textLight} />
              </View>
            )}
            <View style={styles.cameraIcon}>
              {uploadingImage ? (
                <ActivityIndicator size="small" color={colors.textLight} />
              ) : (
                <Ionicons name="camera" size={20} color={colors.textLight} />
              )}
            </View>
          </TouchableOpacity>
          <Text style={styles.profileName}>{formData.name || 'Your Name'}</Text>
          <Text style={styles.profileEmail}>{formData.email || 'your.email@example.com'}</Text>
          <View style={styles.roleBadge}>
            <Ionicons name="person" size={16} color={colors.primary} />
            <Text style={styles.roleText}>Buyer Account</Text>
          </View>
          {!userProfile?.phoneVerified && (
            <TouchableOpacity 
              style={[styles.switchButton, { backgroundColor: colors.warning, marginTop: 12 }]}
              onPress={() => router.push('/verify-phone')}
            >
              <Ionicons name="warning-outline" size={20} color={colors.textLight} />
              <Text style={[styles.switchButtonText, { color: colors.textLight }]}>Verify Phone Number</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Personal Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <TouchableOpacity 
            style={styles.detailItem}
            onPress={() => handleEditField('name', formData.name)}
          >
            <View style={styles.detailIcon}>
              <Ionicons name="person-outline" size={20} color={colors.primary} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Full Name</Text>
              <Text style={styles.detailValue}>{formData.name || 'Not set'}</Text>
            </View>
            <Ionicons name="create-outline" size={20} color={colors.textMuted} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.detailItem}
            onPress={() => handleEditField('email', formData.email)}
          >
            <View style={styles.detailIcon}>
              <Ionicons name="mail-outline" size={20} color={colors.primary} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Email</Text>
              <Text style={styles.detailValue}>{formData.email || 'Not set'}</Text>
            </View>
            <Ionicons name="create-outline" size={20} color={colors.textMuted} />
          </TouchableOpacity>

          <View style={styles.detailItem}>
            <View style={styles.detailIcon}>
              <Ionicons name="call-outline" size={20} color={colors.primary} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Phone Verification</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={styles.detailValue}>
                  {userProfile?.phoneVerified ? 'Verified' : 'Not Verified'}
                </Text>
                <Ionicons 
                  name={userProfile?.phoneVerified ? "checkmark-circle" : "close-circle"} 
                  size={18} 
                  color={userProfile?.phoneVerified ? colors.success : colors.error} 
                />
              </View>
            </View>
            {!userProfile?.phoneVerified && (
              <TouchableOpacity onPress={() => router.push('/verify-phone')}>
                <Ionicons name="arrow-forward" size={20} color={colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Actions */}
        <TouchableOpacity style={styles.switchButton} onPress={handleSwitchToSeller}>
          <Ionicons name="storefront-outline" size={20} color={colors.primary} />
          <Text style={styles.switchButtonText}>Switch to Seller</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={colors.error} />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Edit Modal */}
      <Modal visible={editModalVisible} transparent={true} animationType="slide" onRequestClose={() => setEditModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit {editingField}</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.modalInput}
              value={editValue}
              onChangeText={setEditValue}
              placeholder={`Enter ${editingField}`}
              autoFocus
              multiline={editingField === 'bio'}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonCancel]} 
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.modalButtonTextCancel}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonSave]} 
                onPress={handleSaveEdit}
                disabled={updateProfileMutation.isLoading}
              >
                {updateProfileMutation.isLoading ? (
                  <ActivityIndicator size="small" color={colors.textLight} />
                ) : (
                  <Text style={styles.modalButtonTextSave}>Save</Text>
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
