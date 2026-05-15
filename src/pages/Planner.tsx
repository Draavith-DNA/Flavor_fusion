import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronRight, 
  ChevronLeft, 
  RefreshCw, 
  Sparkles, 
  Activity, 
  Scale, 
  Ruler, 
  Target, 
  Check, 
  Plus, 
  Search,
  Loader2,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { generateMealPlanAI } from "@/lib/ai";
import { type UserProfile, diseases, diseaseIcons, dietaryPreferences, dietIcons, generateMealPlan } from "@/data/mockData";
import healthAdvisor from "@/assets/health-advisor.png";
import healthCouple from "@/assets/health-couple.png";
import { supabase } from "@/lib/supabase";
import { saveFullProfile } from "@/lib/db";

const DRAFT_KEY = "plannerDraft";

export default function Planner() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [selectedDiseases, setSelectedDiseases] = useState<string[]>([]);
  const [preference, setPreference] = useState(dietaryPreferences[0]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const defaultDraft = { name: "", age: "", weight: "", height: "", selectedDiseases: [], preference: dietaryPreferences[0] };
  const [draft, setDraft] = useState(defaultDraft);

  useEffect(() => {
    const saved = localStorage.getItem(DRAFT_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      setName(parsed.name || "");
      setAge(parsed.age || "");
      setWeight(parsed.weight || "");
      setHeight(parsed.height || "");
      setSelectedDiseases(parsed.selectedDiseases || []);
      setPreference(parsed.preference || dietaryPreferences[0]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({
      name, age, weight, height, selectedDiseases, preference
    }));
  }, [name, age, weight, height, selectedDiseases, preference]);

  const toggleDisease = (disease: string) => {
    setSelectedDiseases((prev) =>
      prev.includes(disease) ? prev.filter((d) => d !== disease) : [...prev, disease]
    );
  };

  const handleReset = () => {
    setName(""); setAge(""); setWeight(""); setHeight(""); setSelectedDiseases([]); setPreference(dietaryPreferences[0]);
    localStorage.removeItem(DRAFT_KEY);
    toast({ title: "Form reset", description: "Starting fresh." });
  };

  const handleGenerate = async () => {
    setLoading(true);
    const profile: UserProfile = {
      name: name || "Alex",
      age: parseInt(age) || 25,
      weight: parseFloat(weight) || 70,
      height: parseFloat(height) || 170,
      diseases: selectedDiseases,
      preference,
    };

    try {
      const plan = await generateMealPlanAI(profile);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        try {
          // Save to Relational Database (multiple tables)
          await saveFullProfile(user.id, profile, plan);
        } catch (dbError) {
          console.error("Database save failed:", dbError);
          toast({
            title: "Plan Saved Locally Only",
            description: "Your plan was generated but couldn't be saved to the cloud.",
            variant: "destructive"
          });
        }
      }

      sessionStorage.setItem("mealPlan", JSON.stringify(plan));
      sessionStorage.setItem("userProfile", JSON.stringify(profile));
      toast({
        title: "Plan Generated!",
        description: "AI has customized your nutrition journey.",
      });
      navigate("/dashboard");
    } catch (error: any) {
      console.error("AI Generation failed:", error);
      const plan = generateMealPlan(profile);
      sessionStorage.setItem("mealPlan", JSON.stringify(plan));
      sessionStorage.setItem("userProfile", JSON.stringify(profile));
      toast({ title: "Using Standard Plan", description: "AI connection error. Using local logic.", variant: "destructive" });
      setTimeout(() => navigate("/dashboard"), 1500);
    } finally {
      setLoading(false);
    }
  };

  const filteredDiseases = diseases.filter(d => 
    d.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-col items-center px-6 py-8 md:py-12 bg-background relative overflow-hidden">
      <div className="max-w-2xl w-full relative z-10">
        <div className="flex justify-between items-center mb-8">
          <div className="flex gap-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className={`h-1.5 w-12 rounded-full transition-colors duration-300 ${step >= s ? "bg-primary" : "bg-secondary"}`} />
            ))}
          </div>
          {step > 1 && (
            <Button variant="ghost" size="sm" onClick={() => setStep(step - 1)} className="text-muted-foreground hover:text-primary font-bold">
              <ChevronLeft className="mr-1 h-4 w-4" /> Back
            </Button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="h-6 w-6 text-primary" />
                <span className="text-sm font-bold text-primary uppercase tracking-widest">Onboarding v2.0</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-display font-extrabold mb-8">Personal Details</h1>
              
              <div className="grid gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase ml-1">Full Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Alex Johnson" className="w-full h-14 bg-card border-2 border-border rounded-2xl px-5 font-bold focus:border-primary transition-colors outline-none" />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "Age", value: age, setter: setAge, icon: Activity, unit: "yrs" },
                    { label: "Weight", value: weight, setter: setWeight, icon: Scale, unit: "kg" },
                    { label: "Height", value: height, setter: setHeight, icon: Ruler, unit: "cm" }
                  ].map((field) => (
                    <div key={field.label} className="space-y-2">
                      <label className="text-xs font-bold text-muted-foreground uppercase ml-1">{field.label}</label>
                      <div className="relative">
                        <input type="number" value={field.value} onChange={(e) => field.setter(e.target.value)} placeholder="0" className="w-full h-14 bg-card border-2 border-border rounded-2xl px-4 font-bold focus:border-primary transition-colors outline-none text-center" />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-muted-foreground/40">{field.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <Button onClick={() => setStep(2)} className="coral-btn h-14 text-lg font-display shadow-xl group mt-4">
                  Next Step <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h1 className="text-3xl md:text-4xl font-display font-extrabold mb-2">Health History</h1>
              <p className="text-muted-foreground mb-8 font-medium">Select existing medical conditions for AI tailoring.</p>
              
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input type="text" placeholder="Search conditions..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full h-12 bg-card border-2 border-border rounded-xl pl-10 pr-4 font-bold focus:border-primary transition-colors outline-none text-sm" />
              </div>

              <div className="flex flex-wrap gap-2.5 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar mb-8">
                {selectedDiseases.filter(d => !diseases.includes(d)).map((d) => (
                  <button key={d} onClick={() => toggleDisease(d)} className="px-4 py-2.5 rounded-2xl text-sm font-bold border-2 bg-primary/10 border-primary text-primary flex items-center gap-1.5">
                    💊 <Check className="h-3.5 w-3.5" /> {d}
                  </button>
                ))}
                
                {filteredDiseases.map((d) => (
                  <button key={d} onClick={() => toggleDisease(d)} className={`px-4 py-2.5 rounded-2xl text-sm font-bold border-2 transition-all flex items-center gap-1.5 ${selectedDiseases.includes(d) ? "bg-primary/10 border-primary text-primary" : "bg-card border-border text-muted-foreground hover:border-primary/20"}`}>
                    <span className="text-base">{diseaseIcons[d]}</span>
                    {selectedDiseases.includes(d) && <Check className="h-3.5 w-3.5" />} {d}
                  </button>
                ))}

                {filteredDiseases.length === 0 && searchQuery && (
                  <button onClick={() => { toggleDisease(searchQuery); setSearchQuery(""); }} className="w-full py-4 rounded-2xl border-2 border-dashed border-primary/30 text-primary font-bold flex items-center justify-center gap-2 hover:bg-primary/5 transition-colors">
                    <Sparkles className="h-4 w-4" /> Add custom condition: "{searchQuery}"
                  </button>
                )}
              </div>

              <Button onClick={() => setStep(3)} className="coral-btn h-14 w-full text-lg shadow-xl">
                Continue <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h1 className="text-3xl md:text-4xl font-display font-extrabold mb-8">Dietary Preference</h1>
              <div className="grid gap-4 mb-8">
                {dietaryPreferences.map((p) => (
                  <button key={p} onClick={() => setPreference(p)} className={`flex items-center justify-between p-6 rounded-3xl border-2 transition-all ${preference === p ? "bg-primary/10 border-primary shadow-inner" : "bg-card border-border hover:border-primary/20"}`}>
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{dietIcons[p]}</span>
                      <span className={`text-lg font-bold ${preference === p ? "text-foreground" : "text-muted-foreground"}`}>{p}</span>
                    </div>
                    {preference === p && <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center"><Check className="h-4 w-4 text-white" /></div>}
                  </button>
                ))}
              </div>

              <Button onClick={handleGenerate} disabled={loading} className="coral-btn h-16 w-full text-xl font-display shadow-2xl relative overflow-hidden group">
                {loading ? (
                  <><Loader2 className="mr-2 h-6 w-6 animate-spin" /> Training AI...</>
                ) : (
                  <><Sparkles className="mr-2 h-6 w-6" /> Generate SmartPlan</>
                )}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Dynamic Illustrations */}
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="fixed bottom-10 right-10 hidden xl:block pointer-events-none">
        <img src={healthAdvisor} alt="" className="w-64 h-64 object-contain opacity-20" />
      </motion.div>
    </div>
  );
}
