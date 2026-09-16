/**
 * Voice FAB visual style.
 * Set in `.env.local`:
 *   NEXT_PUBLIC_VOICE_FAB_STYLE=1   // current: Coda mark + bar visualizer
 *   NEXT_PUBLIC_VOICE_FAB_STYLE=2   // face with talking mouth
 */
export type VoiceFabStyle = 1 | 2;

export function getVoiceFabStyle(): VoiceFabStyle {
  const raw = process.env.NEXT_PUBLIC_VOICE_FAB_STYLE?.trim();
  if (raw === "2") return 2;
  return 1;
}
