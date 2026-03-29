// Imports.
import { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getMobilesBySellerId, getUserConversations } from "../../services/api";
import { colors } from "../../styles/colors";
import { sellerDashboardStyles as styles } from "../../styles/seller-dashboard";
import AddMobileForm from "../../components/AddMobileForm";


// Frontend.
export default function SellerDashboard() {
  // States.
  const router = useRouter();
  const queryClient = useQueryClient();
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [sellerId, setSellerId] = useState(null);

  // Get user data.
  useEffect(() => {
    const getUserData = async () => {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        setSellerId(user.id);
      }
    };
    getUserData();
  }, []);

  // Fetch mobiles.
  const { data: mobilesData, isLoading: mobilesLoading } = useQuery({
    queryKey: ["sellerMobiles", sellerId],
    queryFn: () => getMobilesBySellerId(sellerId, 1, 3), // Get first page, 3 items
    enabled: !!sellerId,
  });

  // Fetch conversations to count unique buyers
  const { data: conversationsData } = useQuery({
    queryKey: ["userConversations", sellerId],
    queryFn: getUserConversations,
    enabled: !!sellerId,
  });

  const recentMobiles = mobilesData?.mobiles?.slice(0, 3) || [];
  const totalMobiles = mobilesData?.total || 0;
  
  // Count unique buyers from conversations
  const uniqueBuyers = conversationsData?.reduce((unique, conversation) => {
    const otherUserId = conversation.participants?.find(id => id !== sellerId);
    if (otherUserId) {
      unique.add(otherUserId);
    }
    return unique;
  }, new Set()).size || 0;
  
  const stats = [
    { title: "Total Mobiles", value: totalMobiles.toString(), icon: "phone-portrait", color: colors.primary },
    { title: "Total Buyers", value: uniqueBuyers.toString(), icon: "people", color: colors.success },
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
            <Text style={styles.sectionTitle}>Recent Mobiles</Text>
            <TouchableOpacity onPress={() => router.push('/(seller-tabs)/products')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          {mobilesLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={styles.loadingText}>Loading recent mobiles...</Text>
            </View>
          ) : recentMobiles.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="phone-portrait-outline" size={48} color={colors.textMuted} />
              <Text style={styles.emptyText}>No mobiles listed yet</Text>
              <Text style={styles.emptySubtext}>Add your first mobile to get started</Text>
            </View>
          ) : (
            <View style={styles.mobilesList}>
              {recentMobiles.map((mobile, index) => (
                <TouchableOpacity key={mobile._id} style={styles.mobileCard} onPress={() => router.push(`/mobile/${mobile._id}`)}>
                  <View style={styles.mobileImage}>
                    {mobile.images && mobile.images.length > 0 ? (
                      <Image source={{ uri: mobile.images[0] }} style={styles.mobileImageImg} />
                    ) : (
                      <Ionicons name="phone-portrait" size={24} color={colors.textMuted} />
                    )}
                  </View>
                  <View style={styles.mobileInfo}>
                    <Text style={styles.mobileBrand}>{mobile.brand}</Text>
                    <Text style={styles.mobileModel}>{mobile.model}</Text>
                    <Text style={styles.mobilePrice}>Rs. {mobile.price?.toLocaleString()}</Text>
                    <View style={styles.mobileCondition}>
                      <Text style={styles.conditionText}>{mobile.condition}</Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity  style={styles.actionCard} onPress={() => setAddModalVisible(true)}>
              <Ionicons name="add-circle" size={32} color={colors.primary} />
              <Text style={styles.actionText}>Add Product</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/(seller-tabs)/account')}>
              <Ionicons name="person-circle" size={32} color={colors.success} />
              <Text style={styles.actionText}>View Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Add Mobile Modal */}
      <AddMobileForm visible={addModalVisible} onClose={() => setAddModalVisible(false)} onSuccess={() => { queryClient.invalidateQueries(['sellerMobiles']); setAddModalVisible(false);}} />
    </SafeAreaView>
  );
}
