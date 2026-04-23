import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Sparkles, Check, ChevronRight, ChevronLeft, RotateCcw } from "lucide-react";
import { diseases, diseaseIcons, dietaryPreferences, dietIcons, dietDescriptions, generateMealPlan, type UserProfile } from "@/data/mockData";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { generateMealPlanAI } from "@/lib/ai";
import healthAdvisor from "@/assets/health-advisor.png";
import healthCouple from "@/assets/health-couple.png";

const DRAFT_KEY = "plannerDraft";

interface PlannerDraft {
  step: number;
  name: string;
  age: string;
  weight: string;
  height: string;
  selectedDiseases: string[];
  preference: string;
}

const defaultDraft: PlannerDraft = {
  step: 1,
  name: "",
  age: "",
  weight: "",
  height: "",
  selectedDiseases: [],
  preference: "Vegetarian",
};

function loadDraft(): PlannerDraft {
  try {
    const stored = sessionStorage.getItem(DRAFT_KEY);
    if (stored) return { ...defaultDraft, ...JSON.parse(stored) };
    // Fallback: hydrate from existing userProfile so "back to edit" works
    const profile = sessionStorage.getItem("userProfile");
    if (profile) {
      const p = JSON.parse(profile) as UserProfile;
      return {
        step: 1,
        name: p.name || "",
        age: String(p.age ?? ""),
        weight: String(p.weight ?? ""),
        height: String(p.height ?? ""),
        selectedDiseases: p.diseases || [],
        preference: p.preference || "Vegetarian",
      };
    }
  } catch {}
  return defaultDraft;
}

