"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import {
  EMPTY_ANSWERS,
  usePrefs,
  type PrefAnswers,
} from "@/lib/prefs-context";
import { cn } from "@/lib/cn";

const easeOut = [0.22, 1, 0.36, 1] as const;

const CALORIE_OPTIONS = [
  {
    value: "care" as const,
    title: "نعم، أتابع السعرات",
    desc: "أفضل الخيارات مع وضوح السعرات الغذائية",
  },
  {
    value: "dont_care" as const,
    title: "لا، مو مهم حالياً",
    desc: "أختار حسب الذوق بدون التركيز على السعرات",
  },
];

export function PrefsOnboarding() {
  const { ready, done, complete } = usePrefs();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  /** -1 ترحيب | 0 سؤال السعرات */
  const [step, setStep] = useState(-1);
  const [draft, setDraft] = useState<PrefAnswers>(EMPTY_ANSWERS);
  const [dir, setDir] = useState(1);
  const pendingRef = useRef<{
    answers: PrefAnswers;
    skipped: boolean;
  } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!ready || done) return;
    setVisible(true);
  }, [ready, done]);

  useEffect(() => {
    if (!visible) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [visible]);

  if (!mounted || !ready) return null;
  if (done && !visible) return null;

  function finish(answers: PrefAnswers, skipped: boolean) {
    pendingRef.current = { answers, skipped };
    setVisible(false);
  }

  function skipAll() {
    finish(EMPTY_ANSWERS, true);
  }

  function goBack() {
    if (step <= -1) return;
    setDir(-1);
    setStep(-1);
  }

  function goNext() {
    if (step < 0) {
      setDir(1);
      setStep(0);
      return;
    }
    if (!draft.calories) return;
    finish(draft, false);
  }

  const isWelcome = step < 0;
  const canContinue = Boolean(draft.calories);
  const progress = isWelcome ? 0 : 100;

  return createPortal(
    <AnimatePresence
      onExitComplete={() => {
        const pending = pendingRef.current;
        if (!pending) return;
        pendingRef.current = null;
        complete(pending.answers, pending.skipped);
      }}
    >
      {visible ? (
        <motion.div
          key="prefs-onboarding"
          role="dialog"
          aria-modal="true"
          aria-labelledby="prefs-title"
          className="fixed inset-0 z-[100000] flex flex-col bg-[#0f0f0f]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{
            opacity: 0,
            y: -28,
            scale: 1.02,
            filter: "blur(6px)",
          }}
          transition={{ duration: 0.48, ease: easeOut }}
        >
          <div
            className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-40"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&q=80)",
            }}
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/70 via-black/80 to-black/90"
            aria-hidden
          />

          <div className="relative z-10 flex h-full min-h-0 flex-col">
            <header className="flex shrink-0 items-center justify-between px-5 pt-5 sm:px-8 sm:pt-7">
              <p className="text-lg font-bold tracking-tight text-white">لقمة</p>
              {!isWelcome ? (
                <button
                  type="button"
                  onClick={skipAll}
                  className="rounded-full bg-white/10 px-3.5 py-1.5 text-sm font-medium text-white/90 backdrop-blur transition hover:bg-white/20"
                >
                  تخطّي
                </button>
              ) : (
                <span className="w-16" aria-hidden />
              )}
            </header>

            {!isWelcome ? (
              <div className="mx-auto mt-4 w-full max-w-xl shrink-0 px-5 sm:px-8">
                <div className="h-1 overflow-hidden rounded-full bg-white/15">
                  <motion.div
                    className="h-full rounded-full bg-accent"
                    initial={false}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.35, ease: easeOut }}
                  />
                </div>
              </div>
            ) : null}

            <div className="flex min-h-0 flex-1 flex-col justify-center overflow-y-auto scrollbar-none px-5 py-6 sm:px-8">
              <div className="mx-auto w-full max-w-xl">
                <AnimatePresence mode="wait" custom={dir}>
                  {isWelcome ? (
                    <motion.div
                      key="welcome"
                      custom={dir}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.32, ease: easeOut }}
                      className="text-center sm:text-start"
                    >
                      <p className="text-sm font-semibold text-accent">
                        حيّاك الله
                      </p>
                      <h1
                        id="prefs-title"
                        className="mt-2 text-3xl font-bold leading-tight text-white sm:text-4xl"
                      >
                        خلّنا نتعرّف على ذوقك
                      </h1>
                      <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-white/75 sm:mx-0">
                        أسئلة قصيرة عن أهدافك ونظامك وتفضيلاتك.
                      </p>
                      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:justify-start">
                        <button
                          type="button"
                          onClick={() => {
                            setDir(1);
                            setStep(0);
                          }}
                          className="rounded-2xl bg-accent px-6 py-3.5 text-sm font-bold text-white transition hover:bg-accent-hover"
                        >
                          يلا نبدأ
                        </button>
                        <button
                          type="button"
                          onClick={skipAll}
                          className="rounded-2xl border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white/90 backdrop-blur transition hover:bg-white/10"
                        >
                          دخول مباشر
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="calories"
                      custom={dir}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.28, ease: easeOut }}
                    >
                      <h2
                        id="prefs-title"
                        className="text-center text-2xl font-bold leading-snug text-white sm:text-3xl"
                      >
                        هل تود متابعة السعرات؟
                      </h2>
                      <p className="mt-2 text-center text-sm text-white/65 sm:text-base">
                        اختَر الأنسب لطريقة طلبك
                      </p>

                      <div className="mt-7 flex flex-col gap-3">
                        {CALORIE_OPTIONS.map((opt) => {
                          const selected = draft.calories === opt.value;
                          return (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() =>
                                setDraft({ calories: opt.value })
                              }
                              className={cn(
                                "rounded-2xl border px-4 py-4 text-start backdrop-blur-md transition active:scale-[0.99]",
                                selected
                                  ? "border-accent bg-accent/25 text-white"
                                  : "border-white/15 bg-white/8 text-white hover:border-accent/50 hover:bg-white/12",
                              )}
                            >
                              <span className="block text-base font-bold">
                                {opt.title}
                              </span>
                              <span
                                className={cn(
                                  "mt-1 block text-sm leading-snug",
                                  selected
                                    ? "text-white/80"
                                    : "text-white/55",
                                )}
                              >
                                {opt.desc}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      <div className="mt-6 flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={goBack}
                          className="rounded-xl px-3 py-2 text-sm font-medium text-white/60 transition hover:bg-white/10 hover:text-white"
                        >
                          رجوع
                        </button>

                        <button
                          type="button"
                          disabled={!canContinue}
                          onClick={goNext}
                          className="rounded-2xl bg-accent px-5 py-2.5 text-sm font-bold text-white transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          تم
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 28 : -28,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -28 : 28,
    opacity: 0,
  }),
};
