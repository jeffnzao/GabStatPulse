import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "GabStat Pulse - Sondages & Statistiques du Gabon",
  description: "Plateforme de sondages basée sur les réalités quotidiennes des Gabonais",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="bg-dark-900 text-gray-100">
        <Navbar />
        <main className="min-h-screen pt-16">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
