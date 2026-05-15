import { motion } from "framer-motion";
import { User, Mail, Activity, Target, Scale, Ruler, LogOut, Info, Heart, Thermometer, Brain, Check, Sparkles, ChevronDown, Loader2, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";
import { type UserProfile, dietaryPreferences, dietIcons } from "@/data/mockData";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { generateMealPlanAI } from "@/lib/ai";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [email, setEmail] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchProfileData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setEmail(user.email || "");
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (data && !error) {
        setProfile({
          name: data.full_name,
          age: data.age,
          weight: data.weight,
          height: data.height,
          diseases: data.health_conditions || [],
          preference: data.dietary_preference
        });
      }
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const updatePreference = async (newPref: string) => {
    setIsUpdating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .update({ dietary_preference: newPref })
        .eq('id', user.id);

      if (error) throw error;
      
      setProfile(prev => prev ? { ...prev, preference: newPref } : null);
      toast({ title: "Preference Updated", description: `Diet changed to ${newPref}` });
    } catch (error: any) {
      toast({ title: "Update Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsUpdating(false);
    }
  };

  const regeneratePlan = async () => {
    if (!profile) return;
    setIsRegenerating(true);
    try {
      const plan = await generateMealPlanAI(profile);
      sessionStorage.setItem("mealPlan", JSON.stringify(plan));
      sessionStorage.setItem("userProfile", JSON.stringify(profile));
      toast({ title: "Plan Regenerated! ✨", description: "AI has updated your diet plan based on your new preference." });
      navigate("/dashboard");
    } catch (error: any) {
      toast({ title: "Regeneration Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    sessionStorage.clear();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/login");
  };

  const calculateBMI = () => {
    if (!profile?.weight || !profile?.height) return null;
    const heightInMeters = profile.height / 100;
    return (profile.weight / (heightInMeters * heightInMeters)).toFixed(1);
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { label: "Underweight", color: "text-blue-500" };
    if (bmi < 25) return { label: "Healthy", color: "text-primary" };
    if (bmi < 30) return { label: "Overweight", color: "text-orange-500" };
    return { label: "Obese", color: "text-destructive" };
  };

  const bmi = calculateBMI();
  const bmiVal = bmi ? parseFloat(bmi) : 0;
  const bmiCategory = bmi ? getBMICategory(bmiVal) : null;

  return (
    <div className="min-h-[calc(100vh-3.5rem)] px-6 py-8 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <header className="mb-8">
          <h1 className="text-3xl font-display font-extrabold tracking-tight">
            Health Dashboard <span className="text-primary text-xl">v1.0</span>
          </h1>
          <p className="text-muted-foreground text-sm font-medium">Your clinical profile and metabolic overview</p>
        </header>

        <div className="grid md:grid-cols-3 gap-6">
          {/* User Basic Info Card */}
          <div className="md:col-span-1 space-y-6">
            <div className="soft-card p-6 text-center">
              <div className="relative inline-block mb-4">
                <div className="h-24 w-24 rounded-3xl gradient-mint flex items-center justify-center mx-auto shadow-inner">
                  <User className="h-12 w-12 text-primary-foreground" />
                </div>
                <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-background border-4 border-card flex items-center justify-center">
                  <Check className="h-4 w-4 text-primary" />
                </div>
              </div>
              <h2 className="font-display font-extrabold text-xl mb-1">{profile?.name || "User"}</h2>
              <p className="text-xs text-muted-foreground flex items-center justify-center gap-1 font-bold bg-secondary/50 py-1.5 px-3 rounded-full w-fit mx-auto">
                <Mail className="h-3 w-3" /> {email || "Connected"}
              </p>

              <div className="mt-8 pt-6 border-t border-border space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground font-medium">Status</span>
                  <span className="text-primary font-bold">Active Patient</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground font-medium">Joined</span>
                  <span className="text-foreground font-bold">May 2026</span>
                </div>
              </div>

              <Button 
                variant="ghost" 
                onClick={handleLogout}
                className="w-full mt-8 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl font-bold flex items-center justify-center gap-2 h-11"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
            
            {/* BMI Card */}
            <div className="soft-card p-6 bg-primary/5 border-primary/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-extrabold text-sm">Metabolic BMI</h3>
                <Info className="h-3.5 w-3.5 text-primary/40" />
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-display font-extrabold text-primary">{bmi || "N/A"}</span>
                <span className={`text-xs font-bold ${bmiCategory?.color}`}>{bmiCategory?.label}</span>
              </div>
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden mt-4">
                <div 
                  className="h-full bg-primary transition-all duration-1000" 
                  style={{ width: bmi ? `${Math.min(100, (bmiVal / 40) * 100)}%` : "0%" }} 
                />
              </div>
              <p className="text-[10px] text-muted-foreground mt-3 leading-relaxed">
                Your BMI is calculated based on clinical height/weight ratios.
              </p>
            </div>
          </div>

          {/* Detailed Stats Column */}
          <div className="md:col-span-2 space-y-6">
            <div className="soft-card p-6">
              <h3 className="font-display font-extrabold mb-6 flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                Clinical Parameters
              </h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { label: "Weight", value: profile?.weight ? `${profile.weight} kg` : 'N/A', icon: Scale, trend: "Stable" },
                  { label: "Height", value: profile?.height ? `${profile.height} cm` : 'N/A', icon: Ruler, trend: "Static" },
                  { label: "Age", value: profile?.age ? `${profile.age} yrs` : 'N/A', icon: Activity, trend: "Primary" },
                  { label: "Heart Rate", value: "72 bpm", icon: Heart, trend: "Normal" },
                  { label: "Body Temp", value: "98.6 °F", icon: Thermometer, trend: "Normal" },
                  { label: "Metabolic", value: "High", icon: Brain, trend: "Active" },
                ].map((item) => (
                  <div key={item.label} className="soft-card p-4 border border-border/40 hover:border-primary/20 transition-colors">
                    <div className="h-10 w-10 rounded-2xl bg-secondary flex items-center justify-center mb-3">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{item.label}</span>
                    <p className="font-display font-extrabold text-lg leading-none mt-1">{item.value}</p>
                    <span className="text-[9px] text-primary font-bold mt-2 inline-block px-2 py-0.5 bg-primary/10 rounded-md">
                      {item.trend}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {/* Diet Preferences Card */}
              <div className="soft-card p-6 relative overflow-hidden">
                <h3 className="font-display font-extrabold mb-4 flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  Nutrition Logic
                </h3>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-3xl">
                    {profile?.preference ? dietIcons[profile.preference] : "🍽️"}
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground font-bold uppercase">Current Preference</span>
                    <p className="font-display font-extrabold text-xl">{profile?.preference || 'Not Set'}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full h-12 rounded-xl font-bold justify-between border-2 border-border/60 hover:border-primary/40 hover:bg-transparent">
                        Switch Preference <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2">
                      {dietaryPreferences.map((p) => (
                        <DropdownMenuItem 
                          key={p} 
                          onClick={() => updatePreference(p)}
                          className="rounded-xl font-bold text-sm gap-2 p-3 cursor-pointer"
                        >
                          <span className="text-xl">{dietIcons[p]}</span>
                          {p}
                          {profile?.preference === p && <Check className="ml-auto h-4 w-4 text-primary" />}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Button 
                    onClick={regeneratePlan} 
                    disabled={isRegenerating || isUpdating}
                    className="w-full coral-btn h-12 shadow-xl"
                  >
                    {isRegenerating ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Training AI...</>
                    ) : (
                      <><Sparkles className="mr-2 h-4 w-4" /> Re-sync AI Diet</>
                    )}
                  </Button>
                </div>
                
                {isUpdating && (
                  <div className="absolute inset-0 bg-background/60 flex items-center justify-center backdrop-blur-sm z-10">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                )}
              </div>

              {/* Conditions Card */}
              <div className="soft-card p-6">
                <h3 className="font-display font-extrabold mb-4 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  Clinical History
                </h3>
                {profile?.diseases && profile.diseases.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.diseases.map((d) => (
                      <span key={d} className="px-3 py-1.5 bg-secondary text-foreground font-bold text-[11px] rounded-xl border border-border/60">
                        {d}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic">No medical conditions reported.</p>
                )}
                
                <Button 
                  variant="link" 
                  onClick={() => navigate("/planner")}
                  className="text-primary font-bold text-xs p-0 mt-4 h-auto"
                >
                  Edit health profile →
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
