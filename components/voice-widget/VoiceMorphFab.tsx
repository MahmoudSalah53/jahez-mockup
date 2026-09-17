"use client";

import { AnimatePresence, motion } from "motion/react";
import { Microphone, MicrophoneSlash, XIcon } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import type { RemoteAudioTrack } from "livekit-client";
import { FakeBarVisualizer } from "@/components/voice-widget/FakeBarVisualizer";
import { TalkingFace } from "@/components/voice-widget/TalkingFace";
import { usePrefs } from "@/lib/prefs-context";
import { getVoiceFabStyle } from "@/lib/voice-fab-style";
import { useFormantVisemes } from "@/lib/use-formant-visemes";
import { useMultibandTrackVolume } from "@/lib/use-multiband-track-volume";
import { cn } from "@/lib/cn";

export type VoicePhase = "closed" | "connecting" | "listening";

const CIRCLE_PX = 44;
const CIRCLE_DESKTOP_PX = 52;
/** Style 2 — face FAB sizes (عدّل من هنا لتصغير/تكبير الموديل كله) */
const FACE_CIRCLE_PX = 52;
const FACE_CIRCLE_DESKTOP_PX = 60;
const TEASE_PILL_PX = 142;
const TEASE_PILL_DESKTOP_PX = 164;
const FACE_TEASE_PILL_PX = 148;
const FACE_TEASE_PILL_DESKTOP_PX = 168;
const OPEN_PILL_PX = 250;
const OPEN_PILL_DESKTOP_PX = 290;
const OPEN_H = 48;
const OPEN_H_DESKTOP = 56;
/** Style 2 — open session pill */
const FACE_OPEN_PILL_PX = 260;
const FACE_OPEN_PILL_DESKTOP_PX = 298;
const FACE_OPEN_H = 56;
const FACE_OPEN_H_DESKTOP = 64;
/** Avatar disc: closed → slightly smaller when active */
const FACE_AVATAR_CLOSED_PX = FACE_CIRCLE_PX;
const FACE_AVATAR_CLOSED_DESKTOP_PX = FACE_CIRCLE_DESKTOP_PX;
const FACE_AVATAR_OPEN_PX = 48;
const FACE_AVATAR_OPEN_DESKTOP_PX = 54;
const TEASE_VISIBLE_MS = 3000;
const TEASE_GAP_MS = 60_000;
const INTRO_DELAY_MS = 500;

/** Coda mark — lavender of the O, not Jahez red. */
const CODA_FAB_BG = "bg-[linear-gradient(145deg,#8B6FF0_0%,#C4B5FD_100%)]";
const CODA_FAB_BG_X = "bg-[linear-gradient(90deg,#8B6FF0_0%,#C4B5FD_100%)]";
const CODA_FAB_BG_Y = "bg-[linear-gradient(180deg,#8B6FF0,#C4B5FD)]";
const CODA_PULSE = "bg-[#8B6FF0]/15";
const CODA_SHADOW = "shadow-[0_4px_12px_rgba(139,111,240,0.38)]";
const CODA_MUTE = "bg-[#EEE8FF] text-[#6D5AE6]";

/** Style 2 — site accent only (--accent #c62828 / --accent-hover #b71c1c) */
/** Darker hover on text side → brand accent toward the circle */
const FACE_FAB_BG_X =
  "bg-[linear-gradient(90deg,var(--accent-hover)_0%,var(--accent)_55%,var(--accent)_100%)]";
const FACE_FAB_BG_Y = "bg-[linear-gradient(180deg,var(--accent-hover),var(--accent))]";
const FACE_PULSE = "bg-accent/20";
const FACE_SHADOW = "shadow-[0_6px_18px_rgba(198,40,40,0.35)]";
const FACE_MUTE = "bg-accent-soft text-accent";
/** Avatar disc — exact website red */
const FACE_AVATAR_BG = "bg-accent";
/** Drop shadow under/around the disc so it lifts off the expanding strip */
const FACE_AVATAR_RING =
  "shadow-[0_5px_12px_rgba(0,0,0,0.32),0_2px_4px_rgba(0,0,0,0.2),-3px_3px_10px_rgba(0,0,0,0.18),inset_0_0_0_1px_rgba(255,255,255,0.18)]";

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

