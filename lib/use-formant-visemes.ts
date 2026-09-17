"use client";

import { useEffect, useRef, useState } from "react";
import {
  createAudioAnalyser,
  type LocalAudioTrack,
  type RemoteAudioTrack,
} from "livekit-client";

export type FormantVisemes = {
  jawOpen: number;
  aa: number;
  ee: number;
  oo: number;
  consonant: number;
};

const REST: FormantVisemes = {
  jawOpen: 0,
  aa: 0,
  ee: 0,
  oo: 0,
  consonant: 0,
};

/** Brief gaps (plosive / syllable) hold last shape; then ease shut */
const SILENCE_HOLD_MS = 35;
const SILENCE_EXIT_MUL = 1.25;
const RMS_SILENCE = 0.016;

function clamp01(x: number) {
  return Math.min(1, Math.max(0, x));
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

/**
 * Peak in a Hz band via 5-bin envelope (xrblocks-style) so F0 harmonics
 * don't steal the formant.
 */
function peakHz(
  freq: Uint8Array,
  binHz: number,
  loHz: number,
  hiHz: number,
  minAvg = 20,
): number {
  const loBin = Math.max(1, Math.floor(loHz / binHz));
  const hiBin = Math.min(freq.length - 1, Math.floor(hiHz / binHz));
  let bestBin = -1;
  let bestVal = 0;
  for (let i = loBin; i <= hiBin; i++) {
    let sum = 0;
    for (let k = -2; k <= 2; k++) {
      const j = i + k;
      if (j >= loBin && j <= hiBin) sum += freq[j];
    }
    const avg = sum / 5;
    if (avg > bestVal) {
      bestVal = avg;
      bestBin = i;
    }
  }
  if (bestVal < minAvg) return 0;
  return bestBin * binHz;
}

/**
 * Live mouth visemes from the agent track using F1/F2 formants.
 *
 * Heuristic (Google xrblocks lipsync + Arabic /u/ formant ranges):
 *   آ / aa  = high F1
 *   ي / ee  = low F1 + high F2 (+ large F2−F1)
 *   و / oo  = low F1 + low F2 (+ small F2−F1) — strict, not default
 *   jaw     = RMS
 *   consonant = high-band / sibilance
 *
 * Not phoneme-accurate — good “talking” motion from spectrum only.
 */
export function useFormantVisemes(
  track: LocalAudioTrack | RemoteAudioTrack | null | undefined,
): FormantVisemes {
  const [visemes, setVisemes] = useState<FormantVisemes>(REST);
  const visemesRef = useRef(REST);

  useEffect(() => {
    if (!track?.mediaStream) {
      visemesRef.current = REST;
      setVisemes(REST);
      return;
    }

    const { analyser, cleanup } = createAudioAnalyser(track, {
      fftSize: 2048,
      smoothingTimeConstant: 0.7,
      minDecibels: -90,
      maxDecibels: -30,
    });

    const freq = new Uint8Array(analyser.frequencyBinCount);
    const time = new Uint8Array(analyser.fftSize);
    const sampleRate = analyser.context.sampleRate;
    const binHz = sampleRate / 2 / freq.length;

    let smoothF1 = 0;
    let smoothF2 = 0;
    let silentFor = 0;
    let silenceSinceMs: number | null = null;
    let lastHeld: FormantVisemes | null = null;
    let last = performance.now();
    let raf = 0;
    let lastPublish = 0;

    const tick = (now: number) => {
      const dt = Math.max(0.001, Math.min(0.08, (now - last) / 1000));
      last = now;

      analyser.getByteFrequencyData(freq);
      analyser.getByteTimeDomainData(time);

      let sumSq = 0;
      for (let i = 0; i < time.length; i++) {
        const v = time[i] / 128 - 1;
        sumSq += v * v;
      }
      const rms = Math.sqrt(sumSq / time.length);

      let total = 0;
      let weighted = 0;
      let low = 0;
      let mid = 0;
      let high = 0;
      for (let i = 0; i < freq.length; i++) {
        const e = freq[i] / 255;
        const hz = i * binHz;
        total += e;
        weighted += hz * e;
        if (hz < 500) low += e;
        else if (hz < 2000) mid += e;
        else if (hz < 8000) high += e;
      }
      const centroid = total > 0 ? weighted / total : 0;
      const lowMid = low + mid;
      const voiced = rms > 0.02 && lowMid > high * 1.2 && lowMid > 1;
      const voicingGate = voiced ? 1 : smoothstep(0.02, 0.05, rms);

      // Schmitt silence: avoid chatter at the threshold
      const inSilence = silenceSinceMs !== null;
      const exitThr = RMS_SILENCE * SILENCE_EXIT_MUL;
      const isSilent = inSilence ? rms < exitThr : rms < RMS_SILENCE;
      if (isSilent) {
        if (silenceSinceMs === null) {
          silenceSinceMs = now;
          lastHeld = visemesRef.current;
        }
        // Hold last shape briefly so the mouth doesn't slam shut mid-word
        if (now - silenceSinceMs < SILENCE_HOLD_MS && lastHeld) {
          const holdA = 1 - Math.exp(-dt / 0.03);
          const held: FormantVisemes = {
            jawOpen: lerp(visemesRef.current.jawOpen, lastHeld.jawOpen * 0.85, holdA),
            aa: lerp(visemesRef.current.aa, lastHeld.aa * 0.75, holdA),
            ee: lerp(visemesRef.current.ee, lastHeld.ee * 0.75, holdA),
            oo: lerp(visemesRef.current.oo, lastHeld.oo * 0.75, holdA),
            consonant: lerp(visemesRef.current.consonant, 0, holdA),
          };
          visemesRef.current = held;
          if (now - lastPublish > 16) {
            lastPublish = now;
            setVisemes(held);
          }
          raf = requestAnimationFrame(tick);
          return;
        }
      } else {
        silenceSinceMs = null;
        lastHeld = null;
      }

      const jawTarget = clamp01(voicingGate * Math.min(1, rms * 6.5));
      const fricRatio = high / (low + mid + high + 0.001);
      const brightness = clamp01((centroid - 1500) / 2500);
      const consonantTarget = clamp01(
        voicingGate * (0.55 * brightness + 0.7 * fricRatio),
      );

      // F2 searched above F1 so back vowels don't double-count F1 as F2
      const f1Hz = peakHz(freq, binHz, 200, 950);
      const f2Lo = f1Hz > 0 ? Math.max(700, f1Hz + 200) : 800;
      const f2Hz = peakHz(freq, binHz, f2Lo, 3200);

      if (voicingGate > 0.5 && f1Hz > 0 && f2Hz > 0) {
        silentFor = 0;
        const a = 1 - Math.exp(-dt / 0.032);
        smoothF1 = smoothF1 ? lerp(smoothF1, f1Hz, a) : f1Hz;
        smoothF2 = smoothF2 ? lerp(smoothF2, f2Hz, a) : f2Hz;
      } else {
        silentFor += dt;
        if (silentFor > 0.25) {
          smoothF1 = 0;
          smoothF2 = 0;
        }
      }

      const vowelMass = clamp01(voicingGate * (1 - consonantTarget * 0.85));
      let aa = 0;
      let ee = 0;
      let oo = 0;
      if (vowelMass > 0.1 && smoothF1 > 0 && smoothF2 > 0) {
        const sF1 = smoothF1;
        const sF2 = smoothF2;
        const sep = sF2 - sF1; // ee: large; oo/u: small

        // aa / ā: open jaw → high F1
        aa = smoothstep(520, 820, sF1);

        const f1Low = 1 - smoothstep(320, 580, sF1);

        // ee / ī: low F1, high F2, wide F2−F1
        ee =
          f1Low *
          smoothstep(1750, 2450, sF2) *
          smoothstep(900, 1600, sep);

        // oo / ū / و: low F1 + low F2 + tight F2−F1
        // Arabic long /u:/ ≈ F2 840–1000; short /u/ higher but still back.
        // Stricter than xrblocks' 1100–1700 band to avoid و on every mid vowel.
        const f2Low = 1 - smoothstep(900, 1350, sF2);
        const sepTight = 1 - smoothstep(450, 1100, sep);
        oo = f1Low * f2Low * sepTight;
        // Soft gate: only real back-round energy, not leftover
        oo *= oo;

        // Mild sharpening so one vowel wins instead of muddy mix
        aa = aa * aa;
        ee = ee * ee;

        const sum = aa + ee + oo + 0.001;
        aa = (aa / sum) * vowelMass;
        ee = (ee / sum) * vowelMass;
        oo = (oo / sum) * vowelMass;
      }

      const vA = 1 - Math.exp(-dt / 0.032);
      const cA = 1 - Math.exp(-dt / 0.028);
      const prev = visemesRef.current;
      const next: FormantVisemes = {
        jawOpen: lerp(prev.jawOpen, jawTarget, vA),
        aa: lerp(prev.aa, aa, vA),
        ee: lerp(prev.ee, ee, vA),
        oo: lerp(prev.oo, oo, vA),
        consonant: lerp(prev.consonant, consonantTarget, cA),
      };
      visemesRef.current = next;

      if (now - lastPublish > 16) {
        lastPublish = now;
        setVisemes(next);
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      visemesRef.current = REST;
      setVisemes(REST);
      void cleanup();
    };
  }, [track, track?.mediaStream]);

  return visemes;
}
