import avocadoToast from "@/assets/avocado-toast.jpg";
import salmonSalad from "@/assets/salmon-salad.jpg";
import smoothieBowl from "@/assets/smoothie-bowl.jpg";
import chickenBroccoli from "@/assets/chicken-broccoli.jpg";
import mixedNuts from "@/assets/mixed-nuts.jpg";

export const diseases = [
  "Diabetes", "Hypertension", "PCOS", "IBS",
  "Thyroid", "Heart Disease", "Kidney Disease",
  "Obesity", "Anemia", "Cholesterol", "Celiac Disease"
];

export const diseaseIcons: Record<string, string> = {
  "Diabetes": "💉",
  "Hypertension": "❤️‍🩹",
  "PCOS": "🩺",
  "IBS": "🫄",
  "Thyroid": "🦋",
  "Heart Disease": "❤️",
  "Kidney Disease": "🫘",
  "Obesity": "⚖️",
  "Anemia": "🩸",
  "Cholesterol": "🧬",
  "Celiac Disease": "🌾",
};

export const dietaryPreferences = [
  "Vegetarian", "Non-Vegetarian", "Vegan", "Jain", "Keto", "Mediterranean", "Paleo", "DASH", "Whole30"
];

export const dietIcons: Record<string, string> = {
  "Vegetarian": "🥬",
  "Non-Vegetarian": "🍗",
  "Vegan": "🌱",
  "Jain": "🙏",
  "Keto": "🥑",
  "Mediterranean": "🫒",
  "Paleo": "🦴",
  "DASH": "💚",
  "Whole30": "🔥",
};

export const dietDescriptions: Record<string, string> = {
  "Vegetarian": "Plant-based with dairy & eggs",
  "Non-Vegetarian": "Includes meat, fish & poultry",
  "Vegan": "100% plant-based, no animal products",
  "Jain": "No root vegetables, sattvic diet",
  "Keto": "High fat, very low carb",
  "Mediterranean": "Heart-healthy, olive oil based",
  "Paleo": "Whole foods, no grains or dairy",
  "DASH": "Low sodium, heart-healthy eating",
  "Whole30": "30-day reset, no sugar or grains",
};

export interface MealItem {
  name: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  benefits: string;
  image: string;
  mealTime: string;
  prepTime?: string;
  warning?: string;
}

export interface MealPlan {
  breakfast: MealItem[];
  lunch: MealItem[];
  snacks: MealItem[];
  dinner: MealItem[];
  totalCalories: number;
  totalProtein: number;
  totalFat: number;
  totalCarbs: number;
  goalCalories: number;
  riskAlerts: RiskAlert[];
}

export interface RiskAlert {
  food: string;
  disease: string;
  severity: "high" | "medium" | "low";
  message: string;
}

export interface UserProfile {
  name: string;
  age: number;
  weight: number;
  height: number;
  diseases: string[];
  preference: string;
}

