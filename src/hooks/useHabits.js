import { useState, useEffect } from 'react';
import { localDateStr, datesBeforeLocal } from '../utils/date';

const STORAGE_KEY = 'habit-tracker-data';

function calcStreak(completions) {
  const d = new Date();
  // If today isn't done yet, start counting from yesterday so the streak
  // survives until midnight rather than dropping to 0.
  if (!completions[localDateStr(d)]) {
    d.setDate(d.getDate() - 1);
  }
  let streak = 0;
  while (streak < 3650) {
    if (completions[localDateStr(d)]) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

function parseDateLocal(str) {
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function calcLongestStreak(completions) {
  const keys = Object.keys(completions).sort();
  if (keys.length === 0) return 0;
  let longest = 1;
  let current = 1;
  for (let i = 1; i < keys.length; i++) {
    const diff = (parseDateLocal(keys[i]) - parseDateLocal(keys[i - 1])) / 86400000;
    if (diff === 1) {
      longest = Math.max(longest, ++current);
    } else {
      current = 1;
    }
  }
  return longest;
}

function calcCompletionRate(completions, days = 30) {
  const dates = datesBeforeLocal(days);
  const completed = dates.filter(d => completions[d]).length;
  return Math.round((completed / days) * 100);
}

export function useHabits() {
  const [habits, setHabits] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
  }, [habits]);

  function addHabit(name) {
    const trimmed = name.trim();
    if (!trimmed) return;
    setHabits(prev => [
      ...prev,
      { id: Date.now().toString(), name: trimmed, completions: {}, createdAt: localDateStr() },
    ]);
  }

  function removeHabit(id) {
    setHabits(prev => prev.filter(h => h.id !== id));
  }

  function renameHabit(id, name) {
    const trimmed = name.trim();
    if (!trimmed) return;
    setHabits(prev => prev.map(h => h.id === id ? { ...h, name: trimmed } : h));
  }

  function toggleDay(id, date) {
    setHabits(prev =>
      prev.map(h => {
        if (h.id !== id) return h;
        const completions = { ...h.completions };
        if (completions[date]) {
          delete completions[date];
        } else {
          completions[date] = true;
        }
        return { ...h, completions };
      })
    );
  }

  function getStats(habit) {
    return {
      streak: calcStreak(habit.completions),
      longestStreak: calcLongestStreak(habit.completions),
      completionRate: calcCompletionRate(habit.completions),
    };
  }

  return { habits, addHabit, removeHabit, renameHabit, toggleDay, getStats };
}
