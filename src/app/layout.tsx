import type { Metadata } from "next";
import { EB_Garamond, Cormorant_Garamond } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-eb-garamond",
  display: "swap",
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400"],
  variable: "--font-cormorant-garamond",
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Heat Sheet",
  description:
    "Nonpartisan political analysis. Race ratings, forecaster accountability, prediction market grades, and campaign finance research.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${ebGaramond.variable} ${cormorantGaramond.variable}`}>
      <body suppressHydrationWarning className="min-h-screen flex flex-col">
        <Header />
        <main className="max-w-6xl mx-auto px-6 md:px-10 py-10 page-enter flex-1 w-full">
          {children}
        </main>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
