import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

export default function ForYouScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      
      {/* Search Header */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for products..."
            placeholderTextColor="#999"
          />
          <TouchableOpacity style={styles.cameraButton}>
            <Ionicons name="camera-outline" size={20} color="#666" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.searchButton}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Banner Carousel */}
        <View style={styles.bannerContainer}>
          <View style={styles.banner}>
            <Text style={styles.bannerText}>FLASH SALE</Text>
            <Text style={styles.bannerSubtext}>Up to 70% OFF</Text>
          </View>
        </View>

        {/* Quick Access Icons */}
        <View style={styles.quickAccessContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <QuickAccessItem icon="pricetag" label="Shop here" color="#FFA726" />
            <QuickAccessItem icon="sparkles" label="Beauty" color="#EC407A" />
            <QuickAccessItem icon="gift" label="Free Delivery" color="#26A69A" />
            <QuickAccessItem icon="trophy" label="Free Freebie" color="#AB47BC" />
            <QuickAccessItem icon="cart" label="DarazMall" color="#5C6BC0" />
          </ScrollView>
        </View>

        {/* Vouchers Section */}
        <View style={styles.voucherSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Claim Vouchers to Save More</Text>
            <TouchableOpacity>
              <Text style={styles.moreLink}>More Vouchers {'>'}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.voucherCards}>
            <VoucherCard discount="4%OFF" subtitle="Voucher Max" color="#FF5252" />
            <VoucherCard discount="Rs.200" subtitle="Free shipping" color="#42A5F5" />
          </View>
          <TouchableOpacity style={styles.collectAllButton}>
            <Text style={styles.collectAllText}>Collect All</Text>
          </TouchableOpacity>
        </View>

        {/* Flash Sale Section */}
        <View style={styles.flashSaleSection}>
          <View style={styles.sectionHeader}>
            <View style={styles.flashSaleHeader}>
              <Text style={styles.flashSaleTitle}>Flash Sale</Text>
              <View style={styles.countdown}>
                <View style={styles.countdownBox}>
                  <Text style={styles.countdownText}>18</Text>
                </View>
                <Text style={styles.countdownSeparator}>:</Text>
                <View style={styles.countdownBox}>
                  <Text style={styles.countdownText}>50</Text>
                </View>
                <Text style={styles.countdownSeparator}>:</Text>
                <View style={styles.countdownBox}>
                  <Text style={styles.countdownText}>03</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity>
              <Text style={styles.moreLink}>Shop More {'>'}</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.productScroll}>
            <ProductCard
              image="https://via.placeholder.com/150"
              price="Rs.186"
              originalPrice="Rs.620"
              discount="-70%"
              sold="1.0k sold"
            />
            <ProductCard
              image="https://via.placeholder.com/150"
              price="Rs.832"
              originalPrice="Rs.2,980"
              discount="-72%"
              sold="Only 1 left"
            />
            <ProductCard
              image="https://via.placeholder.com/150"
              price="Rs.430"
              originalPrice="Rs.1,000"
              discount="-57%"
              sold="Only 10 left"
            />
          </ScrollView>
        </View>

        {/* Daily Choice Section */}
        <View style={styles.dailyChoiceSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Daily Sasti CHOICE</Text>
            <TouchableOpacity>
              <Text style={styles.moreLink}>Shop Now | Free Gift! {'>'}</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.productScroll}>
            <ProductCard
              image="https://via.placeholder.com/150"
              price="Rs.292"
              badge="HOT"
              label="BUY 1 GET 1 FREE"
            />
            <ProductCard
              image="https://via.placeholder.com/150"
              price="Rs.191"
              badge="HOT"
              label="SUPER PACK"
            />
            <ProductCard
              image="https://via.placeholder.com/150"
              price="Rs.240"
              badge="HOT"
            />
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Quick Access Item Component
function QuickAccessItem({ icon, label, color }: { icon: any; label: string; color: string }) {
  return (
    <TouchableOpacity style={styles.quickAccessItem}>
      <View style={[styles.quickAccessIcon, { backgroundColor: color }]}>
        <Ionicons name={icon} size={24} color="#fff" />
      </View>
      <Text style={styles.quickAccessLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

// Voucher Card Component
function VoucherCard({ discount, subtitle, color }: { discount: string; subtitle: string; color: string }) {
  return (
    <View style={[styles.voucherCard, { borderLeftColor: color }]}>
      <Text style={[styles.voucherDiscount, { color }]}>{discount}</Text>
      <Text style={styles.voucherSubtitle}>{subtitle}</Text>
    </View>
  );
}

// Product Card Component
function ProductCard({
  image,
  price,
  originalPrice,
  discount,
  sold,
  badge,
  label,
}: {
  image: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  sold?: string;
  badge?: string;
  label?: string;
}) {
  return (
    <View style={styles.productCard}>
      <View style={styles.productImageContainer}>
        <View style={styles.productImagePlaceholder} />
        {label && (
          <View style={styles.productLabel}>
            <Text style={styles.productLabelText}>{label}</Text>
          </View>
        )}
        {sold && (
          <View style={styles.soldBadge}>
            <Text style={styles.soldText}>{sold}</Text>
          </View>
        )}
      </View>
      <View style={styles.productInfo}>
        <View style={styles.priceRow}>
          <Text style={styles.productPrice}>{price}</Text>
          {badge && <View style={styles.hotBadge}><Text style={styles.hotBadgeText}>{badge}</Text></View>}
        </View>
        {originalPrice && (
          <View style={styles.discountRow}>
            <Text style={styles.originalPrice}>{originalPrice}</Text>
            {discount && <Text style={styles.discountBadge}>{discount}</Text>}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 42,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  cameraButton: {
    padding: 4,
  },
  searchButton: {
    backgroundColor: '#FF6D00',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  bannerContainer: {
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  banner: {
    backgroundColor: '#D32F2F',
    borderRadius: 12,
    padding: 20,
    height: 140,
    justifyContent: 'center',
  },
  bannerText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  bannerSubtext: {
    color: '#FFEB3B',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 4,
  },
  quickAccessContainer: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    marginTop: 12,
  },
  quickAccessItem: {
    alignItems: 'center',
    marginHorizontal: 12,
    width: 70,
  },
  quickAccessIcon: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickAccessLabel: {
    fontSize: 11,
    color: '#333',
    textAlign: 'center',
  },
  voucherSection: {
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  moreLink: {
    fontSize: 12,
    color: '#FF6D00',
  },
  voucherCards: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  voucherCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  voucherDiscount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  voucherSubtitle: {
    fontSize: 12,
    color: '#42A5F5',
    marginTop: 4,
  },
  collectAllButton: {
    backgroundColor: '#FF6D00',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  collectAllText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  flashSaleSection: {
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 12,
  },
  flashSaleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  flashSaleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  countdown: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countdownBox: {
    backgroundColor: '#FF1744',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  countdownText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  countdownSeparator: {
    color: '#FF1744',
    fontSize: 12,
    fontWeight: 'bold',
    marginHorizontal: 2,
  },
  productScroll: {
    marginTop: 8,
  },
  productCard: {
    width: 140,
    marginRight: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  productImageContainer: {
    position: 'relative',
    width: '100%',
    height: 140,
  },
  productImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0',
  },
  productLabel: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  productLabelText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: 'bold',
  },
  soldBadge: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingVertical: 4,
    alignItems: 'center',
  },
  soldText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  productInfo: {
    padding: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6D00',
  },
  hotBadge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  hotBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333',
  },
  discountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  originalPrice: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
    marginRight: 6,
  },
  discountBadge: {
    fontSize: 11,
    color: '#FF1744',
    fontWeight: '600',
  },
  dailyChoiceSection: {
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 12,
    marginBottom: 20,
  },
});
