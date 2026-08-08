"use client";

import { AnimatePresence, motion } from "motion/react";
import {
  Microphone,
  MicrophoneSlash,
  SparkleIcon,
  XIcon,
} from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { FakeBarVisualizer } from "@/components/voice-widget/FakeBarVisualizer";
import { cn } from "@/lib/cn";

export type VoicePhase = "closed" | "connecting" | "listening";

const CIRCLE_PX = 48;
const CIRCLE_DESKTOP_PX = 56;
const TEASE_PILL_PX = 138;
const TEASE_PILL_DESKTOP_PX = 160;
const OPEN_PILL_PX = 260;
const OPEN_PILL_DESKTOP_PX = 300;
const OPEN_H = 52;
const OPEN_H_DESKTOP = 60;
const TEASE_VISIBLE_MS = 2500;
const TEASE_GAP_MS = 14000;
const INTRO_DELAY_MS = 500;

const morphSpring = {
  type: "spring" as const,
  duration: 0.58,
  bounce: 0.18,
};

function useFabBottom() {
  const [bottom, setBottom] = useState(16);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => setBottom(mq.matches ? 72 : 16);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);
  return bottom;
}

function usePillTease(active: boolean) {
  const [teased, setTeased] = useState(false);
  const seenSessionRef = useRef(false);

  useEffect(() => {
    if (!active) {
      // بعد فتح الجلسة مرة، الإغلاق يرجع دائرة (مش tease فوري)
      seenSessionRef.current = true;
      setTeased(false);
      return;
    }

    let cancelled = false;
    let collapseTimer: ReturnType<typeof setTimeout> | null = null;
    let cycleTimer: ReturnType<typeof setTimeout> | null = null;

    function runCycle(gapAfterCollapse: number) {
      if (cancelled) return;
      setTeased(true);
      collapseTimer = setTimeout(() => {
        if (cancelled) return;
        setTeased(false);
        cycleTimer = setTimeout(
          () => runCycle(TEASE_GAP_MS),
          gapAfterCollapse,
        );
      }, TEASE_VISIBLE_MS);
    }

    // أول تحميل: تظهر «اسأل لقمة» بسرعة ثم ترجع دائرة
    // بعد إغلاق الجلسة: تفضل دائرة، والـ tease لاحقاً
    const initialDelay = seenSessionRef.current
      ? TEASE_GAP_MS
      : INTRO_DELAY_MS;

    const intro = setTimeout(() => runCycle(TEASE_GAP_MS), initialDelay);

    return () => {
      cancelled = true;
      clearTimeout(intro);
      if (collapseTimer) clearTimeout(collapseTimer);
      if (cycleTimer) clearTimeout(cycleTimer);
    };
  }, [active]);

  return teased;
}

function useIsDesktop() {
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const apply = () => setDesktop(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);
  return desktop;
}

