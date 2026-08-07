import { Suspense } from "react";
import { RestaurantsClient } from "./RestaurantsClient";

export default function RestaurantsPage() {
  return (
    <Suspense
      fallback={
        <div className="px-4 py-16 text-center text-muted">جاري التحميل...</div>
      }
    >
      <RestaurantsClient />
    </Suspense>
  );
}
