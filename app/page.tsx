"use client";

import { useState, FormEvent } from "react";
import Hero from "./components/Hero";
import ServicesSection from "./components/ServicesSection";
import PortfolioSection from "./components/PortfolioSection";

export default function Home() {
  return (
    <div className="w-full">
      {/* 1. HERO SECTION */}
      <Hero />

      {/* 2. ABOUT US SECTION */}
      <section id="about" className="scroll-mt-20 py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div>
              <span className="text-blue-600 font-semibold text-sm tracking-wider uppercase">Tentang Kami</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-2 mb-6">
                Mitra Strategis Terpercaya Untuk Pengambilan Keputusan Bisnis
              </h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                GrowthLine Consulting didirikan dengan satu komitmen utama: membantu perusahaan dari berbagai skala dalam menghadapi tantangan bisnis modern dan mengeksekusi strategi pertumbuhan yang terukur.
              </p>
              <p className="text-slate-600 leading-relaxed mb-8">
                Kami menggabungkan analisis ilmiah berbasis data dengan pengalaman praktis mendalam di industri untuk memberikan solusi kontekstual yang berfokus pada hasil nyata.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="font-bold text-slate-900 text-lg mb-1">Visi Kami</div>
                  <div className="text-sm text-slate-600">Menjadi konsultan bisnis terdepan yang mendorong efisiensi dan inovasi di kawasan Asia Tenggara.</div>
                </div>
                <div className="p-5 rounded-xl bg-blue-50/60 border border-blue-100">
                  <div className="font-bold text-blue-900 text-lg mb-1">Misi Kami</div>
                  <div className="text-sm text-blue-800">Menghadirkan konsultasi berstandar tinggi yang memberikan nilai tambah signifikan bagi pemangku kepentingan.</div>
                </div>
              </div>
            </div>

            {/* Right Card Feature */}
            <div className="bg-slate-900 text-white rounded-2xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl" />
              <h3 className="text-2xl font-bold mb-6 text-white">Mengapa Memilih GrowthLine?</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center flex-shrink-0 font-bold">1</div>
                  <div>
                    <h4 className="font-semibold text-lg text-white">Pendekatan Berbasis Data</h4>
                    <p className="text-slate-300 text-sm mt-1">Setiap rekomendasi didasarkan pada riset pasar aktual dan pemodelan finansial yang valid.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center flex-shrink-0 font-bold">2</div>
                  <div>
                    <h4 className="font-semibold text-lg text-white">Solusi Kustom & Spesifik</h4>
                    <p className="text-slate-300 text-sm mt-1">Tidak ada template generik; strategi kami disesuaikan dengan kondisi unik bisnis Anda.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center flex-shrink-0 font-bold">3</div>
                  <div>
                    <h4 className="font-semibold text-lg text-white">Pendampingan Eksekusi</h4>
                    <p className="text-slate-300 text-sm mt-1">Kami tidak hanya memberikan laporan, tapi juga mendampingi implementasi hingga mencapai target.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SERVICES SECTION */}
      <ServicesSection />

      {/* 4. PORTFOLIO SECTION */}
      <PortfolioSection />



    </div>
  );
}