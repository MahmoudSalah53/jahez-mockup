/**
 * Strip the voice agent's diacritics before text reaches a form field.
 *
 * The agent diacritizes everything it says so the TTS gets the vowels right,
 * and that spelling leaked into the checkout inputs ("مُحَمَّد" instead of
 * "محمد"). The backend already normalizes, but these fields end up rendered to
 * the user, so the frontend sanitizes independently.
 */
const HARAKAT = /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g;
const ARABIC_INDIC = /[\u0660-\u0669\u06F0-\u06F9]/g;

function toAsciiDigit(char: string): string {
  const code = char.charCodeAt(0);
  const base = code >= 0x06f0 ? 0x06f0 : 0x0660;
  return String(code - base);
}

export function plainArabic(raw: string): string {
  return raw
    .normalize("NFC")
    .replace(HARAKAT, "")
    .replace(ARABIC_INDIC, toAsciiDigit)
    .replace(/\s+/g, " ")
    .trim();
}
