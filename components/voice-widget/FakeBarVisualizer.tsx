"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/cn";

type Props = {
  active?: boolean;
  muted?: boolean;
  /** compact = 3 أعمدة صغيرة | rich = موجات أغنى للأورب */
  variant?: "compact" | "rich";
  className?: string;
  /** لون الأعمدة (مثلاً أبيض داخل الأورب) */
  barClassName?: string;
};

const COMPACT_BARS = [
  { delay: 0, duration: 0.55 },
  { delay: 0.12, duration: 0.7 },
  { delay: 0.24, duration: 0.48 },
];

const RICH_BARS = [
  { delay: 0, duration: 0.62 },
  { delay: 0.05, duration: 0.48 },
  { delay: 0.1, duration: 0.72 },
  { delay: 0.15, duration: 0.55 },
  { delay: 0.2, duration: 0.68 },
  { delay: 0.12, duration: 0.5 },
  { delay: 0.08, duration: 0.75 },
  { delay: 0.18, duration: 0.58 },
  { delay: 0.06, duration: 0.64 },
  { delay: 0.14, duration: 0.52 },
];

export function FakeBarVisualizer({
  active = true,
  muted = false,
  variant = "compact",
  className,
  barClassName,
}: Props) {
  const bars = variant === "rich" ? RICH_BARS : COMPACT_BARS;
  const rich = variant === "rich";

  return (
    <div
      className={cn(
        "flex w-auto items-center justify-center",
        rich ? "h-10 gap-[3px]" : "h-5 gap-0.5",
        className,
      )}
      aria-hidden
    >
      {bars.map((bar, i) => (
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
            active && !muted
              ? { scaleY: [0.28, 1, 0.4, 0.92, 0.28] }
              : { scaleY: 0.28 }
          }
          transition={
            active && !muted
              ? {
                  duration: bar.duration,
                  delay: bar.delay,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
              : { duration: 0.2 }
          }
        />
      ))}
    </div>
  );
}
