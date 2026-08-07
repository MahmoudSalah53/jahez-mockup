"use client";

import { SearchBox } from "@/components/SearchBox";

export function Hero() {
  return (
    <section className="relative">
      <div
        className="absolute inset-0 overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&q=80)",
        }}
        aria-hidden
      />
      <div className="absolute inset-0 overflow-hidden bg-black/55 sm:bg-gradient-to-l sm:from-black/75 sm:via-black/55 sm:to-black/35" />

      <div className="relative z-10 mx-auto flex min-h-[68vh] max-w-6xl flex-col justify-end px-4 pb-10 pt-20 sm:min-h-[72vh] sm:justify-center sm:px-6 sm:pb-16 sm:pt-16 md:min-h-[75vh]">
        <p className="mb-2 text-sm font-semibold tracking-wide text-white/85 sm:mb-3 sm:text-base">
          لقمة
        </p>
        <h1 className="max-w-xl text-[1.75rem] font-bold leading-snug text-white sm:text-4xl md:text-5xl md:leading-tight">
          طعامك المفضل يصل إليك بسهولة
        </h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-white/85 sm:mt-4 sm:text-lg">
          اكتشف مطاعم مميزة وأكلات شهية بالقرب منك، واطلب بخطوات بسيطة.
        </p>

        <div className="mt-6 w-full max-w-xl sm:mt-8">
          <SearchBox inputId="hero-search" variant="hero" />
        </div>
      </div>
    </section>
  );
}
