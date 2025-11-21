import { Tabs } from 'expo-router';
import { Platform, StyleSheet, View } from 'react-native';
import { MaterialIcons, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#FF6D00', tabBarInactiveTintColor: '#999', headerShown: false, tabBarStyle: { height: Platform.OS === 'ios' ? 88 : 65, paddingBottom: Platform.OS === 'ios' ? 25 : 8, paddingTop: 8, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#f0f0f0', elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.1, shadowRadius: 3}, tabBarLabelStyle: { fontSize: 11, fontWeight: '500' }}}>
      <Tabs.Screen name="index" options={{ title: 'For You', tabBarIcon: ({ color, size }) => (<Ionicons name="flame" size={size} color={color} />)}} />
      
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages',
          tabBarIcon: ({ color, size }) => (
            <View>
              <Ionicons name="chatbubble-outline" size={size} color={color} />
              {/* Badge for unread messages */}
              <View style={styles.badge}>
                <View style={styles.badgeDot} />
              </View>
            </View>
          ),
        }}
      />
      
      <Tabs.Screen
        name="offers"
        options={{
          title: '',
          tabBarIcon: ({ focused }) => (
            <View style={styles.centerButton}>
              <View style={[styles.centerButtonInner, focused && styles.centerButtonFocused]}>
                <MaterialCommunityIcons name="sale" size={24} color="#fff" />
                <View style={styles.offerBadge}>
                  <MaterialIcons name="local-offer" size={10} color="#FF6D00" />
                </View>
              </View>
              <View style={styles.offerTextContainer}>
                <View style={styles.offerText}>
                  {/* Percentage badge */}
                </View>
              </View>
            </View>
          ),
        }}
      />
      
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color, size }) => (
            <View>
              <Ionicons name="cart-outline" size={size} color={color} />
              {/* Cart item count badge */}
              <View style={styles.cartBadge}>
                <View style={styles.cartBadgeInner} />
              </View>
            </View>
          ),
        }}
      />
      
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  centerButton: { position: 'relative', marginTop: -20 },
  centerButtonInner:   { width: 60, height: 60, borderRadius: 30, backgroundColor: '#FF6D00', justifyContent: 'center', alignItems: 'center', elevation: 5, shadowColor: '#FF6D00', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, borderWidth: 4, borderColor: '#fff' },
  centerButtonFocused: { backgroundColor: '#FF8F00', transform: [{ scale: 1.05 }]},
  offerBadge: { position: 'absolute', top: -2, right: -2, backgroundColor: '#fff', borderRadius: 10, width: 20, height: 20, justifyContent: 'center', alignItems: 'center', elevation: 3 },
  offerTextContainer: { position: 'absolute', top: -8, left: '50%', transform: [{ translateX: -20 }]},
  offerText: { backgroundColor: '#FF1744', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 },
  badge: { position: 'absolute', top: -2, right: -4 },
  badgeDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#FF1744' },
  cartBadge: { position: 'absolute', top: -4, right: -6 },
  cartBadgeInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#FF1744' },
});
