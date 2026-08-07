import { Suspense } from "react";
import { OffersClient } from "./OffersClient";

export default function OffersPage() {
  return (
    <Suspense
      fallback={
        <div className="px-4 py-16 text-center text-muted">جاري التحميل...</div>
      }
    >
      <OffersClient />
    </Suspense>
  );
}
