import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";
import { UiStateSync } from "@/components/UiStateSync";
import { VoiceWidget } from "@/components/voice-widget/VoiceWidget";
import "./globals.css";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "لقمة | توصيل طعام",
  description: "اطلب من أفضل المطاعم بالقرب منك — عرض تجريبي",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      data-scroll-behavior="smooth"
      className={`${cairo.variable} h-full`}
    >
      <body className="min-h-full flex flex-col font-sans antialiased">
        <Providers>
          <UiStateSync />
          <Navbar />
          <main className="flex-1 pb-20 md:pb-0">{children}</main>
          <BottomNav />
          <VoiceWidget />
        </Providers>
      </body>
    </html>
  );
}
