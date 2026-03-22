import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../styles/colors";
import { sellerAccountStyles as styles } from "../../styles/seller-account";

export default function SellerAccount() {
  const router = useRouter();

  const menuItems = [
    { icon: "person-outline", title: "Edit Profile", subtitle: "Update your personal information" },
    { icon: "storefront-outline", title: "Shop Settings", subtitle: "Manage your shop details" },
    { icon: "stats-chart-outline", title: "Analytics", subtitle: "View detailed sales reports" },
    { icon: "card-outline", title: "Payment Methods", subtitle: "Manage payment options" },
    { icon: "notifications-outline", title: "Notifications", subtitle: "Configure notification preferences" },
    { icon: "help-circle-outline", title: "Help & Support", subtitle: "Get help with your account" },
  ];

  const handleSwitchRole = () => {
    router.replace("/role-selection");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Account</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={40} color={colors.textLight} />
          </View>
          <Text style={styles.userName}>Seller Name</Text>
          <Text style={styles.userEmail}>seller@example.com</Text>
          <View style={styles.roleBadge}>
            <Ionicons name="storefront" size={16} color={colors.success} />
            <Text style={styles.roleText}>Seller Account</Text>
          </View>
        </View>

        <View style={styles.section}>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem}>
              <View style={styles.menuIcon}>
                <Ionicons name={item.icon} size={24} color={colors.primary} />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.switchButton} onPress={handleSwitchRole}>
            <Ionicons name="swap-horizontal" size={20} color={colors.primary} />
            <Text style={styles.switchButtonText}>Switch to Buyer Mode</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={20} color={colors.error} />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
