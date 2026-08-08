"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  VoiceMorphFab,
  type VoicePhase,
} from "@/components/voice-widget/VoiceMorphFab";

const CONNECT_MS = 900;

export function VoiceWidget() {
  const [phase, setPhase] = useState<VoicePhase>("closed");
  const [micOn, setMicOn] = useState(true);
  const [mounted, setMounted] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  function clearTimer() {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }

  function close() {
    clearTimer();
    setPhase("closed");
    setMicOn(true);
  }

  function open() {
    setPhase("connecting");
    setMicOn(true);
    clearTimer();
    timerRef.current = setTimeout(() => {
      setPhase("listening");
      timerRef.current = null;
    }, CONNECT_MS);
  }

  if (!mounted) return null;

  return createPortal(
    <VoiceMorphFab
      phase={phase}
      micOn={micOn}
      onOpen={open}
      onClose={close}
      onMicToggle={() => setMicOn((v) => !v)}
    />,
    document.body,
  );
}
