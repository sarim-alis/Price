// Gemini AI service for smart mobile searches
const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY || 'AIzaSyBndmovbXp8B5LLA06gHz_XdzIcsTT-GDo';

export async function searchWithGemini(query, mobiles) {
  try {
    // Create a simpler prompt for better results
    const mobileList = mobiles.map((mobile, index) => 
      `${index}: ${mobile.brand} ${mobile.model} - Rs.${mobile.price} - ${mobile.ram}GB RAM - ${mobile.rearCamera}MP camera`
    ).join('\n');

    const prompt = `User wants: "${query}"

Available phones:
${mobileList}

Return ONLY a JSON array of indices of the most relevant phones (max 2). Example: [0, 2]`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.0-pro:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 100,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API response error:', errorData);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const result = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    
    if (!result) {
      throw new Error('No response from Gemini');
    }
    
    // Clean and parse the result
    const cleanResult = result.replace(/```json\n?|\n?```/g, '');
    const indices = JSON.parse(cleanResult || '[]');
    
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
