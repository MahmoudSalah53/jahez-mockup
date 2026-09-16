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

function peakHz(
  freq: Uint8Array,
  binHz: number,
  loHz: number,
  hiHz: number,
): number {
  const loBin = Math.max(1, Math.floor(loHz / binHz));
  const hiBin = Math.min(freq.length - 1, Math.floor(hiHz / binHz));
  let bestBin = -1;
  let bestVal = 0;
  for (let i = loBin; i <= hiBin; i++) {
    let sum = 0;
    for (let k = -2; k <= 2; k++) {
      const j = i + k;
      sum += j >= loBin && j <= hiBin ? freq[j] : 0;
    }
    const avg = sum / 5;
    if (avg > bestVal) {
      bestVal = avg;
      bestBin = i;
    }
  }
  if (bestVal < 18) return 0;
  return bestBin * binHz;
}

/**
 * Live mouth visemes from the agent track using F1/F2 formants.
 *
 * Heuristic (same idea as Google xrblocks lipsync):
 *   آ / aa  = high F1
 *   ي / ee  = low F1 + high F2
 *   و / oo  = low F1 + low F2
 *   jaw     = RMS
 *   consonant = high-band / sibilance
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
      smoothingTimeConstant: 0.65,
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
      const voiced = rms > 0.018 && lowMid > high * 1.15 && lowMid > 0.8;
      const voicingGate = voiced ? 1 : smoothstep(0.016, 0.045, rms);

      const jawTarget = clamp01(voicingGate * Math.min(1, rms * 7.5));
      const fricRatio = high / (low + mid + high + 0.001);
      const brightness = clamp01((centroid - 1500) / 2500);
      const consonantTarget = clamp01(
        voicingGate * (0.55 * brightness + 0.7 * fricRatio),
      );

      const f1Hz = peakHz(freq, binHz, 200, 1000);
      const f2Hz = peakHz(freq, binHz, 800, 3000);

      if (voicingGate > 0.5 && f1Hz > 0 && f2Hz > 0) {
        silentFor = 0;
        const a = 1 - Math.exp(-dt / 0.1);
        smoothF1 = smoothF1 ? lerp(smoothF1, f1Hz, a) : f1Hz;
        smoothF2 = smoothF2 ? lerp(smoothF2, f2Hz, a) : f2Hz;
      } else {
        silentFor += dt;
        if (silentFor > 0.25) {
          smoothF1 = 0;
          smoothF2 = 0;
        }
      }

      const vowelMass = clamp01(voicingGate * (1 - consonantTarget));
      let aa = 0;
      let ee = 0;
      let oo = 0;
      if (vowelMass > 0.1 && smoothF1 > 0 && smoothF2 > 0) {
        aa = smoothstep(550, 850, smoothF1);
        const f1Low = 1 - smoothstep(350, 600, smoothF1);
        ee = f1Low * smoothstep(1700, 2400, smoothF2);
        oo = f1Low * (1 - smoothstep(1100, 1700, smoothF2));
        const sum = aa + ee + oo + 0.001;
        aa = (aa / sum) * vowelMass;
        ee = (ee / sum) * vowelMass;
        oo = (oo / sum) * vowelMass;
      }

      const vA = 1 - Math.exp(-dt / 0.09);
      const cA = 1 - Math.exp(-dt / 0.06);
      const prev = visemesRef.current;
      const next: FormantVisemes = {
        jawOpen: lerp(prev.jawOpen, jawTarget, vA),
        aa: lerp(prev.aa, aa, vA),
        ee: lerp(prev.ee, ee, vA),
        oo: lerp(prev.oo, oo, vA),
        consonant: lerp(prev.consonant, consonantTarget, cA),
      };
      visemesRef.current = next;

      if (now - lastPublish > 32) {
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
