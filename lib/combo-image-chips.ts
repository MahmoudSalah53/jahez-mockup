/** Collapse duplicate combo lines into short image chips, e.g. ×2 + مشروب. */
export function comboImageChips(includes: string[]): string[] {
  if (!includes.length) return [];

  const counts = new Map<string, number>();
  for (const raw of includes) {
    const label = raw.trim();
    if (!label) continue;
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }

  const chips: string[] = [];
  for (const [label, count] of counts) {
    if (count > 1) chips.push(`×${count}`);
    else chips.push(label);
  }
  return chips;
}
