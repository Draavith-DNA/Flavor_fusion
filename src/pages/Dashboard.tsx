import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Flame, TrendingUp, Droplets, Dumbbell, AlertTriangle, ArrowRight, RefreshCw } from "lucide-react";
import { type MealPlan, type MealItem, type UserProfile } from "@/data/mockData";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StreakCard } from "@/components/StreakCard";
import { ReportGenerator } from "@/components/ReportGenerator";
import { StepCounter } from "@/components/StepCounter";

/**
 * A donut chart component that visualizes calorie consumption against a goal.
 */
function CalorieDonut({ current, goal }: { current: number; goal: number }) {
  const remaining = Math.max(goal - current, 0);
  const data = [
    { name: "Consumed", value: current },
    { name: "Remaining", value: remaining },
  ];
  const COLORS = ["hsl(155, 45%, 52%)", "hsl(150, 18%, 88%)"];

  return (
    <div className="relative w-48 h-48 mx-auto">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            startAngle={90}
            endAngle={-270}
            paddingAngle={3}
            dataKey="value"
            stroke="none"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-display font-extrabold text-foreground">{current.toLocaleString()}</span>
        <span className="text-xs text-muted-foreground font-medium">/ {goal.toLocaleString()} kcal</span>
        <span className="text-[10px] text-primary font-bold mt-0.5">Daily Goal</span>
      </div>
    </div>
  );
}

/**
 * A small circular badge to display specific macronutrient values (protein, fat, carbs).
 */
function MacroBadge({ label, value, unit, color }: { label: string; value: number; unit: string; color: string }) {
  return (
    <div className="text-center">
      <div className={`h-10 w-10 rounded-full border-2 mx-auto mb-1 flex items-center justify-center text-xs font-bold`} style={{ borderColor: color, color }}>
        {value}{unit}
      </div>
      <span className="text-[10px] text-muted-foreground font-medium">{label}</span>
    </div>
  );
}

/**
 * A card component representing a single meal item with image, name, and benefits.
 */
