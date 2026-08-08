"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import {
  EMPTY_ANSWERS,
  usePrefs,
  type PrefAnswers,
} from "@/lib/prefs-context";
import { cn } from "@/lib/cn";

type Option = { value: string; title: string; desc?: string };

type StepConfig = {
  id: keyof PrefAnswers;
  title: string;
  subtitle: string;
  options: Option[];
  /** شبكة عمودين للإجابات */
  grid?: boolean;
};

/** حقول تتخزّن كمصفوفة (عنصر واحد بعد الاختيار) */
const ARRAY_FIELDS = new Set<keyof PrefAnswers>([
  "goals",
  "proteins",
  "plantPrefs",
  "cuisines",
]);

const GOALS_STEP: StepConfig = {
  id: "goals",
  grid: true,
  title: "وش هدفك من الأكل الحين؟",
  subtitle: "اختَر الأقرب لك",
  options: [
    { value: "indulgent", title: "لذيذ ومشبع", desc: "طعم غني وراحة" },
    { value: "balanced", title: "صحي ومتوازن", desc: "سعرات وبروتين معقولة" },
    { value: "high_protein", title: "عالي البروتين", desc: "شبع أطول" },
    { value: "low_calorie", title: "خفيف سعرات", desc: "وجبات أخف" },
    { value: "quick", title: "سريع وجاهز", desc: "أقل وقت للتوصيل" },
    { value: "family", title: "عائلي وكميات", desc: "يكفي مجموعة" },
    { value: "explore", title: "تجربة مطابخ جديدة", desc: "اكتشاف أكلات" },
    { value: "deals", title: "عروض ووفّر", desc: "أفضل قيمة" },
    { value: "comfort", title: "أكل مريح", desc: "خيارات كلاسيكية" },
    { value: "premium", title: "جودة فاخرة", desc: "مطاعم أعلى" },
    { value: "light_meal", title: "وجبة خفيفة", desc: "مو غدا ثقيل" },
    { value: "late_night", title: "سناك متأخر", desc: "بعد الدوام" },
  ],
};

const DIET_STEP: StepConfig = {
  id: "diet",
  title: "وش نظامك الغذائي؟",
  subtitle: "اختَر الأنسب لك",
  options: [
    { value: "none", title: "بدون قيود", desc: "آكل أغلب الأنواع" },
    {
      value: "no_red_meat",
      title: "بدون لحم أحمر",
      desc: "دجاج / بحري / نباتي",
    },
    {
      value: "vegetarian",
      title: "نباتي",
      desc: "بدون لحوم (ألبان وبيض OK)",
    },
    {
      value: "vegan",
      title: "نباتي صرف",
      desc: "بدون منتجات حيوانية",
    },
    {
      value: "pescatarian",
      title: "بحري + نباتي",
      desc: "سمك ومأكولات بحرية فقط من اللحوم",
    },
    { value: "low_carb", title: "قليل كارب", desc: "تقليل النشويات" },
    { value: "high_fiber", title: "غني بالألياف", desc: "خضار وحبوب أكثر" },
  ],
};

const ALL_CUISINES: Option[] = [
  { value: "grill", title: "مشاوي" },
  { value: "levantine", title: "شامي" },
  { value: "saudi", title: "سعودي" },
  { value: "burger", title: "برجر وسريع" },
  { value: "asian", title: "آسيوي / سوشي" },
  { value: "italian", title: "إيطالي" },
  { value: "indian", title: "هندي" },
  { value: "seafood", title: "بحري" },
  { value: "healthy", title: "صحي / بولز" },
  { value: "desserts", title: "حلويات" },
];

const SPICE_STEP: StepConfig = {
  id: "spice",
  title: "كم تحب الأكل الحار؟",
  subtitle: "مستوى التوابل المناسب لك",
  options: [
    { value: "none", title: "بدون حار", desc: "نكهات هادية" },
    { value: "mild", title: "خفيف", desc: "لمسة بسيطة" },
    { value: "medium", title: "متوسط", desc: "حرارة مريحة" },
    { value: "hot", title: "حار", desc: "توابل قوية" },
  ],
};

const PRIORITY_STEP: StepConfig = {
  id: "priority",
  title: "وش أهم شيء لما تطلب؟",
  subtitle: "أولويتك عند الاختيار",
  options: [
    { value: "fast", title: "التوصيل السريع", desc: "الوقت أولاً" },
    { value: "rating", title: "أعلى تقييم", desc: "الجودة أولاً" },
    { value: "offers", title: "أفضل العروض", desc: "الخصم أولاً" },
    { value: "nearby", title: "الأقرب لي", desc: "مسافة أقرب" },
  ],
};

