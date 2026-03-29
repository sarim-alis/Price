import { colors } from "./colors";

export const sellerDashboardStyles = {
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingBottom: 60
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
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.textPrimary,
  },
  seeAll: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "600",
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
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
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
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textLight,
  },
  orderCustomer: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  orderProduct: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 8,
  },
  orderAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primary,
  },
  actionsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
    marginTop: 8,
    textAlign: "center",
  },
  mobilesList: {
    gap: 12,
  },
  mobileCard: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
    alignItems: "center",
  },
  mobileImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: colors.backgroundDark,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  mobileImageImg: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  mobileInfo: {
    flex: 1,
  },
  mobileBrand: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  mobileModel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  mobilePrice: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.primary,
    marginTop: 4,
  },
  mobileCondition: {
    marginTop: 6,
  },
  conditionText: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.textLight,
    backgroundColor: "#b45309", // amber/brown color
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: "flex-start", // only take width of text
  },
  // Loading and empty states
  loadingContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    gap: 8,
  },
  loadingText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 30,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textSecondary,
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 4,
  },
};
