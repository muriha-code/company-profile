import "./globals.css";
import ConditionalLayout from "./components/ConditionalLayout";
import { ReactNode } from "react";
import { Metadata } from "next";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";

// Prevent FontAwesome from automatically injecting CSS to fix SSR/CSR hydration mismatch
config.autoAddCss = false;

export const metadata: Metadata = {
  title: "GrowthLine Consulting | Your Partner in Business Growth",
  description: "GrowthLine Consulting helps ambitious businesses scale faster with data-driven strategy, operational efficiency, and expert guidance.",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body suppressHydrationWarning className="antialiased bg-white text-slate-900 selection:bg-blue-600 selection:text-white">
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}