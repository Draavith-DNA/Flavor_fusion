import { UserProfile, MealPlan } from "@/data/mockData";

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

/**
 * Generates a personalized 1-day meal plan based on the user's profile using the Groq AI API.
 * 
 * @param profile - The user's clinical and dietary profile.
 * @returns A promise that resolves to a MealPlan object containing breakfast, lunch, snacks, and dinner.
 * @throws Error if the Groq API key is missing or the API request fails.
 */
export async function generateMealPlanAI(profile: UserProfile): Promise<MealPlan> {
  if (!GROQ_API_KEY || GROQ_API_KEY === "your_groq_api_key_here") {
    console.error("GROQ_API_KEY is missing or using placeholder.");
    throw new Error("Groq API key is not configured. Please add your key to the .env file.");
  }

  console.log("Using Groq API Key starting with:", GROQ_API_KEY.substring(0, 4) + "...");

  const prompt = `
    Act as a professional clinical nutritionist specializing in medical nutrition therapy.
    Generate a 1-day science-backed meal plan for a user with the following profile:
    - Name: ${profile.name}
    - Age: ${profile.age}
    - Weight: ${profile.weight}kg
    - Height: ${profile.height}cm
    - Health Conditions: ${profile.diseases.length > 0 ? profile.diseases.join(", ") : "None"}
    - Dietary Preference: ${profile.preference}

    Strict Dietary Rules (MANDATORY):
    - If preference is Jain: No root vegetables (onion, garlic, potato, carrot), no meat, no eggs. Focus on sattvic foods.
    - If preference is Vegan: No animal products (dairy, honey, eggs, meat).
    - If preference is Keto: High fat (>70%), very low carb (<5%), moderate protein.
    - If preference is Mediterranean: High in olive oil, legumes, whole grains, and fish.

    Prompt Focus:
    - Avoid generic "Healthy Salad" advice. 
    - Provide specific, culturally appropriate, and delicious meal names.
    - Tailor the nutrients (Sodium, Sugar, Fiber) precisely for the mentioned diseases.
    - For example, if the user has Hypertension, strictly limit sodium in all suggested ingredients.
    - If the user has Diabetes, prioritize complex carbs and high fiber.

    Strict Requirements:
    1. The meal plan MUST be optimized for the mentioned health conditions.
    2. Respond ONLY with a valid JSON object. DO NOT include any preamble, introduction, or explanation text. No markdown blocks like \`\`\`json. Just the raw JSON object.
    3. Provide EXACTLY ONE cohesive and high-quality meal choice for each category (Breakfast, Lunch, Snack, Dinner). Ensure they are practical and easy to prepare.
    4. Each meal's 'benefits' field MUST explain WHY it is good for the user's specific disease combination (e.g., 'Lowers BP while managing glucose spikes').
    5. The JSON structure MUST match this exactly:
    {
      "breakfast": [{"name": "string", "calories": number, "protein": number, "fat": number, "carbs": number, "benefits": "string", "mealTime": "7am", "prepTime": "15 min", "image": "string (leave empty)"}],
      "lunch": [{"name": "string", "calories": number, "protein": number, "fat": number, "carbs": number, "benefits": "string", "mealTime": "1pm", "prepTime": "20 min", "image": "string (leave empty)"}],
      "snacks": [{"name": "string", "calories": number, "protein": number, "fat": number, "carbs": number, "benefits": "string", "mealTime": "4pm", "prepTime": "5 min", "image": "string (leave empty)"}],
      "dinner": [{"name": "string", "calories": number, "protein": number, "fat": number, "carbs": number, "benefits": "string", "mealTime": "8pm", "prepTime": "25 min", "image": "string (leave empty)"}],
      "totalCalories": number,
      "totalProtein": number,
      "totalFat": number,
      "totalCarbs": number,
      "goalCalories": number,
      "riskAlerts": [{"food": "string", "disease": "string", "severity": "high | medium | low", "message": "string"}]
    }

    5. Ensure macros and calories are realistic and accurate.
    6. Provide specific clinical risk alerts related to the health conditions and the generated meals.
  `;

  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "You are a professional clinical nutritionist that outputs ONLY JSON.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Groq API Error Response:", errorText);
      throw new Error(`Groq API Error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    let result;
    try {
      let content = data.choices[0].message.content;
      console.log("Raw AI Content:", content);
      
      // Strip markdown code blocks if present
      content = content.replace(/^```json\n?/, "").replace(/\n?```$/, "").trim();
      
      result = typeof content === "string" ? JSON.parse(content) : content;
    } catch (parseError) {
      console.error("JSON Parsing Error:", parseError);
      throw new Error("Failed to parse AI response. The model might have returned an invalid format.");
    }
    
    // Add default images if missing (since AI won't provide them)
    const addDefaultImages = (meals: any[]) => 
      meals ? meals.map(m => ({ ...m, image: m.image || "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&auto=format&fit=crop&q=60" })) : [];

    return {
      ...result,
      breakfast: addDefaultImages(result.breakfast),
      lunch: addDefaultImages(result.lunch),
      snacks: addDefaultImages(result.snacks),
      dinner: addDefaultImages(result.dinner),
    };
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw error;
  }
}

/**
 * Generates a chat response from the AI nutritionist based on message history and user profile.
 * 
 * @param messages - The array of previous chat messages.
 * @param profile - The user's profile to tailor the advice.
 * @returns A promise that resolves to the AI's response string.
 */
export async function generateChatResponse(
  messages: { role: "user" | "assistant"; content: string }[],
  profile: UserProfile | null
): Promise<string> {
  if (!GROQ_API_KEY || GROQ_API_KEY === "your_groq_api_key_here") {
    return "Groq API key is missing. Please add it to your .env file to enable the AI assistant.";
  }

  const systemPrompt = `
    You are a Professional Clinical Dietician and Nutritionist. 
    Your goal is to provide expert, science-backed dietary advice specifically tailored to the user's medical conditions and dietary restrictions.
    
    User Profile:
    ${profile ? `- Name: ${profile.name}\n- Diseases: ${profile.diseases.join(", ") || "None"}\n- Diet Preference: ${profile.preference}` : "Profile not available yet."}
    
    Strict Dietary Guidelines:
    - If user is Jain: Strictly avoid root vegetables (onion, garlic, potato, carrots) and any non-veg products.
    - If user is Keto: Recommend high-fat, low-carb options.
    - Focus on specific medical impacts (e.g., how fiber helps their Diabetes or why low sodium is key for their Hypertension).
    
    Guidelines:
    1. Be professional, empathetic, and encouraging.
    2. NEVER give generic advice. Be specific. Instead of "eat more fruits", say "eat fiber-rich berries to manage your glucose".
    3. If they ask about foods that are dangerous for their condition, be clear and warn them about the risks.
    4. Keep responses concise but highly authoritative.
    5. Use markdown for lists and bold text for key terms.
  `;

  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile", // Unified with meal generation model
        messages: [
          { role: "system", content: systemPrompt },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Chat Groq API Error Response:", errorText);
      throw new Error(`Groq API Error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error: any) {
    console.error("Chat AI Error:", error);
    return `I'm sorry, I encountered an error: ${error.message || "Unknown error"}. Please try again later.`;
  }
}
