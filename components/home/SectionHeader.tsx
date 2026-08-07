import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  title: string;
  href?: string;
  linkLabel?: string;
  children: ReactNode;
};

export function SectionHeader({
  title,
  href,
  linkLabel = "عرض الكل",
  children,
}: Props) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-4 flex items-end justify-between gap-3 sm:mb-6">
        <h2 className="text-lg font-bold text-foreground sm:text-2xl">
          {title}
        </h2>
        {href && (
          <Link
            href={href}
            className="shrink-0 text-sm font-medium text-accent transition-colors hover:text-accent-hover"
          >
            {linkLabel}
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}
