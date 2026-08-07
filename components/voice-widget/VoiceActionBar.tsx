"use client";

import {
  Microphone,
  MicrophoneSlash,
} from "@phosphor-icons/react";
import { FakeBarVisualizer } from "@/components/voice-widget/FakeBarVisualizer";
import { cn } from "@/lib/cn";

type Props = {
  micOn: boolean;
  onMicToggle: () => void;
  active?: boolean;
  className?: string;
};

export function VoiceActionBar({
  micOn,
  onMicToggle,
  active = true,
  className,
}: Props) {
  return (
    <div
      aria-label="عناصر التحكم بالمساعد الصوتي"
      className={cn(
        "relative z-20 flex flex-col rounded-[24px] border border-separator1 bg-white p-1 drop-shadow-md",
        className,
      )}
    >
      <div className="flex flex-row items-center">
        <button
          type="button"
          aria-label={micOn ? "كتم الميكروفون" : "تشغيل الميكروفون"}
          aria-pressed={micOn}
          onClick={onMicToggle}
          className={cn(
            "group/track relative flex h-10 w-auto cursor-pointer items-center gap-2 rounded-[20px] border-0 px-3 transition-colors",
            micOn
              ? "bg-bg2 text-fg1 hover:bg-bg2/80"
              : "bg-destructive text-destructive-foreground",
          )}
        >
          {micOn ? (
            <Microphone size={18} weight="bold" className="size-[18px]" />
          ) : (
            <MicrophoneSlash size={18} weight="bold" className="size-[18px]" />
          )}
          <FakeBarVisualizer active={active && micOn} muted={!micOn} />
        </button>
      </div>
    </div>
  );
}
