"use client";

import { SearchBox } from "@/components/SearchBox";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div
        className="absolute inset-0 scale-105 bg-cover bg-center transition-transform duration-[8s] ease-out will-change-transform hover:scale-100"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=2000&q=80)",
        }}
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-l from-black/80 via-black/55 to-black/25"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,transparent_0%,rgba(0,0,0,0.35)_70%)]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex min-h-[52vh] max-w-7xl flex-col justify-end px-8 pb-14 pt-24 lg:min-h-[58vh] lg:pb-16">
        <p className="mb-3 text-sm font-semibold tracking-[0.2em] text-white/80">
          لقمة
        </p>
        <h1 className="max-w-2xl text-5xl font-bold leading-[1.15] text-white lg:text-6xl">
          اطلب من أفضل المطاعم بالقرب منك
        </h1>
        <p className="mt-4 max-w-lg text-lg leading-relaxed text-white/85">
          توصيل سريع، عروض يومية، وتجربة طلب بسيطة من مطابخ تحبها.
        </p>

        <div className="mt-8 w-full max-w-2xl">
          <SearchBox inputId="hero-search" variant="hero" />
        </div>
      </div>
    </section>
  );
}
