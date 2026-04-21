// Imports.
import { View, Text, ScrollView, TextInput, TouchableOpacity, Modal, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getFlashSaleMobiles } from '../../services/api';
import { searchWithOpenAI } from '../../services/openai';
import { forYouStyles } from '../../styles/for-you';
import { colors } from '../../styles/colors';
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
  const [filterType, setFilterType] = useState('name'); // 'name' or 'price'
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filteredMobiles, setFilteredMobiles] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const { data: flashSaleMobiles = [], isLoading: loadingFlashSale } = useQuery({
    queryKey: ['flashSaleMobiles'],
    queryFn: getFlashSaleMobiles,
    staleTime: 1000 * 60 * 5,
  });

  // Filter options
  const filterOptions = [
    { id: 'name', label: 'Search by Name', icon: 'search' },
    { id: 'price', label: 'Search by Specs', icon: 'options' },
  ];

  // Handle basic name search (auto-search)
  useEffect(() => {
    if (filterType !== 'name' || !searchQuery.trim()) {
      if (!searchQuery.trim()) {
        setFilteredMobiles(flashSaleMobiles);
      }
      return;
    }

    // Basic name search
    const query = searchQuery.toLowerCase();
    const results = flashSaleMobiles.filter(mobile => 
      mobile.brand?.toLowerCase().includes(query) ||
      mobile.model?.toLowerCase().includes(query)
    );
    setFilteredMobiles(results.slice(0, 2));
  }, [searchQuery, filterType, flashSaleMobiles]);

  // Handle AI search when icon is clicked
  const handleAISearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const results = await searchWithOpenAI(searchQuery, flashSaleMobiles);
      setFilteredMobiles(results.slice(0, 2));
    } catch (error) {
      console.error('AI search error:', error);
      setFilteredMobiles([]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <SafeAreaView style={forYouStyles.container} edges={['top']}>
      <StatusBar style="dark" />
      
      {/* Search */}
      <View style={forYouStyles.header}>
        <View style={forYouStyles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" style={forYouStyles.searchIcon} />
          <TextInput 
            style={forYouStyles.searchInputLarge} 
            placeholder={filterType === 'name' ? "Search for mobile..." : "Search"} 
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {filterType === 'price' && (
            <TouchableOpacity style={forYouStyles.aiSearchButton} onPress={handleAISearch}>
              <Ionicons name="search" size={16} color={colors.primary} />
            </TouchableOpacity>
          )}
          {searchQuery.trim() && (
            <TouchableOpacity style={forYouStyles.clearButton} onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            style={forYouStyles.filterButton}
            onPress={() => setShowFilterModal(true)}
          >
            <Ionicons name="options" size={20} color="#666" />
          </TouchableOpacity>
        </View>
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
        {searchQuery.trim() && (
          <View style={forYouStyles.flashSaleSection}>
            <View style={forYouStyles.sectionHeader}>
              <View style={forYouStyles.flashSaleHeader}>
                <Text style={forYouStyles.flashSaleTitle}>
                  {isSearching ? 'Searching...' : 'Search Results'}
                </Text>
              </View>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={forYouStyles.productScroll}>
              {isSearching ? (
                <>
                  <ProductCardSkeleton />
                  <ProductCardSkeleton />
                </>
              ) : filteredMobiles.length > 0 ? (
                filteredMobiles.map((mobile, index) => (
                  <ProductCard key={mobile._id || index} image={mobile.image || mobile.images?.[0]} price={`Rs.${mobile.price}`} originalPrice={`Rs.${mobile.originalPrice}`} discount={`-${mobile.discount}%`} sold={mobile.sold} onPress={() => router.push(`/mobile/${mobile._id}`)} />
                ))
              ) : (
                <View style={forYouStyles.productCard}>
                  <Text style={{ textAlign: 'center', color: '#999' }}>No mobiles found</Text>
                </View>
              )}
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

      {/* Filter Modal */}
      <Modal visible={showFilterModal} transparent={true} animationType="fade" onRequestClose={() => setShowFilterModal(false)}>
        <View style={forYouStyles.modalOverlay}>
          <View style={forYouStyles.modalContent}>
            <View style={forYouStyles.modalHeader}>
              <Text style={forYouStyles.modalTitle}>Search Filter</Text>
              <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={filterOptions}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    forYouStyles.filterOption,
                    filterType === item.id && forYouStyles.filterOptionActive
                  ]}
                  onPress={() => {
                    setFilterType(item.id);
                  }}
                >
                  <Ionicons name={item.icon} size={20} color={filterType === item.id ? '#fff' : '#666'} />
                  <Text style={[
                    forYouStyles.filterOptionText,
                    filterType === item.id && forYouStyles.filterOptionTextActive
                  ]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

