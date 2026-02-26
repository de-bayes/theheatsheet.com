import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400..800;1,400..800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Header />
        <main className="max-w-6xl mx-auto px-6 md:px-10 py-10">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
