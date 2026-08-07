import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  title: string;
  href?: string;
  linkLabel?: string;
  subtitle?: string;
  children: ReactNode;
};

export function SectionHeader({
  title,
  href,
  linkLabel = "عرض الكل",
  subtitle,
  children,
}: Props) {
  return (
    <section className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-1.5 text-sm text-muted lg:text-base">{subtitle}</p>
          ) : null}
        </div>
        {href && (
          <Link
            href={href}
            className="shrink-0 rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold text-accent transition hover:border-accent/40 hover:bg-accent-soft"
          >
            {linkLabel}
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}