export default function Planner() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  const [draft, setDraft] = useState<PlannerDraft>(() => loadDraft());
  const [loading, setLoading] = useState(false);

  const { step, name, age, weight, height, selectedDiseases, preference } = draft;
  const update = (patch: Partial<PlannerDraft>) =>
    setDraft((d) => ({ ...d, ...patch }));

  // Pre-select diet from query (?diet=Keto)
  useEffect(() => {
    const dietParam = searchParams.get("diet");
    if (dietParam && dietaryPreferences.includes(dietParam)) {
      update({ preference: dietParam, step: Math.max(step, 3) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Persist draft on every change
  useEffect(() => {
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  }, [draft]);

  const toggleDisease = (d: string) => {
    update({
      selectedDiseases: selectedDiseases.includes(d)
        ? selectedDiseases.filter((x) => x !== d)
        : [...selectedDiseases, d],
    });
  };

  const handleReset = () => {
    sessionStorage.removeItem(DRAFT_KEY);
    setDraft(defaultDraft);
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
      sessionStorage.setItem("mealPlan", JSON.stringify(plan));
      sessionStorage.setItem("userProfile", JSON.stringify(profile));
      toast({
        title: "Plan Generated!",
        description: "AI has customized your nutrition plan.",
      });
      navigate("/dashboard");
    } catch (error: any) {
      console.error("AI Generation failed:", error);
      
      // Fallback to mock data if AI fails
      const plan = generateMealPlan(profile);
      sessionStorage.setItem("mealPlan", JSON.stringify(plan));
      sessionStorage.setItem("userProfile", JSON.stringify(profile));
      
      toast({
        title: "AI Generation Error",
        description: "Using standard recommendations (API key might be missing).",
        variant: "destructive",
      });
      
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  const totalSteps = 3;
  const setStep = (s: number) => update({ step: s });

  return (
    <div className="min-h-[calc(100vh-3.5rem)] px-5 py-8 max-w-lg mx-auto">
      {/* Mobile Header */}
      <div className="flex items-center justify-between mb-6 md:hidden">
        {step > 1 ? (
          <button onClick={() => setStep(step - 1)} className="p-1" aria-label="Back">
            <ChevronLeft className="h-5 w-5 text-foreground" />
          </button>
        ) : (
          <div className="w-7" />
        )}
        <h2 className="text-base font-bold font-display">
          {step === 1 ? "Personal Info" : step === 2 ? "Health Profile" : "Diet Preference"}
        </h2>
        <button onClick={handleReset} className="p-1" aria-label="Reset">
          <RotateCcw className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      {/* Progress + step navigation */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-bold text-muted-foreground">
            Step {step} of {totalSteps}
          </p>
          <button
            onClick={handleReset}
            className="hidden md:flex items-center gap-1 text-[11px] font-bold text-muted-foreground hover:text-primary"
          >
            <RotateCcw className="h-3 w-3" /> Reset
          </button>
        </div>
        <div className="flex gap-2">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i + 1)}
              className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                i < step ? "bg-primary" : "bg-border hover:bg-primary/40"
              }`}
              aria-label={`Go to step ${i + 1}`}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.3 }}>
            <h1 className="text-2xl md:text-3xl font-display font-extrabold mb-1">
              Health Profile
            </h1>
            <p className="text-muted-foreground text-sm mb-6">Tell us about yourself</p>

            <div className="soft-card p-5 space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">Your Name</Label>
                <Input
                  placeholder="Alex"
                  value={name}
                  onChange={(e) => update({ name: e.target.value })}
                  className="bg-secondary/50 border-border rounded-xl h-11"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground">Age</Label>
                  <Input type="number" placeholder="25" value={age} onChange={(e) => update({ age: e.target.value })} className="bg-secondary/50 border-border rounded-xl h-11" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground">Weight (kg)</Label>
                  <Input type="number" placeholder="70" value={weight} onChange={(e) => update({ weight: e.target.value })} className="bg-secondary/50 border-border rounded-xl h-11" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground">Height (cm)</Label>
                  <Input type="number" placeholder="170" value={height} onChange={(e) => update({ height: e.target.value })} className="bg-secondary/50 border-border rounded-xl h-11" />
                </div>
              </div>

              <Button onClick={() => setStep(2)} className="w-full coral-btn h-12 text-base shadow-lg mt-2">
                Continue <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.3 }}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-display font-extrabold mb-1">
                  Select Your<br />Conditions
                </h1>
                <p className="text-muted-foreground text-sm mb-6">
                  Choose your conditions to personalize<br />your health profile.
                </p>
              </div>
              <img src={healthAdvisor} alt="" className="w-20 h-20 md:w-24 md:h-24 object-contain -mt-2" loading="lazy" width={512} height={512} />
            </div>

            <div className="soft-card p-5 space-y-5">
              <div className="flex flex-wrap gap-2.5">
                {diseases.map((d) => (
                  <button
                    key={d}
                    onClick={() => toggleDisease(d)}
                    className={`px-4 py-2.5 rounded-2xl text-sm font-bold transition-all duration-200 border-2 flex items-center gap-1.5 ${
                      selectedDiseases.includes(d)
                        ? "bg-primary/10 border-primary text-primary scale-[1.02]"
                        : "bg-card border-border text-muted-foreground hover:border-primary/30"
                    }`}
                  >
                    <span className="text-base">{diseaseIcons[d]}</span>
                    {selectedDiseases.includes(d) && <Check className="h-3.5 w-3.5" />}
                    {d}
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1 h-12 rounded-2xl font-bold text-base border-border">
                  Back
                </Button>
                <Button onClick={() => setStep(3)} className="flex-1 coral-btn h-12 text-base shadow-lg">
                  Continue <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <img src={healthCouple} alt="" className="w-28 h-28 md:w-32 md:h-32 object-contain" loading="lazy" width={512} height={512} />
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.3 }}>
            <h1 className="text-2xl md:text-3xl font-display font-extrabold mb-1">
              Dietary Preference
            </h1>
            <p className="text-muted-foreground text-sm mb-6">
              Choose your diet style.{" "}
              <button onClick={() => navigate("/diets")} className="text-primary font-bold hover:underline">
                Browse all plans →
              </button>
            </p>

            <div className="soft-card p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {dietaryPreferences.map((p) => (
                  <button
                    key={p}
                    onClick={() => update({ preference: p })}
                    className={`px-4 py-4 rounded-2xl text-left font-bold transition-all duration-200 border-2 ${
                      preference === p
                        ? "bg-primary/10 border-primary text-primary scale-[1.02]"
                        : "bg-card border-border text-foreground hover:border-primary/30"
                    }`}
                  >
                    <span className="text-2xl block mb-1">{dietIcons[p]}</span>
                    <span className="text-sm font-extrabold block">{p}</span>
                    <span className="text-[11px] text-muted-foreground font-medium block mt-0.5">{dietDescriptions[p]}</span>
                    {preference === p && <Check className="h-4 w-4 mt-1 text-primary" />}
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1 h-12 rounded-2xl font-bold text-base border-border">
                  Back
                </Button>
                <Button onClick={handleGenerate} disabled={loading} className="flex-1 coral-btn h-12 text-base shadow-lg">
                  <AnimatePresence mode="wait">
                    {loading ? (
                      <motion.span key="loading" className="flex items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
                      </motion.span>
                    ) : (
                      <motion.span key="idle" className="flex items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <Sparkles className="mr-2 h-4 w-4" /> Generate Plan
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
