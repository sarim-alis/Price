import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { getMobileById } from "../../services/api";
import { colors } from "../../styles/colors";

const { width } = Dimensions.get("window");

function SpecRow({ icon, label, value }) {
  return (
    <View style={styles.specRow}>
      <Ionicons name={icon} size={20} color={colors.primary} style={styles.specIcon} />
      <Text style={styles.specLabel}>{label}</Text>
      <Text style={styles.specValue}>{value}</Text>
    </View>
  );
}

export default function MobileDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { data: mobile, isLoading, isError, error } = useQuery({
    queryKey: ["mobile", id],
    queryFn: () => getMobileById(id),
    enabled: !!id,
  });

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

  const openChat = () => {
    if (sellerId) {
      router.push({
        pathname: "/chat/[sellerId]",
        params: { sellerId, sellerName, mobileTitle: `${mobile.brand} ${mobile.model}` },
      });
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Device Details</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Image */}
        <View style={styles.imageSection}>
          {hasImages ? (
            <Image
              source={{ uri: mobile.images[0] }}
              style={styles.mainImage}
              resizeMode="contain"
            />
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

        {/* Seller */}
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
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  backBtn: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.textPrimary,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  errorText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  imageSection: {
    backgroundColor: colors.surface,
    padding: 16,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  mainImage: {
    width: width * 0.6,
    height: width * 0.6,
  },
  imagePlaceholder: {
    width: width * 0.6,
    height: width * 0.5,
    backgroundColor: colors.backgroundDark,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  priceConditionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    gap: 12,
  },
  price: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
  },
  conditionChip: {
    backgroundColor: colors.backgroundDark,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  conditionChipText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textSecondary,
    textTransform: "capitalize",
  },
  titleSection: {
    padding: 16,
    backgroundColor: colors.surface,
    marginTop: 8,
  },
  brand: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  model: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginTop: 4,
  },
  section: {
    padding: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 12,
  },
  specsCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  specRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  specIcon: {
    marginRight: 12,
  },
  specLabel: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
  },
  specValue: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  sellerCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  sellerAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  sellerInfo: {
    flex: 1,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.textPrimary,
  },
  sellerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 6,
  },
  sellerDetail: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  contactBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  contactBtnText: {
    color: colors.textLight,
    fontSize: 13,
    fontWeight: "600",
    marginTop: 2,
  },
});
