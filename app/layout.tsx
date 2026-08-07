import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
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
    <html lang="ar" dir="rtl" className={`${cairo.variable} h-full`}>
      <body className="min-h-full flex flex-col font-sans antialiased">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <VoiceWidget />
        </Providers>
      </body>
    </html>
  );
}
