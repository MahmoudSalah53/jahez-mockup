"use client";

import { AnimatePresence, motion } from "motion/react";
import { Microphone, MicrophoneSlash, XIcon } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import type { RemoteAudioTrack } from "livekit-client";
import { FakeBarVisualizer } from "@/components/voice-widget/FakeBarVisualizer";
import { usePrefs } from "@/lib/prefs-context";
import { useMultibandTrackVolume } from "@/lib/use-multiband-track-volume";
import { cn } from "@/lib/cn";

export type VoicePhase = "closed" | "connecting" | "listening";

const CIRCLE_PX = 44;
const CIRCLE_DESKTOP_PX = 52;
const TEASE_PILL_PX = 142;
const TEASE_PILL_DESKTOP_PX = 164;
const OPEN_PILL_PX = 250;
const OPEN_PILL_DESKTOP_PX = 290;
const OPEN_H = 48;
const OPEN_H_DESKTOP = 56;
const TEASE_VISIBLE_MS = 2500;
const TEASE_GAP_MS = 60_000;
const INTRO_DELAY_MS = 500;

/** Coda mark — lavender of the O, not Jahez red. */
const CODA_FAB_BG = "bg-[linear-gradient(145deg,#8B6FF0_0%,#C4B5FD_100%)]";
const CODA_FAB_BG_X = "bg-[linear-gradient(90deg,#8B6FF0_0%,#C4B5FD_100%)]";
const CODA_FAB_BG_Y = "bg-[linear-gradient(180deg,#8B6FF0,#C4B5FD)]";
const CODA_PULSE = "bg-[#8B6FF0]/15";
const CODA_SHADOW = "shadow-[0_4px_12px_rgba(139,111,240,0.38)]";
const CODA_MUTE = "bg-[#EEE8FF] text-[#6D5AE6]";

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

/**
 * @param active — الزر مغلق وprefs خلصت (مش أثناء الأونبوردينج)
 * @param burstIntro — أول مرة بعد إنهاء/تخطي الأونبوردينج
 * @param voiceOpenedOnce — المستخدم فتح الفويس قبل كده (بعد الإغلاق نستنى دقيقة)
 */
function usePillTease(
  active: boolean,
  burstIntro: boolean,
  voiceOpenedOnce: boolean,
) {
  const [teased, setTeased] = useState(false);
  const burstHandledRef = useRef(false);

  useEffect(() => {
    if (!active) {
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

    const shouldBurst = burstIntro && !burstHandledRef.current;
    if (shouldBurst) burstHandledRef.current = true;

    // مهم: متخلطش «انتظار الأونبوردينج» مع «إغلاق جلسة صوت»
    const initialDelay = shouldBurst
      ? 200
      : voiceOpenedOnce
        ? TEASE_GAP_MS
        : INTRO_DELAY_MS;

    const intro = setTimeout(() => runCycle(TEASE_GAP_MS), initialDelay);

    return () => {
      cancelled = true;
      clearTimeout(intro);
      if (collapseTimer) clearTimeout(collapseTimer);
      if (cycleTimer) clearTimeout(cycleTimer);
    };
  }, [active, burstIntro, voiceOpenedOnce]);

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
  if (phase === "connecting") return "جاري الاتصال…";
  if (!micOn) return "الميكروفون مقفول";
  return "متصل الآن";
}

type Props = {
  phase: VoicePhase;
  micOn: boolean;
  /** صوت الـ AI من LiveKit — الموجات تتبعه */
  agentTrack?: RemoteAudioTrack | null;
  onOpen: () => void;
  onClose: () => void;
  onMicToggle: () => void;
};

/**
 * عنصر واحد يتمدّد من دائرة «اسأل سلمى» إلى شريط الجلسة والعكس.
 */
export function VoiceMorphFab({
  phase,
  micOn,
  agentTrack = null,
  onOpen,
  onClose,
  onMicToggle,
}: Props) {
  const bottom = useFabBottom();
  const desktop = useIsDesktop();
  const { ready, done } = usePrefs();
  const open = phase !== "closed";

  const agentLevels = useMultibandTrackVolume(agentTrack, {
    bands: 5,
    updateInterval: 40,
  });
  const agentSpeaking =
    phase === "listening" &&
    Boolean(agentTrack) &&
    agentLevels.some((v) => v > 0.18);

  // هل الزائر بدأ بدون prefs؟ (أول مرة يشوف الأونبوردينج)
  const startedWithoutPrefsRef = useRef<boolean | null>(null);
  useEffect(() => {
    if (!ready || startedWithoutPrefsRef.current !== null) return;
    startedWithoutPrefsRef.current = !done;
  }, [ready, done]);

  const [voiceOpenedOnce, setVoiceOpenedOnce] = useState(false);
  useEffect(() => {
    if (open) setVoiceOpenedOnce(true);
  }, [open]);

  const burstAfterOnboarding =
    ready && done && startedWithoutPrefsRef.current === true;

  // متظهرش «اسأل سلمى» أثناء الأونبوردينج — استنى يخلص/يتخطّى
  const teaseAllowed = ready && done && !open;
  const teased = usePillTease(
    teaseAllowed,
    burstAfterOnboarding,
    voiceOpenedOnce,
  );
  const [hovered, setHovered] = useState(false);
  const openWidth = useOpenWidth(desktop);

  // بعد الإغلاق/الفتح: امسح الـ hover عشان متفضلش «اسأل سلمى» معلّقة
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
  const waveActive = agentSpeaking || (connecting && !agentTrack);
  const liveLevels =
    phase === "listening" && agentTrack ? agentLevels : undefined;

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
        className={cn("absolute inset-0 rounded-full", CODA_FAB_BG_X)}
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
          className={cn(
            "pointer-events-none absolute inset-y-0 start-0 z-[1] w-1",
            CODA_FAB_BG_Y,
          )}
          aria-hidden
        />
      ) : null}

      <AnimatePresence mode="popLayout" initial={false}>
        {!open ? (
          <motion.button
            key="closed"
            type="button"
            aria-label="اسأل سلمى"
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
                "grid shrink-0 place-items-center overflow-hidden rounded-full",
                desktop ? "size-[52px]" : "size-11",
              )}
            >
              <img
                src="/coda-mark.png"
                alt=""
                width={desktop ? 52 : 44}
                height={desktop ? 52 : 44}
                className="size-full scale-[1.12] object-cover"
                draggable={false}
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
                "overflow-hidden whitespace-nowrap ps-3 pe-4 font-bold text-white",
                desktop ? "text-[15px]" : "text-sm",
              )}
            >
              اسأل سلمى
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
                className={cn("absolute inset-0 rounded-full", CODA_PULSE)}
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
                  CODA_FAB_BG,
                  CODA_SHADOW,
                  desktop ? "size-11" : "size-10",
                )}
              >
                <FakeBarVisualizer
                  variant="compact"
                  active={connecting || waveActive}
                  levels={liveLevels}
                  barClassName="bg-white"
                  className={cn(
                    connecting && "opacity-80",
                    desktop ? "h-[18px] gap-[2px]" : "h-4 gap-[1.5px]",
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
                سلمى
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
                    : CODA_MUTE,
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
