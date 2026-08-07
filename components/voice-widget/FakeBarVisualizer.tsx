"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/cn";

type Props = {
  active?: boolean;
  muted?: boolean;
  className?: string;
};

const bars = [
  { delay: 0, duration: 0.55 },
  { delay: 0.12, duration: 0.7 },
  { delay: 0.24, duration: 0.48 },
];

export function FakeBarVisualizer({
  active = true,
  muted = false,
  className,
}: Props) {
  return (
    <div
      className={cn(
        "flex h-5 w-auto items-center justify-center gap-0.5",
        className,
      )}
      aria-hidden
    >
      {bars.map((bar, i) => (
        <motion.span
          key={i}
          className={cn(
            "inline-block h-full w-0.5 origin-center rounded-2xl",
            muted ? "bg-destructive-foreground" : "bg-fg1",
          )}
          animate={
            active && !muted
              ? { scaleY: [0.35, 1, 0.45, 0.9, 0.35] }
              : { scaleY: 0.35 }
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
