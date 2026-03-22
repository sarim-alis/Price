import { colors } from "./colors";

export const sellerOrdersStyles = {
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  orderCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  orderId: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.textPrimary,
  },
  orderDate: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusPending: {
    backgroundColor: colors.warning,
  },
  statusProcessing: {
    backgroundColor: colors.info,
  },
  statusShipped: {
    backgroundColor: colors.primary,
  },
  statusDelivered: {
    backgroundColor: colors.success,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textLight,
  },
  orderBody: {
    marginBottom: 12,
  },
  orderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  orderLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  orderValue: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  orderTotal: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.primary,
  },
  detailsButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  detailsButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textLight,
  },
};