const mealsByDiet: Record<string, { breakfast: MealItem[]; lunch: MealItem[]; snacks: MealItem[]; dinner: MealItem[] }> = {
  Vegetarian: {
    breakfast: [
      { name: "Avocado Toast", calories: 280, protein: 12, fat: 15, carbs: 28, benefits: "Low Glycemic for blood sugar control", image: avocadoToast, mealTime: "Breakfast · 7am" },
      { name: "Vegetable Poha", calories: 240, protein: 7, fat: 6, carbs: 38, benefits: "Light, easy-to-digest carbs for steady energy", image: smoothieBowl, mealTime: "Breakfast · 8am" },
    ],
    lunch: [
      { name: "Quinoa Buddha Bowl", calories: 350, protein: 18, fat: 12, carbs: 42, benefits: "Complete protein with all amino acids", image: salmonSalad, mealTime: "Lunch · 1pm" },
      { name: "Rajma Chawal (Brown Rice)", calories: 380, protein: 16, fat: 8, carbs: 60, benefits: "Plant protein + fiber-rich complex carbs", image: chickenBroccoli, mealTime: "Lunch · 1:30pm" },
    ],
    snacks: [
      { name: "Mixed Nuts & Seeds", calories: 170, protein: 6, fat: 14, carbs: 8, benefits: "Healthy fats for heart health", image: mixedNuts, mealTime: "Snack · 4pm" },
      { name: "Berry Smoothie Bowl", calories: 200, protein: 8, fat: 4, carbs: 36, benefits: "Rich in antioxidants & vitamins", image: smoothieBowl, mealTime: "Snack · 11am" },
    ],
    dinner: [
      { name: "Palak Paneer & Roti", calories: 400, protein: 22, fat: 18, carbs: 38, benefits: "Iron-rich spinach with protein", image: chickenBroccoli, mealTime: "Dinner · 7pm" },
      { name: "Vegetable Khichdi", calories: 320, protein: 12, fat: 8, carbs: 50, benefits: "Easy on the gut, balanced one-pot meal", image: salmonSalad, mealTime: "Dinner · 8pm" },
    ],
  },
  "Non-Vegetarian": {
    breakfast: [
      { name: "Egg White Omelette", calories: 250, protein: 22, fat: 10, carbs: 12, benefits: "High protein, low calorie start", image: avocadoToast, mealTime: "Breakfast · 7am" },
      { name: "Smoked Salmon Bagel", calories: 340, protein: 24, fat: 12, carbs: 36, benefits: "Omega-3s for brain & heart", image: smoothieBowl, mealTime: "Breakfast · 8am" },
    ],
    lunch: [
      { name: "Grilled Salmon Salad", calories: 380, protein: 32, fat: 18, carbs: 20, benefits: "Omega-3 rich for heart & brain", image: salmonSalad, mealTime: "Lunch · 1pm" },
      { name: "Chicken Caesar Wrap", calories: 420, protein: 30, fat: 18, carbs: 36, benefits: "Lean protein with greens", image: chickenBroccoli, mealTime: "Lunch · 1:30pm" },
    ],
    snacks: [
      { name: "Mixed Nuts & Seeds", calories: 170, protein: 6, fat: 14, carbs: 8, benefits: "Healthy fats for heart health", image: mixedNuts, mealTime: "Snack · 4pm" },
      { name: "Greek Yogurt Parfait", calories: 190, protein: 14, fat: 5, carbs: 28, benefits: "Probiotics for gut health", image: smoothieBowl, mealTime: "Snack · 11am" },
    ],
    dinner: [
      { name: "Grilled Chicken & Broccoli", calories: 400, protein: 35, fat: 16, carbs: 22, benefits: "High protein for muscle recovery", image: chickenBroccoli, mealTime: "Dinner · 7pm" },
      { name: "Baked Cod & Sweet Potato", calories: 380, protein: 30, fat: 10, carbs: 38, benefits: "Lean white fish with complex carbs", image: salmonSalad, mealTime: "Dinner · 8pm" },
    ],
  },
  Vegan: {
    breakfast: [
      { name: "Chia Seed Pudding", calories: 240, protein: 8, fat: 12, carbs: 28, benefits: "Omega-3 & fiber rich", image: smoothieBowl, mealTime: "Breakfast · 7am" },
      { name: "Tofu Scramble Wrap", calories: 290, protein: 18, fat: 11, carbs: 30, benefits: "Plant protein-packed start", image: avocadoToast, mealTime: "Breakfast · 8am" },
    ],
    lunch: [
      { name: "Lentil & Kale Stew", calories: 320, protein: 20, fat: 8, carbs: 44, benefits: "Iron & protein from legumes", image: salmonSalad, mealTime: "Lunch · 1pm" },
      { name: "Chickpea Falafel Bowl", calories: 380, protein: 18, fat: 14, carbs: 48, benefits: "Mediterranean plant power", image: chickenBroccoli, mealTime: "Lunch · 1:30pm" },
    ],
    snacks: [
      { name: "Hummus & Veggie Sticks", calories: 160, protein: 7, fat: 9, carbs: 16, benefits: "Plant protein with fiber", image: mixedNuts, mealTime: "Snack · 4pm" },
      { name: "Acai Bowl", calories: 210, protein: 5, fat: 6, carbs: 38, benefits: "Superfood antioxidants", image: smoothieBowl, mealTime: "Snack · 11am" },
    ],
    dinner: [
      { name: "Tofu Stir-Fry with Quinoa", calories: 380, protein: 24, fat: 14, carbs: 40, benefits: "Complete plant-based protein", image: chickenBroccoli, mealTime: "Dinner · 7pm" },
      { name: "Black Bean Tacos", calories: 360, protein: 16, fat: 10, carbs: 52, benefits: "Fiber-rich plant meal", image: salmonSalad, mealTime: "Dinner · 8pm" },
    ],
  },
  Jain: {
    breakfast: [
      { name: "Sabudana Khichdi", calories: 290, protein: 6, fat: 12, carbs: 42, benefits: "Easy to digest, energy boost", image: avocadoToast, mealTime: "Breakfast · 7am" },
      { name: "Methi Thepla with Curd", calories: 270, protein: 9, fat: 10, carbs: 36, benefits: "Iron-rich, gut-friendly", image: smoothieBowl, mealTime: "Breakfast · 8am" },
    ],
    lunch: [
      { name: "Moong Dal Cheela", calories: 280, protein: 16, fat: 8, carbs: 36, benefits: "Protein-rich without root veggies", image: salmonSalad, mealTime: "Lunch · 1pm" },
      { name: "Kadhi & Steamed Rice", calories: 340, protein: 12, fat: 10, carbs: 50, benefits: "Comforting, gut-soothing", image: chickenBroccoli, mealTime: "Lunch · 1:30pm" },
    ],
    snacks: [
      { name: "Dry Fruit Ladoo", calories: 180, protein: 5, fat: 10, carbs: 22, benefits: "Natural energy from dry fruits", image: mixedNuts, mealTime: "Snack · 4pm" },
      { name: "Fresh Fruit Bowl", calories: 150, protein: 2, fat: 1, carbs: 38, benefits: "Vitamins & natural sugars", image: smoothieBowl, mealTime: "Snack · 11am" },
    ],
    dinner: [
      { name: "Paneer Tikka (No Onion/Garlic)", calories: 350, protein: 20, fat: 22, carbs: 18, benefits: "Sattvic protein source", image: chickenBroccoli, mealTime: "Dinner · 7pm" },
      { name: "Bottle Gourd Sabzi & Roti", calories: 280, protein: 8, fat: 8, carbs: 44, benefits: "Light, hydrating dinner", image: salmonSalad, mealTime: "Dinner · 8pm" },
    ],
  },
  Keto: {
    breakfast: [
      { name: "Bulletproof Coffee & Eggs", calories: 420, protein: 18, fat: 38, carbs: 3, benefits: "Sustained energy from healthy fats", image: avocadoToast, mealTime: "Breakfast · 7am" },
      { name: "Avocado & Bacon Plate", calories: 460, protein: 20, fat: 40, carbs: 6, benefits: "Pure keto fuel", image: smoothieBowl, mealTime: "Breakfast · 8am" },
    ],
    lunch: [
      { name: "Avocado Chicken Salad", calories: 450, protein: 30, fat: 34, carbs: 8, benefits: "High fat, minimal carbs for ketosis", image: salmonSalad, mealTime: "Lunch · 1pm" },
      { name: "Zucchini Noodle Carbonara", calories: 480, protein: 28, fat: 36, carbs: 10, benefits: "Pasta-style, no carbs", image: chickenBroccoli, mealTime: "Lunch · 1:30pm" },
    ],
    snacks: [
      { name: "Cheese & Almond Plate", calories: 220, protein: 12, fat: 18, carbs: 4, benefits: "Keto-friendly fats & protein", image: mixedNuts, mealTime: "Snack · 4pm" },
      { name: "Coconut Fat Bombs", calories: 180, protein: 2, fat: 18, carbs: 2, benefits: "MCTs for brain fuel", image: smoothieBowl, mealTime: "Snack · 11am" },
    ],
    dinner: [
      { name: "Salmon with Cauliflower Mash", calories: 480, protein: 35, fat: 32, carbs: 10, benefits: "Omega-3 with low-carb sides", image: chickenBroccoli, mealTime: "Dinner · 7pm" },
      { name: "Ribeye Steak & Asparagus", calories: 520, protein: 40, fat: 36, carbs: 6, benefits: "Classic keto power dinner", image: salmonSalad, mealTime: "Dinner · 8pm" },
    ],
  },
  Mediterranean: {
    breakfast: [
      { name: "Greek Yogurt with Honey & Walnuts", calories: 300, protein: 15, fat: 14, carbs: 32, benefits: "Probiotics & healthy fats", image: avocadoToast, mealTime: "Breakfast · 7am" },
      { name: "Shakshuka", calories: 320, protein: 16, fat: 18, carbs: 22, benefits: "Eggs poached in tomato richness", image: smoothieBowl, mealTime: "Breakfast · 8am" },
    ],
    lunch: [
      { name: "Mediterranean Grain Bowl", calories: 380, protein: 16, fat: 18, carbs: 42, benefits: "Heart-healthy olive oil & grains", image: salmonSalad, mealTime: "Lunch · 1pm" },
      { name: "Tuna Niçoise Salad", calories: 360, protein: 26, fat: 16, carbs: 26, benefits: "Lean protein & Mediterranean veggies", image: chickenBroccoli, mealTime: "Lunch · 1:30pm" },
    ],
    snacks: [
      { name: "Olives & Feta Plate", calories: 160, protein: 6, fat: 14, carbs: 4, benefits: "Monounsaturated fats", image: mixedNuts, mealTime: "Snack · 4pm" },
      { name: "Hummus & Pita", calories: 200, protein: 8, fat: 8, carbs: 26, benefits: "Chickpea protein & fiber", image: smoothieBowl, mealTime: "Snack · 11am" },
    ],
    dinner: [
      { name: "Baked Sea Bass with Vegetables", calories: 360, protein: 30, fat: 16, carbs: 24, benefits: "Lean protein with Mediterranean herbs", image: chickenBroccoli, mealTime: "Dinner · 7pm" },
      { name: "Lemon Herb Chicken & Couscous", calories: 410, protein: 32, fat: 14, carbs: 38, benefits: "Flavorful, heart-healthy dinner", image: salmonSalad, mealTime: "Dinner · 8pm" },
    ],
  },
  Paleo: {
    breakfast: [
      { name: "Sweet Potato Hash & Eggs", calories: 380, protein: 22, fat: 18, carbs: 32, benefits: "Whole food energy with healthy fats", image: avocadoToast, mealTime: "Breakfast · 7am" },
      { name: "Berry Almond Smoothie", calories: 280, protein: 10, fat: 14, carbs: 28, benefits: "Antioxidant + healthy fats", image: smoothieBowl, mealTime: "Breakfast · 8am" },
    ],
    lunch: [
      { name: "Grilled Chicken & Avocado Salad", calories: 420, protein: 35, fat: 24, carbs: 18, benefits: "Clean protein with anti-inflammatory fats", image: salmonSalad, mealTime: "Lunch · 1pm" },
      { name: "Beef & Veggie Stir-Fry", calories: 440, protein: 34, fat: 22, carbs: 22, benefits: "Iron-rich and grain-free", image: chickenBroccoli, mealTime: "Lunch · 1:30pm" },
    ],
    snacks: [
      { name: "Trail Mix (Nuts & Dried Fruit)", calories: 200, protein: 6, fat: 14, carbs: 16, benefits: "Paleo-friendly natural energy", image: mixedNuts, mealTime: "Snack · 4pm" },
      { name: "Coconut Chia Pudding", calories: 180, protein: 5, fat: 12, carbs: 14, benefits: "Healthy MCTs and fiber", image: smoothieBowl, mealTime: "Snack · 11am" },
    ],
    dinner: [
      { name: "Herb-Crusted Lamb with Roasted Veggies", calories: 460, protein: 38, fat: 26, carbs: 20, benefits: "Iron-rich with antioxidant herbs", image: chickenBroccoli, mealTime: "Dinner · 7pm" },
      { name: "Grilled Trout & Roasted Squash", calories: 410, protein: 32, fat: 20, carbs: 24, benefits: "Omega-3 with seasonal veggies", image: salmonSalad, mealTime: "Dinner · 8pm" },
    ],
  },
  DASH: {
    breakfast: [
      { name: "Oatmeal with Banana & Flaxseed", calories: 300, protein: 10, fat: 8, carbs: 48, benefits: "Low sodium, heart-friendly fiber", image: smoothieBowl, mealTime: "Breakfast · 7am" },
      { name: "Whole Grain Toast & Egg", calories: 280, protein: 16, fat: 10, carbs: 32, benefits: "Balanced low-sodium start", image: avocadoToast, mealTime: "Breakfast · 8am" },
    ],
    lunch: [
      { name: "Turkey & Veggie Wrap", calories: 350, protein: 28, fat: 10, carbs: 38, benefits: "Lean protein, low sodium", image: salmonSalad, mealTime: "Lunch · 1pm" },
      { name: "Lentil & Spinach Soup", calories: 310, protein: 18, fat: 6, carbs: 44, benefits: "Potassium & magnesium powerhouse", image: chickenBroccoli, mealTime: "Lunch · 1:30pm" },
    ],
    snacks: [
      { name: "Unsalted Almonds & Apple", calories: 180, protein: 6, fat: 12, carbs: 16, benefits: "Potassium-rich for blood pressure", image: mixedNuts, mealTime: "Snack · 4pm" },
      { name: "Low-Fat Yogurt with Berries", calories: 150, protein: 10, fat: 3, carbs: 24, benefits: "Calcium & probiotics", image: smoothieBowl, mealTime: "Snack · 11am" },
    ],
    dinner: [
      { name: "Baked Cod with Steamed Broccoli", calories: 320, protein: 32, fat: 8, carbs: 26, benefits: "Omega-3s with low sodium prep", image: chickenBroccoli, mealTime: "Dinner · 7pm" },
      { name: "Grilled Chicken & Brown Rice", calories: 360, protein: 30, fat: 8, carbs: 42, benefits: "DASH-aligned classic dinner", image: salmonSalad, mealTime: "Dinner · 8pm" },
    ],
  },
  Whole30: {
    breakfast: [
      { name: "Veggie Frittata (No Dairy)", calories: 340, protein: 24, fat: 20, carbs: 14, benefits: "Clean protein, no processed ingredients", image: avocadoToast, mealTime: "Breakfast · 7am" },
      { name: "Sweet Potato & Sausage Bowl", calories: 380, protein: 22, fat: 18, carbs: 30, benefits: "Compliant & filling", image: smoothieBowl, mealTime: "Breakfast · 8am" },
    ],
    lunch: [
      { name: "Grilled Shrimp & Zucchini Noodles", calories: 360, protein: 30, fat: 16, carbs: 22, benefits: "Grain-free, whole food nutrition", image: salmonSalad, mealTime: "Lunch · 1pm" },
      { name: "Whole30 Chicken Cobb Salad", calories: 420, protein: 32, fat: 26, carbs: 14, benefits: "Compliant fats & lean protein", image: chickenBroccoli, mealTime: "Lunch · 1:30pm" },
    ],
    snacks: [
      { name: "Cashew Butter & Celery", calories: 170, protein: 5, fat: 14, carbs: 8, benefits: "Whole30 compliant healthy fats", image: mixedNuts, mealTime: "Snack · 4pm" },
      { name: "Mixed Berry Bowl", calories: 120, protein: 2, fat: 1, carbs: 28, benefits: "Natural sugars only, no additives", image: smoothieBowl, mealTime: "Snack · 11am" },
    ],
    dinner: [
      { name: "Herb Roasted Chicken with Sweet Potato", calories: 440, protein: 36, fat: 18, carbs: 32, benefits: "Clean eating with complex carbs", image: chickenBroccoli, mealTime: "Dinner · 7pm" },
      { name: "Beef Meatballs & Spaghetti Squash", calories: 420, protein: 30, fat: 22, carbs: 20, benefits: "Italian-style, Whole30 approved", image: salmonSalad, mealTime: "Dinner · 8pm" },
    ],
  },
};

