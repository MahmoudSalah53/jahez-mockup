"use client";

import { useEffect, useRef, useState } from "react";
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

const REST: MouthShape = { open: 0, width: 0.55, round: 0.1 };
/** Cyan matching Udeat logo */
const MOUTH_COLOR = "#00E5D4";

/* ── Tunables (عدّل من هنا) ─────────────────────────────
   Logo:  +X يمين / −X شمال | +Y تحت / −Y فوق
   Mouth: LEFT/TOP/W/H | STROKE سُمك | SCALE حجم
   CURVE: انحناء الراحة + شكل/حجم الفتحة وقت الكلام (نفس القيمة)
*/
const LOGO_NUDGE_X = 0;
const LOGO_NUDGE_Y = 5;

const MOUTH_LEFT = 30; // %
const MOUTH_TOP = 56; // %
const MOUTH_W = 40; // %
const MOUTH_H = 22; // %
/** سُمك خط الفم وهو مقفول (ابتسامة) — زوّد للـ bold */
const MOUTH_STROKE = 10;
/** حجم منحنى الفم جوّه الـ SVG — 1 عادي، أكبر = فم أعرض/أضخم */
const MOUTH_SCALE = 1.7;
/**
 * انحناء الابتسامة — يطبّق على الراحة والحركة مع بعض
 * 0.4 ≈ مستقيم | 1 عادي | 1.6–2 زي اللوجو | أعلى = U أعمق + فتحة أكبر وقت الكلام
 */
const MOUTH_CURVE = 4;

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

/** One topology for rest + talk: thin U ribbon → opens along the same curve */
function mouthPath({ open, width, round }: MouthShape): string {
  const s = MOUTH_SCALE;
  const curve = Math.max(0.25, MOUTH_CURVE);
  const curveAmt = Math.pow(curve, 0.72);
  const o = clamp01(open);

  const cx = 20;
  const cy = 16.5;
  const halfW =
    lerp(5.2, 11.0, width) * s * lerp(1, 0.9, clamp01((curveAmt - 1) / 3));
  const rx = halfW * (1 - round * 0.4);
  const left = cx - rx;
  const right = cx + rx;

  const dip = lerp(1.35, 2.35, width) * s * curveAmt;

  // Rest thickness matches MOUTH_STROKE look; jaw grows from that ribbon
  const restHalf = MOUTH_STROKE * 0.42;
  const jawUp = o * s * lerp(2.6, 4.8, clamp01((curveAmt - 0.5) / 3));
  const jawDown = o * s * lerp(3.0, 5.8, clamp01((curveAmt - 0.5) / 3));

  const topOff = restHalf * 0.45 + jawUp;
  const botOff = restHalf * 0.55 + jawDown + dip * 0.06 * o;
  const endY = cy + dip * 0.08 * o;

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

  // oo only rounds when it actually wins — no default و look
  const ooDom = clamp01(v.oo - Math.max(v.aa, v.ee) * 0.55);

  const open = clamp01(
    v.jawOpen * 0.52 +
      v.aa * 0.72 +
      v.ee * 0.3 +
      v.oo * 0.2 +
      v.consonant * 0.12,
  );
  const width = clamp01(
    0.48 + v.aa * 0.36 + v.ee * 0.45 - ooDom * 0.38 + v.consonant * 0.1,
  );
  const round = clamp01(ooDom * 0.7 - v.ee * 0.2 - v.aa * 0.06);

  return { open, width, round };
}

/**
 * Udeat logo face — transparent mark (no baked-in smile) with an
 * animated cyan mouth in the open U, driven by live visemes.
 */
export function TalkingFace({
  visemes,
  className,
  faceClassName,
}: Props) {
  const [shape, setShape] = useState<MouthShape>(REST);
  const shapeRef = useRef(REST);
  const targetRef = useRef(REST);
  targetRef.current = visemes ? shapeFromVisemes(visemes) : REST;

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(48, now - last);
      last = now;
      const cur = shapeRef.current;
      const tgt = targetRef.current;
      const opening = tgt.open > cur.open;
      // Close slower so return-to-smile feels continuous, not a snap
      const k = 1 - Math.exp(-dt / (opening ? 40 : 125));
      const next: MouthShape = {
        open: lerp(cur.open, tgt.open, k),
        width: lerp(cur.width, tgt.width, k),
        round: lerp(cur.round, tgt.round, k),
      };
      // Snap tiny residual shut so rest settles cleanly
      if (tgt.open < 0.02 && next.open < 0.012) {
        next.open = 0;
        next.width = lerp(next.width, REST.width, 0.2);
        next.round = lerp(next.round, REST.round, 0.2);
      }
      shapeRef.current = next;
      setShape(next);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const path = mouthPath(shape);
  // Deeper curve needs a taller overlay so the U + jaw don’t clip
  const curveFit = Math.max(
    1,
    Math.min(2.6, 0.65 + Math.pow(MOUTH_CURVE, 0.72) * 0.35),
  );
  const mouthH = MOUTH_H * curveFit;
  const mouthTop = MOUTH_TOP - (mouthH - MOUTH_H) * 0.4;

  return (
    <div
      className={cn(
        "relative grid size-full place-items-center overflow-hidden rounded-full",
        faceClassName ?? "bg-white",
        className,
      )}
      aria-hidden
    >
      {/*
        Tunables فوق: LOGO_* | MOUTH_LEFT/TOP/W/H | STROKE | SCALE | CURVE
        الفم شكل واحد دايمًا (شريط U) بيتضخّم وقت الكلام ويرجع لنفس الحجم
      */}
      <img
        src="/test-removebg-preview.png"
        alt=""
        draggable={false}
        className="pointer-events-none absolute left-1/2 top-1/2 max-w-none object-contain"
        style={{
          width: "94%",
          height: "94%",
          transform: `translate(calc(-50% + ${LOGO_NUDGE_X}%), calc(-50% + ${LOGO_NUDGE_Y}%))`,
        }}
      />

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
          d={path}
          fill={MOUTH_COLOR}
          stroke={MOUTH_COLOR}
          strokeWidth={0.35}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
