// Imports.
import { View, Text, ScrollView, TextInput, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { colors } from '../../styles/colors';
import { getFlashSaleMobiles } from '../../services/api';
import { forYouStyles } from '../../styles/for-you';

// Brands.
const BRAND_CATEGORIES = [
  { icon: 'pricetag', label: 'Apple', brand: 'apple', color: '#FFA726' },
  { icon: 'sparkles', label: 'Samsung', brand: 'samsung', color: '#EC407A' },
  { icon: 'gift', label: 'Xiaomi', brand: 'xiaomi', color: '#26A69A' },
  { icon: 'trophy', label: 'Realme', brand: 'realme', color: '#AB47BC' },
  { icon: 'cart', label: 'Oppo', brand: 'oppo', color: '#5C6BC0' },
  { icon: 'phone-portrait', label: 'Vivo', brand: 'vivo', color: '#29B6F6' },
  { icon: 'headset', label: 'OnePlus', brand: 'oneplus', color: '#66BB6A' },
  { icon: 'laptop', label: 'Huawei', brand: 'huawei', color: '#FF7043' },
  { icon: 'game-controller', label: 'Google', brand: 'google', color: '#8D6E63' },
];

// Frontend.
export default function ForYouScreen() {
  const router = useRouter();
  const [flashSaleMobiles, setFlashSaleMobiles] = useState([]);
  const [loadingFlashSale, setLoadingFlashSale] = useState(true);

  useEffect(() => {
    fetchFlashSaleMobiles();
  }, []);

  const fetchFlashSaleMobiles = async () => {
    try {
      setLoadingFlashSale(true);
      const mobiles = await getFlashSaleMobiles();
      setFlashSaleMobiles(mobiles);
    } catch (error) {
      console.error('Error fetching flash sale mobiles:', error);
    } finally {
      setLoadingFlashSale(false);
    }
  };

  return (
    <SafeAreaView style={forYouStyles.container} edges={['top']}>
      <StatusBar style="dark" />
      
      {/* Search Header */}
      <View style={forYouStyles.header}>
        <View style={forYouStyles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" style={forYouStyles.searchIcon} />
          <TextInput style={forYouStyles.searchInput} placeholder="Search for products..." placeholderTextColor="#999" />
          <TouchableOpacity style={forYouStyles.cameraButton}>
            <Ionicons name="camera-outline" size={20} color="#666" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={forYouStyles.searchButton}>
          <Text style={forYouStyles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={forYouStyles.content} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 70 }}>
        {/* Banner */}
        <View style={forYouStyles.bannerContainer}>
          <View style={forYouStyles.banner}>
            <Text style={forYouStyles.bannerText}>Zod Mobile</Text>
            <Text style={forYouStyles.bannerSubtext}>Buy Better. Sell Faster.</Text>
          </View>
        </View>

        {/* Icons */}
        <View style={forYouStyles.quickAccessContainer}>
          <View style={forYouStyles.sectionHeader}>
          <Text style={forYouStyles.sectionTitle}>Categories</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {BRAND_CATEGORIES.map((item) => (
              <QuickAccessItem key={item.brand} icon={item.icon} label={item.label} color={item.color} onPress={() => router.push({ pathname: '/mobiles', params: { brand: item.brand, category: item.label } })} />
            ))}
          </ScrollView>
        </View>

        {/* Flash Sale Section */}
        <View style={forYouStyles.flashSaleSection}>
          <View style={forYouStyles.sectionHeader}>
            <View style={forYouStyles.flashSaleHeader}>
              <Text style={forYouStyles.flashSaleTitle}>Trending Mobiles</Text>
            </View>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={forYouStyles.productScroll}>
            {loadingFlashSale ? (
              <>
                <ProductCardSkeleton />
                <ProductCardSkeleton />
                <ProductCardSkeleton />
              </>
            ) : flashSaleMobiles.length > 0 ? (
              flashSaleMobiles.map((mobile, index) => (
                <ProductCard
                  key={mobile._id || index}
                  image={mobile.image || mobile.images?.[0]}
                  price={`Rs.${mobile.price}`}
                  originalPrice={`Rs.${mobile.originalPrice}`}
                  discount={`-${mobile.discount}%`}
                  sold={mobile.sold}
                  onPress={() => router.push(`/mobile/${mobile._id}`)}
                />
              ))
            ) : (
              <>
                <ProductCard
                  image="https://res.cloudinary.com/dgk3gaml0/image/upload/v1768789028/r1fubc2z7du0t5gnpm8o.jpg"
                  price="Rs.292"
                  originalPrice="Rs.1,200"
                  discount="-76%"
                  sold="iPhone 15 Pro"
                  onPress={() => router.push('/mobiles')}
                />
                <ProductCard
                  image="https://res.cloudinary.com/dgk3gaml0/image/upload/v1768788796/ob4nrnqdawiepvw4b1vc.webp"
                  price="Rs.832"
                  originalPrice="Rs.2,980"
                  discount="-72%"
                  sold="Samsung S24"
                  onPress={() => router.push('/mobiles')}
                />
                <ProductCard
                  image="https://res.cloudinary.com/dgk3gaml0/image/upload/v1768788851/dhzamx2qwfcpbfrh78jb.jpg"
                  price="Rs.430"
                  originalPrice="Rs.1,000"
                  discount="-57%"
                  sold="Realme 12"
                  onPress={() => router.push('/mobiles')}
                />
              </>
            )}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Quick access item.
function QuickAccessItem({ icon, label, color, onPress }) {
  return (
    <TouchableOpacity style={forYouStyles.quickAccessItem} onPress={onPress} activeOpacity={0.8}>
      <View style={[forYouStyles.quickAccessIcon, { backgroundColor: color }]}>
        <Ionicons name={icon} size={24} color="#fff" />
      </View>
      <Text style={forYouStyles.quickAccessLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

// Voucher card.
function VoucherCard({ discount, subtitle, color }) {
  return (
    <View style={[forYouStyles.voucherCard, { borderLeftColor: color }]}>
      <Text style={[forYouStyles.voucherDiscount, { color }]}>{discount}</Text>
      <Text style={forYouStyles.voucherSubtitle}>{subtitle}</Text>
    </View>
  );
}

// Product card skeleton.
function ProductCardSkeleton() {
  return (
    <View style={forYouStyles.productCard}>
      <View style={forYouStyles.productImageContainer}>
        <View style={forYouStyles.skeletonImage} />
        <View style={forYouStyles.skeletonBadge} />
      </View>
      <View style={forYouStyles.productInfo}>
        <View style={forYouStyles.skeletonPrice} />
        <View style={forYouStyles.skeletonOriginalPrice} />
      </View>
    </View>
  );
}

// Product card.
function ProductCard({ image, price, originalPrice, discount, sold, badge, label, onPress }) {
  return (
    <TouchableOpacity style={forYouStyles.productCard} onPress={onPress} activeOpacity={0.8}>
      <View style={forYouStyles.productImageContainer}>
        <Image source={{ uri: image }} style={forYouStyles.productImage} />
        {label && (
          <View style={forYouStyles.productLabel}>
            <Text style={forYouStyles.productLabelText}>{label}</Text>
          </View>
        )}
        {sold && (
          <View style={forYouStyles.soldBadge}>
            <Text style={forYouStyles.soldText}>{sold}</Text>
          </View>
        )}
      </View>
      <View style={forYouStyles.productInfo}>
        <View style={forYouStyles.priceRow}>
          <Text style={forYouStyles.productPrice}>{price}</Text>
          {badge && <View style={forYouStyles.hotBadge}><Text style={forYouStyles.hotBadgeText}>{badge}</Text></View>}
        </View>
      </View>
    </TouchableOpacity>
  );
}