function dietFlags(diet: string | null) {
  return {
    vegan: diet === "vegan",
    vegetarianOnly: diet === "vegetarian",
    plantBased: diet === "vegetarian" || diet === "vegan",
    pescatarian: diet === "pescatarian",
    noRedMeat: diet === "no_red_meat",
    lowCarb: diet === "low_carb",
    highFiber: diet === "high_fiber",
    none: diet === "none" || diet === null,
  };
}

/** سؤال ما بعد النظام الغذائي — مسار مختلف لكل اختيار */
function followUpAfterDiet(diet: string | null): StepConfig {
  const flags = dietFlags(diet);

  if (flags.vegan) {
    return {
      id: "plantPrefs",
      grid: true,
      title: "وش يناسبك أكثر كنباتي صرف؟",
      subtitle: "بدون لحوم ولا ألبان ولا بيض — اختَر الأقرب",
      options: [
        { value: "bowls", title: "بولز وخضار", desc: "خفيف ومتوازن" },
        { value: "falafel", title: "فلافل ومقبلات", desc: "شامي نباتي" },
        { value: "asian_veg", title: "آسيوي نباتي", desc: "سوشي خضار / نودلز" },
        { value: "grilled_veg", title: "خضار مشوية", desc: "طعم شواء بدون لحم" },
        { value: "legumes", title: "بقول وحبوب", desc: "حمص / عدس / فول" },
        { value: "desserts", title: "حلويات نباتية", desc: "خيارات بدون ألبان" },
      ],
    };
  }

  if (flags.vegetarianOnly) {
    return {
      id: "plantPrefs",
      grid: true,
      title: "وش الأكل النباتي اللي تفضّله؟",
      subtitle: "بدون لحوم — ألبان وبيض متاحين",
      options: [
        { value: "cheese_egg", title: "جبن وبيض", desc: "أومليت / فطور" },
        { value: "bowls", title: "بولز وسلطة", desc: "خفيف ومتوازن" },
        { value: "falafel", title: "فلافل ومقبلات", desc: "شامي نباتي" },
        { value: "pasta", title: "معكرونة نباتية", desc: "إيطالي خفيف" },
        { value: "asian_veg", title: "آسيوي نباتي", desc: "سوشي خضار / قلي" },
        { value: "desserts", title: "حلويات", desc: "خيارات حلوة" },
      ],
    };
  }

  if (flags.pescatarian) {
    return {
      id: "proteins",
      title: "تميل لإيش أكثر؟",
      subtitle: "نظامك بحري + نباتي — اختَر الميل الأقرب لك",
      options: [
        {
          value: "mostly_seafood",
          title: "أغلب الوقت بحري",
          desc: "سمك وروبيان أكثر",
        },
        {
          value: "mostly_plant",
          title: "أغلب الوقت نباتي",
          desc: "بولز ومقبلات نباتية أكثر",
        },
        {
          value: "balanced_pesc",
          title: "مزيج بين الاثنين",
          desc: "بحري ونباتي بالتساوي تقريباً",
        },
      ],
    };
  }

  if (flags.noRedMeat) {
    return {
      id: "proteins",
      grid: true,
      title: "وش تعوّض فيه اللحم الأحمر؟",
      subtitle: "بدون لحم أحمر — اختَر مصدر البروتين الأقرب لك",
      options: [
        { value: "chicken", title: "دجاج", desc: "مشوي / مقلي / وجبات" },
        { value: "seafood", title: "بحري", desc: "سمك وروبيان" },
        { value: "plant", title: "نباتي", desc: "فلافل / بولز / خضار" },
        { value: "turkey", title: "ديك رومي", desc: "بديل أخف" },
        { value: "mixed", title: "متنوع", desc: "ما عندي تفضيل ثابت" },
      ],
    };
  }

  if (flags.lowCarb) {
    return {
      id: "proteins",
      grid: true,
      title: "وش يناسب قليل الكارب عندك؟",
      subtitle: "أقل نشويات — اختَر اللي تميل له أكثر",
      options: [
        { value: "grilled_meat", title: "لحوم مشوية", desc: "لحم / دجاج بدون صوص ثقيل" },
        { value: "seafood", title: "بحري", desc: "سمك مشوي أو مقلي خفيف" },
        { value: "salads", title: "سلطات وبروتين", desc: "خضار + قطعة بروتين" },
        { value: "eggs_dairy", title: "بيض وألبان", desc: "فطور وأكلات بسيطة" },
        { value: "mixed", title: "متنوع", desc: "حسب اليوم" },
      ],
    };
  }

  if (flags.highFiber) {
    return {
      id: "proteins",
      grid: true,
      title: "وش مصدر الألياف المفضل؟",
      subtitle: "غني بالألياف — اختَر الاتجاه الأقرب لك",
      options: [
        { value: "salads_bowls", title: "سلطات وبولز", desc: "خضار طازجة" },
        { value: "legumes", title: "بقوليات", desc: "حمص / عدس / فول" },
        { value: "whole_grains", title: "حبوب كاملة", desc: "شوفان / برغل / أرز بني" },
        { value: "veg_mains", title: "وجبات خضار", desc: "طبق رئيسي نباتي" },
        { value: "mixed", title: "مزيج", desc: "من كل الأنواع" },
      ],
    };
  }

  // بدون قيود (أو قبل اختيار النظام — يظهر مسار افتراضي)
  return {
    id: "proteins",
    grid: true,
    title: "وش البروتين اللي تفضّله؟",
    subtitle: "اختَر الأقرب لذوقك",
    options: [
      { value: "chicken", title: "دجاج", desc: "مشوي / مقلي / وجبات" },
      { value: "beef_lamb", title: "لحم / غنم", desc: "مشاوي ولحوم حمراء" },
      { value: "seafood", title: "بحري", desc: "سمك وروبيان" },
      { value: "plant", title: "نباتي", desc: "فلافل / بولز / خضار" },
      { value: "mixed", title: "متنوع", desc: "ما عندي تفضيل ثابت" },
    ],
  };
}

