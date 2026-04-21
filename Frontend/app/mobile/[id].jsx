// Imports.
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";
import { getMobileById, getOrCreateConversation } from "../../services/api";
import { predictPriceTrend } from "../../services/prediction";
import { colors } from "../../styles/colors";
import { detailStyles as styles } from "../../styles/detail";

// Spec row.
function SpecRow({ icon, label, value }) {
  return (
    <View style={styles.specRow}>
      <Ionicons name={icon} size={20} color={colors.primary} style={styles.specIcon} />
      <Text style={styles.specLabel}>{label}</Text>
      <Text style={styles.specValue}>{value}</Text>
    </View>
  );
}

// Frontend.
export default function MobileDetailScreen() {
  // States.
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [currentUserId, setCurrentUserId] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loadingPrediction, setLoadingPrediction] = useState(false);
  const { data: mobile, isLoading, isError, error } = useQuery({queryKey: ["mobile", id], queryFn: () => getMobileById(id), enabled: !!id});

  // Get current user
  useEffect(() => {
    const getUserData = async () => {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        setCurrentUserId(user.id);
      }
    };
    getUserData();
  }, []);

  useEffect(() => {
    const fetchPrediction = async () => {
      if (mobile) {
        setLoadingPrediction(true);
        try {
          const result = await predictPriceTrend(mobile);
          setPrediction(result);
        } catch (error) {
          console.error('Failed to fetch prediction:', error);
        } finally {
          setLoadingPrediction(false);
        }
      }
    };
    fetchPrediction();
  }, [mobile]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Device</Text>
        </View>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (isError || !mobile) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Device</Text>
        </View>
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error?.message || "Device not found"}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const seller = mobile.sellerId;
  const sellerId = seller?._id ?? seller;
  const sellerName = seller?.name || "Seller";
  const hasImages = mobile.images?.length > 0;

  const openChat = async () => {
    if (!sellerId) return;
    
    try {
      // Create or get existing conversation
      const conversation = await getOrCreateConversation(sellerId, id);
      
      // Navigate to chat screen with conversation ID
      router.push({
        pathname: "/chat/[conversationId]",
        params: { 
          conversationId: conversation._id,
          otherUserName: sellerName,
          otherUserId: sellerId
        },
      });
    } catch (error) {
      console.error('Failed to open chat:', error);
      alert('Failed to open chat. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Device details. */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Device Details</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Image */}
        <View style={styles.imageSection}>
          {hasImages ? (
            <Image source={{ uri: mobile.images[0] }} style={styles.mainImage} resizeMode="contain" />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="phone-portrait-outline" size={80} color={colors.textMuted} />
            </View>
          )}
          <View style={styles.priceConditionRow}>
            <Text style={styles.price}>Rs. {mobile.price?.toLocaleString()}</Text>
            <View style={styles.conditionChip}>
              <Text style={styles.conditionChipText}>{mobile.condition || "used"}</Text>
            </View>
          </View>
        </View>

        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.brand}>{mobile.brand}</Text>
          <Text style={styles.model}>{mobile.model}</Text>
        </View>

        {/* Price Prediction - Hide if current user is the seller */}
        {currentUserId !== sellerId && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>AI Price Prediction</Text>
            {loadingPrediction ? (
              <View style={styles.predictionCard}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={{ color: colors.textSecondary, marginTop: 8 }}>Analyzing market data...</Text>
              </View>
            ) : prediction ? (
              <View style={styles.predictionCard}>
                <View style={styles.predictionRow}>
                  <Text style={styles.predictionLabel}>Current</Text>
                  <Text style={styles.predictionValue}>Rs. {mobile.price?.toLocaleString()}</Text>
                </View>
                <View style={styles.predictionRow}>
                  <Text style={styles.predictionLabel}>AI Trend</Text>
                  <View style={[styles.trendBadge, prediction.prediction === "increase" ? styles.trendUp : styles.trendDown]}>
                    <Ionicons
                      name={prediction.prediction === "increase" ? "trending-up" : "trending-down"}
                      size={16}
                      color={colors.textLight}
                    />
                    <Text style={styles.trendText}>{prediction.prediction === "increase" ? "Increase" : "Decrease"}</Text>
                  </View>
                </View>
                <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 8 }}>
                  Based on AI analysis of specs and market data
                </Text>
              </View>
            ) : null}
          </View>
        )}

        {/* Device specs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Specifications</Text>
          <View style={styles.specsCard}>
            <SpecRow icon="hardware-chip-outline" label="Processor" value={mobile.processor || "—"} />
            <SpecRow icon="phone-portrait-outline" label="RAM" value={`${mobile.ram} GB`} />
            <SpecRow icon="save-outline" label="Storage" value={`${mobile.storage} GB`} />
            <SpecRow icon="tablet-portrait-outline" label="Screen" value={`${mobile.screenSize}"`} />
            <SpecRow icon="camera-outline" label="Front camera" value={`${mobile.frontCamera} MP`} />
            <SpecRow icon="camera-reverse-outline" label="Rear camera" value={`${mobile.rearCamera} MP`} />
            <SpecRow icon="battery-charging-outline" label="Battery" value={`${mobile.battery} mAh`} />
            {mobile.location ? (
              <SpecRow icon="location-outline" label="Location" value={mobile.location} />
            ) : null}
          </View>
        </View>

        {/* Seller - Hide if current user is the seller */}
        {currentUserId !== sellerId && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Seller</Text>
            <View style={styles.sellerCard}>
              <View style={styles.sellerAvatar}>
                <Ionicons name="person" size={28} color={colors.textLight} />
              </View>
              <View style={styles.sellerInfo}>
                <Text style={styles.sellerName}>{seller?.name || "Seller"}</Text>
                {seller?.email ? (
                  <View style={styles.sellerRow}>
                    <Ionicons name="mail-outline" size={16} color={colors.textSecondary} />
                    <Text style={styles.sellerDetail}>{seller.email}</Text>
                  </View>
                ) : null}
                {seller?.phone ? (
                  <View style={styles.sellerRow}>
                    <Ionicons name="call-outline" size={16} color={colors.textSecondary} />
                    <Text style={styles.sellerDetail}>{seller.phone}</Text>
                  </View>
                ) : null}
              </View>
              <TouchableOpacity style={styles.contactBtn} onPress={openChat} activeOpacity={0.8}>
                <Ionicons name="chatbubble-outline" size={20} color={colors.textLight} />
                <Text style={styles.contactBtnText}>Chat</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom Action Buttons - Hide if current user is the seller */}
      {/* {currentUserId !== sellerId && (
        <View style={styles.bottomActions}>
          <TouchableOpacity 
            style={styles.buyNowButton} 
            onPress={() => router.push({
              pathname: '/checkout/[mobileId]',
              params: { mobileId: id }
            })}
            activeOpacity={0.8}
          >
            <Ionicons name="card-outline" size={20} color={colors.textLight} />
            <Text style={styles.buyNowText}>Buy Now</Text>
          </TouchableOpacity>
        </View>
      )} */}
    </SafeAreaView>
  );
}

