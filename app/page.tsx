"use client";

import { useState, FormEvent } from "react";
import Hero from "./components/Hero";
import ServicesSection from "./components/ServicesSection";

interface ServiceItem {
  icon: string;
  title: string;
  description: string;
  features: string[];
}

interface PortfolioItem {
  category: string;
  title: string;
  client: string;
  description: string;
  metric: string;
  metricLabel: string;
}

const servicesData: ServiceItem[] = [
  {
    icon: "📈",
    title: "Business Strategy",
    description: "Perencanaan strategis terarah berbasis analisis pasar komprehensif untuk pertumbuhan jangka panjang.",
    features: ["Market Expansion", "Strategic Roadmap", "Competitive Analysis"],
  },
  {
    icon: "💰",
    title: "Financial Optimization",
    description: "Restrukturisasi dan optimalisasi aliran kas untuk memaksimalkan margin keuntungan bisnis Anda.",
    features: ["Cash Flow Management", "Cost Reduction", "Financial Forecasting"],
  },
  {
    icon: "⚙️",
    title: "Operational Excellence",
    description: "Peningkatan efisiensi operasional dan otomatisasi alur kerja guna memangkas redundansi.",
    features: ["Process Automation", "Supply Chain Audit", "KPI Framework"],
  },
  {
    icon: "👥",
    title: "Leadership & Team",
    description: "Pengembangan kapabilitas kepemimpinan dan budaya kerja tinggi untuk akselerasi eksekusi.",
    features: ["Talent Alignment", "Executive Coaching", "Performance Review"],
  },
];

const portfolioData: PortfolioItem[] = [
  {
    category: "Financial Strategy",
    title: "FinTech Scaleup Restructuring",
    client: "PayPulse Solutions",
    description: "Optimalisasi struktur finansial dan perancangan strategi pendanaan Seri B.",
    metric: "+240%",
    metricLabel: "Pertumbuhan Revenue YoY",
  },
  {
    category: "Operations",
    title: "Supply Chain & Logistics Audit",
    client: "LogiGlobal Tech",
    description: "Transformasi proses rantai pasok dan efisiensi operasional gudang regional.",
    metric: "35%",
    metricLabel: "Pengurangan Biaya Operasional",
  },
  {
    category: "Market Expansion",
    title: "Regional Retail Expansion",
    client: "OmniStore Retail",
    description: "Strategi penetrasi pasar baru di 12 kota besar secara bersamaan.",
    metric: "12 Pasar",
    metricLabel: "Cabang Baru Berhasil Dioperasikan",
  },
];

export default function Home() {
  const scrollToSection = (targetId: string) => {
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };


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
      <section id="portfolio" className="scroll-mt-20 py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-blue-600 font-semibold text-sm tracking-wider uppercase">Portfolio</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-2 mb-4">
              Studi Kasus & Rekam Jejak Keberhasilan
            </h2>
            <p className="text-slate-600 text-lg">
              Lihat bagaimana kami membantu para klien dalam memecahkan masalah kompleks dan mencapai hasil bisnis nyata.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolioData.map((project, index) => (
              <div
                key={index}
                className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-200/80 hover:border-blue-300 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div className="p-8">
                  <div className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full mb-4">
                    {project.category}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {project.title}
                  </h3>
                  <div className="text-xs font-medium text-slate-500 mb-4">
                    Klien: {project.client}
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {project.description}
                  </p>
                </div>
                <div className="bg-white p-6 border-t border-slate-200/80 flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-extrabold text-blue-600">{project.metric}</div>
                    <div className="text-xs text-slate-500 font-medium">{project.metricLabel}</div>
                  </div>
                  <button
                    onClick={() => scrollToSection("contact")}
                    className="text-xs font-semibold text-slate-700 hover:text-blue-600 flex items-center space-x-1 cursor-pointer"
                  >
                    <span>Konsultasi</span>
                    <span>&rarr;</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


    </div>
  );
}