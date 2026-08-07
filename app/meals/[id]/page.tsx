import { Suspense } from "react";
import { MealDetailClient } from "./MealDetailClient";

export default function MealPage() {
  return (
    <Suspense
      fallback={
        <div className="px-4 py-16 text-center text-muted">جاري التحميل...</div>
      }
    >
      <MealDetailClient />
    </Suspense>
  );
}
