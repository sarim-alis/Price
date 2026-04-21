// OpenAI service for smart mobile searches
const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

export async function searchWithOpenAI(query, mobiles) {
  try {
    // Create a simplified list of mobiles
    const mobileList = mobiles.map((mobile, index) => 
      `${index}: ${mobile.brand} ${mobile.model} - Rs.${mobile.price} - ${mobile.ram}GB RAM - ${mobile.rearCamera}MP camera - ${mobile.battery}mAh battery`
    ).join('\n');

    const prompt = `User wants: "${query}"

Available phones:
${mobileList}

Return ONLY a JSON array of indices of the most relevant phones (max 2). Example: [0, 2]`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a mobile phone expert. Return only JSON arrays of indices.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 50,
        temperature: 0.1,
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API response error:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content?.trim();
    
    if (!result) {
      throw new Error('No response from OpenAI');
    }
    
    // Clean and parse the result
    const cleanResult = result.replace(/```json\n?|\n?```/g, '');
    const indices = JSON.parse(cleanResult || '[]');
    
    return indices.map(index => mobiles[index]).filter(Boolean);
    
  } catch (error) {
    console.error('OpenAI search error:', error);
    // Fallback to basic text search
    return mobiles.filter(mobile => 
      mobile.brand?.toLowerCase().includes(query.toLowerCase()) ||
      mobile.model?.toLowerCase().includes(query.toLowerCase())
    );
  }
}
