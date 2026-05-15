import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Flame, 
  Utensils, 
  CheckCircle2, 
  RefreshCw, 
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StreakCard } from "@/components/StreakCard";
import { ReportGenerator } from "@/components/ReportGenerator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { fetchActivePlan } from "@/lib/db";
import { type MealPlan, type UserProfile, type MealItem } from "@/data/mockData";

/**
 * A donut chart component that visualizes calorie consumption against a goal.
 */
function CalorieDonut({ current, goal }: { current: number; goal: number }) {
  const percentage = Math.min((current / goal) * 100, 100);
  const strokeDasharray = 2 * Math.PI * 45;
  const strokeDashoffset = strokeDasharray - (strokeDasharray * percentage) / 100;

  return (
    <div className="relative h-48 w-48 mx-auto group">
      <svg className="h-full w-full transform -rotate-90">
        <circle cx="96" cy="96" r="45" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-secondary" />
        <circle 
          cx="96" cy="96" r="45" stroke="currentColor" strokeWidth="12" fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="text-primary transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-display font-black text-foreground">{current}</span>
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Kcal / {goal}</span>
      </div>
    </div>
  );
}

function MacroBadge({ label, value, unit, color }: { label: string; value: number; unit: string; color: string }) {
  return (
    <div className="text-center">
      <div className="h-2 w-8 rounded-full mx-auto mb-2" style={{ backgroundColor: color }} />
      <p className="text-xs font-bold text-muted-foreground uppercase tracking-tighter mb-0.5">{label}</p>
      <p className="font-display font-black text-sm">{value}{unit}</p>
    </div>
  );
}

