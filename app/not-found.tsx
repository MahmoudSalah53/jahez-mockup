import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-20 text-center">
      <h1 className="text-2xl font-bold text-foreground">الصفحة غير موجودة</h1>
      <p className="mt-2 text-sm text-muted">تأكد من الرابط أو عد إلى الصفحة الرئيسية</p>
      <Link
        href="/"
        className="mt-6 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
      >
        الرئيسية
      </Link>
    </div>
  );
}
