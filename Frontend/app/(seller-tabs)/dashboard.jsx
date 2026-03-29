// Imports.
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../styles/colors";
import { sellerDashboardStyles as styles } from "../../styles/seller-dashboard";


// Frontend.
export default function SellerDashboard() {
  const stats = [
    { title: "Active Listings", value: "24", icon: "phone-portrait", color: colors.info },
    { title: "Total Sales", value: "156", icon: "cart", color: colors.success },
    { title: "Pending Orders", value: "8", icon: "cube", color: colors.warning },
    { title: "Revenue", value: "₨ 245K", icon: "trending-up", color: colors.primary },
  ];

  const recentOrders = [
    { id: "ORD-001", customer: "Ali Ahmed", product: "iPhone 14 Pro", amount: "₨ 425,000", status: "Pending" },
    { id: "ORD-002", customer: "Sara Khan", product: "Samsung S23", amount: "₨ 389,000", status: "Processing" },
    { id: "ORD-003", customer: "Hassan Raza", product: "Google Pixel 8", amount: "₨ 285,000", status: "Shipped" },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Dashboard</Text>
          <Text style={styles.headerSubtitle}>Track your sales and manage listings</Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: stat.color }]}>
                <Ionicons name={stat.icon} size={24} color={colors.textLight} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statTitle}>{stat.title}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Orders</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          {recentOrders.map((order) => (
            <View key={order.id} style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <Text style={styles.orderId}>{order.id}</Text>
                <View style={[
                  styles.statusBadge,
                  order.status === "Pending" && styles.statusPending,
                  order.status === "Processing" && styles.statusProcessing,
                  order.status === "Shipped" && styles.statusShipped,
                ]}>
                  <Text style={styles.statusText}>{order.status}</Text>
                </View>
              </View>
              <Text style={styles.orderCustomer}>{order.customer}</Text>
              <Text style={styles.orderProduct}>{order.product}</Text>
              <Text style={styles.orderAmount}>{order.amount}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionCard}>
              <Ionicons name="add-circle" size={32} color={colors.primary} />
              <Text style={styles.actionText}>Add Product</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <Ionicons name="stats-chart" size={32} color={colors.success} />
              <Text style={styles.actionText}>View Analytics</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
