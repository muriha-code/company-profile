"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolderOpen,
  faGears,
  faBuilding,
  faImage,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";

export default function AdminDashboardPage() {
  const router = useRouter();

  const cards = [
    {
      title: "Portofolio",
      desc: "Tambah, edit, dan hapus studi kasus portofolio serta hasil proyek.",
      href: "/admin/portfolios",
      icon: faFolderOpen,
      color: "bg-blue-50 text-blue-600 border-blue-200",
      btnColor: "bg-blue-600 hover:bg-blue-700",
    },
    {
      title: "Layanan",
      desc: "Kelola daftar layanan utama, fitur, dan penyesuaian ikon.",
      href: "/admin/services",
      icon: faGears,
      color: "bg-emerald-50 text-emerald-600 border-emerald-200",
      btnColor: "bg-emerald-600 hover:bg-emerald-700",
    },
    {
      title: "Logo Klien",
      desc: "Kelola logo perusahaan klien yang tampil pada marquee.",
      href: "/admin/logos",
      icon: faBuilding,
      color: "bg-purple-50 text-purple-600 border-purple-200",
      btnColor: "bg-purple-600 hover:bg-purple-700",
    },
    {
      title: "Hero Section",
      desc: "Ganti gambar latar belakang utama Hero Section website.",
      href: "/admin/hero",
      icon: faImage,
      color: "bg-amber-50 text-amber-600 border-amber-200",
      btnColor: "bg-amber-600 hover:bg-amber-700",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider">
            <span>GrowthLine CMS Panel</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Selamat Datang di Admin Dashboard
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Kelola konten portofolio, layanan, logo klien, dan hero section website GrowthLine Consulting secara real-time yang terhubung langsung dengan Firebase Firestore & Cloudinary.
          </p>
        </div>
        <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-blue-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* Quick Access Cards */}
      <div>
        <h2 className="text-lg font-extrabold text-slate-900 mb-4">Modul Manajemen Konten</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card) => (
            <div
              key={card.href}
              className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className={`w-12 h-12 rounded-2xl ${card.color} border flex items-center justify-center mb-4`}>
                  <FontAwesomeIcon icon={card.icon} className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-lg text-slate-900 mb-1">{card.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{card.desc}</p>
              </div>

              <button
                onClick={() => router.push(card.href)}
                className={`mt-6 w-full ${card.btnColor} text-white py-2.5 px-4 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center space-x-2 shadow-sm cursor-pointer`}
              >
                <span>Kelola {card.title}</span>
                <FontAwesomeIcon icon={faArrowRight} className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}