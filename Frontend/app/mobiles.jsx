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
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { getMobiles } from "../services/api";
import { colors } from "../styles/colors";

const { width } = Dimensions.get("window");
const CARD_GAP = 12;
const PAD = 16;
const COLS = 2;
const CARD_WIDTH = (width - PAD * 2 - CARD_GAP) / COLS;

export default function MobilesScreen() {
  const router = useRouter();
  const { category = "Mobiles", brand } = useLocalSearchParams();
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["mobiles", category, brand],
    queryFn: () => getMobiles({ limit: 50, ...(brand && { brand }) }),
  });

  const mobiles = data?.mobiles ?? [];
  const headerTitle = category || (brand ? brand.charAt(0).toUpperCase() + brand.slice(1) : "Mobiles");

  if (isLoading && !isRefetching) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{headerTitle}</Text>
        </View>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading mobiles...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{headerTitle}</Text>
        </View>
        <View style={styles.centered}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.textMuted} />
          <Text style={styles.errorText}>{error?.message || "Something went wrong"}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
            <Text style={styles.retryBtnText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{headerTitle}</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} colors={[colors.primary]} />
        }
      >
        {mobiles.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="phone-portrait-outline" size={64} color={colors.textMuted} />
            <Text style={styles.emptyText}>No mobiles in this category yet.</Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {mobiles.map((mobile) => (
              <TouchableOpacity
                key={mobile._id}
                style={styles.card}
                onPress={() => router.push({ pathname: "/mobile/[id]", params: { id: mobile._id } })}
                activeOpacity={0.8}
              >
                <View style={styles.cardImageWrap}>
                  {mobile.images?.[0] ? (
                    <Image source={{ uri: mobile.images[0] }} style={styles.cardImage} resizeMode="contain" />
                  ) : (
                    <View style={styles.cardImagePlaceholder}>
                      <Ionicons name="phone-portrait-outline" size={40} color={colors.textMuted} />
                    </View>
                  )}
                  {mobile.condition && (
                    <View style={styles.conditionBadge}>
                      <Text style={styles.conditionText}>{mobile.condition}</Text>
                    </View>
                  )}
                </View>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardBrand}>{mobile.brand}</Text>
                  <Text style={styles.cardModel} numberOfLines={2}>{mobile.model}</Text>
                  <Text style={styles.cardPrice}>Rs. {mobile.price?.toLocaleString()}</Text>
                  {mobile.prediction && (
                    <View style={styles.predictionRow}>
                      <Text style={styles.predictionLabel}>Pred: Rs. {mobile.prediction.predictedPrice?.toLocaleString()}</Text>
                      <View style={[styles.trendDot, mobile.prediction.trend === "up" ? styles.trendUp : styles.trendDown]} />
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
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
    padding: PAD,
    paddingBottom: 40,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.textSecondary,
  },
  errorText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
  },
  retryBtn: {
    marginTop: 16,
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryBtnText: {
    color: colors.textLight,
    fontWeight: "600",
  },
  empty: {
    alignItems: "center",
    paddingVertical: 48,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: CARD_GAP,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: colors.surface,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.borderLight,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  cardImageWrap: {
    width: "100%",
    height: CARD_WIDTH * 0.9,
    backgroundColor: colors.backgroundDark,
    position: "relative",
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  cardImagePlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  conditionBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  conditionText: {
    color: colors.textLight,
    fontSize: 10,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  cardInfo: {
    padding: 10,
  },
  cardBrand: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  cardModel: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
    marginTop: 2,
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginTop: 6,
  },
  predictionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 4,
  },
  predictionLabel: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  trendDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  trendUp: {
    backgroundColor: colors.success,
  },
  trendDown: {
    backgroundColor: colors.error,
  },
});
