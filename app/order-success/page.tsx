"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useOrders } from "@/lib/orders-context";
import { formatDate, formatPrice } from "@/lib/format";

function SuccessContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { orders } = useOrders();
  const order = orders.find((o) => o.id === id);

  return (
    <div className="mx-auto max-w-lg px-4 py-12 text-center sm:px-6 sm:py-16">
      <div className="rounded-2xl border border-border bg-surface px-6 py-10">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent-soft text-2xl text-accent">
          ✓
        </div>
        <h1 className="text-2xl font-bold text-foreground">تم تأكيد طلبك</h1>
        <p className="mt-2 text-sm text-muted">
          شكراً لك — هذا عرض تجريبي ولم يتم تنفيذ دفع حقيقي
        </p>

        {order ? (
          <div className="mt-6 space-y-2 text-sm text-start">
            <p>
              <span className="text-muted">رقم الطلب: </span>
              <span className="font-medium" dir="ltr">
                {order.id}
              </span>
            </p>
            <p>
              <span className="text-muted">الوقت: </span>
              {formatDate(order.createdAt)}
            </p>
            <p>
              <span className="text-muted">الإجمالي: </span>
              <span className="font-semibold text-accent">
                {formatPrice(order.total)}
              </span>
            </p>
          </div>
        ) : (
          <p className="mt-6 text-sm text-muted">تم استلام طلبك بنجاح</p>
        )}

        <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Link
            href="/orders"
            className="rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
          >
            عرض الطلبات
          </Link>
          <Link
            href="/"
            className="rounded-xl border border-border px-5 py-3 text-sm font-semibold transition-colors hover:border-accent/40"
          >
            العودة للرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-lg px-4 py-16 text-center text-muted">
          جاري التحميل...
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
