import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastCheckIn: string | null;
  history: string[]; // ISO date strings
}

const STORAGE_KEY = "smartplate_streak";

function getTodayISO() {
  return new Date().toISOString().split("T")[0];
}

function getYesterdayISO() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
}

export function useStreak() {
  const [streak, setStreak] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    lastCheckIn: null,
    history: [],
  });

  const loadStreak = async () => {
    // 1. Try local storage first for speed
    const local = localStorage.getItem(STORAGE_KEY);
    if (local) setStreak(JSON.parse(local));

    // 2. Try Supabase for source of truth
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from("profiles")
        .select("streak_count, last_completed_date")
        .eq("id", user.id)
        .single();
      
      if (data && !error) {
        // Sync logic could go here
      }
    }
  };

  useEffect(() => {
    loadStreak();
  }, []);

  const completeDailyGoal = async () => {
    const today = getTodayISO();
    if (streak.lastCheckIn === today) return; // Already done

    const yesterday = getYesterdayISO();
    const wasYesterday = streak.lastCheckIn === yesterday;
    
    const newStreakCount = wasYesterday ? streak.currentStreak + 1 : 1;
    const newLongest = Math.max(newStreakCount, streak.longestStreak);
    
    const newData: StreakData = {
      currentStreak: newStreakCount,
      longestStreak: newLongest,
      lastCheckIn: today,
      history: [...streak.history, today].slice(-30),
    };

    setStreak(newData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));

    // Update Supabase
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from("profiles")
        .update({
          streak_count: newStreakCount,
          last_completed_date: today
        })
        .eq("id", user.id);
    }
  };

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const iso = d.toISOString().split("T")[0];
    return { 
      date: iso, 
      day: d.toLocaleDateString("en", { weekday: "short" }), 
      active: streak.history.includes(iso) 
    };
  });

  return { ...streak, last7Days, completeDailyGoal };
}
