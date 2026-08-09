"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { setUiStateFromPath } from "@/lib/ui-state";

/** Keeps the voice agent's page snapshot in sync with the Next.js route. */
export function UiStateSync() {
  const pathname = usePathname();

  useEffect(() => {
    setUiStateFromPath(pathname || "/");
  }, [pathname]);

  return null;
}
