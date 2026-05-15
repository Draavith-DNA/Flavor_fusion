import { supabase } from "./supabase";
import { UserProfile, MealPlan, MealItem } from "@/data/mockData";

/**
 * Saves a complete onboarding profile and generated meal plan to the relational database.
 */
export async function saveFullProfile(userId: string, profile: UserProfile, plan: MealPlan) {
  // 1. Ensure Profile exists and is marked as completed
  const { error: profileError } = await supabase
    .from('profiles')
    .upsert({ 
      id: userId, 
      onboarding_completed: true, 
      dietary_preference: profile.preference,
      full_name: profile.name 
    });

  if (profileError) throw profileError;

  // 2. Save Biometrics (linked to profile)
  await supabase
    .from('biometrics')
    .upsert({
      user_id: userId,
      age: profile.age,
      weight: profile.weight,
      height: profile.height,
      health_conditions: profile.diseases,
    });

  // 3. Create a new Meal Plan record
  const { data: planRecord, error: planError } = await supabase
    .from('meal_plans')
    .insert({
      user_id: userId,
      diet_type: profile.preference,
      total_calories: plan.totalCalories,
      is_active: true
    })
    .select()
    .single();

  if (planError) throw planError;

  // 4. Save individual meals
  const allMeals = [
    ...plan.breakfast.map(m => ({ ...m, meal_type: 'breakfast' })),
    ...plan.lunch.map(m => ({ ...m, meal_type: 'lunch' })),
    ...plan.snacks.map(m => ({ ...m, meal_type: 'snacks' })),
    ...plan.dinner.map(m => ({ ...m, meal_type: 'dinner' })),
  ];

  const mealsToInsert = allMeals.map(meal => ({
    user_id: userId,
    plan_id: planRecord.id,
    meal_type: meal.meal_type,
    name: meal.name,
    calories: meal.calories,
    protein: meal.protein,
    fat: meal.fat,
    carbs: meal.carbs,
    benefits: meal.benefits,
    meal_time: meal.mealTime,
    is_completed: false
  }));

  const { error: mealsError } = await supabase
    .from('meals')
    .insert(mealsToInsert);

  if (mealsError) throw mealsError;
  
  return planRecord.id;
}

/**
 * Fetches the active meal plan and associated meals for a user.
 */
export async function fetchActivePlan(userId: string) {
  const { data: plan, error: planError } = await supabase
    .from('meal_plans')
    .select('*, meals(*)')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (planError) return null;
  return plan;
}
