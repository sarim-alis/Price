// Imports.
import { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery } from "@tanstack/react-query";
import { getMobilesBySellerId } from "../../services/api";
import { colors } from "../../styles/colors";
import { sellerProductsStyles as styles } from "../../styles/seller-products";

export default function SellerProducts() {
  const router = useRouter();
  const [sellerId, setSellerId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5;

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

  const { data: mobiles = [], isLoading, isError, error } = useQuery({
    queryKey: ["sellerMobiles", sellerId],
    queryFn: () => getMobilesBySellerId(sellerId),
    enabled: !!sellerId,
  });

  const totalPages = Math.ceil(mobiles.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = mobiles.slice(startIndex, endIndex);

  const handleViewDetails = (mobileId) => {
    router.push(`/mobile/${mobileId}`);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
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
          <Text style={styles.headerSubtitle}>{mobiles.length} total listings</Text>
        </View>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color={colors.textLight} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {currentProducts.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="cube-outline" size={64} color={colors.textMuted} />
            <Text style={styles.emptyText}>No products yet</Text>
            <Text style={styles.emptySubtext}>Start adding your mobile listings</Text>
          </View>
        ) : (
          currentProducts.map((mobile) => (
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
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleViewDetails(mobile._id)}
                >
                  <Ionicons name="eye-outline" size={20} color={colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="create-outline" size={20} color={colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="trash-outline" size={20} color={colors.error} />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        {totalPages > 1 && (
          <View style={styles.pagination}>
            <TouchableOpacity 
              style={[styles.pageButton, currentPage === 1 && styles.pageButtonDisabled]}
              onPress={handlePrevPage}
              disabled={currentPage === 1}
            >
              <Ionicons name="chevron-back" size={20} color={currentPage === 1 ? colors.textMuted : colors.primary} />
            </TouchableOpacity>
            
            <Text style={styles.pageText}>
              Page {currentPage} of {totalPages}
            </Text>
            
            <TouchableOpacity 
              style={[styles.pageButton, currentPage === totalPages && styles.pageButtonDisabled]}
              onPress={handleNextPage}
              disabled={currentPage === totalPages}
            >
              <Ionicons name="chevron-forward" size={20} color={currentPage === totalPages ? colors.textMuted : colors.primary} />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
