import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../../styles/colors';

const { width } = Dimensions.get('window');

const offers = [
  { id: '1', title: 'Flash Sale', discount: '60%', time: '18:50:03', items: 234 },
  { id: '2', title: 'Super Deal', discount: '50%', time: '23:45:12', items: 156 },
  { id: '3', title: 'Daily Offers', discount: '40%', time: '12:30:45', items: 89 },
];

export default function OffersScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Special Offers</Text>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 70 }}
      >
        {/* Main Banner */}
        <View style={styles.mainBanner}>
          <View style={styles.bannerContent}>
            <MaterialCommunityIcons name="sale" size={60} color="#fff" />
            <Text style={styles.bannerTitle}>UP TO</Text>
            <Text style={styles.bannerDiscount}>60% OFF</Text>
            <Text style={styles.bannerSubtitle}>Limited Time Only!</Text>
          </View>
          <View style={styles.bannerOverlay} />
        </View>

        {/* Countdown Section */}
        <View style={styles.countdownSection}>
          <View style={styles.countdownHeader}>
            <Ionicons name="time-outline" size={24} color="#FF6D00" />
            <Text style={styles.countdownTitle}>Hurry Up! Deals End Soon</Text>
          </View>
        </View>

        {/* Offers Grid */}
        <View style={styles.offersGrid}>
          {offers.map((offer) => (
            <TouchableOpacity key={offer.id} style={styles.offerCard}>
              <View style={styles.offerIcon}>
                <MaterialCommunityIcons name="tag-multiple" size={32} color="#FF6D00" />
              </View>
              <Text style={styles.offerTitle}>{offer.title}</Text>
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>{offer.discount} OFF</Text>
              </View>
              <View style={styles.offerTime}>
                <Ionicons name="time" size={14} color="#666" />
                <Text style={styles.timeText}>{offer.time}</Text>
              </View>
              <View style={styles.offerFooter}>
                <Text style={styles.itemsText}>{offer.items} items</Text>
                <Ionicons name="chevron-forward" size={16} color="#FF6D00" />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Categories Section */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Shop by Category</Text>
          <View style={styles.categoriesGrid}>
            <CategoryCard icon="phone-portrait" label="Mobiles" color="#42A5F5" />
            <CategoryCard icon="laptop" label="Electronics" color="#66BB6A" />
            <CategoryCard icon="shirt" label="Fashion" color="#EC407A" />
            <CategoryCard icon="home" label="Home" color="#FFA726" />
          </View>
        </View>

        {/* Voucher Codes */}
        <View style={styles.voucherSection}>
          <Text style={styles.sectionTitle}>Available Vouchers</Text>
          <VoucherItem code="SAVE20" discount="20% OFF" min="Min. Rs.500" />
          <VoucherItem code="FLASH50" discount="Rs.50 OFF" min="Min. Rs.200" />
          <VoucherItem code="FREE100" discount="Free Shipping" min="No minimum" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function CategoryCard({ icon, label, color }) {
  return (
    <TouchableOpacity style={styles.categoryCard}>
      <View style={[styles.categoryIcon, { backgroundColor: color }]}>
        <Ionicons name={icon} size={32} color="#fff" />
      </View>
      <Text style={styles.categoryLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

function VoucherItem({ code, discount, min }) {
  return (
    <TouchableOpacity style={styles.voucherItem}>
      <View style={styles.voucherLeft}>
        <MaterialCommunityIcons name="ticket-percent" size={32} color="#FF6D00" />
      </View>
      <View style={styles.voucherContent}>
        <Text style={styles.voucherCode}>{code}</Text>
        <Text style={styles.voucherDiscount}>{discount}</Text>
        <Text style={styles.voucherMin}>{min}</Text>
      </View>
      <TouchableOpacity style={styles.collectButton}>
        <Text style={styles.collectButtonText}>Collect</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  content: {
    flex: 1,
  },
  mainBanner: {
    height: 220,
    backgroundColor: colors.primary,
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  bannerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  bannerTitle: {
    fontSize: 24,
    color: '#fff',
    fontWeight: '600',
    marginTop: 12,
  },
  bannerDiscount: {
    fontSize: 48,
    color: '#fff',
    fontWeight: 'bold',
  },
  bannerSubtitle: {
    fontSize: 16,
    color: '#FFF9C4',
    marginTop: 8,
  },
  countdownSection: {
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
  },
  countdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  countdownTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  offersGrid: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  offerCard: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  offerIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.backgroundDark,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  offerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  discountBadge: {
    backgroundColor: colors.error,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  discountText: {
    color: colors.textLight,
    fontSize: 14,
    fontWeight: 'bold',
  },
  offerTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  timeText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  offerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: 8,
  },
  itemsText: {
    fontSize: 14,
    color: colors.textMuted,
  },
  categoriesSection: {
    backgroundColor: colors.surface,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: (width - 60) / 2,
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.background,
    borderRadius: 12,
  },
  categoryIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  voucherSection: {
    backgroundColor: colors.surface,
    padding: 16,
    marginBottom: 20,
  },
  voucherItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.background,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  voucherLeft: {
    marginRight: 12,
  },
  voucherContent: {
    flex: 1,
  },
  voucherCode: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  voucherDiscount: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  voucherMin: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  collectButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  collectButtonText: {
    color: colors.textLight,
    fontSize: 12,
    fontWeight: '600',
  },
});
