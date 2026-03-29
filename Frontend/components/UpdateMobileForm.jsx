// Imports.
import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Modal, ActivityIndicator, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import * as ImagePicker from 'expo-image-picker';
import { updateMobile } from '../services/api';
import { addMobileStyles as styles } from '../styles/add-mobile';

// Colors for inline styles
const colors = { primary: '#7b5740', textMuted: '#999999', textLight: '#ffffff' };

// Frontend.
const UpdateMobileForm = ({ visible, onClose, onSuccess, mobile }) => {
  // States.
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  const [imagePickerVisible, setImagePickerVisible] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form state - initialize with mobile data
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    ram: '',
    storage: '',
    screenSize: '',
    battery: '',
    frontCamera: '',
    rearCamera: '',
    processor: '',
    price: '',
    stock: '1',
    status: 'active',
    condition: 'new',
    location: '',
    images: []
  });

  // Brands for selection
  const brands = [
    { value: 'apple', label: 'Apple' },
    { value: 'samsung', label: 'Samsung' },
    { value: 'xiaomi', label: 'Xiaomi' },
    { value: 'oppo', label: 'Oppo' },
    { value: 'vivo', label: 'Vivo' },
    { value: 'realme', label: 'Realme' },
    { value: 'oneplus', label: 'OnePlus' },
    { value: 'google', label: 'Google' },
    { value: 'motorola', label: 'Motorola' },
    { value: 'nokia', label: 'Nokia' },
    { value: 'huawei', label: 'Huawei' },
    { value: 'honor', label: 'Honor' },
    { value: 'asus', label: 'Asus' },
    { value: 'lg', label: 'LG' },
    { value: 'sony', label: 'Sony' },
    { value: 'tecno', label: 'Tecno' },
    { value: 'infinix', label: 'Infinix' },
    { value: 'itel', label: 'Itel' }
  ];

  // Conditions for selection
  const conditions = [
    { value: 'new', label: 'New' },
    { value: 'used', label: 'Used' }
  ];

  // Initialize form data when mobile prop changes
  useEffect(() => {
    if (mobile) {
      setFormData({
        brand: mobile.brand || '',
        model: mobile.model || '',
        ram: mobile.ram?.toString() || '',
        storage: mobile.storage?.toString() || '',
        screenSize: mobile.screenSize?.toString() || '',
        battery: mobile.battery?.toString() || '',
        frontCamera: mobile.frontCamera?.toString() || '',
        rearCamera: mobile.rearCamera?.toString() || '',
        processor: mobile.processor || '',
        price: mobile.price?.toString() || '',
        stock: mobile.stock?.toString() || '1',
        status: mobile.status || 'active',
        condition: mobile.condition || 'new',
        location: mobile.location || '',
        images: mobile.images || []
      });
    }
  }, [mobile]);

  // Update mobile mutation
  const updateMobileMutation = useMutation({
    mutationFn: ({ mobileId, mobileData }) => updateMobile(mobileId, mobileData),
    onSuccess: () => {
      Toast.show({ 
        type: "success", 
        text1: "Success", 
        text2: "Mobile updated successfully!" 
      });
      queryClient.invalidateQueries(['sellerMobiles']);
      onSuccess();
      handleClose();
    },
    onError: (error) => {
      Toast.show({ 
        type: "error", 
        text1: "Error", 
        text2: error.message || "Failed to update mobile" 
      });
    }
  });

  const handleClose = () => {
    setCurrentStep(1);
    onClose();
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

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
      
      // Replace with single image (not array)
      setFormData(prev => ({
        ...prev,
        images: [imageUrl]
      }));
      
      Toast.show({ type: "success", text1: "Success", text2: "Image uploaded successfully!" });
    } catch (error) {
      Toast.show({ type: "error", text1: "Error", text2: "Failed to upload image" });
    } finally {
      setUploadingImage(false);
    }
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        if (!formData.brand || !formData.model) {
          Toast.show({ type: "error", text1: "Error", text2: "Brand and Model are required" });
          return false;
        }
        return true;
      case 2:
        if (!formData.ram || !formData.storage || !formData.price) {
          Toast.show({ type: "error", text1: "Error", text2: "RAM, Storage, and Price are required" });
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    if (!validateStep(currentStep)) return;

    // Prepare data for API
    const mobileData = {
      brand: formData.brand,
      model: formData.model,
      ram: parseInt(formData.ram),
      storage: parseInt(formData.storage),
      screenSize: parseFloat(formData.screenSize),
      frontCamera: parseInt(formData.frontCamera),
      rearCamera: parseInt(formData.rearCamera),
      battery: parseInt(formData.battery),
      processor: formData.processor,
      price: parseInt(formData.price),
      stock: parseInt(formData.stock),
      status: formData.status,
      condition: formData.condition,
      location: formData.location,
      images: formData.images
    };

    updateMobileMutation.mutate({ mobileId: mobile._id, mobileData });
  };

  const renderStepIndicator = () => {
    return (
      <View style={styles.stepIndicator}>
        {[1, 2, 3].map((step) => (
          <View key={step} style={styles.stepItem}>
            <View style={[
              styles.stepCircle,
              currentStep === step && styles.stepCircleActive
            ]}>
              <Text style={[
                styles.stepNumber,
                currentStep === step && styles.stepNumberActive
              ]}>
                {step}
              </Text>
            </View>
            <Text style={[
              styles.stepLabel,
              currentStep === step && styles.stepLabelActive
            ]}>
              {step === 1 ? 'Basic Info' : step === 2 ? 'Specs & Price' : 'Details'}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const renderStep1 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Basic Information</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Brand *</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.brandScroll}>
          {brands.map((brand) => (
            <TouchableOpacity
              key={brand.value}
              style={[
                styles.brandChip,
                formData.brand === brand.value && styles.brandChipActive
              ]}
              onPress={() => updateFormData('brand', brand.value)}
            >
              <Text style={[
                styles.brandChipText,
                formData.brand === brand.value && styles.brandChipTextActive
              ]}>
                {brand.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Model *</Text>
        <TextInput style={styles.textInput} value={formData.model} onChangeText={(value) => updateFormData('model', value)} placeholder="e.g. iPhone 15 Pro Max" placeholderTextColor={colors.textMuted} />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Processor</Text>
        <TextInput style={styles.textInput} value={formData.processor} onChangeText={(value) => updateFormData('processor', value)} placeholder="e.g. Snapdragon 8 Gen 3" placeholderTextColor={colors.textMuted} />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Mobile Image</Text>
        <View style={styles.singleImageContainer}>
          {formData.images && formData.images.length > 0 ? (
            <View style={styles.singleImageWrapper}>
              <Image source={{ uri: formData.images[0] }} style={styles.singleImagePreview} />
              <TouchableOpacity 
                style={styles.singleRemoveImageButton}
                onPress={() => {
                  setFormData(prev => ({
                    ...prev,
                    images: []
                  }));
                }}
              >
                <Ionicons name="close-circle" size={24} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.changeImageButton}
                onPress={showImagePickerOptions}
              >
                <Ionicons name="camera" size={16} color={colors.textLight} />
                <Text style={styles.changeImageText}>Change</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.singleImagePlaceholder} onPress={showImagePickerOptions}>
              {uploadingImage ? (
                <ActivityIndicator size="large" color={colors.primary} />
              ) : (
                <>
                  <Ionicons name="camera" size={48} color={colors.textMuted} />
                  <Text style={styles.singleImageUploadText}>Upload image</Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Specifications & Price</Text>
      
      <View style={styles.inputRow}>
        <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
          <Text style={styles.inputLabel}>RAM (GB) *</Text>
          <TextInput style={styles.textInput} value={formData.ram} onChangeText={(value) => updateFormData('ram', value)} placeholder="8" placeholderTextColor={colors.textMuted} keyboardType="numeric" />
        </View>
        
        <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
          <Text style={styles.inputLabel}>Storage (GB) *</Text>
          <TextInput style={styles.textInput} value={formData.storage} onChangeText={(value) => updateFormData('storage', value)} placeholder="256" placeholderTextColor={colors.textMuted} keyboardType="numeric" />
        </View>
      </View>

      <View style={styles.inputRow}>
        <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
          <Text style={styles.inputLabel}>Screen (inches)</Text>
          <TextInput style={styles.textInput} value={formData.screenSize} onChangeText={(value) => updateFormData('screenSize', value)} placeholder="6.7" placeholderTextColor={colors.textMuted} keyboardType="numeric" />
        </View>
        
        <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
          <Text style={styles.inputLabel}>Battery (mAh)</Text>
          <TextInput style={styles.textInput} value={formData.battery} onChangeText={(value) => updateFormData('battery', value)} placeholder="5000" placeholderTextColor={colors.textMuted} keyboardType="numeric" />
        </View>
      </View>

      <View style={styles.inputRow}>
        <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
          <Text style={styles.inputLabel}>Front Camera (MP)</Text>
          <TextInput style={styles.textInput} value={formData.frontCamera} onChangeText={(value) => updateFormData('frontCamera', value)} placeholder="12" placeholderTextColor={colors.textMuted} keyboardType="numeric" />
        </View>
        
        <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
          <Text style={styles.inputLabel}>Rear Camera (MP)</Text>
          <TextInput style={styles.textInput} value={formData.rearCamera} onChangeText={(value) => updateFormData('rearCamera', value)} placeholder="48" placeholderTextColor={colors.textMuted} keyboardType="numeric" />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Price (PKR) *</Text>
        <TextInput style={styles.textInput} value={formData.price} onChangeText={(value) => updateFormData('price', value)} placeholder="150000" placeholderTextColor={colors.textMuted} keyboardType="numeric" />
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Additional Details</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Condition</Text>
        <View style={styles.conditionContainer}>
          {conditions.map((condition) => (
            <TouchableOpacity
              key={condition.value}
              style={[
                styles.conditionChip,
                formData.condition === condition.value && styles.conditionChipActive
              ]}
              onPress={() => updateFormData('condition', condition.value)}
            >
              <Text style={[
                styles.conditionChipText,
                formData.condition === condition.value && styles.conditionChipTextActive
              ]}>
                {condition.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.inputRow}>
        <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
          <Text style={styles.inputLabel}>Stock Quantity</Text>
          <View style={styles.quantityContainer}>
            <TouchableOpacity 
              style={[styles.quantityButton, styles.quantityButtonLeft]}
              onPress={() => {
                const currentStock = parseInt(formData.stock) || 1;
                if (currentStock > 1) {
                  updateFormData('stock', (currentStock - 1).toString());
                }
              }}
            >
              <Ionicons name="remove" size={16} color={colors.primary} />
            </TouchableOpacity>
            <TextInput 
              style={[styles.quantityInput, { flex: 1 }]} 
              value={formData.stock} 
              onChangeText={(value) => updateFormData('stock', value)} 
              placeholder="1" 
              placeholderTextColor={colors.textMuted} 
              keyboardType="numeric"
              textAlign="center"
            />
            <TouchableOpacity 
              style={[styles.quantityButton, styles.quantityButtonRight]}
              onPress={() => {
                const currentStock = parseInt(formData.stock) || 1;
                updateFormData('stock', (currentStock + 1).toString());
              }}
            >
              <Ionicons name="add" size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Location</Text>
        <TextInput style={styles.textInput} value={formData.location} onChangeText={(value) => updateFormData('location', value)} placeholder="e.g. Lahore, Pakistan" placeholderTextColor={colors.textMuted} />
      </View>
    </View>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      default:
        return renderStep1();
    }
  };

  return (
    <>
      <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={handleClose}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={colors.textMuted} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Update Mobile</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Content */}
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          {renderCurrentStep()}
        </ScrollView>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.backButton]} 
            onPress={handleBack}
            disabled={currentStep === 1}
          >
            <Ionicons name="chevron-back" size={20} color={currentStep === 1 ? colors.textMuted : colors.primary} />
            <Text style={[
              styles.actionButtonText,
              currentStep === 1 && styles.actionButtonTextDisabled
            ]}>
              Back
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, styles.nextButton]} 
            onPress={currentStep === totalSteps ? handleSubmit : handleNext}
            disabled={updateMobileMutation.isLoading}
          >
            {updateMobileMutation.isLoading ? (
              <ActivityIndicator size="small" color={colors.textLight} />
            ) : (
              <>
                <Text style={styles.nextButtonText}>
                  {currentStep === totalSteps ? 'Update' : 'Next'}
                </Text>
                {currentStep < totalSteps && (
                  <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
                )}
              </>
            )}
          </TouchableOpacity>
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
    </>
  );
};

export default UpdateMobileForm;
