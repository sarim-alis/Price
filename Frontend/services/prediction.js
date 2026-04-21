// Brand encoding map (matches transform.py)
const BRAND_MAP = {
  'apple': 0,
  'samsung': 1,
  'xiaomi': 2,
  'poco': 2,
  'realme': 3,
  'infinix': 4,
  'oppo': 5,
  'oneplus': 6,
  'tecno': 7,
  'vivo': 8,
  'google': 9,
};

// Tier encoding map (matches transform.py)
const TIER_MAP = {
  'base': 0,
  'plus': 1,
  'pro': 2,
  'promax': 3,
};

// Extract brand from model name
export function extractBrand(name) {
  const lowerName = name.toLowerCase().trim();
  
  if (lowerName.startsWith('apple') || lowerName.startsWith('iphone')) return 'apple';
  if (lowerName.startsWith('samsung') || lowerName.startsWith('galaxy')) return 'samsung';
  if (lowerName.startsWith('xiaomi') || lowerName.startsWith('redmi')) return 'xiaomi';
  if (lowerName.startsWith('poco')) return 'poco';
  if (lowerName.startsWith('realme')) return 'realme';
  if (lowerName.startsWith('infinix')) return 'infinix';
  if (lowerName.startsWith('oppo')) return 'oppo';
  if (lowerName.startsWith('oneplus')) return 'oneplus';
  if (lowerName.startsWith('tecno')) return 'tecno';
  if (lowerName.startsWith('vivo')) return 'vivo';
  if (lowerName.startsWith('google') || lowerName.startsWith('pixel')) return 'google';
  
  return 'other';
}

// Extract tier from model name
export function extractTier(name) {
  const lowerName = name.toLowerCase();
  
  if (lowerName.includes('promax') || lowerName.includes('pro max') || 
      lowerName.includes('ultra') || lowerName.includes('max')) {
    return 'promax';
  }
  if (lowerName.includes('pro') || lowerName.includes('plus') || 
      lowerName.includes('air') || lowerName.includes('edge')) {
    return 'pro';
  }
  if (lowerName.includes('lite') || lowerName.includes('mini') || 
      lowerName.includes('se') || lowerName.includes('neo')) {
    return 'plus';
  }
  
  return 'base';
}

// Encode brand
export function encodeBrand(brand) {
  return BRAND_MAP[brand.toLowerCase()] || 10;
}

// Encode tier
export function encodeTier(tier) {
  return TIER_MAP[tier.toLowerCase()] !== undefined ? TIER_MAP[tier.toLowerCase()] : 0;
}

// Transform mobile data to model input format
export function transformMobileToModelInput(mobile) {
  const brand = extractBrand(mobile.model || mobile.brand || '');
  const tier = extractTier(mobile.model || '');
  
  return {
    back_camera: parseInt(mobile.rearCamera) || 0,
    battery: parseInt(mobile.battery) || 0,
    display: parseFloat(mobile.screenSize) || 0,
    ram: parseInt(mobile.ram) || 0,
    brand_encoded: encodeBrand(brand),
    tier_encoded: encodeTier(tier),
  };
}

// Call Flask prediction API
export async function predictPriceTrend(mobile) {
  try {
    const features = transformMobileToModelInput(mobile);
    
    // Flask API URL - update this to your Flask server URL
    const FLASK_URL = process.env.EXPO_PUBLIC_FLASK_URL || 'http://192.168.18.203:5001';
    const url = `${FLASK_URL}/predict`;
    
    console.log('🔮 Prediction Request URL:', url);
    console.log('📱 Mobile Data:', mobile.model || mobile.brand);
    console.log('📊 Features:', features);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...features,
        name: mobile.model || mobile.brand,
      }),
    });
    
    console.log('📡 Response Status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error Response:', errorText);
      throw new Error(`Prediction API error: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('✅ Prediction Result:', data);
    return data;
  } catch (error) {
    console.error('❌ Price prediction error:', error.message);
    console.error('Full error:', error);
    // Return fallback prediction if API fails
    return {
      phone: mobile.model || mobile.brand,
      prediction: 'increase', // Default fallback
    };
  }
}