function MealCard({ meal, isCompleted, onToggle }: { meal: MealItem; isCompleted: boolean; onToggle: () => void }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.01 }}
      className={`soft-card p-5 flex items-center gap-4 transition-all duration-300 border-2 ${isCompleted ? "bg-secondary/30 border-transparent opacity-75" : "bg-card border-border hover:border-primary/30"}`}
    >
      <div className={`h-12 w-12 rounded-2xl flex items-center justify-center text-xl shadow-inner ${isCompleted ? "bg-muted" : "bg-primary/10"}`}>
        {isCompleted ? "✅" : "🥣"}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className={`font-display font-extrabold truncate ${isCompleted ? "line-through text-muted-foreground" : ""}`}>{meal.name}</h4>
        <p className="text-xs text-muted-foreground font-medium flex items-center gap-2">
          <span>{meal.calories} kcal</span>
          <span className="h-1 w-1 rounded-full bg-border" />
          <span>{meal.protein}g Protein</span>
        </p>
      </div>
      <button 
        onClick={(e) => { e.stopPropagation(); onToggle(); }}
        className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all ${isCompleted ? "bg-primary text-white scale-90" : "bg-secondary hover:bg-primary/20 text-muted-foreground"}`}
      >
        <CheckCircle2 className="h-5 w-5" />
      </button>
    </motion.div>
  );
}

export default function Dashboard() {
  const [plan, setPlan] = useState<MealPlan | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [completedMeals, setCompletedMeals] = useState<string[]>([]);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    async function loadAllData() {
      setIsLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // 1. Fetch Profile and Biometrics
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*, biometrics(*)')
            .eq('id', user.id)
            .single();
          
          if (profileData) {
            const bio = profileData.biometrics?.[0];
            setProfile({
              name: profileData.full_name || "User",
              age: bio?.age,
              weight: bio?.weight,
              height: bio?.height,
              diseases: bio?.health_conditions || [],
              preference: profileData.dietary_preference || "Standard"
            });
          }

          // 2. Fetch Active Meal Plan
          const activePlan = await fetchActivePlan(user.id);
          if (activePlan && activePlan.meals) {
            const transformedPlan: MealPlan = {
              totalCalories: activePlan.total_calories || 0,
              totalProtein: activePlan.meals.reduce((sum: number, m: any) => sum + (m.protein || 0), 0),
              totalFat: activePlan.meals.reduce((sum: number, m: any) => sum + (m.fat || 0), 0),
              totalCarbs: activePlan.meals.reduce((sum: number, m: any) => sum + (m.carbs || 0), 0),
              goalCalories: (activePlan.total_calories || 2000) + 500,
              riskAlerts: [],
              breakfast: activePlan.meals.filter((m: any) => m.meal_type === 'breakfast'),
              lunch: activePlan.meals.filter((m: any) => m.meal_type === 'lunch'),
              snacks: activePlan.meals.filter((m: any) => m.meal_type === 'snacks'),
              dinner: activePlan.meals.filter((m: any) => m.meal_type === 'dinner'),
            };
            setPlan(transformedPlan);
            setCompletedMeals(activePlan.meals.filter((m: any) => m.is_completed).map((m: any) => m.name));
          }
        }
      } catch (err) {
        console.error("Dashboard load failed:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadAllData();
  }, []);

  const allMeals = plan ? [...plan.breakfast, ...plan.lunch, ...plan.snacks, ...plan.dinner] : [];

  const toggleMeal = async (mealName: string) => {
    const isNowCompleted = !completedMeals.includes(mealName);
    setCompletedMeals(prev => isNowCompleted ? [...prev, mealName] : prev.filter(m => m !== mealName));

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      await supabase.from('meals').update({ is_completed: isNowCompleted }).eq('user_id', user.id).eq('name', mealName).eq('date', new Date().toISOString().split("T")[0]);
      if (isNowCompleted && completedMeals.length + 1 === allMeals.length) {
        toast({ title: "Goal Met! 🏆", description: "You crushed all your meals today!" });
      }
    } catch (err) {
      console.error("Toggle failed:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground font-medium animate-pulse">Building your clinical dashboard...</p>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-6">
        <div className="soft-card p-12 text-center max-w-md">
          <Utensils className="h-12 w-12 text-primary mx-auto mb-6" />
          <h2 className="text-2xl font-display font-extrabold mb-4">No Active Plan</h2>
          <p className="text-muted-foreground mb-8">Setup your biometrics and AI will build your roadmap.</p>
          <Button onClick={() => navigate("/planner")} className="coral-btn px-10 h-14 text-lg">Start Planning <ArrowRight className="ml-2 h-5 w-5" /></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] px-6 py-8 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <header className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-black mb-1">Welcome, {profile?.name}!</h1>
            <p className="text-muted-foreground font-medium">Tracking your <span className="text-primary font-bold">{profile?.preference}</span> journey.</p>
          </div>
          <div className="flex gap-3">
            <ReportGenerator />
            <Button onClick={() => navigate("/planner")} variant="outline" className="rounded-2xl font-bold h-11"><RefreshCw className="mr-2 h-4 w-4" /> Update Plan</Button>
          </div>
        </header>

        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-8">
            <div className="soft-card p-8 text-center bg-gradient-to-br from-card to-secondary/20">
              <h3 className="font-display font-black text-sm uppercase tracking-widest text-muted-foreground mb-6">Metabolic Intake</h3>
              <CalorieDonut current={plan.totalCalories} goal={plan.goalCalories} />
              <div className="flex justify-center gap-8 mt-10">
                <MacroBadge label="Prot" value={plan.totalProtein} unit="g" color="#10b981" />
                <MacroBadge label="Fat" value={plan.totalFat} unit="g" color="#f59e0b" />
                <MacroBadge label="Carb" value={plan.totalCarbs} unit="g" color="#f43f5e" />
              </div>
            </div>
            <StreakCard />
          </div>

          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-display font-black">Daily Meal Pipeline</h3>
              <span className="text-xs font-black text-primary bg-primary/10 px-3 py-1.5 rounded-full">{completedMeals.length}/{allMeals.length} DONE</span>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-4">
              {[...plan.breakfast, ...plan.lunch, ...plan.snacks, ...plan.dinner].map((meal, idx) => (
                <MealCard key={idx} meal={meal} isCompleted={completedMeals.includes(meal.name)} onToggle={() => toggleMeal(meal.name)} />
              ))}
            </div>

            <div className="soft-card p-6 border-l-4 border-l-primary">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h4 className="font-display font-extrabold">Progress Projection</h4>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-2 uppercase tracking-tighter"><span>Adherence Score</span><span>{Math.round((completedMeals.length / allMeals.length) * 100)}%</span></div>
                  <Progress value={(completedMeals.length / allMeals.length) * 100} className="h-3 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
