"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faSearch,
  faEdit,
  faTrash,
  faTimes,
  faUpload,
  faSpinner,
  faCheckCircle,
  faExclamationTriangle,
  faFolderOpen,
} from "@fortawesome/free-solid-svg-icons";
import {
  getPortfolios,
  createPortfolio,
  updatePortfolio,
  deletePortfolio,
} from "@/lib/services/portfolioService";
import { PortfolioItem } from "@/app/components/PortfolioSection";
import { uploadToCloudinary, deleteFromCloudinary } from "@/lib/cloudinaryClient";
import { slugify } from "@/lib/utils/slugify";
import Pagination from "@/app/admin/components/Pagination";

const ITEMS_PER_PAGE = 5;

const CATEGORY_OPTIONS = [
  { label: "Financial Strategy", slug: "financial" },
  { label: "Operations", slug: "operations" },
  { label: "Market Expansion", slug: "expansion" },
  { label: "Digital Transformation", slug: "digital" },
  { label: "Leadership & Team", slug: "leadership" },
];

const BADGE_COLOR_PRESETS = [
  { label: "Emerald (Hijau)", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  { label: "Blue (Biru)", bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  { label: "Amber (Kuning/Oranye)", bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  { label: "Purple (Ungu)", bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  { label: "Rose (Merah)", bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200" },
  { label: "Indigo (Nila)", bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200" },
];

const emptyFormState: Omit<PortfolioItem, "id"> & { id?: string } = {
  category: "Financial Strategy",
  categorySlug: "financial",
  title: "",
  client: "",
  description: "",
  fullDescription: "",
  timeline: "",
  image: "",
  imagePublicId: "",
  slug: "",
  folder: "growthline/portfolio",
  metric: "",
  metricLabel: "",
  documentUrl: "#",
  outcomes: [""],
  deliverables: [""],
  tags: [""],
  badgeColor: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
};

export default function AdminPortfoliosPage() {
  const [portfolios, setPortfolios] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [formData, setFormData] = useState<Omit<PortfolioItem, "id"> & { id?: string }>(emptyFormState);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Delete Confirmation State
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast State
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
      const data = await getPortfolios();
      setPortfolios(data);
    } catch (err) {
      console.error("Gagal memuat data portofolio:", err);
      showToast("Gagal mengambil data dari Firestore", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingItem(null);
    setFormData({
      ...emptyFormState,
      order: portfolios.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: PortfolioItem) => {
    setEditingItem(item);
    setFormData({
      id: item.id,
      title: item.title || "",
      client: item.client || "",
      category: item.category || "Financial Strategy",
      categorySlug: item.categorySlug || "financial",
      description: item.description || "",
      fullDescription: item.fullDescription || "",
      timeline: item.timeline || "",
      image: item.image || "",
      metric: item.metric || "",
      metricLabel: item.metricLabel || "",
      documentUrl: item.documentUrl || "#",
      outcomes: item.outcomes && item.outcomes.length > 0 ? item.outcomes : [""],
      deliverables: item.deliverables && item.deliverables.length > 0 ? item.deliverables : [""],
      tags: item.tags && item.tags.length > 0 ? item.tags : [""],
      badgeColor: item.badgeColor || { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
    });
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const customSlug = slugify(formData.title || file.name.split(".")[0]);

      // Delete previous Cloudinary image if publicId changed
      const targetPublicId = `growthline/portfolio/${customSlug}`;
      if (formData.imagePublicId && formData.imagePublicId !== targetPublicId) {
        await deleteFromCloudinary(formData.imagePublicId);
      }

      const data = await uploadToCloudinary(file, "growthline/portfolio", customSlug);

      setFormData((prev) => ({
        ...prev,
        image: data.url,
        imagePublicId: data.public_id,
        slug: data.slug || customSlug,
        folder: "growthline/portfolio",
      }));
      showToast(`Gambar berhasil diunggah ke ${data.public_id}!`);
    } catch (err: any) {
      console.error("Upload error:", err);
      showToast(err.message || "Gagal mengunggah gambar", "error");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.client || !formData.image) {
      showToast("Harap isi Judul, Klien, dan Gambar Portofolio!", "error");
      return;
    }

    try {
      setSaving(true);
      const portfolioSlug = formData.slug || slugify(formData.title);
      // Clean up empty array values
      const cleanedData = {
        ...formData,
        slug: portfolioSlug,
        folder: "growthline/portfolio",
        outcomes: (formData.outcomes || []).filter((item) => item.trim() !== ""),
        deliverables: (formData.deliverables || []).filter((item) => item.trim() !== ""),
        tags: (formData.tags || []).filter((item) => item.trim() !== ""),
      };

      if (editingItem) {
        await updatePortfolio(editingItem.id, cleanedData);
        showToast("Studi kasus portofolio berhasil diperbarui!");
      } else {
        await createPortfolio(cleanedData);
        showToast("Studi kasus portofolio baru berhasil ditambahkan!");
      }

      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      console.error("Save error:", err);
      showToast("Gagal menyimpan data portofolio", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      setIsDeleting(true);
      const itemToDelete = portfolios.find((p) => p.id === deletingId);
      if (itemToDelete?.imagePublicId) {
        await deleteFromCloudinary(itemToDelete.imagePublicId);
      }

      await deletePortfolio(deletingId);
      showToast("Portofolio berhasil dihapus!");
      setDeletingId(null);

      const remainingCount = portfolios.filter((p) => p.id !== deletingId).length;
      const newTotalPages = Math.ceil(remainingCount / ITEMS_PER_PAGE) || 1;
      if (currentPage > newTotalPages) {
        setCurrentPage(newTotalPages);
      }

      loadData();
    } catch (err) {
      console.error("Delete error:", err);
      showToast("Gagal menghapus portofolio", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  // Helper Array Input Handler
  const handleArrayChange = (
    field: "outcomes" | "deliverables" | "tags",
    index: number,
    value: string
  ) => {
    const updated = [...(formData[field] || [])];
    updated[index] = value;
    setFormData({ ...formData, [field]: updated });
  };

  const handleAddArrayItem = (field: "outcomes" | "deliverables" | "tags") => {
    setFormData({ ...formData, [field]: [...(formData[field] || []), ""] });
  };

  const handleRemoveArrayItem = (
    field: "outcomes" | "deliverables" | "tags",
    index: number
  ) => {
    const updated = (formData[field] || []).filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: updated.length > 0 ? updated : [""] });
  };

  // Filter & Search Logic
  const filteredPortfolios = portfolios.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.client.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || item.categorySlug === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredPortfolios.length / ITEMS_PER_PAGE) || 1;
  const paginatedPortfolios = filteredPortfolios.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
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

      {/* Header & Main Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center space-x-2">
            <FontAwesomeIcon icon={faFolderOpen} className="w-6 h-6 text-blue-600" />
            <span>Manajemen Portofolio</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Kelola studi kasus, hasil proyek, dan kredensial klien yang tampil di website publik.
          </p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold transition-all shadow-md shadow-blue-600/20 cursor-pointer"
        >
          <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
          <span>Tambah Portofolio</span>
        </button>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4"
          />
          <input
            type="text"
            placeholder="Cari berdasarkan judul atau nama klien..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-medium focus:outline-none focus:border-blue-500 transition cursor-pointer"
        >
          <option value="all">Semua Kategori</option>
          {CATEGORY_OPTIONS.map((cat) => (
            <option key={cat.slug} value={cat.slug}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* Data Table / Cards Grid */}
      {loading ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
          <FontAwesomeIcon icon={faSpinner} className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
          <p className="text-sm font-medium text-slate-600">Memuat portofolio dari Firestore...</p>
        </div>
      ) : filteredPortfolios.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
          <FontAwesomeIcon icon={faFolderOpen} className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-base font-bold text-slate-700">Belum ada portofolio</p>
          <p className="text-xs text-slate-500">Tidak ada studi kasus yang sesuai dengan kriteria pencarian Anda.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold uppercase text-slate-500 tracking-wider">
                    <th className="py-3.5 px-5">Gambar</th>
                    <th className="py-3.5 px-5">Judul & Klien</th>
                    <th className="py-3.5 px-5">Kategori</th>
                    <th className="py-3.5 px-5">Metric / Hasil</th>
                    <th className="py-3.5 px-5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                  {paginatedPortfolios.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-5">
                        <div className="relative w-16 h-12 rounded-lg bg-slate-100 overflow-hidden border border-slate-200">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.title}
                              fill
                              sizes="80px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400 text-[10px]">
                              No Image
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-5 max-w-xs">
                        <p className="font-bold text-slate-900 line-clamp-1">{item.title}</p>
                        <p className="text-xs text-blue-600 font-semibold">{item.client}</p>
                      </td>
                      <td className="py-4 px-5">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border ${item.badgeColor?.bg || "bg-blue-50"} ${item.badgeColor?.text || "text-blue-700"} ${item.badgeColor?.border || "border-blue-200"}`}>
                          {item.category}
                        </span>
                      </td>
                      <td className="py-4 px-5">
                        {item.metric ? (
                          <div>
                            <span className="font-extrabold text-emerald-600">{item.metric}</span>
                            <span className="text-[11px] text-slate-500 block">{item.metricLabel}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-xs">-</span>
                        )}
                      </td>
                      <td className="py-4 px-5 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-blue-600 hover:text-white transition-colors cursor-pointer"
                          title="Edit Portofolio"
                        >
                          <FontAwesomeIcon icon={faEdit} className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingId(item.id)}
                          className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-colors cursor-pointer"
                          title="Hapus Portofolio"
                        >
                          <FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredPortfolios.length}
            itemsPerPage={ITEMS_PER_PAGE}
            itemLabel="portfolio"
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}

      {/* Modal Form Create / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 my-8 overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-5 bg-slate-900 text-white flex items-center justify-between">
              <h2 className="text-lg font-bold">
                {editingItem ? "Edit Portofolio" : "Tambah Portofolio Baru"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition cursor-pointer"
              >
                <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSave} className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Judul Studi Kasus */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                    Judul Studi Kasus *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="misal: FinTech Scaleup Financial Restructuring"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Nama Klien */}
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                    Nama Klien *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="misal: PayPulse Solutions"
                    value={formData.client}
                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Kategori */}
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                    Kategori *
                  </label>
                  <select
                    value={formData.categorySlug}
                    onChange={(e) => {
                      const selected = CATEGORY_OPTIONS.find((c) => c.slug === e.target.value);
                      setFormData({
                        ...formData,
                        categorySlug: e.target.value,
                        category: selected ? selected.label : "Financial Strategy",
                      });
                    }}
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    {CATEGORY_OPTIONS.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Preset Warna Badge */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                    Warna Badge Kategori
                  </label>
                  <select
                    value={formData.badgeColor?.bg || "bg-blue-50"}
                    onChange={(e) => {
                      const selectedPreset = BADGE_COLOR_PRESETS.find((p) => p.bg === e.target.value);
                      if (selectedPreset) {
                        setFormData({
                          ...formData,
                          badgeColor: { bg: selectedPreset.bg, text: selectedPreset.text, border: selectedPreset.border },
                        });
                      }
                    }}
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    {BADGE_COLOR_PRESETS.map((preset) => (
                      <option key={preset.bg} value={preset.bg}>
                        {preset.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Unggah Gambar Cloudinary */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                    Gambar Portofolio (Cloudinary) *
                  </label>
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    {formData.image && (
                      <div className="relative w-28 h-20 rounded-xl overflow-hidden border border-slate-300 flex-shrink-0">
                        <Image src={formData.image} alt="Preview" fill className="object-cover" />
                      </div>
                    )}
                    <div className="flex-1 space-y-2">
                      <label className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition cursor-pointer border border-slate-300">
                        <FontAwesomeIcon icon={uploadingImage ? faSpinner : faUpload} className={uploadingImage ? "animate-spin" : ""} />
                        <span>{uploadingImage ? "Mengunggah..." : "Pilih File Gambar..."}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={uploadingImage}
                          className="hidden"
                        />
                      </label>
                      <input
                        type="text"
                        placeholder="Atau masukkan URL Gambar..."
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700"
                      />
                    </div>
                  </div>
                </div>

                {/* Deskripsi Singkat */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                    Deskripsi Ringkas (Tampil di Card)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Deskripsi singkat proyek..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Deskripsi Lengkap Modal */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                    Deskripsi Lengkap (Tampil di Pop-up Modal Detail)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Latar belakang dan detail studi kasus lengkap..."
                    value={formData.fullDescription}
                    onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Label Metric */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                    Label Metric (Opsional)
                  </label>
                  <input
                    type="text"
                    placeholder="misal: Pertumbuhan Revenue YoY"
                    value={formData.metricLabel || ""}
                    onChange={(e) => setFormData({ ...formData, metricLabel: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Dynamic Array Inputs: Outcomes */}
              <div className="space-y-3 pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                    Outcomes / Hasil Utama Bisnis
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAddArrayItem("outcomes")}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-blue-600/30 bg-blue-50/50 hover:bg-blue-600 hover:text-white text-blue-700 text-xs font-bold transition cursor-pointer"
                  >
                    <FontAwesomeIcon icon={faPlus} className="w-3 h-3" />
                    <span>Tambah Outcome</span>
                  </button>
                </div>
                {(formData.outcomes || [""]).map((outcome, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder={`Outcome ${idx + 1}`}
                      value={outcome}
                      onChange={(e) => handleArrayChange("outcomes", idx, e.target.value)}
                      className="flex-1 px-4 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveArrayItem("outcomes", idx)}
                      aria-label="Hapus outcome"
                      title="Hapus outcome"
                      className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                    >
                      <FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Dynamic Array Inputs: Deliverables */}
              <div className="space-y-3 pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                    Deliverables & Output Strategis
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAddArrayItem("deliverables")}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-blue-600/30 bg-blue-50/50 hover:bg-blue-600 hover:text-white text-blue-700 text-xs font-bold transition cursor-pointer"
                  >
                    <FontAwesomeIcon icon={faPlus} className="w-3 h-3" />
                    <span>Tambah Deliverable</span>
                  </button>
                </div>
                {(formData.deliverables || [""]).map((deliv, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder={`Deliverable ${idx + 1}`}
                      value={deliv}
                      onChange={(e) => handleArrayChange("deliverables", idx, e.target.value)}
                      className="flex-1 px-4 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveArrayItem("deliverables", idx)}
                      aria-label="Hapus deliverable"
                      title="Hapus deliverable"
                      className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                    >
                      <FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Form Buttons */}
              <div className="pt-6 border-t border-slate-200 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving || uploadingImage}
                  className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-md shadow-blue-600/20 disabled:opacity-60 cursor-pointer"
                >
                  {saving && <FontAwesomeIcon icon={faSpinner} className="w-3.5 h-3.5 animate-spin" />}
                  <span>{saving ? "Menyimpan..." : "Simpan Portofolio"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Dialog Konfirmasi Hapus */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center space-y-4 border border-slate-200 shadow-2xl">
            <FontAwesomeIcon icon={faExclamationTriangle} className="w-12 h-12 text-rose-500 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">Konfirmasi Hapus</h3>
            <p className="text-xs text-slate-600">
              Apakah Anda yakin ingin menghapus studi kasus portofolio ini secara permanen dari Firestore?
            </p>
            <div className="flex justify-center space-x-3 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition shadow-md shadow-rose-600/20 disabled:opacity-60 cursor-pointer flex items-center space-x-1.5"
              >
                {isDeleting && <FontAwesomeIcon icon={faSpinner} className="w-3 h-3 animate-spin" />}
                <span>{isDeleting ? "Menghapus..." : "Ya, Hapus"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
