// Gemini AI service for smart mobile searches
const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY || 'AIzaSyBndmovbXp8B5LLA06gHz_XdzIcsTT-GDo';

export async function searchWithGemini(query, mobiles) {
  try {
    const prompt = `
    You are a mobile phone expert. Based on the user's query "${query}", find the best matching phones from this list:
    
    ${mobiles.map(mobile => `
    - ${mobile.brand} ${mobile.model}: 
      Price: Rs.${mobile.price}
      RAM: ${mobile.ram}GB
      Storage: ${mobile.storage}GB
      Camera: ${mobile.frontCamera}MP front, ${mobile.rearCamera}MP rear
      Battery: ${mobile.battery}mAh
      Screen: ${mobile.screenSize}"
    `).join('\n')}
    
    Return ONLY a JSON array of matching phone indices in order of relevance. If no phones match, return [].
    Example: [0, 3, 1]
    `;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error('Gemini API error');
    }

    const data = await response.json();
    const result = data.candidates[0]?.content?.parts[0]?.text?.trim();
    
    // Parse the result to get indices
    const indices = JSON.parse(result || '[]');
    return indices.map(index => mobiles[index]).filter(Boolean);
    
  } catch (error) {
    console.error('Gemini search error:', error);
    // Fallback to basic text search
    return mobiles.filter(mobile => 
      mobile.brand?.toLowerCase().includes(query.toLowerCase()) ||
      mobile.model?.toLowerCase().includes(query.toLowerCase())
    );
  }
}
