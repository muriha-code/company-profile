import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { ReactNode } from "react";
import { Metadata } from "next";

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
      <body className="antialiased bg-white text-slate-900 selection:bg-blue-600 selection:text-white">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}