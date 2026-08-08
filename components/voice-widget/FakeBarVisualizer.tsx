"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/cn";

type Props = {
  active?: boolean;
  muted?: boolean;
  /** compact = أعمدة صغيرة | rich = موجات أغنى للأورب */
  variant?: "compact" | "rich";
  className?: string;
  /** لون الأعمدة (مثلاً أبيض داخل الأورب) */
  barClassName?: string;
  /**
   * مستويات حقيقية 0–1 من صوت الـ AI.
   * لو موجودة → الموجات تتبع الصوت؛ لو لأ → أنيميشن idle (مثلاً أثناء الاتصال).
   */
  levels?: number[];
};

const COMPACT_COUNT = 5;
const RICH_COUNT = 10;

const MIN_SCALE = 0.28;

function levelToScale(level: number) {
  const boosted = Math.min(1, level * 1.7);
  return MIN_SCALE + boosted * (1 - MIN_SCALE);
}

/**
 * وزّع الـ bands من الوسط للخارج:
 * أقوى/أول band → الوسط، وبعدين يمين/شمال بالتبادل.
 * كده الحركة تبان من المركز مش الجناب.
 */
function toCenterOutLevels(levels: number[], count: number): number[] {
  const out = Array.from({ length: count }, () => 0);
  const mid = Math.floor((count - 1) / 2);
  let src = 0;

  out[mid] = levels[src++] ?? 0;

  for (let step = 1; step <= mid; step++) {
    if (mid - step >= 0) {
      out[mid - step] = levels[src++] ?? 0;
    }
    if (mid + step < count) {
      out[mid + step] = levels[src++] ?? 0;
    }
  }

  // تأكيد بصري: الوسط أعلى شوية من الأطراف
  return out.map((v, i) => {
    const dist = Math.abs(i - mid) / Math.max(mid, 1);
    const weight = 1.15 - dist * 0.55;
    return Math.min(1, v * weight);
  });
}

function idleScaleKeyframes(distFromCenter: number) {
  // الوسط يهتز أقوى؛ الجناب أهدى
  const peak = 1 - distFromCenter * 0.42;
  const mid = 0.4 + (1 - distFromCenter) * 0.35;
  return [MIN_SCALE, peak, mid * 0.85, peak * 0.9, MIN_SCALE];
}

function idleDelay(distFromCenter: number) {
  return distFromCenter * 0.1;
}

function idleDuration(distFromCenter: number) {
  return 0.48 + distFromCenter * 0.12;
}

export function FakeBarVisualizer({
  active = true,
  muted = false,
  variant = "compact",
  className,
  barClassName,
  levels,
}: Props) {
  const count = variant === "rich" ? RICH_COUNT : COMPACT_COUNT;
  const rich = variant === "rich";
  const mid = Math.floor((count - 1) / 2);
  const live = Boolean(levels && levels.length > 0);
  const mappedLevels =
    live && levels ? toCenterOutLevels(levels, count) : null;

  return (
    <div
      dir="ltr"
      className={cn(
        "flex w-auto items-center justify-center",
        rich ? "h-10 gap-[3px]" : "h-5 gap-0.5",
        className,
      )}
      aria-hidden
    >
      {Array.from({ length: count }, (_, i) => {
        const dist = Math.abs(i - mid) / Math.max(mid, 1);
        const liveScale = mappedLevels
          ? levelToScale(mappedLevels[i] ?? 0)
          : MIN_SCALE;

        return (
          <motion.span
            key={i}
            className={cn(
              "inline-block h-full origin-center rounded-2xl",
              rich ? "w-[3px]" : "w-0.5",
              barClassName
                ? barClassName
                : muted
                  ? "bg-destructive-foreground"
                  : "bg-fg1",
            )}
            animate={
              live
                ? { scaleY: liveScale }
                : active && !muted
                  ? { scaleY: idleScaleKeyframes(dist) }
                  : { scaleY: MIN_SCALE }
            }
            transition={
              live
                ? { duration: 0.05, ease: "linear" }
                : active && !muted
                  ? {
                      duration: idleDuration(dist),
                      delay: idleDelay(dist),
                      repeat: Infinity,
                      ease: "easeInOut",
                    }
                  : { duration: 0.2 }
            }
          />
        );
      })}
    </div>
  );
}
