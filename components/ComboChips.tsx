import { comboImageChips } from "@/lib/combo-image-chips";
import { cn } from "@/lib/cn";

type Props = {
  includes: string[];
  size?: "sm" | "md";
  className?: string;
};

/** Inline combo tags next to meal copy — not over the photo. */
export function ComboChips({ includes, size = "sm", className }: Props) {
  const chips = comboImageChips(includes);
  if (!chips.length) return null;

  return (
    <div className={cn("flex flex-wrap gap-1", className)}>
      {chips.map((chip) => (
        <span
          key={chip}
          className={cn(
            "rounded-md bg-background font-semibold text-muted ring-1 ring-border",
            size === "sm"
              ? "px-1.5 py-0.5 text-[10px]"
              : "px-2 py-0.5 text-xs",
          )}
        >
          {chip}
        </span>
      ))}
    </div>
  );
}
