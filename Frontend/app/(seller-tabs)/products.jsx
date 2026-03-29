// Imports.
import { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { getMobilesBySellerId, deleteMobile } from "../../services/api";
import AddMobileForm from "../../components/AddMobileForm";
import { colors } from "../../styles/colors";
import { sellerProductsStyles as styles } from "../../styles/seller-products";


// Frontend.
export default function SellerProducts() {
  // States.
  const router = useRouter();
  const queryClient = useQueryClient();
  const [sellerId, setSellerId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [addModalVisible, setAddModalVisible] = useState(false);

  // Get user data.
  useEffect(() => {
    const getUserData = async () => {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        setSellerId(user.id);
      }
    };
    getUserData();
  }, []);

  // Query.
  const { data: mobilesData, isLoading, isError, error } = useQuery({
    queryKey: ["sellerMobiles", sellerId, currentPage],
    queryFn: () => getMobilesBySellerId(sellerId, currentPage, 3),
    enabled: !!sellerId,
  });

  const mobiles = mobilesData?.mobiles || [];
  const totalPages = mobilesData?.pages || 1;
  const total = mobilesData?.total || 0;

  // Delete mobile.
  const deleteMobileMutation = useMutation({
    mutationFn: deleteMobile,
    onSuccess: () => {
      queryClient.invalidateQueries(['sellerMobiles']);
      if (mobiles.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    },
    onError: (error) => {
      Alert.alert("Error", error.message || "Failed to delete mobile");
    }
  });

  const handleViewDetails = (mobileId) => {
    router.push(`/mobile/${mobileId}`);
  };

  const handleDeleteMobile = (mobileId, mobileModel) => {
    Alert.alert(
      "Delete Mobile",
      `Are you sure you want to delete ${mobileModel}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteMobileMutation.mutate(mobileId)
        }
      ]
    );
  };

  const handleAddMobile = () => {
    setAddModalVisible(true);
  };

  const handleAddSuccess = () => {
    queryClient.invalidateQueries(['sellerMobiles']);
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>My Products</Text>
            <Text style={styles.headerSubtitle}>Manage your product listings</Text>
          </View>
        </View>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>My Products</Text>
            <Text style={styles.headerSubtitle}>Manage your product listings</Text>
          </View>
        </View>
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error?.message || "Failed to load products"}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>My Products</Text>
          <Text style={styles.headerSubtitle}>{total} total listings</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={handleAddMobile}>
          <Ionicons name="add" size={24} color={colors.textLight} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {mobiles.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="cube-outline" size={64} color={colors.textMuted} />
            <Text style={styles.emptyText}>No products yet</Text>
            <Text style={styles.emptySubtext}>Start adding your mobile listings</Text>
          </View>
        ) : (
          mobiles.map((mobile) => (
            <View key={mobile._id} style={styles.productCard}>
              <View style={styles.productImage}>
                {mobile.images && mobile.images.length > 0 ? (
                  <Image source={{ uri: mobile.images[0] }} style={styles.productImageImg} />
                ) : (
                  <Ionicons name="phone-portrait" size={40} color={colors.textMuted} />
                )}
              </View>
              
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{mobile.brand} {mobile.model}</Text>
                <Text style={styles.productBrand}>{mobile.storage}GB • {mobile.ram}GB RAM</Text>
                <View style={styles.productFooter}>
                  <Text style={styles.productPrice}>Rs. {mobile.price?.toLocaleString()}</Text>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>{mobile.condition || "Used"}</Text>
                  </View>
                </View>
                {mobile.location && (
                  <Text style={styles.stockText}>📍 {mobile.location}</Text>
                )}
              </View>

              <View style={styles.actions}>
                <TouchableOpacity style={styles.actionButton} onPress={() => handleViewDetails(mobile._id)}>
                  <Ionicons name="eye-outline" size={20} color={colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="create-outline" size={20} color={colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={() => handleDeleteMobile(mobile._id, mobile.model)} disabled={deleteMobileMutation.isLoading}>
                  <Ionicons name="trash-outline" size={20} color={colors.error} />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        {totalPages > 1 && (
          <View style={styles.circularPagination}>
            {Array.from({ length: totalPages }, (_, index) => (
              <TouchableOpacity key={index} style={[styles.paginationDot, currentPage === index + 1 && styles.paginationDotActive]} onPress={() => setCurrentPage(index + 1)}>
                <Text style={[styles.paginationDotText, currentPage === index + 1 && styles.paginationDotTextActive]}>
                  {index + 1}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Add Mobile Modal */}
      <AddMobileForm visible={addModalVisible} onClose={() => setAddModalVisible(false)} onSuccess={handleAddSuccess} />
    </SafeAreaView>
  );
}
