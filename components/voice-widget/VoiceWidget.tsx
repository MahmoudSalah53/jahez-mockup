"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import {
  Room,
  RoomEvent,
  Track,
  type RemoteAudioTrack,
} from "livekit-client";
import {
  VoiceMorphFab,
  type VoicePhase,
} from "@/components/voice-widget/VoiceMorphFab";
import { useCart } from "@/lib/cart-context";
import { usePrefs } from "@/lib/prefs-context";
import {
  registerLuqmaRpcs,
  unregisterLuqmaRpcs,
} from "@/lib/voice-rpc";

export function VoiceWidget() {
  const router = useRouter();
  const { items, addItem } = useCart();
  const [phase, setPhase] = useState<VoicePhase>("closed");
  const [micOn, setMicOn] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [agentTrack, setAgentTrack] = useState<RemoteAudioTrack | null>(null);
  const { ready, done, skipped, answers } = usePrefs();

  const roomRef = useRef<Room | null>(null);
  const audioElsRef = useRef<HTMLMediaElement[]>([]);
  const routerRef = useRef(router);
  routerRef.current = router;
  // refs so RPC handlers never see a stale cart snapshot
  const itemsRef = useRef(items);
  itemsRef.current = items;
  const addItemRef = useRef(addItem);
  addItemRef.current = addItem;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    return () => {
      void disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function clearAudioElements() {
    for (const el of audioElsRef.current) {
      el.remove();
    }
    audioElsRef.current = [];
  }

  async function disconnect() {
    clearAudioElements();
    setAgentTrack(null);
    const room = roomRef.current;
    roomRef.current = null;
    if (room) {
      unregisterLuqmaRpcs(room);
      await room.disconnect();
    }
  }

  async function close() {
    await disconnect();
    setPhase("closed");
    setMicOn(true);
  }

  function buildParticipantMetadata() {
    const caresAboutCalories = answers.calories === "care";
    const caloriesPreference =
      answers.calories === "care"
        ? "care"
        : answers.calories === "dont_care"
          ? "dont_care"
          : "unknown";

    return {
      voice: "female",
      prefs: {
        done,
        skipped,
        schemaVersion: 8,
        calories: {
          preference: caloriesPreference,
          cares_about_calories: caresAboutCalories,
          label_ar:
            caloriesPreference === "care"
              ? "يهتم بالسعرات الغذائية"
              : caloriesPreference === "dont_care"
                ? "لا يهتم بالسعرات الغذائية"
                : "لم يحدد تفضيل السعرات",
          label_en:
            caloriesPreference === "care"
              ? "User cares about calorie counts"
              : caloriesPreference === "dont_care"
                ? "User does not care about calories"
                : "Calorie preference not set",
        },
      },
    };
  }

  async function open() {
    if (phase !== "closed") return;
    if (!ready) return;

    setPhase("connecting");
    setMicOn(true);

    try {
      const res = await fetch("/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          participant_metadata: buildParticipantMetadata(),
        }),
      });

      if (!res.ok) {
        throw new Error(`Token failed: ${res.status}`);
      }

      const data = (await res.json()) as {
        server_url: string;
        participant_token: string;
        room_name?: string;
        participant_identity?: string;
      };

      console.log(
        "%c[luqma-voice:FRONTEND] connecting",
        "color:#00838f;font-weight:bold",
        {
          room: data.room_name,
          identity: data.participant_identity,
          hint: "لو الـ AI قال أضفت للسلة، لازم يظهر [luqma-rpc:FRONTEND] RECV luqma.addToCart — لو مظهرش فالمشكلة من الـ agent مش الفرونت",
        },
      );

      const room = new Room();
      roomRef.current = room;

      // Register RPCs before connect so the agent can call them immediately
      registerLuqmaRpcs(room, {
        push: (path) => {
          routerRef.current.push(path);
        },
        getItems: () => itemsRef.current,
        addItem: (input) => {
          addItemRef.current(input);
        },
      });

      room.on(RoomEvent.TrackSubscribed, (track) => {
        if (track.kind !== Track.Kind.Audio) return;

        const remote = track as RemoteAudioTrack;
        setAgentTrack(remote);

        const el = remote.attach();
        el.autoplay = true;
        document.body.appendChild(el);
        audioElsRef.current.push(el);
      });

      room.on(RoomEvent.TrackUnsubscribed, (track) => {
        if (track.kind === Track.Kind.Audio) {
          setAgentTrack((current) => (current === track ? null : current));
        }
        track.detach().forEach((el) => {
          el.remove();
          audioElsRef.current = audioElsRef.current.filter((x) => x !== el);
        });
      });

      room.on(RoomEvent.Disconnected, () => {
        clearAudioElements();
        setAgentTrack(null);
        if (roomRef.current === room) {
          unregisterLuqmaRpcs(room);
          roomRef.current = null;
        }
        setPhase("closed");
      });

      await room.connect(data.server_url, data.participant_token);
      await room.localParticipant.setMicrophoneEnabled(true);

      setPhase("listening");
    } catch (err) {
      console.error("LiveKit connect error:", err);
      await disconnect();
      setPhase("closed");
    }
  }

  async function onMicToggle() {
    const next = !micOn;
    setMicOn(next);
    const room = roomRef.current;
    if (!room) return;
    await room.localParticipant.setMicrophoneEnabled(next);
  }

  if (!mounted) return null;

  return createPortal(
    <VoiceMorphFab
      phase={phase}
      micOn={micOn}
      agentTrack={agentTrack}
      onOpen={() => {
        void open();
      }}
      onClose={() => {
        void close();
      }}
      onMicToggle={() => {
        void onMicToggle();
      }}
    />,
    document.body,
  );
}
