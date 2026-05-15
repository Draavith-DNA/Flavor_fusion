import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/Layout";
import { PageTransition } from "@/components/PageTransition";
import { AuthGuard } from "@/components/AuthGuard";
import { AnimatePresence } from "framer-motion";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Planner from "./pages/Planner";
import Diets from "./pages/Diets";
import Dashboard from "./pages/Dashboard";
import Alerts from "./pages/Alerts";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import MealDetail from "./pages/MealDetail";
import Exercises from "./pages/Exercises";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Landing /></PageTransition>} />
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/planner" element={<PageTransition><Planner /></PageTransition>} />
        <Route path="/diets" element={<PageTransition><Diets /></PageTransition>} />
        <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
        <Route path="/meal/:mealName" element={<PageTransition><MealDetail /></PageTransition>} />
        <Route path="/alerts" element={<PageTransition><Alerts /></PageTransition>} />
        <Route path="/exercises" element={<PageTransition><Exercises /></PageTransition>} />
        <Route path="/chat" element={<PageTransition><Chat /></PageTransition>} />
        <Route path="/profile" element={<PageTransition><Profile /></PageTransition>} />
        <Route path="/admin" element={<PageTransition><Admin /></PageTransition>} />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthGuard>
          <Layout>
            <AnimatedRoutes />
          </Layout>
        </AuthGuard>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
