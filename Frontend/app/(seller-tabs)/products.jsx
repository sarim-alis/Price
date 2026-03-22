// Imports.
import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../styles/colors";
import { sellerProductsStyles as styles } from "../../styles/seller-products";

export default function SellerProducts() {
  const [products] = useState([
    { id: 1, name: "iPhone 14 Pro Max", brand: "Apple", price: "₨ 425,000", stock: 12, status: "Active" },
    { id: 2, name: "Samsung Galaxy S23 Ultra", brand: "Samsung", price: "₨ 389,000", stock: 8, status: "Active" },
    { id: 3, name: "Google Pixel 8 Pro", brand: "Google", price: "₨ 285,000", stock: 5, status: "Active" },
    { id: 4, name: "OnePlus 12", brand: "OnePlus", price: "₨ 195,000", stock: 15, status: "Active" },
    { id: 5, name: "Xiaomi 14 Pro", brand: "Xiaomi", price: "₨ 165,000", stock: 0, status: "Out of Stock" },
    { id: 6, name: "Oppo Find X7", brand: "Oppo", price: "₨ 145,000", stock: 10, status: "Active" },
  ]);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>My Products</Text>
          <Text style={styles.headerSubtitle}>Manage your product listings</Text>
        </View>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color={colors.textLight} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {products.map((product) => (
          <View key={product.id} style={styles.productCard}>
            <View style={styles.productImage}>
              <Ionicons name="phone-portrait" size={40} color={colors.textMuted} />
            </View>
            
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productBrand}>{product.brand}</Text>
              <View style={styles.productFooter}>
                <Text style={styles.productPrice}>{product.price}</Text>
                <View style={[
                  styles.statusBadge,
                  product.status === "Active" && styles.statusActive,
                  product.status === "Out of Stock" && styles.statusOutOfStock,
                ]}>
                  <Text style={styles.statusText}>{product.status}</Text>
                </View>
              </View>
              <Text style={styles.stockText}>Stock: {product.stock} units</Text>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="create-outline" size={20} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="trash-outline" size={20} color={colors.error} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
