import { comboImageChips } from "@/lib/combo-image-chips";
import { cn } from "@/lib/cn";

type Props = {
  includes: string[];
  size?: "sm" | "md";
  /** Default: bottom of image. Use `top` when price already sits at the bottom. */
  placement?: "bottom" | "top";
  className?: string;
};

/** Floating chips on a meal image for combo deals (e.g. ×2 · مشروب). */
export function ComboImageOverlay({
  includes,
  size = "md",
  placement = "bottom",
  className,
}: Props) {
  const chips = comboImageChips(includes);
  if (!chips.length) return null;

  return (
    <div
      className={cn(
        "pointer-events-none absolute z-[1] flex flex-wrap gap-1.5",
        placement === "bottom"
          ? "inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent"
          : "start-0 end-0 top-0 justify-end bg-gradient-to-b from-black/35 to-transparent",
        size === "sm"
          ? placement === "bottom"
            ? "p-1.5 pt-6"
            : "p-1.5 pb-4"
          : placement === "bottom"
            ? "p-3 pt-12"
            : "p-3 pb-8",
        className,
      )}
    >
      {chips.map((chip) => (
        <span
          key={chip}
          className={cn(
            "rounded-full bg-white/95 font-bold text-foreground shadow-sm ring-1 ring-black/5",
            size === "sm"
              ? "px-1.5 py-0.5 text-[9px]"
              : "px-2.5 py-1 text-xs",
          )}
        >
          {chip}
        </span>
      ))}
    </div>
  );
}
