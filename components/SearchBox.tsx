"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FormEvent,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { getSearchSuggestions } from "@/data/meals";

type Props = {
  initialQuery?: string;
  inputId?: string;
  variant?: "hero" | "page";
};

type DropdownPos = {
  top: number;
  left: number;
  width: number;
};

export function SearchBox({
  initialQuery = "",
  inputId,
  variant = "page",
}: Props) {
  const router = useRouter();
  const generatedId = useId();
  const id = inputId ?? generatedId;
  const rootRef = useRef<HTMLDivElement>(null);
  const inputWrapRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState(initialQuery);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [pos, setPos] = useState<DropdownPos | null>(null);
  const [inputName] = useState(
    () => `luqma-q-${Math.random().toString(36).slice(2)}`,
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const suggestions = useMemo(
    () => getSearchSuggestions(query, 3),
    [query],
  );

  const showDropdown =
    open && query.trim().length > 0 && suggestions.length > 0;

  function updatePosition() {
    const el = inputWrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setPos({
      top: rect.bottom + 6,
      left: rect.left,
      width: rect.width,
    });
  }

  useLayoutEffect(() => {
    if (!showDropdown) {
      setPos(null);
      return;
    }
    updatePosition();
  }, [showDropdown, query]);

  useEffect(() => {
    if (!showDropdown) return;

    function onScrollOrResize() {
      updatePosition();
    }

    window.addEventListener("resize", onScrollOrResize);
    // capture scroll from any container
    window.addEventListener("scroll", onScrollOrResize, true);
    return () => {
      window.removeEventListener("resize", onScrollOrResize);
      window.removeEventListener("scroll", onScrollOrResize, true);
    };
  }, [showDropdown]);

  useEffect(() => {
    function onPointerDown(e: MouseEvent | TouchEvent) {
      const target = e.target;
      if (!(target instanceof Node)) return;
      if (rootRef.current?.contains(target)) return;
      const dropdown = document.getElementById(`${id}-listbox`);
      if (dropdown?.contains(target)) return;
      setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [id]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setOpen(false);
    const q = query.trim();
    if (!q) {
      router.push("/");
      return;
    }
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  const isHero = variant === "hero";

  const dropdown =
    mounted &&
    showDropdown &&
    pos &&
    createPortal(
      <ul
        id={`${id}-listbox`}
        role="listbox"
        style={{
          position: "fixed",
          top: pos.top,
          left: pos.left,
          width: pos.width,
        }}
        className="z-[200] overflow-hidden rounded-xl border border-border bg-white text-foreground shadow-lg"
      >
        {suggestions.map((item) => (
          <li key={item.id} role="option">
            <Link
              href={item.href}
              onClick={() => setOpen(false)}
              className="flex items-center justify-between gap-3 px-4 py-3 text-sm transition-colors hover:bg-background"
            >
              <span className="font-medium text-foreground">{item.label}</span>
              <span className="shrink-0 text-xs text-muted">
                {item.kind === "restaurant" ? "مطعم" : "وجبة"}
                {item.meta ? ` · ${item.meta}` : ""}
              </span>
            </Link>
          </li>
        ))}
      </ul>,
      document.body,
    );

  return (
    <div ref={rootRef} className="relative z-[60] w-full">
      <form
        onSubmit={onSubmit}
        autoComplete="off"
        className="flex w-full flex-col gap-2 sm:flex-row sm:gap-0"
      >
        <label htmlFor={id} className="sr-only">
          ابحث عن مطعم أو وجبة
        </label>
        <div ref={inputWrapRef} className="relative min-w-0 flex-1">
          <input
            id={id}
            type="text"
            name={inputName}
            role="combobox"
            aria-expanded={showDropdown}
            aria-controls={`${id}-listbox`}
            aria-autocomplete="list"
            inputMode="search"
            enterKeyHint="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder="ابحث عن مطعم أو وجبة..."
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck={false}
            data-lpignore="true"
            data-1p-ignore="true"
            data-form-type="other"
            className={
              isHero
                ? "min-h-12 w-full rounded-xl border-0 bg-white px-4 py-3.5 text-base text-foreground outline-none placeholder:text-muted sm:rounded-e-none sm:rounded-s-xl"
                : "min-h-12 w-full rounded-xl border border-border bg-surface px-4 py-3 text-base text-foreground outline-none focus:border-accent sm:rounded-e-none sm:rounded-s-xl sm:text-sm"
            }
          />
        </div>

        <button
          type="submit"
          className="min-h-12 shrink-0 rounded-xl bg-accent px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-accent-hover sm:rounded-s-none sm:rounded-e-xl sm:text-sm"
        >
          بحث
        </button>
      </form>
      {dropdown}
    </div>
  );
}
