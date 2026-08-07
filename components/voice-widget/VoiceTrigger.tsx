"use client";

import { AnimatePresence, motion } from "motion/react";
import {
  Microphone,
  PhoneDisconnectIcon,
  XIcon,
} from "@phosphor-icons/react";
import { cn } from "@/lib/cn";

export type VoicePhase = "closed" | "connecting" | "listening";

type Props = {
  phase: VoicePhase;
  onToggle: () => void;
};

export function VoiceTrigger({ phase, onToggle }: Props) {
  const popupOpen = phase !== "closed";
  const isAgentConnecting = phase === "connecting";
  const isAgentConnected = phase === "listening";

  return (
    <AnimatePresence>
      <motion.button
        key="trigger-button"
        type="button"
        aria-label={
          phase === "closed"
            ? "فتح المساعد الصوتي"
            : phase === "connecting"
              ? "إلغاء الاتصال"
              : "إنهاء المكالمة"
        }
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        transition={{
          type: "spring",
          duration: 1,
          bounce: 0.2,
        }}
        onClick={onToggle}
        style={{
          position: "fixed",
          right: 16,
          bottom: 16,
          zIndex: 99999,
        }}
        className={cn(
          "m-0 block size-12 cursor-pointer border-0 p-0.5 drop-shadow-md",
          "transition-[scale] duration-300 hover:scale-105 focus:scale-105 focus:outline-none",
        )}
      >
        <motion.div
          className={cn(
            "absolute inset-0 z-10 rounded-full transition-colors",
            !popupOpen && "bg-fgAccent",
            isAgentConnecting &&
              "bg-fgAccent/30 animate-spin [background-image:conic-gradient(from_0deg,transparent_0%,transparent_30%,var(--color-fgAccent)_50%,transparent_70%,transparent_100%)]",
            isAgentConnected && "bg-destructive-foreground",
          )}
        />
        <div
          className={cn(
            "relative z-20 grid size-11 place-items-center rounded-full transition-colors",
            !popupOpen && "bg-fgAccent",
            isAgentConnecting && "bg-bg1",
            isAgentConnected && "bg-destructive",
          )}
        >
          <AnimatePresence>
            {!popupOpen && (
              <motion.div
                key="microphone-icon"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: popupOpen ? 20 : -20 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              >
                <Microphone
                  size={20}
                  weight="bold"
                  className="size-5"
                  style={{ color: "var(--trigger-mic-color, var(--bg1))" }}
                />
              </motion.div>
            )}
            {isAgentConnecting && (
              <motion.div
                key="dismiss"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: popupOpen ? -20 : 20 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              >
                <XIcon size={20} weight="bold" className="size-5 text-fg0" />
              </motion.div>
            )}
            {isAgentConnected && (
              <motion.div
                key="disconnect"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: popupOpen ? -20 : 20 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              >
                <PhoneDisconnectIcon
                  size={20}
                  weight="bold"
                  className="size-5 text-destructive-foreground"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.button>
    </AnimatePresence>
  );
}
