import Link from "next/link";

export default function AccountPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="text-2xl font-bold sm:text-3xl">الحساب</h1>
      <p className="mt-2 text-sm text-muted sm:text-base">
        حساب تجريبي للعرض — بدون تسجيل دخول حقيقي
      </p>

      <div className="mt-6 max-w-md rounded-2xl border border-border bg-surface p-5 sm:p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-soft text-xl font-bold text-accent">
            ز
          </div>
          <div>
            <p className="font-semibold text-foreground">زائر لقمة</p>
            <p className="text-sm text-muted" dir="ltr">
              guest@luqma.demo
            </p>
          </div>
        </div>

        <ul className="mt-6 space-y-1 border-t border-border pt-4">
          <AccountLink href="/orders" label="طلباتي" />
          <AccountLink href="/saved" label="المحفوظات" />
          <AccountLink href="/cart" label="السلة" />
        </ul>
      </div>
    </div>
  );
}

function AccountLink({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <Link
        href={href}
        className="block rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-background"
      >
        {label}
      </Link>
    </li>
  );
}