function MealCard({ item, onSwap }: { item: MealItem; onSwap?: () => void }) {
  const navigate = useNavigate();
  const slug = item.name.toLowerCase().replace(/\s+/g, "-");

  return (
    <motion.div
      className="soft-card-hover p-4 flex gap-4 items-center cursor-pointer"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => navigate(`/meal/${slug}`)}
    >
      <img
        src={item.image}
        alt={item.name}
        loading="lazy"
        width={64}
        height={64}
        className="h-16 w-16 rounded-2xl object-cover flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="font-bold text-sm text-foreground">{item.name}</h4>
            <p className="text-xs text-muted-foreground">{item.mealTime}</p>
          </div>
          {onSwap && (
            <button onClick={onSwap} className="text-primary text-xs font-bold flex items-center gap-1 hover:underline whitespace-nowrap">
              <RefreshCw className="h-3 w-3" />
              Swap
            </button>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
          <div className="flex items-center gap-1">
            <span className="text-primary text-[10px] font-bold whitespace-nowrap">Why this works:</span>
            <span className="text-[10px] text-muted-foreground truncate max-w-[120px]">{item.benefits}</span>
          </div>
          {item.prepTime && (
            <div className="flex items-center gap-1">
              <span className="text-amber-600 text-[10px] font-bold whitespace-nowrap">Time:</span>
              <span className="text-[10px] text-muted-foreground">{item.prepTime}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function Dashboard() {
  const [plan, setPlan] = useState<MealPlan | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = sessionStorage.getItem("mealPlan");
    const storedProfile = sessionStorage.getItem("userProfile");
    if (stored) setPlan(JSON.parse(stored));
    if (storedProfile) setProfile(JSON.parse(storedProfile));
  }, []);

  if (!plan) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-6">
        <div className="soft-card p-10 text-center max-w-md">
          <Flame className="h-12 w-12 text-primary mx-auto mb-4" />
          <h2 className="text-xl font-display font-extrabold mb-2">No Diet Plan Yet</h2>
          <p className="text-muted-foreground mb-6 text-sm">Generate your personalized AI diet plan first</p>
          <Button onClick={() => navigate("/planner")} className="coral-btn px-8 h-12 text-base shadow-lg">
            Go to Planner
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  const allMeals = [...plan.breakfast, ...plan.lunch, ...plan.snacks, ...plan.dinner];

  return (
    <div className="min-h-[calc(100vh-3.5rem)] px-6 py-8 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Greeting */}
        <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold">
              Hi {profile?.name || "Alex"}! 👋
            </h1>
            <p className="text-lg font-display font-bold text-muted-foreground">
              Good Morning. {profile?.preference && <span className="text-primary">{profile.preference} plan</span>}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/diets")}
              className="rounded-xl font-bold"
            >
              Browse Diets
            </Button>
            <Button
              size="sm"
              onClick={() => navigate("/planner")}
              className="coral-btn"
            >
              <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
              Edit Plan
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Donut card */}
            <div className="soft-card p-6">
              <h3 className="font-display font-extrabold mb-4 text-center">Daily SmartPlate</h3>
              <CalorieDonut current={plan.totalCalories} goal={plan.goalCalories} />
              <div className="flex justify-center gap-6 mt-4">
                <MacroBadge label="Protein" value={plan.totalProtein} unit="g" color="hsl(155, 45%, 52%)" />
                <MacroBadge label="Fat" value={plan.totalFat} unit="g" color="hsl(38, 92%, 50%)" />
                <MacroBadge label="Carbs" value={plan.totalCarbs} unit="g" color="hsl(12, 80%, 62%)" />
              </div>
            </div>

            {/* Streak */}
            <StreakCard />

            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Water", value: "3.2L", icon: Droplets, color: "text-blue-500" },
                { label: "Alerts", value: `${plan.riskAlerts.length}`, icon: AlertTriangle, color: "text-warning" },
              ].map((s) => (
                <div key={s.label} className="soft-card p-4 flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
                    <s.icon className={`h-4 w-4 ${s.color}`} />
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground font-medium">{s.label}</span>
                    <p className="font-display font-extrabold">{s.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Report download */}
            <ReportGenerator plan={plan} profile={profile} />

            {/* Step Counter */}
            <StepCounter />
          </div>

          {/* Right column - Meals */}
          <div className="lg:col-span-3 space-y-6">
            <div className="soft-card p-6">
              <h3 className="font-display font-extrabold mb-4">Today's Meals</h3>
              <div className="space-y-3">
                {allMeals.map((meal) => (
                  <MealCard key={meal.name} item={meal} onSwap={() => {}} />
                ))}
              </div>
            </div>

            {/* Risk alerts inline */}
            {plan.riskAlerts.length > 0 && (
              <div className="soft-card p-6 border-l-4 border-warning">
                <h3 className="font-display font-extrabold mb-3 flex items-center gap-2 text-sm">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  Risk Alerts
                </h3>
                <div className="space-y-2">
                  {plan.riskAlerts.slice(0, 3).map((alert, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs">
                      <span className={`mt-0.5 h-1.5 w-1.5 rounded-full flex-shrink-0 ${
                        alert.severity === "high" ? "bg-destructive" : "bg-warning"
                      }`} />
                      <span className="text-muted-foreground">
                        <strong className="text-foreground">{alert.food}</strong>: {alert.message}
                      </span>
                    </div>
                  ))}
                  {plan.riskAlerts.length > 3 && (
                    <button
                      onClick={() => navigate("/alerts")}
                      className="text-primary text-xs font-bold hover:underline"
                    >
                      View all {plan.riskAlerts.length} alerts →
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Progress section */}
        <div className="soft-card p-6 mt-6">
          <h3 className="font-display font-extrabold mb-5 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            Weekly Progress
          </h3>
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
            {[
              { label: "Calorie Goal", value: 78 },
              { label: "Hydration", value: 65 },
              { label: "Protein Intake", value: 82 },
              { label: "Fiber Intake", value: 55 },
            ].map((item) => (
              <div key={item.label} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground font-medium">{item.label}</span>
                  <span className="font-display font-extrabold text-primary">{item.value}%</span>
                </div>
                <Progress value={item.value} className="h-2.5 bg-secondary rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