function cuisineStepForDiet(diet: string | null): StepConfig {
  const flags = dietFlags(diet);

  let options = ALL_CUISINES;
  let subtitle = "اختَر المطبخ الأقرب لك";

  if (flags.plantBased) {
    options = ALL_CUISINES.filter((o) => o.value !== "grill");
    subtitle = flags.vegan
      ? "مطابخ تناسب النباتي الصرف"
      : "مطابخ تناسب النظام النباتي";
  } else if (flags.pescatarian) {
    options = ALL_CUISINES.filter((o) => o.value !== "grill");
    subtitle = "ركّزنا على خيارات تناسب البحري والنباتي";
  } else if (flags.noRedMeat) {
    options = ALL_CUISINES.filter((o) => o.value !== "grill");
    subtitle = "بدون مشاوي لحم أحمر — اختَر مطبخك";
  } else if (flags.lowCarb) {
    subtitle = "أي مطبخ يناسب أسلوب قليل الكارب عندك؟";
  } else if (flags.highFiber) {
    subtitle = "أي مطبخ يعطيك ألياف أكثر براحتك؟";
  }

  return {
    id: "cuisines",
    grid: true,
    title: "وش المطابخ اللي تحبها؟",
    subtitle,
    options,
  };
}

/** يبني الأسئلة حسب الإجابات السابقة عشان ما تتعارض */
function buildSteps(draft: PrefAnswers): StepConfig[] {
  return [
    GOALS_STEP,
    DIET_STEP,
    followUpAfterDiet(draft.diet),
    cuisineStepForDiet(draft.diet),
    SPICE_STEP,
    PRIORITY_STEP,
  ];
}

const easeOut = [0.22, 1, 0.36, 1] as const;

function getArrayValue(draft: PrefAnswers, id: keyof PrefAnswers): string[] {
  const v = draft[id];
  return Array.isArray(v) ? v : [];
}

function isSelected(
  draft: PrefAnswers,
  id: keyof PrefAnswers,
  value: string,
): boolean {
  if (ARRAY_FIELDS.has(id)) {
    return getArrayValue(draft, id)[0] === value;
  }
  return draft[id] === value;
}

function hasAnswer(draft: PrefAnswers, id: keyof PrefAnswers): boolean {
  if (ARRAY_FIELDS.has(id)) {
    return getArrayValue(draft, id).length > 0;
  }
  return draft[id] != null && draft[id] !== "";
}

/** تنظيف إجابات متعارضة بعد تغيير النظام الغذائي */
function sanitizeAfterDiet(draft: PrefAnswers): PrefAnswers {
  const flags = dietFlags(draft.diet);
  let proteins = draft.proteins;
  let plantPrefs = draft.plantPrefs;
  let cuisines = draft.cuisines;

  if (flags.plantBased) {
    proteins = [];
  } else {
    plantPrefs = [];
    if (flags.pescatarian) {
      proteins = proteins.filter((p) =>
        ["mostly_seafood", "mostly_plant", "balanced_pesc"].includes(p),
      );
    } else if (flags.noRedMeat) {
      const allowed = new Set([
        "chicken",
        "seafood",
        "plant",
        "turkey",
        "mixed",
      ]);
      proteins = proteins.filter((p) => allowed.has(p));
    } else if (flags.lowCarb) {
      const allowed = new Set([
        "grilled_meat",
        "seafood",
        "salads",
        "eggs_dairy",
        "mixed",
      ]);
      proteins = proteins.filter((p) => allowed.has(p));
    } else if (flags.highFiber) {
      const allowed = new Set([
        "salads_bowls",
        "legumes",
        "whole_grains",
        "veg_mains",
        "mixed",
      ]);
      proteins = proteins.filter((p) => allowed.has(p));
    } else {
      const allowed = new Set([
        "chicken",
        "beef_lamb",
        "seafood",
        "plant",
        "mixed",
      ]);
      proteins = proteins.filter((p) => allowed.has(p));
    }
  }

  if (flags.plantBased || flags.pescatarian || flags.noRedMeat) {
    cuisines = cuisines.filter((c) => c !== "grill");
  }

  return { ...draft, proteins, plantPrefs, cuisines };
}

