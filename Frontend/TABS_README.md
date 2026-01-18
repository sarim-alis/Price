# 5-Tab Navigation Structure

## Overview
This React Native Expo app features a Daraz-inspired bottom tab navigation with 5 tabs.

## Tab Structure

### 1. **For You** (Home/Feed)
- **Icon**: Flame icon
- **Features**:
  - Search bar with camera scan
  - Banner carousel for promotions
  - Quick access icons (Shop, Beauty, Free Delivery, etc.)
  - Voucher collection section
  - Flash Sale with countdown timer
  - Daily Choice products
  - Product cards with pricing and discounts

### 2. **Messages**
- **Icon**: Chat bubble
- **Features**:
  - Message list with customer support and sellers
  - Search messages
  - Unread message badges
  - Empty state when no messages
  - Message preview and timestamps

### 3. **Offers** (Center Tab)
- **Icon**: Sale tag (Promotional center button)
- **Special Design**: 
  - Elevated circular button
  - Orange gradient background
  - White border
  - Positioned above tab bar
- **Features**:
  - Main promotional banner (60% OFF)
  - Countdown timers for deals
  - Offers grid with discounts
  - Category cards (Mobiles, Electronics, Fashion, Home)
  - Voucher codes section

### 4. **Cart**
- **Icon**: Shopping cart
- **Features**:
  - Cart items list with images
  - Quantity controls (+/-)
  - Delete items functionality
  - Price summary (subtotal, discount, shipping)
  - Free shipping threshold indicator
  - Voucher application
  - Checkout button
  - Empty cart state

### 5. **Account**
- **Icon**: Person outline
- **Features**:
  - User profile card with avatar
  - Statistics cards (Orders, Wishlist, Vouchers)
  - My Orders section (To Receive, Completed, Returns, Cancelled)
  - My Account (Addresses, Payment Methods, Reviews, Wishlist)
  - Settings (Notifications toggle, Language, Dark Mode)
  - Support links (Help Center, Contact Us, About, T&C, Privacy)
  - Logout button
  - App version display

## Color Scheme
- **Primary Orange**: `#FF6D00`
- **Light Orange**: `#FFF3E0`
- **Accent Red**: `#FF1744`
- **Background**: `#f5f5f5`
- **White**: `#fff`
- **Text Dark**: `#333`
- **Text Light**: `#666` / `#999`

## Design Features
- Clean, modern UI with card-based layouts
- Consistent spacing and padding
- Shadows and elevation for depth
- Badge notifications on Messages and Cart
- Smooth transitions and interactions
- Safe area handling for notched devices
- iOS and Android platform-specific adjustments

## Getting Started
```bash
cd Frontend
npm install
npm start
```

Then press:
- `i` for iOS simulator
- `a` for Android emulator
- `w` for web browser

## File Structure
```
app/
├── _layout.tsx              # Root layout
├── (tabs)/                  # Tab group
│   ├── _layout.tsx         # Tab navigation config
│   ├── index.tsx           # For You screen
│   ├── messages.tsx        # Messages screen
│   ├── offers.tsx          # Offers screen
│   ├── cart.tsx            # Cart screen
│   └── account.tsx         # Account screen
```

## Dependencies Used
- `@expo/vector-icons` - Icon library
- `expo-router` - File-based routing
- `react-native-safe-area-context` - Safe area handling
- `expo-status-bar` - Status bar control

## Customization
You can customize:
- Colors in each screen's StyleSheet
- Tab bar height and styling in `(tabs)/_layout.tsx`
- Icons and labels for each tab
- Add more screens to existing tabs using nested Stack navigation