export function generateMealPlan(profile: UserProfile): MealPlan {
  const diet = mealsByDiet[profile.preference] || mealsByDiet["Vegetarian"];

  const { breakfast, lunch, snacks, dinner } = diet;

  const riskAlerts: RiskAlert[] = [];

  if (profile.diseases.includes("Diabetes")) {
    riskAlerts.push(
      { food: "White Rice", disease: "Diabetes", severity: "high", message: "High glycemic index. Use brown rice or quinoa instead." },
      { food: "Sugary Beverages", disease: "Diabetes", severity: "high", message: "Avoid all sugary drinks. Opt for water or green tea." },
      { food: "Processed Foods", disease: "Diabetes", severity: "medium", message: "Hidden sugars in processed foods. Always check labels." }
    );
  }
  if (profile.diseases.includes("Hypertension")) {
    riskAlerts.push(
      { food: "Excess Salt", disease: "Hypertension", severity: "high", message: "Limit sodium to less than 1,500mg/day." },
      { food: "Red Meat", disease: "Hypertension", severity: "medium", message: "May increase blood pressure. Choose lean proteins." }
    );
  }
  if (profile.diseases.includes("PCOS")) {
    riskAlerts.push(
      { food: "Dairy Products", disease: "PCOS", severity: "medium", message: "Excess dairy may worsen hormonal imbalance." },
      { food: "Refined Carbs", disease: "PCOS", severity: "high", message: "Avoid white bread, maida. Choose whole grains." }
    );
  }
  if (profile.diseases.includes("Cholesterol")) {
    riskAlerts.push(
      { food: "Fried Foods", disease: "Cholesterol", severity: "high", message: "Avoid deep-fried foods. Use air-frying or baking." }
    );
  }
  if (profile.diseases.includes("IBS")) {
    riskAlerts.push(
      { food: "Spicy Foods", disease: "IBS", severity: "high", message: "Can trigger flare-ups. Use mild seasoning." },
      { food: "Carbonated Drinks", disease: "IBS", severity: "medium", message: "May cause bloating. Choose still water." }
    );
  }
  if (profile.diseases.includes("Celiac Disease")) {
    riskAlerts.push(
      { food: "Wheat & Gluten", disease: "Celiac Disease", severity: "high", message: "Strictly avoid all gluten-containing grains." },
      { food: "Beer & Malt", disease: "Celiac Disease", severity: "high", message: "Contains gluten. Choose gluten-free alternatives." }
    );
  }
  if (profile.diseases.includes("Thyroid")) {
    riskAlerts.push(
      { food: "Raw Cruciferous Veggies", disease: "Thyroid", severity: "medium", message: "Goitrogens may affect thyroid. Cook them well." },
      { food: "Soy Products", disease: "Thyroid", severity: "medium", message: "May interfere with thyroid medication absorption." }
    );
  }

  const allMeals = [...breakfast, ...lunch, ...snacks, ...dinner];
  const totalCalories = allMeals.reduce((s, m) => s + m.calories, 0);
  const totalProtein = allMeals.reduce((s, m) => s + m.protein, 0);
  const totalFat = allMeals.reduce((s, m) => s + m.fat, 0);
  const totalCarbs = allMeals.reduce((s, m) => s + m.carbs, 0);

  return {
    breakfast, lunch, snacks, dinner,
    totalCalories, totalProtein, totalFat, totalCarbs,
    goalCalories: 2000,
    riskAlerts,
  };
}

export const chatbotResponses: Record<string, string> = {
  "hello": "Hello! I'm your SmartPlate AI assistant. How can I help you with your diet today? 😊",
  "help": "I can help you with:\n• Understanding your meal plan\n• Food substitutions\n• Nutritional advice\n• Managing diet with health conditions\n\nJust ask me anything!",
  "calories": "Your daily caloric needs depend on age, weight, activity level, and health goals. Based on your profile, I've optimized your meal plan to match your needs.",
  "diabetes": "For diabetes management, focus on low-GI foods, increase fiber intake, and eat at regular intervals. Avoid white rice, sugary drinks, and processed foods.",
  "weight loss": "For healthy weight loss, maintain a caloric deficit of 300-500 cal/day. Focus on protein-rich meals, plenty of vegetables, and stay hydrated.",
  "keto": "The keto diet focuses on high fat, moderate protein, and very low carbs (under 50g/day). It helps your body enter ketosis for fat burning.",
  "jain": "Jain diet excludes root vegetables, onions, garlic, and emphasizes sattvic (pure) foods. Focus on above-ground vegetables, legumes, and grains.",
  "default": "That's a great question! Based on nutritional science, I'd recommend consulting your meal plan and following the risk alerts. Want more specific advice?",
};