export function PrefsOnboarding() {
  const { ready, done, complete } = usePrefs();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(-1);
  const [draft, setDraft] = useState<PrefAnswers>(EMPTY_ANSWERS);
  const [dir, setDir] = useState(1);
  const pendingRef = useRef<{
    answers: PrefAnswers;
    skipped: boolean;
  } | null>(null);

  const activeSteps = useMemo(() => buildSteps(draft), [draft]);

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

  useEffect(() => {
    if (step < 0) return;
    if (step >= activeSteps.length) {
      setStep(Math.max(0, activeSteps.length - 1));
    }
  }, [activeSteps.length, step]);

  if (!mounted || !ready) return null;
  if (done && !visible) return null;

  function finish(answers: PrefAnswers, skipped: boolean) {
    pendingRef.current = { answers, skipped };
    setVisible(false);
  }

  function goNext() {
    if (step < activeSteps.length - 1) {
      setDir(1);
      setStep((s) => s + 1);
      return;
    }
    finish(draft, false);
  }

  function goBack() {
    if (step <= -1) return;
    setDir(-1);
    setStep((s) => s - 1);
  }

  function skipAll() {
    finish(EMPTY_ANSWERS, true);
  }

  /** اختيار واحد: يحدد الخيار، ولو ضغطت غيره ينتقل التحديد — بدون انتقال تلقائي */
  function onPick(value: string) {
    if (step < 0) return;
    const cfg = activeSteps[step];
    let next: PrefAnswers;
    if (ARRAY_FIELDS.has(cfg.id)) {
      next = { ...draft, [cfg.id]: [value] } as PrefAnswers;
    } else {
      next = { ...draft, [cfg.id]: value } as PrefAnswers;
    }
    if (cfg.id === "diet") {
      next = sanitizeAfterDiet(next);
    }
    setDraft(next);
  }

  const isWelcome = step < 0;
  const cfg = step >= 0 ? activeSteps[step] : null;
  const progress =
    step < 0 ? 0 : ((step + 1) / Math.max(activeSteps.length, 1)) * 100;
  const canContinue = cfg ? hasAnswer(draft, cfg.id) : false;

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
                <p className="mt-2 text-center text-xs text-white/55">
                  {step + 1} / {activeSteps.length}
                </p>
              </div>
            ) : null}

            <div className="flex min-h-0 flex-1 flex-col justify-center overflow-y-auto px-5 py-6 sm:px-8">
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
                  ) : cfg ? (
                    <motion.div
                      key={`${cfg.id}-${cfg.options.map((o) => o.value).join(",")}`}
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
                        {cfg.title}
                      </h2>
                      <p className="mt-2 text-center text-sm text-white/65 sm:text-base">
                        {cfg.subtitle}
                      </p>

                      <div
                        className={cn(
                          "mt-6",
                          cfg.grid
                            ? "grid grid-cols-2 gap-2.5"
                            : "flex flex-col gap-2.5",
                        )}
                      >
                        {cfg.options.map((opt, index) => {
                          const selected = isSelected(draft, cfg.id, opt.value);
                          const oddLast =
                            cfg.grid &&
                            cfg.options.length % 2 === 1 &&
                            index === cfg.options.length - 1;

                          return (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => onPick(opt.value)}
                              className={cn(
                                "rounded-2xl border px-3.5 py-3.5 text-start backdrop-blur-md transition active:scale-[0.99]",
                                selected
                                  ? "border-accent bg-accent/25 text-white"
                                  : "border-white/15 bg-white/8 text-white hover:border-accent/50 hover:bg-white/12",
                                oddLast && "col-span-2",
                              )}
                            >
                              <span className="block text-sm font-bold">
                                {opt.title}
                              </span>
                              {opt.desc ? (
                                <span
                                  className={cn(
                                    "mt-0.5 block text-[11px] leading-snug",
                                    selected
                                      ? "text-white/80"
                                      : "text-white/55",
                                  )}
                                >
                                  {opt.desc}
                                </span>
                              ) : null}
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
                          {step === activeSteps.length - 1 ? "تم" : "التالي"}
                        </button>
                      </div>
                    </motion.div>
                  ) : null}
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