function useOpenWidth(desktop: boolean) {
  const max = desktop ? OPEN_PILL_DESKTOP_PX : OPEN_PILL_PX;
  const [w, setW] = useState(max);
  useEffect(() => {
    const apply = () => setW(Math.min(max, window.innerWidth - 32));
    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, [max]);
  return w;
}

function statusLabel(phase: Exclude<VoicePhase, "closed">, micOn: boolean) {
  if (phase === "connecting") return "ثوانٍ…";
  if (!micOn) return "الميكروفون مكتوم";
  return "أسمعك الآن";
}

type Props = {
  phase: VoicePhase;
  micOn: boolean;
  onOpen: () => void;
  onClose: () => void;
  onMicToggle: () => void;
};

/**
 * عنصر واحد يتمدّد من دائرة «اسأل لقمة» إلى شريط الجلسة والعكس.
 */
export function VoiceMorphFab({
  phase,
  micOn,
  onOpen,
  onClose,
  onMicToggle,
}: Props) {
  const bottom = useFabBottom();
  const desktop = useIsDesktop();
  const open = phase !== "closed";
  const teased = usePillTease(!open);
  const [hovered, setHovered] = useState(false);
  const openWidth = useOpenWidth(desktop);

  // بعد الإغلاق/الفتح: امسح الـ hover عشان متفضلش «اسأل لقمة» معلّقة
  useEffect(() => {
    setHovered(false);
  }, [open]);

  const circlePx = desktop ? CIRCLE_DESKTOP_PX : CIRCLE_PX;
  const teasePx = desktop ? TEASE_PILL_DESKTOP_PX : TEASE_PILL_PX;
  const openH = desktop ? OPEN_H_DESKTOP : OPEN_H;

  const closedExpanded = !open && (teased || hovered);
  const width = open ? openWidth : closedExpanded ? teasePx : circlePx;
  const height = open ? openH : circlePx;

  const connecting = phase === "connecting";
  const waveActive = phase === "listening" && micOn;

  return (
    <motion.div
      layout={false}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1, width, height }}
      transition={{
        scale: { type: "spring", duration: 0.7, bounce: 0.22 },
        opacity: { duration: 0.25 },
        width: morphSpring,
        height: morphSpring,
      }}
      style={{
        position: "fixed",
        right: 16,
        bottom,
        zIndex: 99999,
      }}
      className={cn(
        "origin-bottom-right overflow-hidden rounded-full",
        open ? "shadow-[0_8px_28px_rgba(15,15,15,0.14)]" : "shadow-lg",
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* خلفية مغلقة — تتلاشى أثناء الفتح */}
      <motion.span
        className="absolute inset-0 rounded-full bg-[linear-gradient(90deg,#c62828_0%,#e85a4f_100%)]"
        initial={false}
        animate={{ opacity: open ? 0 : 1 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden
      />

      {/* خلفية مفتوحة — تظهر مع التمدّد */}
      <motion.span
        className="absolute inset-0 rounded-full border border-black/[0.04] bg-white"
        initial={false}
        animate={{ opacity: open ? 1 : 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden
      />

      {open ? (
        <span
          className="pointer-events-none absolute inset-y-0 start-0 z-[1] w-1 bg-[linear-gradient(180deg,#c62828,#e85a4f)]"
          aria-hidden
        />
      ) : null}

      <AnimatePresence mode="popLayout" initial={false}>
        {!open ? (
          <motion.button
            key="closed"
            type="button"
            aria-label="اسأل لقمة"
            onClick={onOpen}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative z-10 m-0 flex h-full w-full cursor-pointer items-center border-0 bg-transparent p-0 focus:outline-none"
            dir="rtl"
          >
            <span
              className={cn(
                "grid shrink-0 place-items-center",
                desktop ? "size-14" : "size-12",
              )}
            >
              <SparkleIcon
                size={desktop ? 26 : 22}
                weight="fill"
                className={cn(
                  "text-white",
                  desktop ? "size-[26px]" : "size-[22px]",
                )}
              />
            </span>
            <motion.span
              initial={false}
              animate={{
                opacity: closedExpanded ? 1 : 0,
                maxWidth: closedExpanded ? (desktop ? 110 : 96) : 0,
              }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                "overflow-hidden whitespace-nowrap pe-4 font-bold text-white",
                desktop ? "text-[15px]" : "text-sm",
              )}
            >
              اسأل لقمة
            </motion.span>
          </motion.button>
        ) : (
          <motion.div
            key="open"
            role="dialog"
            aria-label="جلسة المساعد الصوتي"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, delay: 0.06 }}
            className={cn(
              "relative z-10 flex h-full w-full items-center gap-2 px-1.5 pe-2",
              desktop && "gap-2.5 px-2 pe-2.5",
            )}
          >
            <div
              className={cn(
                "relative ms-1 grid shrink-0 place-items-center",
                desktop ? "size-12" : "size-11",
              )}
            >
              {/* نبضة خفيفة في الاتصال والاستماع */}
              <motion.span
                className="absolute inset-0 rounded-full bg-[#c62828]/10"
                animate={
                  connecting || waveActive
                    ? {
                        scale: [1, 1.18, 1],
                        opacity: [0.35, 0.08, 0.35],
                      }
                    : { scale: 1, opacity: 0.12 }
                }
                transition={
                  connecting || waveActive
                    ? {
                        duration: connecting ? 1.35 : 1.7,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }
                    : { duration: 0.25 }
                }
                aria-hidden
              />

              <div
                className={cn(
                  "relative z-10 grid place-items-center rounded-full",
                  "bg-[linear-gradient(145deg,#c62828_0%,#e85a4f_100%)]",
                  "shadow-[0_4px_12px_rgba(198,40,40,0.35)]",
                  desktop ? "size-11" : "size-10",
                )}
              >
                <FakeBarVisualizer
                  variant="compact"
                  active={connecting || waveActive}
                  muted={!micOn && !connecting}
                  barClassName={
                    !micOn && !connecting ? "bg-white/45" : "bg-white"
                  }
                  className={cn(
                    connecting && "opacity-80",
                    desktop ? "h-[18px]" : "h-4",
                  )}
                />
              </div>
            </div>

            <div className="min-w-0 flex-1 text-start">
              <p
                className={cn(
                  "truncate font-bold leading-tight tracking-tight text-fg0",
                  desktop ? "text-sm" : "text-[13px]",
                )}
              >
                لقمة
              </p>
              <p
                className={cn(
                  "truncate leading-tight text-fg1/90",
                  desktop ? "text-xs" : "text-[11px]",
                )}
              >
                {statusLabel(phase, micOn)}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-0.5">
              <button
                type="button"
                aria-label={micOn ? "كتم الميكروفون" : "تشغيل الميكروفون"}
                aria-pressed={micOn}
                disabled={connecting}
                onClick={onMicToggle}
                className={cn(
                  "grid size-9 place-items-center rounded-full transition",
                  "disabled:cursor-not-allowed disabled:opacity-40",
                  micOn
                    ? "text-fg1 hover:bg-black/[0.05] hover:text-fg0"
                    : "bg-[#fdecea] text-[#c62828]",
                )}
              >
                {micOn ? (
                  <Microphone size={17} weight="bold" className="size-[17px]" />
                ) : (
                  <MicrophoneSlash
                    size={17}
                    weight="bold"
                    className="size-[17px]"
                  />
                )}
              </button>

              <button
                type="button"
                aria-label="إغلاق المساعد"
                onClick={onClose}
                className="grid size-9 place-items-center rounded-full text-fg1/70 transition hover:bg-black/[0.05] hover:text-fg0"
              >
                <XIcon size={16} weight="bold" className="size-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export { useFabBottom };
