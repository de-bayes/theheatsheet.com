import type { Metadata } from "next";
import { EB_Garamond } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-eb-garamond",
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
    <html lang="en">
      <body className={ebGaramond.variable}>
        <Header />
        <main className="max-w-6xl mx-auto px-6 md:px-10 py-10">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