function useOpenWidth(desktop: boolean, isFace: boolean) {
  const max = isFace
    ? desktop
      ? FACE_OPEN_PILL_DESKTOP_PX
      : FACE_OPEN_PILL_PX
    : desktop
      ? OPEN_PILL_DESKTOP_PX
      : OPEN_PILL_PX;
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
  const style = getVoiceFabStyle();
  const isFace = style === 2;
  const bottom = useFabBottom();
  const desktop = useIsDesktop();
  const { ready, done } = usePrefs();
  const open = phase !== "closed";

  const agentLevels = useMultibandTrackVolume(isFace ? null : agentTrack, {
    bands: 5,
    updateInterval: 40,
  });
  const visemes = useFormantVisemes(isFace ? agentTrack : null);
  const visemesLiveRef = useRef(visemes);
  visemesLiveRef.current = visemes;
  const agentSpeaking =
    phase === "listening" &&
    Boolean(agentTrack) &&
    (isFace
      ? visemes.jawOpen > 0.08 || visemes.aa + visemes.ee + visemes.oo > 0.08
      : agentLevels.some((v) => v > 0.18));

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
  const openWidth = useOpenWidth(desktop, isFace);

  // بعد الإغلاق/الفتح: امسح الـ hover عشان متفضلش «اسأل سلمى» معلّقة
  useEffect(() => {
    setHovered(false);
  }, [open]);

  const circlePx = isFace
    ? desktop
      ? FACE_CIRCLE_DESKTOP_PX
      : FACE_CIRCLE_PX
    : desktop
      ? CIRCLE_DESKTOP_PX
      : CIRCLE_PX;
  const teasePx = isFace
    ? desktop
      ? FACE_TEASE_PILL_DESKTOP_PX
      : FACE_TEASE_PILL_PX
    : desktop
      ? TEASE_PILL_DESKTOP_PX
      : TEASE_PILL_PX;
  const openH = isFace
    ? desktop
      ? FACE_OPEN_H_DESKTOP
      : FACE_OPEN_H
    : desktop
      ? OPEN_H_DESKTOP
      : OPEN_H;

  const closedExpanded = !open && (teased || hovered);
  const width = open ? openWidth : closedExpanded ? teasePx : circlePx;
  const height = open ? openH : circlePx;

  const connecting = phase === "connecting";
  const waveActive = agentSpeaking || (connecting && !agentTrack);
  const liveLevels =
    phase === "listening" && agentTrack ? agentLevels : undefined;

  const fabBgX = isFace ? FACE_FAB_BG_X : CODA_FAB_BG_X;
  const fabBgY = isFace ? FACE_FAB_BG_Y : CODA_FAB_BG_Y;
  const fabPulse = isFace ? FACE_PULSE : CODA_PULSE;
  const fabAvatarBg = isFace ? FACE_AVATAR_BG : CODA_FAB_BG;
  const fabShadow = isFace ? FACE_SHADOW : CODA_SHADOW;
  const fabMute = isFace ? FACE_MUTE : CODA_MUTE;
  const teaseTextClass = "text-white";
  const faceClosedPx = desktop
    ? FACE_AVATAR_CLOSED_DESKTOP_PX
    : FACE_AVATAR_CLOSED_PX;
  const faceOpenPx = desktop
    ? FACE_AVATAR_OPEN_DESKTOP_PX
    : FACE_AVATAR_OPEN_PX;
  const facePx = open ? faceOpenPx : faceClosedPx;

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
        className={cn("absolute inset-0 rounded-full", fabBgX)}
        initial={false}
        animate={{ opacity: open ? 0 : 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden
      />

      {/* خلفية مفتوحة — تظهر مع التمدّد */}
      <motion.span
        className="absolute inset-0 rounded-full border border-black/[0.04] bg-white"
        initial={false}
        animate={{ opacity: open ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden
      />

      {open ? (
        <span
          className={cn(
            "pointer-events-none absolute inset-y-0 start-0 z-[1] w-1",
            fabBgY,
          )}
          aria-hidden
        />
      ) : null}

      {/*
        Same face disc for closed → active (shrinks slightly).
        pointer-events-none so the closed button above stays clickable.
      */}
      {isFace ? (
        <motion.div
          className={cn(
            // no overflow-hidden here — so drop shadow isn’t clipped
            "pointer-events-none absolute z-[5] grid place-items-center rounded-full",
            FACE_AVATAR_BG,
            !open && FACE_AVATAR_RING,
            open && fabShadow,
          )}
          initial={false}
          animate={{
            width: facePx,
            height: facePx,
            top: open ? "50%" : 0,
            y: open ? "-50%" : 0,
            insetInlineStart: open ? 8 : 0,
          }}
          transition={morphSpring}
          aria-hidden
        >
          <motion.span
            className={cn("absolute inset-0 rounded-full", fabPulse)}
            animate={
              open && agentSpeaking
                ? {
                    opacity: [0.22, 0.08, 0.22],
                  }
                : { opacity: 0 }
            }
            transition={
              open && agentSpeaking
                ? {
                    duration: 1.7,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }
                : { duration: 0.2 }
            }
          />
          <TalkingFace
            className="relative z-10 size-full"
            faceClassName={FACE_AVATAR_BG}
            visemesRef={visemesLiveRef}
          />
        </motion.div>
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
            transition={{ duration: 0.18 }}
            className="relative z-20 m-0 flex h-full w-full cursor-pointer items-center border-0 bg-transparent p-0 focus:outline-none"
            dir="rtl"
          >
            <span
              className={cn(
                "grid shrink-0 place-items-center overflow-hidden rounded-full",
                !isFace && (desktop ? "size-[52px]" : "size-11"),
              )}
              style={
                isFace
                  ? { width: faceClosedPx, height: faceClosedPx }
                  : undefined
              }
              aria-hidden={isFace}
            >
              {isFace ? null : (
                <img
                  src="/coda-mark.png"
                  alt=""
                  width={desktop ? 52 : 44}
                  height={desktop ? 52 : 44}
                  className="size-full scale-[1.12] object-cover"
                  draggable={false}
                />
              )}
            </span>
            <motion.span
              initial={false}
              animate={{
                opacity: closedExpanded ? 1 : 0,
                maxWidth: closedExpanded ? (desktop ? 110 : 96) : 0,
              }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                "overflow-hidden whitespace-nowrap ps-3 pe-4 font-bold",
                teaseTextClass,
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
            transition={{ duration: 0.28, delay: isFace ? 0 : 0.06 }}
            className={cn(
              "relative z-20 flex h-full w-full items-center gap-2 px-1.5 pe-2",
              desktop && "gap-2.5 px-2 pe-2.5",
            )}
          >
            <div
              className={cn(
                "relative ms-1 grid shrink-0 place-items-center",
                isFace
                  ? undefined
                  : desktop
                    ? "size-12"
                    : "size-11",
              )}
              style={
                isFace
                  ? { width: faceOpenPx, height: faceOpenPx }
                  : undefined
              }
              aria-hidden={isFace}
            >
              {isFace ? null : (
                <>
                  <motion.span
                    className={cn("absolute inset-0 rounded-full", fabPulse)}
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
                      "relative z-10 grid place-items-center overflow-hidden rounded-full",
                      fabAvatarBg,
                      fabShadow,
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
                </>
              )}
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
                    : fabMute,
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
