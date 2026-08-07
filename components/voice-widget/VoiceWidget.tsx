"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { VoiceActionBar } from "@/components/voice-widget/VoiceActionBar";
import {
  VoiceTrigger,
  type VoicePhase,
} from "@/components/voice-widget/VoiceTrigger";

const CONNECT_MS = 1500;

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

  function onToggle() {
    if (phase === "closed") {
      setPhase("connecting");
      setMicOn(true);
      clearTimer();
      timerRef.current = setTimeout(() => {
        setPhase("listening");
        timerRef.current = null;
      }, CONNECT_MS);
      return;
    }
    close();
  }

  const open = phase !== "closed";

  if (!mounted) return null;

  return createPortal(
    <>
      <VoiceTrigger phase={phase} onToggle={onToggle} />

      <AnimatePresence>
        {open && (
          <motion.div
            key="voice-panel"
            initial={{ opacity: 0, scale: 0.92, x: 8 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.92, x: 8 }}
            transition={{ type: "spring", duration: 0.45, bounce: 0.25 }}
            style={{
              position: "fixed",
              right: 68,
              bottom: 16,
              zIndex: 99999,
            }}
            className="flex w-fit flex-col"
          >
            <div className="mr-1 w-fit rounded-[24px] border border-separator1 bg-white drop-shadow-md">
              <VoiceActionBar
                className="!m-0 border-0 shadow-none drop-shadow-none"
                micOn={micOn}
                onMicToggle={() => setMicOn((v) => !v)}
                active={phase === "listening"}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>,
    document.body,
  );
}
