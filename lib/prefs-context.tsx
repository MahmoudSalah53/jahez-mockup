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

const STORAGE_KEY = "luqma-food-prefs-v7";

export type PrefAnswers = {
  goals: string[];
  /** نظام غذائي — اختيار واحد */
  diet: string | null;
  /** بروتين — يُفرّغ في المسار النباتي */
  proteins: string[];
  /** تفضيلات نباتية — بدل سؤال اللحوم */
  plantPrefs: string[];
  cuisines: string[];
  spice: string | null;
  priority: string | null;
};

export const EMPTY_ANSWERS: PrefAnswers = {
  goals: [],
  diet: null,
  proteins: [],
  plantPrefs: [],
  cuisines: [],
  spice: null,
  priority: null,
};

type PrefsPayload = {
  done: boolean;
  skipped: boolean;
  answers: PrefAnswers;
  schemaVersion: 7;
};

type PrefsContextValue = {
  ready: boolean;
  done: boolean;
  skipped: boolean;
  answers: PrefAnswers;
  complete: (answers: PrefAnswers, skipped?: boolean) => void;
};

const PrefsContext = createContext<PrefsContextValue | null>(null);

function loadPrefs(): PrefsPayload {
  if (typeof window === "undefined") {
    return {
      done: false,
      skipped: false,
      answers: EMPTY_ANSWERS,
      schemaVersion: 7,
    };
  }
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        done: false,
        skipped: false,
        answers: EMPTY_ANSWERS,
        schemaVersion: 7,
      };
    }
    const parsed = JSON.parse(raw) as PrefsPayload;
    if (!parsed?.done) {
      return {
        done: false,
        skipped: false,
        answers: EMPTY_ANSWERS,
        schemaVersion: 7,
      };
    }
    return {
      done: true,
      skipped: Boolean(parsed.skipped),
      answers: { ...EMPTY_ANSWERS, ...parsed.answers },
      schemaVersion: 7,
    };
  } catch {
    return {
      done: false,
      skipped: false,
      answers: EMPTY_ANSWERS,
      schemaVersion: 7,
    };
  }
}

function savePrefs(payload: PrefsPayload) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // ignore
  }
}

export function PrefsProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [done, setDone] = useState(false);
  const [skipped, setSkipped] = useState(false);
  const [answers, setAnswers] = useState<PrefAnswers>(EMPTY_ANSWERS);

  useEffect(() => {
    const loaded = loadPrefs();
    setDone(loaded.done);
    setSkipped(loaded.skipped);
    setAnswers(loaded.answers);
    setReady(true);
  }, []);

  const complete = useCallback((next: PrefAnswers, wasSkipped = false) => {
    const payload: PrefsPayload = {
      done: true,
      skipped: wasSkipped,
      answers: next,
      schemaVersion: 7,
    };
    savePrefs(payload);
    setDone(true);
    setSkipped(wasSkipped);
    setAnswers(next);
  }, []);

  const value = useMemo(
    () => ({ ready, done, skipped, answers, complete }),
    [ready, done, skipped, answers, complete],
  );

  return (
    <PrefsContext.Provider value={value}>{children}</PrefsContext.Provider>
  );
}

export function usePrefs() {
  const ctx = useContext(PrefsContext);
  if (!ctx) throw new Error("usePrefs must be used within PrefsProvider");
  return ctx;
}
