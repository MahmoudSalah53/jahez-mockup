"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import type { FormantVisemes } from "@/lib/use-formant-visemes";

type Props = {
  visemes?: FormantVisemes | null;
  idleTalk?: boolean;
  className?: string;
  faceClassName?: string;
};

type MouthShape = {
  open: number;
  width: number;
  round: number;
};

const REST: MouthShape = { open: 0, width: 0.55, round: 0.12 };
const MOUTH_Y = 26;

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

function mouthPath({ open, width, round }: MouthShape): string {
  const halfW = lerp(3.4, 8.4, width);
  const cx = 20;
  const cy = MOUTH_Y;
  const openH = lerp(0.35, 5.0, open);
  const rx = halfW * (1 - round * 0.58);
  const ry = openH * (1 + round * 0.28);
  const left = cx - rx;
  const right = cx + rx;
  const top = cy - ry;
  const bot = cy + ry * 0.85;

  if (open < 0.05) {
    const smileDip = lerp(0.8, 1.5, width);
    return `M ${left.toFixed(2)} ${cy.toFixed(2)} Q ${cx} ${(cy + smileDip).toFixed(2)} ${right.toFixed(2)} ${cy.toFixed(2)}`;
  }

  const cpX = rx * 0.55;
  return [
    `M ${left.toFixed(2)} ${cy.toFixed(2)}`,
    `C ${left.toFixed(2)} ${top.toFixed(2)}, ${(cx - cpX).toFixed(2)} ${top.toFixed(2)}, ${cx.toFixed(2)} ${top.toFixed(2)}`,
    `C ${(cx + cpX).toFixed(2)} ${top.toFixed(2)}, ${right.toFixed(2)} ${top.toFixed(2)}, ${right.toFixed(2)} ${cy.toFixed(2)}`,
    `C ${right.toFixed(2)} ${bot.toFixed(2)}, ${(cx + cpX).toFixed(2)} ${bot.toFixed(2)}, ${cx.toFixed(2)} ${bot.toFixed(2)}`,
    `C ${(cx - cpX).toFixed(2)} ${bot.toFixed(2)}, ${left.toFixed(2)} ${bot.toFixed(2)}, ${left.toFixed(2)} ${cy.toFixed(2)}`,
    "Z",
  ].join(" ");
}

function shapeFromVisemes(v: FormantVisemes): MouthShape {
  const energy = v.jawOpen + v.aa + v.ee + v.oo + v.consonant;
  if (energy < 0.06) return REST;

  // Blend competing visemes so و isn't the default
  const open = clamp01(
    v.jawOpen * 0.55 + v.aa * 0.7 + v.ee * 0.28 + v.oo * 0.22 + v.consonant * 0.12,
  );
  const width = clamp01(
    0.42 + v.aa * 0.38 + v.ee * 0.48 - v.oo * 0.32 + v.consonant * 0.12,
  );
  const round = clamp01(v.oo * 0.95 - v.ee * 0.25 - v.aa * 0.08);

  return { open, width, round };
}

function idleShape(t: number): MouthShape {
  const cycle = t * Math.PI * 2;
  const aa = Math.max(0, Math.sin(cycle));
  const ee = Math.max(0, Math.sin(cycle + 2.1));
  const oo = Math.max(0, Math.sin(cycle + 4.2)) * 0.45;
  return shapeFromVisemes({
    jawOpen: 0.25 + aa * 0.35,
    aa: aa * 0.7,
    ee: ee * 0.55,
    oo,
    consonant: 0.08,
  });
}

/**
 * Face mouth driven by formant visemes (آ / ي / و) from live FFT.
 */
export function TalkingFace({
  visemes,
  idleTalk = false,
  className,
  faceClassName,
}: Props) {
  const [blink, setBlink] = useState(false);
  const [idlePhase, setIdlePhase] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    function schedule() {
      timer = setTimeout(
        () => {
          if (cancelled) return;
          setBlink(true);
          timer = setTimeout(() => {
            if (cancelled) return;
            setBlink(false);
            schedule();
          }, 120);
        },
        2800 + Math.random() * 3200,
      );
    }

    schedule();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!idleTalk) {
      setIdlePhase(0);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      setIdlePhase(((now - start) % 1100) / 1100);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [idleTalk]);

  const shape = visemes
    ? shapeFromVisemes(visemes)
    : idleTalk
      ? idleShape(idlePhase)
      : REST;

  const eyeScaleY = blink ? 0.12 : 1;
  const path = mouthPath(shape);
  const isOpen = shape.open >= 0.05;

  return (
    <div
      className={cn(
        "relative grid size-full place-items-center overflow-hidden rounded-full",
        faceClassName ??
          "bg-[linear-gradient(145deg,#8B6FF0_0%,#C4B5FD_100%)]",
        className,
      )}
      aria-hidden
    >
      <svg
        viewBox="0 0 40 40"
        className="size-[78%] max-h-full max-w-full"
        fill="none"
      >
        <g
          style={{
            transformOrigin: "14px 14px",
            transform: `scaleY(${eyeScaleY})`,
            transition: "transform 80ms ease-out",
          }}
        >
          <rect x="11.5" y="10.5" width="3.2" height="8" rx="1.6" fill="#fff" />
        </g>
        <g
          style={{
            transformOrigin: "26px 14px",
            transform: `scaleY(${eyeScaleY})`,
            transition: "transform 80ms ease-out",
          }}
        >
          <rect x="25.3" y="10.5" width="3.2" height="8" rx="1.6" fill="#fff" />
        </g>

        <path
          d={path}
          stroke="#fff"
          strokeWidth={isOpen ? 0 : 2.2}
          strokeLinecap="round"
          fill={isOpen ? "#fff" : "none"}
        />
      </svg>
    </div>
  );
}
