"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { CldImage } from "next-cloudinary";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faImage,
  faUpload,
  faSpinner,
  faCheckCircle,
  faExclamationTriangle,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import { getHero, updateHeroInFirestore, HeroData } from "@/lib/services/heroService";
import { uploadToCloudinary, deleteFromCloudinary } from "@/lib/cloudinaryClient";

export default function AdminHeroPage() {
  const [heroData, setHeroData] = useState<HeroData>({
    src: "",
    publicId: "",
    cloudinary: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getHero();
      if (data) {
        setHeroData(data);
      } else {
        setHeroData({
          src: "hero-bg_evwycr",
          publicId: "",
          cloudinary: true,
        });
      }
    } catch (err) {
      console.error("Gagal memuat data hero:", err);
      showToast("Gagal mengambil data Hero dari Firestore", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const isCloudinaryPublicId = (src: string) => {
    return !src.startsWith("http://") && !src.startsWith("https://") && !src.startsWith("/");
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const customSlug = "hero-main";

      // Delete old asset from Cloudinary if replacing with different publicId
      const targetPublicId = `growthline/hero/${customSlug}`;
      if (heroData.publicId && heroData.publicId !== targetPublicId) {
        await deleteFromCloudinary(heroData.publicId);
      }

      const res = await uploadToCloudinary(file, "growthline/hero", customSlug);

      setHeroData((prev) => ({
        ...prev,
        src: res.url,
        publicId: res.public_id,
        slug: res.slug || customSlug,
        folder: "growthline/hero",
        cloudinary: false,
      }));
      showToast(`Gambar baru berhasil diunggah ke ${res.public_id}!`);
    } catch (err: any) {
      console.error("Upload error:", err);
      showToast(err.message || "Gagal mengunggah gambar", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroData.src) {
      showToast("Harap tentukan gambar Hero!", "error");
      return;
    }

    try {
      setSaving(true);
      const isPublicId = isCloudinaryPublicId(heroData.src);
      await updateHeroInFirestore({
        ...heroData,
        slug: heroData.slug || "hero-main",
        folder: "growthline/hero",
        cloudinary: isPublicId || heroData.cloudinary,
      });
      showToast("Latar belakang Hero berhasil disimpan ke Firestore!");
      loadData();
    } catch (err) {
      console.error("Save error:", err);
      showToast("Gagal menyimpan Hero", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Toast */}
      {toastMessage && (
        <div
          className={`fixed top-5 right-5 z-50 px-5 py-3.5 rounded-xl shadow-xl text-white text-xs sm:text-sm font-bold flex items-center space-x-3 transition-all duration-300 ${
            toastType === "success" ? "bg-emerald-600" : "bg-rose-600"
          }`}
        >
          <FontAwesomeIcon
            icon={toastType === "success" ? faCheckCircle : faExclamationTriangle}
            className="w-5 h-5"
          />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center space-x-2">
          <FontAwesomeIcon icon={faImage} className="w-6 h-6 text-amber-500" />
          <span>Manajemen Hero Section</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Kelola gambar latar belakang (background image) utama yang ditampilkan di Hero Section website.
        </p>
      </div>

      {loading ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
          <FontAwesomeIcon icon={faSpinner} className="w-8 h-8 text-amber-500 animate-spin mx-auto" />
          <p className="text-sm font-medium text-slate-600">Memuat konfigurasi Hero...</p>
        </div>
      ) : (
        <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
          {/* Image Preview Box */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block">
              Pratinjau Gambar Latar Belakang Hero saat ini
            </label>
            <div className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden border border-slate-300 bg-slate-950 flex items-center justify-center shadow-inner">
              {heroData.src ? (
                isCloudinaryPublicId(heroData.src) || heroData.cloudinary ? (
                  <CldImage
                    src={heroData.src}
                    alt="Hero Preview"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <Image
                    src={heroData.src}
                    alt="Hero Preview"
                    fill
                    className="object-cover"
                  />
                )
              ) : (
                <div className="text-slate-400 text-xs">Belum ada gambar terpilih</div>
              )}
              <div className="absolute inset-0 bg-slate-950/40 pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 text-white text-xs font-bold bg-slate-900/80 backdrop-blur-md p-3 rounded-xl border border-white/10">
                URL / ID: <span className="text-amber-400 font-mono font-normal truncate block">{heroData.src}</span>
              </div>
            </div>
          </div>

          {/* Upload & Input Controls */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block">
              Ganti Gambar Latar Belakang Hero
            </label>
            <div className="flex flex-col sm:flex-row gap-4">
              <label className="inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-bold transition cursor-pointer border border-slate-300 flex-shrink-0">
                <FontAwesomeIcon icon={uploading ? faSpinner : faUpload} className={uploading ? "animate-spin" : ""} />
                <span>{uploading ? "Mengunggah..." : "Pilih File Gambar Baru..."}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
              <input
                type="text"
                placeholder="Atau masukkan URL / Public ID Cloudinary..."
                value={heroData.src}
                onChange={(e) => setHeroData({ ...heroData, src: e.target.value })}
                className="flex-1 px-4 py-3 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-6 border-t border-slate-200 flex justify-end">
            <button
              type="submit"
              disabled={saving || uploading}
              className="inline-flex items-center space-x-2 px-7 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs sm:text-sm font-bold transition shadow-md shadow-amber-500/20 disabled:opacity-60 cursor-pointer"
            >
              {saving ? (
                <FontAwesomeIcon icon={faSpinner} className="w-4 h-4 animate-spin" />
              ) : (
                <FontAwesomeIcon icon={faSave} className="w-4 h-4" />
              )}
              <span>{saving ? "Menyimpan ke Firestore..." : "Simpan Perubahan Hero"}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
