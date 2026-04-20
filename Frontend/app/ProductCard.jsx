import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { forYouStyles } from '../styles/for-you';

export default function ProductCard({ image, price, originalPrice, discount, sold, badge, label, onPress }) {
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

export function ProductCardSkeleton() {
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

export function QuickAccessItem({ icon, label, color, onPress }) {
  return (
    <TouchableOpacity style={forYouStyles.quickAccessItem} onPress={onPress} activeOpacity={0.8}>
      <View style={[forYouStyles.quickAccessIcon, { backgroundColor: color }]}>
        <Ionicons name={icon} size={24} color="#fff" />
      </View>
      <Text style={forYouStyles.quickAccessLabel}>{label}</Text>
    </TouchableOpacity>
  );
}
