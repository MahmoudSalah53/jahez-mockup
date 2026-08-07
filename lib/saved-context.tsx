"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "luqma-saved";

type SavedContextValue = {
  savedIds: string[];
  isSaved: (mealId: string) => boolean;
  toggleSaved: (mealId: string) => void;
  removeSaved: (mealId: string) => void;
};

const SavedContext = createContext<SavedContextValue | null>(null);

function loadSaved(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as string[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function SavedProvider({ children }: { children: ReactNode }) {
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSavedIds(loadSaved());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedIds));
  }, [savedIds, ready]);

  const isSaved = useCallback(
    (mealId: string) => savedIds.includes(mealId),
    [savedIds],
  );

  const toggleSaved = useCallback((mealId: string) => {
    setSavedIds((prev) =>
      prev.includes(mealId)
        ? prev.filter((id) => id !== mealId)
        : [...prev, mealId],
    );
  }, []);

  const removeSaved = useCallback((mealId: string) => {
    setSavedIds((prev) => prev.filter((id) => id !== mealId));
  }, []);

  const value = useMemo(
    () => ({ savedIds, isSaved, toggleSaved, removeSaved }),
    [savedIds, isSaved, toggleSaved, removeSaved],
  );

  return (
    <SavedContext.Provider value={value}>{children}</SavedContext.Provider>
  );
}

export function useSaved() {
  const ctx = useContext(SavedContext);
  if (!ctx) throw new Error("useSaved must be used within SavedProvider");
  return ctx;
}
