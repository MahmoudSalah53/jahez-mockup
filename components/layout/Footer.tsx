import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="text-lg font-bold text-accent">لقمة</p>
          <p className="mt-1 text-sm text-muted">
            عرض تجريبي لتوصيل الطعام — ليس متجراً حقيقياً
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-muted">
          <Link href="/restaurants" className="hover:text-accent">
            المطاعم
          </Link>
          <Link href="/offers" className="hover:text-accent">
            العروض
          </Link>
          <Link href="/cart" className="hover:text-accent">
            السلة
          </Link>
        </div>
      </div>
    </footer>
  );
}
