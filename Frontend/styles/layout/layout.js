import { StyleSheet, Platform } from 'react-native';

// Tab Bar Styles Configuration
export const tabBarConfig = {
  activeTintColor: '#FF6D00',
  inactiveTintColor: '#999',
  headerShown: false,
  tabBarStyle: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: Platform.OS === 'ios' ? 70 : 60,
    paddingBottom: Platform.OS === 'ios' ? 10 : 8,
    paddingTop: 5,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  tabBarLabelStyle: {
    fontSize: 11,
    fontWeight: '500',
  },
};

// Tab Layout Styles
export const tabLayoutStyles = StyleSheet.create({
  centerButton: {
    position: 'relative',
    marginTop: -20,
  },
  centerButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF6D00',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#FF6D00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    borderWidth: 4,
    borderColor: '#fff',
  },
  centerButtonFocused: {
    backgroundColor: '#FF8F00',
    transform: [{ scale: 1.05 }],
  },
  offerBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#fff',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  offerTextContainer: {
    position: 'absolute',
    top: -8,
    left: '50%',
    transform: [{ translateX: -20 }],
  },
  offerText: {
    backgroundColor: '#FF1744',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -4,
  },
  badgeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF1744',
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -6,
  },
  cartBadgeInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF1744',
  },
});
