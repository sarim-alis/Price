// Imports.
import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getFlashSaleMobiles } from '../../services/api';
import { forYouStyles } from '../../styles/for-you';
import ProductCard, { ProductCardSkeleton, QuickAccessItem } from '../ProductCard';

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
  // States.
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const { data: flashSaleMobiles = [], isLoading: loadingFlashSale } = useQuery({
    queryKey: ['flashSaleMobiles'],
    queryFn: getFlashSaleMobiles,
    staleTime: 1000 * 60 * 5,
  });

  // Filter mobiles by search query
  const filteredMobiles = useMemo(() => {
    if (!searchQuery.trim()) return flashSaleMobiles;
    
    const query = searchQuery.toLowerCase();
    return flashSaleMobiles.filter(mobile => 
      mobile.brand?.toLowerCase().includes(query) ||
      mobile.model?.toLowerCase().includes(query)
    );
  }, [flashSaleMobiles, searchQuery]);

  return (
    <SafeAreaView style={forYouStyles.container} edges={['top']}>
      <StatusBar style="dark" />
      
      {/* Search */}
      <View style={forYouStyles.header}>
        <View style={forYouStyles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" style={forYouStyles.searchIcon} />
          <TextInput style={forYouStyles.searchInput} placeholder="Search for mobile..." placeholderTextColor="#999"value={searchQuery}onChangeText={setSearchQuery} />
        </View>
        <TouchableOpacity style={forYouStyles.searchButton} onPress={() => searchQuery.trim() && setSearchQuery('')}>
          <Text style={forYouStyles.searchButtonText}>
            {searchQuery.trim() ? 'Clear' : 'Search'}
          </Text>
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

        {/* Categories */}
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

        {/* Search Results */}
        {searchQuery.trim() && filteredMobiles.length > 0 && (
          <View style={forYouStyles.flashSaleSection}>
            <View style={forYouStyles.sectionHeader}>
              <View style={forYouStyles.flashSaleHeader}>
                <Text style={forYouStyles.flashSaleTitle}>Search Results</Text>
              </View>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={forYouStyles.productScroll}>
              {filteredMobiles.slice(0, 2).map((mobile, index) => (
                <ProductCard key={mobile._id || index} image={mobile.image || mobile.images?.[0]} price={`Rs.${mobile.price}`} originalPrice={`Rs.${mobile.originalPrice}`} discount={`-${mobile.discount}%`} sold={mobile.sold} onPress={() => router.push(`/mobile/${mobile._id}`)} />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Trending Mobiles */}
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
                <ProductCard key={mobile._id || index} image={mobile.image || mobile.images?.[0]} price={`Rs.${mobile.price}`} originalPrice={`Rs.${mobile.originalPrice}`} discount={`-${mobile.discount}%`} sold={mobile.sold} onPress={() => router.push(`/mobile/${mobile._id}`)} />
              ))
            ) : (
              <View style={forYouStyles.productCard}>
                <Text style={{ textAlign: 'center', color: '#999' }}>No trending mobiles available</Text>
              </View>
            )}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

