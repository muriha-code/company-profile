import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import fs from "fs";
import path from "path";

// Read .env.local variables
const envPath = path.resolve(process.cwd(), ".env.local");
const envContent = fs.readFileSync(envPath, "utf-8");
const envVars = {};

envContent.split("\n").forEach((line) => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim();
  }
});

const firebaseConfig = {
  apiKey: envVars.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: envVars.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: envVars.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: envVars.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: envVars.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: envVars.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const portfolioData = [
  {
    id: "fintech-restructuring",
    category: "Financial Strategy",
    categorySlug: "financial",
    title: "FinTech Scaleup Financial Restructuring",
    client: "PayPulse Solutions",
    description: "Optimalisasi alokasi modal dan pemodelan proyeksi keuangan terpadu untuk persiapan pendanaan Seri B skala regional.",
    fullDescription: "PayPulse Solutions mengalami pertumbuhan pengguna yang sangat cepat namun menghadapi tantangan dalam efisiensi alokasi modal dan proyeksi arus kas. GrowthLine Consulting melakukan audit finansial mendalam, menyusun model proyeksi 5 tahun berbasis skenario dinamis, serta mendesain strategi restrukturisasi beban operasional untuk meningkatkan valuasi perusahaan menjelang proses pendanaan Seri B.",
    outcomes: [
      "Pertumbuhan Revenue YoY meningkat signifikan hingga +240%",
      "Pengurangan rasio burn rate operasional bulanan sebesar 28%",
      "Keberhasilan penggalangan dana Seri B sebesar $15 Juta tepat waktu"
    ],
    deliverables: [
      "Laporan Model Keuangan & Proyeksi Arus Kas 5 Tahun",
      "Dokumen Evaluasi Valuation & Audit Unit Economics",
      "Executive Pitch Deck & Data Room Investor Seri B"
    ],
    timeline: "4 Bulan (Q1 - Q2)",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=800&auto=format&fit=crop",
    metricLabel: "Pertumbuhan Revenue YoY",
    tags: ["Financial Audit", "Capital Raising", "Cost Efficiency"],
    badgeColor: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
    order: 1
  },
  {
    id: "supply-chain-audit",
    category: "Operations",
    categorySlug: "operations",
    title: "Supply Chain & Regional Logistics Audit",
    client: "LogiGlobal Tech",
    description: "Transformasi alur kerja pergudangan dan otomatisasi rute distribusi logistik antar-pulau.",
    fullDescription: "LogiGlobal Tech menghadapi kendala ketidakseimbangan inventoris di gudang cabang serta keterlambatan pengiriman logistik antar-pulau. Tim GrowthLine melakukan analisis pemetaan rantai pasok dari hulu ke hilir, mendesain ulang SOP pengelolaan gudang, serta menerapkan algoritma perutean distribusi otomatis guna memangkas biaya transportasi.",
    outcomes: [
      "Pengurangan total biaya operasional logistik sebesar 35%",
      "Peningkatan kecepatan pemenuhan pesanan (order fulfillment) sebesar 45%",
      "Penurunan angka kerusakan barang saat transit hingga 0.2%"
    ],
    deliverables: [
      "Peta Strategi & Blue Print Rantai Pasok Logistik",
      "Buku Panduan Standar Operasional Prosedur (SOP) Pergudangan",
      "Dashboard Pemantauan Rute Distribusi Real-Time"
    ],
    timeline: "3 Bulan (Q2 - Q3)",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&auto=format&fit=crop",
    metricLabel: "Pengurangan Biaya Operasional",
    tags: ["Logistics Optimization", "SOP Re-engineering", "Automation"],
    badgeColor: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
    order: 2
  },
  {
    id: "retail-expansion",
    category: "Market Expansion",
    categorySlug: "expansion",
    title: "Omnichannel Regional Retail Expansion",
    client: "OmniStore Retail",
    description: "Riset pasar komprehensif dan strategi eksekusi penetrasi gerai fisik di 12 kota strategis secara serentak.",
    fullDescription: "OmniStore Retail berencana memperluas jangkauan jaringan toko fisik ke kota-kota tier-2 dan tier-3 secara efektif. GrowthLine melakukan studi kelayakan pasar regional, analisis demografi lokal, penetapan lokasi potensial berbasis data trafik, serta memandu strategi pemasaran launching terintegrasi online-to-offline.",
    outcomes: [
      "12 Cabang Baru Berhasil Dioperasikan Tepat Waktu dalam 6 bulan",
      "Pencapaian titik impas (BEP) gerai 2 bulan lebih cepat dari target awal",
      "Peningkatan kesadaran merek (brand awareness) regional sebesar 65%"
    ],
    deliverables: [
      "Dokumen Riset Studi Kelayakan Pasar di 12 Kota Tujuan",
      "Kriteria & Framework Pemilihan Lokasi Strategis (Site Selection)",
      "Playbook Peluncuran Gerai Omnichannel & Program Promosi"
    ],
    timeline: "6 Bulan (Q1 - Q3)",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop",
    metricLabel: "Cabang Baru Berhasil Dioperasikan",
    tags: ["Market Feasibility", "Site Selection", "Go-To-Market"],
    badgeColor: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
    order: 3
  },
  {
    id: "digital-transformation",
    category: "Digital Transformation",
    categorySlug: "digital",
    title: "Enterprise ERP & Workflow Integration",
    client: "Nusantara Manufacturing Group",
    description: "Migrasi sistem warisan ke platform ERP terintegrasi berbasis data analitik real-time untuk 3 pabrik utama.",
    fullDescription: "Nusantara Manufacturing Group menghadapi fragmentasi data pada 3 unit pabrik utama yang memperlambat laporan keputusan eksekutif. GrowthLine bertindak sebagai konsultan pendamping migrasi digital, merancang arsitektur ERP terpadu, serta mendampingi manajemen perubahan staf pabrik.",
    outcomes: [
      "Peningkatan kecepatan konsolidasi data operasional hingga 4.2x",
      "Eliminasi ganda data (data redundancy) antar divisi sebesar 95%",
      "Transparansi pelaporan stok bahan baku dan jadwal produksi secara real-time"
    ],
    deliverables: [
      "Peta Jalan (Roadmap) Transformasi Digital Manufaktur",
      "Arsitektur Integrasi ERP & Modul Produksi",
      "Modul Pelatihan Manajemen Perubahan Staf Operasional"
    ],
    timeline: "5 Bulan (Q2 - Q4)",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
    metricLabel: "Kecepatan Pengolahan Data ERP",
    tags: ["Digital Roadmap", "ERP Integration", "Data Analytics"],
    badgeColor: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
    order: 4
  },
  {
    id: "leadership-culture",
    category: "Leadership & Team",
    categorySlug: "leadership",
    title: "Executive Leadership Alignment & Culture",
    client: "AeroTech Holdings",
    description: "Penyelarasan kembali struktur manajerial senior dan pembentukan sistem evaluasi kinerja berbasis OKR modern.",
    fullDescription: "Pasca merger perusahaan, AeroTech Holdings menghadapi tantangan dalam penyelarasan visi antar pimpinan eksekutif dan penurunan motivasi kerja tim manajerial. GrowthLine memfasilitasi sesi executive alignment, membentuk matriks Kinerja OKR transparan, serta merancang ulang sistem retensi talenta.",
    outcomes: [
      "Skor retensi talenta kunci manajerial meningkat hingga 92%",
      "Pencapaian target OKR bulanan naik dari 68% menjadi 91%",
      "Peningkatan kepuasan iklim kerja eksekutif sebesar 40%"
    ],
    deliverables: [
      "Matriks Kerangka Kerja OKR & Sistem Evaluasi Kinerja Eksekutif",
      "Buku Panduan Budaya Perusahaan (Company Culture Playbook)",
      "Modul Executive Coaching & Alignment Workshop"
    ],
    timeline: "3 Bulan (Q3 - Q4)",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop",
    metricLabel: "Skor Retensi Talenta Kunci",
    tags: ["Executive Coaching", "OKR Framework", "Culture Transformation"],
    badgeColor: { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200" },
    order: 5
  },
  {
    id: "corporate-strategy",
    category: "Financial Strategy",
    categorySlug: "financial",
    title: "Healthcare Provider Turnaround Strategy",
    client: "Medica Health Systems",
    description: "Restrukturisasi portofolio produk medis dan optimalisasi unit bisnis untuk meningkatkan profit marjin.",
    fullDescription: "Medica Health Systems mengalami penurunan marjin profitabilitas akibat ketidakseimbangan alokasi aset medis dan biaya operasional klinik. GrowthLine menyusun strategi penyehatan (turnaround plan), merestrukturisasi portofolio unit bisnis, serta mengoptimalkan harga dan efisiensi pengadaan pasokan kesehatan.",
    outcomes: [
      "Peningkatan EBITDA Margin sebesar +180 Bps dalam satu tahun fiskal",
      "Optimalisasi tingkat okupansi dan utilitas fasilitas medis sebesar 88%",
      "Peningkatan arus kas operasional bersih hingga 32%"
    ],
    deliverables: [
      "Rencana Strategis Penyehatan Bisnis (Business Turnaround Plan)",
      "Analisis Margin Profitabilitas Portofolio Layanan Kesehatan",
      "SOP Efisiensi Pengadaan Peralatan & Obat-obatan"
    ],
    timeline: "4 Bulan (Q1 - Q2)",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop",
    metricLabel: "Peningkatan EBITDA Margin",
    tags: ["Business Turnaround", "Portfolio Audit", "Growth Strategy"],
    badgeColor: { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200" },
    order: 6
  }
];

async function seed() {
  console.log("Seeding 6 portfolio items to Cloud Firestore...");
  for (const item of portfolioData) {
    const { id, ...data } = item;
    await setDoc(doc(db, "portfolios", id), data);
    console.log(`✓ Uploaded: ${id}`);
  }
  console.log("🎉 All 6 portfolio items successfully uploaded to Firestore!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
