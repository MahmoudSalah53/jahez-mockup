"use client";

import { useEffect, useState } from "react";
import {
  createAudioAnalyser,
  type LocalAudioTrack,
  type RemoteAudioTrack,
} from "livekit-client";

type Options = {
  bands?: number;
  loPass?: number;
  hiPass?: number;
  updateInterval?: number;
};

function normalizeFrequencies(frequencies: Float32Array) {
  const normalizeDb = (value: number) => {
    const minDb = -100;
    const maxDb = -10;
    let db = 1 - (Math.max(minDb, Math.min(maxDb, value)) * -1) / 100;
    db = Math.sqrt(db);
    return db;
  };

  return frequencies.map((value) => {
    if (value === -Infinity) return 0;
    return normalizeDb(value);
  });
}

/**
 * Levels 0–1 per frequency band from a LiveKit audio track (agent voice).
 */
export function useMultibandTrackVolume(
  track: LocalAudioTrack | RemoteAudioTrack | null | undefined,
  options: Options = {},
) {
  const bands = options.bands ?? 5;
  const loPass = options.loPass ?? 100;
  const hiPass = options.hiPass ?? 600;
  const updateInterval = options.updateInterval ?? 32;

  const [levels, setLevels] = useState<number[]>(() =>
    Array.from({ length: bands }, () => 0),
  );

  useEffect(() => {
    if (!track?.mediaStream) {
      setLevels(Array.from({ length: bands }, () => 0));
      return;
    }

    const { analyser, cleanup } = createAudioAnalyser(track, {
      fftSize: 2048,
      smoothingTimeConstant: 0.7,
    });

    const dataArray = new Float32Array(analyser.frequencyBinCount);

    const update = () => {
      analyser.getFloatFrequencyData(dataArray);
      const sliced = dataArray.slice(loPass, hiPass);
      const normalized = normalizeFrequencies(sliced);
      const totalBins = normalized.length;
      const chunks: number[] = [];

      for (let i = 0; i < bands; i++) {
        const start = Math.floor((i * totalBins) / bands);
        const end = Math.floor(((i + 1) * totalBins) / bands);
        const chunk = normalized.slice(start, end);
        if (chunk.length === 0) {
          chunks.push(0);
        } else {
          chunks.push(chunk.reduce((a, b) => a + b, 0) / chunk.length);
        }
      }

      setLevels(chunks);
    };

    const id = window.setInterval(update, updateInterval);

    return () => {
      window.clearInterval(id);
      void cleanup();
    };
  }, [track, track?.mediaStream, bands, loPass, hiPass, updateInterval]);

  return levels;
}
