"use client";

import { memo, useEffect, useRef, type MutableRefObject } from "react";
import { cn } from "@/lib/cn";
import type { FormantVisemes } from "@/lib/use-formant-visemes";

type Props = {
  /** Prefer a stable ref so parent re-renders don’t remount/repaint the logo */
  visemesRef?: MutableRefObject<FormantVisemes | null | undefined>;
  /** @deprecated use visemesRef — kept for brief compat */
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

const REST: MouthShape = { open: 0, width: 0.55, round: 0.1 };
/** Animated mouth — white on red circle */
const MOUTH_COLOR = "#ffffff";

/* ── Tunables — عدّل من هنا فقط ─────────────────────────
   LOGO_SIZE     حجم اللوجو % من الدايرة (زوّد = أكبر)
   LOGO_NUDGE_X  يمين(+) / شمال(−)
   LOGO_NUDGE_Y  تحت(+) / فوق(−)
   MOUTH_LEFT    مكان الفم من الشمال %
   MOUTH_TOP     مكان الفم من فوق %
   MOUTH_W/H     حجم صندوق الفم %
   MOUTH_STROKE  سُمك الابتسامة
   MOUTH_SCALE   حجم الفم (العرض/الضخامة)
   MOUTH_CURVE   انحناء القوس فقط — مش الطول
*/
const LOGO_SIZE = 140; // % — كان 88، كبّرناه
const LOGO_NUDGE_X = 0;
const LOGO_NUDGE_Y = -8 ;

const MOUTH_LEFT = 30; // %
const MOUTH_TOP = 48; // %
const MOUTH_W = 40; // %
const MOUTH_H = 22; // %
/** سُمك خط الفم وهو مقفول (ابتسامة) — زوّد للـ bold */
const MOUTH_STROKE = 6;
/** حجم الفم (العرض) — من غير ما يغيّر شكل الانحناء */
const MOUTH_SCALE = 1.5;
/**
 * انحناء القوس فقط (عمق الوسط بالنسبة للعرض الثابت)
 * 0.2 ≈ شبه مستقيم | 0.7 عادي | 1.1 أقوس | أعلى = انحناء أعمق من غير تطويل
 */
const MOUTH_CURVE = 1.5;

/** Red circle — exact site --accent (#c62828) */
const FACE_BG = "bg-accent";
const LOGO_SRC = "/ICON.png";

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

/** Same chord width; CURVE only bows the middle (sagitta), doesn’t lengthen */
function mouthPath({ open, width, round }: MouthShape): string {
  const s = MOUTH_SCALE;
  const o = clamp01(open);

  const cx = 20;
  const cy = 16.5;
  const halfW = lerp(5.2, 11.0, width) * s;
  const rx = halfW * (1 - round * 0.4);
  const left = cx - rx;
  const right = cx + rx;

  const curve = Math.max(0.05, MOUTH_CURVE);
  const dip = rx * curve * 0.9;

  const restHalf = MOUTH_STROKE * 0.42;
  const jawUp = o * s * 3.4;
  const jawDown = o * s * 4.2;

  const topOff = restHalf * 0.45 + jawUp;
  const botOff = restHalf * 0.55 + jawDown + dip * 0.05 * o;
  const endY = cy + dip * 0.06 * o;

  const topCtrl = cy + dip - topOff;
  const botCtrl = cy + dip + botOff;

  return [
    `M ${left.toFixed(2)} ${endY.toFixed(2)}`,
    `Q ${cx} ${topCtrl.toFixed(2)} ${right.toFixed(2)} ${endY.toFixed(2)}`,
    `Q ${cx} ${botCtrl.toFixed(2)} ${left.toFixed(2)} ${endY.toFixed(2)}`,
    "Z",
  ].join(" ");
}

function shapeFromVisemes(v: FormantVisemes): MouthShape {
  const energy = v.jawOpen + v.aa + v.ee + v.oo + v.consonant;
  if (energy < 0.05) return REST;

  const ooDom = clamp01(v.oo - Math.max(v.aa, v.ee) * 0.55);

  const open = clamp01(
    v.jawOpen * 0.52 +
      v.aa * 0.72 +
      v.ee * 0.3 +
      v.oo * 0.2 +
      v.consonant * 0.12,
  );
  // Keep width mostly stable — big left/right swings look like the logo shaking
  const width = clamp01(
    0.52 + v.aa * 0.22 + v.ee * 0.28 - ooDom * 0.22 + v.consonant * 0.06,
  );
  const round = clamp01(ooDom * 0.55 - v.ee * 0.15 - v.aa * 0.05);

  return { open, width, round };
}

/**
 * White ICON on red circle. Mouth path is patched via DOM;
 * component is memoized + visemes come through a stable ref so the
 * logo never re-renders during speech (fixes mobile jitter).
 */
export const TalkingFace = memo(function TalkingFace({
  visemesRef,
  visemes,
  className,
  faceClassName,
}: Props) {
  const shapeRef = useRef(REST);
  const pathRef = useRef<SVGPathElement | null>(null);
  const fallbackVisemes = useRef(visemes);
  fallbackVisemes.current = visemes;

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(48, now - last);
      last = now;

      const live = visemesRef?.current ?? fallbackVisemes.current;
      const tgt = live ? shapeFromVisemes(live) : REST;

      const cur = shapeRef.current;
      const opening = tgt.open > cur.open;
      const k = 1 - Math.exp(-dt / (opening ? 12 : 36));
      const kW = 1 - Math.exp(-dt / (opening ? 36 : 56));
      const next: MouthShape = {
        open: lerp(cur.open, tgt.open, k),
        width: lerp(cur.width, tgt.width, kW),
        round: lerp(cur.round, tgt.round, kW),
      };
      if (tgt.open < 0.02 && next.open < 0.012) {
        next.open = 0;
        next.width = lerp(next.width, REST.width, 0.3);
        next.round = lerp(next.round, REST.round, 0.3);
      }
      shapeRef.current = next;
      pathRef.current?.setAttribute("d", mouthPath(next));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visemesRef]);

  const curveFit = Math.max(
    1,
    Math.min(2.2, 0.9 + MOUTH_SCALE * 0.28 + MOUTH_CURVE * 0.2),
  );
  const mouthH = MOUTH_H * curveFit;
  const mouthTop = MOUTH_TOP - (mouthH - MOUTH_H) * 0.4;

  return (
    <div
      className={cn(
        "relative grid size-full place-items-center overflow-hidden rounded-full [contain:paint]",
        faceClassName ?? FACE_BG,
        className,
      )}
      aria-hidden
    >
      {/* Static centered logo — never updated during lip-sync */}
      <div className="pointer-events-none absolute inset-0 grid place-items-center">
        <img
          src={LOGO_SRC}
          alt=""
          draggable={false}
          decoding="async"
          className="max-w-none object-contain select-none"
          style={{
            width: `${LOGO_SIZE}%`,
            height: `${LOGO_SIZE}%`,
            transform:
              LOGO_NUDGE_X || LOGO_NUDGE_Y
                ? `translate(${LOGO_NUDGE_X}%, ${LOGO_NUDGE_Y}%)`
                : undefined,
          }}
        />
      </div>

      <svg
        viewBox="0 0 40 40"
        className="pointer-events-none absolute"
        style={{
          left: `${MOUTH_LEFT}%`,
          top: `${mouthTop}%`,
          width: `${MOUTH_W}%`,
          height: `${mouthH}%`,
        }}
        fill="none"
      >
        <path
          ref={pathRef}
          d={mouthPath(REST)}
          fill={MOUTH_COLOR}
          stroke={MOUTH_COLOR}
          strokeWidth={0.35}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
});
