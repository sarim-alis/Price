import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../styles/colors";
import { sellerOrdersStyles as styles } from "../../styles/seller-orders";

export default function SellerOrders() {
  const [orders] = useState([
    { id: "ORD-001", customer: "Ali Ahmed", product: "iPhone 14 Pro Max", quantity: 1, total: "₨ 425,000", status: "Pending", date: "2024-03-20" },
    { id: "ORD-002", customer: "Sara Khan", product: "Samsung Galaxy S23", quantity: 2, total: "₨ 778,000", status: "Processing", date: "2024-03-19" },
    { id: "ORD-003", customer: "Hassan Raza", product: "Google Pixel 8", quantity: 1, total: "₨ 285,000", status: "Shipped", date: "2024-03-18" },
    { id: "ORD-004", customer: "Fatima Noor", product: "OnePlus 12", quantity: 1, total: "₨ 195,000", status: "Delivered", date: "2024-03-17" },
    { id: "ORD-005", customer: "Usman Ali", product: "Xiaomi 14 Pro", quantity: 3, total: "₨ 495,000", status: "Pending", date: "2024-03-16" },
  ]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending": return "time-outline";
      case "Processing": return "cube-outline";
      case "Shipped": return "car-outline";
      case "Delivered": return "checkmark-circle-outline";
      default: return "time-outline";
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Orders</Text>
          <Text style={styles.headerSubtitle}>Track and manage your orders</Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {orders.map((order) => (
          <View key={order.id} style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <View>
                <Text style={styles.orderId}>{order.id}</Text>
                <Text style={styles.orderDate}>{order.date}</Text>
              </View>
              <View style={[
                styles.statusBadge,
                order.status === "Pending" && styles.statusPending,
                order.status === "Processing" && styles.statusProcessing,
                order.status === "Shipped" && styles.statusShipped,
                order.status === "Delivered" && styles.statusDelivered,
              ]}>
                <Ionicons name={getStatusIcon(order.status)} size={16} color={colors.textLight} />
                <Text style={styles.statusText}>{order.status}</Text>
              </View>
            </View>

            <View style={styles.orderBody}>
              <View style={styles.orderRow}>
                <Text style={styles.orderLabel}>Customer</Text>
                <Text style={styles.orderValue}>{order.customer}</Text>
              </View>
              <View style={styles.orderRow}>
                <Text style={styles.orderLabel}>Product</Text>
                <Text style={styles.orderValue}>{order.product}</Text>
              </View>
              <View style={styles.orderRow}>
                <Text style={styles.orderLabel}>Quantity</Text>
                <Text style={styles.orderValue}>{order.quantity}</Text>
              </View>
            </View>

            <View style={styles.orderFooter}>
              <Text style={styles.orderTotal}>{order.total}</Text>
              <TouchableOpacity style={styles.detailsButton}>
                <Text style={styles.detailsButtonText}>View Details</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
