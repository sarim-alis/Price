 import { Dimensions } from "react-native";
import { colors } from "./colors";

const { width } = Dimensions.get("window");

export const detailStyles = {
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
  predictionCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  predictionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  predictionLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  predictionValue: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  predictionHighlight: {
    color: colors.primary,
    fontSize: 18,
  },
  trendBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  trendUp: {
    backgroundColor: colors.success,
  },
  trendDown: {
    backgroundColor: colors.error,
  },
  trendText: {
    color: colors.textLight,
    fontSize: 13,
    fontWeight: "600",
  },
  predictionNote: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 8,
    fontStyle: "italic",
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
  bottomActions: {
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  buyNowButton: {
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 8,
  },
  buyNowText: {
    color: colors.textLight,
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
};