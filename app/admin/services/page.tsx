"use client";

import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faSearch,
  faEdit,
  faTrash,
  faTimes,
  faSpinner,
  faCheckCircle,
  faExclamationTriangle,
  faGears,
  faChartLine,
  faCoins,
  faUserGroup,
  faLightbulb,
  faCheck,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import { uploadToCloudinary, deleteFromCloudinary } from "@/lib/cloudinaryClient";
import { slugify } from "@/lib/utils/slugify";
import Pagination from "@/app/admin/components/Pagination";

const ITEMS_PER_PAGE = 3;
import {
  getServices,
  createService,
  updateService,
  deleteService,
  ServiceInputData,
} from "@/lib/services/servicesService";
import { ServiceItem } from "@/app/components/ServicesSection";

const ICON_OPTIONS = [
  { label: "faChartLine (Grafik Tren)", key: "faChartLine", icon: faChartLine },
  { label: "faCoins (Koin/Keuangan)", key: "faCoins", icon: faCoins },
  { label: "faGears (Roda Gigi/Sistem)", key: "faGears", icon: faGears },
  { label: "faUserGroup (Tim/SDM)", key: "faUserGroup", icon: faUserGroup },
  { label: "faLightbulb (Bohlam/Ide)", key: "faLightbulb", icon: faLightbulb },
];

const COLOR_SCHEME_PRESETS = [
  {
    label: "Blue Theme (Strategi Utama)",
    value: "blue",
    scheme: {
      iconBg: "bg-blue-50 group-hover:bg-blue-600",
      iconColor: "text-blue-600 group-hover:text-white",
      borderHover: "hover:border-blue-500/50 hover:shadow-blue-500/10",
      badgeBg: "bg-blue-50 text-blue-700 border-blue-200",
      badgeText: "text-blue-700",
      bulletColor: "text-blue-600 bg-blue-100",
      glowBg: "from-blue-500/10 to-indigo-500/5",
    },
  },
  {
    label: "Emerald Theme (Keuangan)",
    value: "emerald",
    scheme: {
      iconBg: "bg-emerald-50 group-hover:bg-emerald-600",
      iconColor: "text-emerald-600 group-hover:text-white",
      borderHover: "hover:border-emerald-500/50 hover:shadow-emerald-500/10",
      badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
      badgeText: "text-emerald-700",
      bulletColor: "text-emerald-600 bg-emerald-100",
      glowBg: "from-emerald-500/10 to-teal-500/5",
    },
  },
  {
    label: "Amber Theme (Sistem & Operasional)",
    value: "amber",
    scheme: {
      iconBg: "bg-amber-50 group-hover:bg-amber-600",
      iconColor: "text-amber-600 group-hover:text-white",
      borderHover: "hover:border-amber-500/50 hover:shadow-amber-500/10",
      badgeBg: "bg-amber-50 text-amber-800 border-amber-200",
      badgeText: "text-amber-800",
      bulletColor: "text-amber-600 bg-amber-100",
      glowBg: "from-amber-500/10 to-orange-500/5",
    },
  },
  {
    label: "Purple Theme (SDM & Budaya)",
    value: "purple",
    scheme: {
      iconBg: "bg-purple-50 group-hover:bg-purple-600",
      iconColor: "text-purple-600 group-hover:text-white",
      borderHover: "hover:border-purple-500/50 hover:shadow-purple-500/10",
      badgeBg: "bg-purple-50 text-purple-700 border-purple-200",
      badgeText: "text-purple-700",
      bulletColor: "text-purple-600 bg-purple-100",
      glowBg: "from-purple-500/10 to-pink-500/5",
    },
  },
];

const emptyFormState: ServiceInputData & { id?: string } = {
  title: "",
  subtitle: "",
  description: "",
  badgeText: "Layanan Utama",
  iconName: "faChartLine",
  slug: "",
  folder: "growthline/services",
  features: [""],
  colorScheme: COLOR_SCHEME_PRESETS[0].scheme,
};

export default function AdminServicesPage() {
  const [services, setServices] = useState<(ServiceItem & { iconName?: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ServiceItem | null>(null);
  const [formData, setFormData] = useState<ServiceInputData & { id?: string }>(emptyFormState);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Delete State
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
      const data = await getServices();
      setServices(data as any);
    } catch (err) {
      console.error("Gagal memuat layanan:", err);
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
      order: services.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: ServiceItem & { iconName?: string }) => {
    setEditingItem(item);
    setFormData({
      id: item.id,
      title: item.title || "",
      subtitle: item.subtitle || "",
      description: item.description || "",
      badgeText: item.badgeText || "Layanan",
      iconName: item.iconName || "faChartLine",
      image: item.image || "",
      imagePublicId: item.imagePublicId || "",
      features: item.features && item.features.length > 0 ? item.features : [""],
      colorScheme: item.colorScheme || COLOR_SCHEME_PRESETS[0].scheme,
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
      const targetPublicId = `growthline/services/${customSlug}`;
      if (formData.imagePublicId && formData.imagePublicId !== targetPublicId) {
        await deleteFromCloudinary(formData.imagePublicId);
      }

      const res = await uploadToCloudinary(file, "growthline/services", customSlug);

      setFormData((prev) => ({
        ...prev,
        image: res.url,
        imagePublicId: res.public_id,
        slug: res.slug || customSlug,
        folder: "growthline/services",
      }));
      showToast(`Gambar layanan berhasil diunggah ke ${res.public_id}!`);
    } catch (err: any) {
      console.error("Upload error:", err);
      showToast(err.message || "Gagal mengunggah gambar", "error");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.subtitle || !formData.description) {
      showToast("Harap isi Judul, Subtitle, dan Deskripsi Layanan!", "error");
      return;
    }

    try {
      setSaving(true);
      const serviceSlug = formData.slug || slugify(formData.title);
      const cleanedData = {
        ...formData,
        slug: serviceSlug,
        folder: "growthline/services",
        features: (formData.features || []).filter((f) => f.trim() !== ""),
      };

      if (editingItem) {
        await updateService(editingItem.id, cleanedData);
        showToast("Layanan berhasil diperbarui!");
      } else {
        await createService(cleanedData);
        showToast("Layanan baru berhasil ditambahkan!");
      }

      setIsModalOpen(false);
      loadData();
    } catch (err) {
      console.error("Save error:", err);
      showToast("Gagal menyimpan layanan", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      setIsDeleting(true);
      const itemToDelete = services.find((s) => s.id === deletingId);
      if (itemToDelete?.imagePublicId) {
        await deleteFromCloudinary(itemToDelete.imagePublicId);
      }

      await deleteService(deletingId);
      showToast("Layanan berhasil dihapus!");
      setDeletingId(null);

      const remainingCount = services.filter((s) => s.id !== deletingId).length;
      const newTotalPages = Math.ceil(remainingCount / ITEMS_PER_PAGE) || 1;
      if (currentPage > newTotalPages) {
        setCurrentPage(newTotalPages);
      }

      loadData();
    } catch (err) {
      console.error("Delete error:", err);
      showToast("Gagal menghapus layanan", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  // Feature Array Handlers
  const handleFeatureChange = (index: number, value: string) => {
    const updated = [...(formData.features || [])];
    updated[index] = value;
    setFormData({ ...formData, features: updated });
  };

  const handleAddFeature = () => {
    setFormData({ ...formData, features: [...(formData.features || []), ""] });
  };

  const handleRemoveFeature = (index: number) => {
    const updated = (formData.features || []).filter((_, i) => i !== index);
    setFormData({ ...formData, features: updated.length > 0 ? updated : [""] });
  };

  const filteredServices = services.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredServices.length / ITEMS_PER_PAGE) || 1;
  const paginatedServices = filteredServices.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-6">
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center space-x-2">
            <FontAwesomeIcon icon={faGears} className="w-6 h-6 text-emerald-600" />
            <span>Manajemen Layanan</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Kelola daftar layanan utama, deskripsi, fitur pendukung, dan skema warna di website.
          </p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
        >
          <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
          <span>Tambah Layanan</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <FontAwesomeIcon
          icon={faSearch}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4"
        />
        <input
          type="text"
          placeholder="Cari layanan berdasarkan judul atau subtitle..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
        />
      </div>

      {/* Data Cards / Grid */}
      {loading ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
          <FontAwesomeIcon icon={faSpinner} className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
          <p className="text-sm font-medium text-slate-600">Memuat layanan dari Firestore...</p>
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
          <FontAwesomeIcon icon={faGears} className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-base font-bold text-slate-700">Belum ada layanan</p>
          <p className="text-xs text-slate-500">Tidak ada data layanan yang cocok.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedServices.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between relative overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl ${service.colorScheme?.iconBg || "bg-blue-50"} flex items-center justify-center`}>
                      <FontAwesomeIcon icon={service.icon} className={`w-6 h-6 ${service.colorScheme?.iconColor || "text-blue-600"}`} />
                    </div>
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-md border ${service.colorScheme?.badgeBg || "bg-blue-50 text-blue-700 border-blue-200"}`}>
                      {service.badgeText}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-lg text-slate-900">{service.title}</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">{service.subtitle}</p>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-3">{service.description}</p>

                  <div className="border-t border-slate-100 pt-3 mb-4">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Features ({service.features?.length || 0})</p>
                    <ul className="space-y-1.5">
                      {(service.features || []).slice(0, 3).map((feat, idx) => (
                        <li key={idx} className="text-xs text-slate-700 flex items-center space-x-2">
                          <FontAwesomeIcon icon={faCheck} className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                          <span className="truncate">{feat}</span>
                        </li>
                      ))}
                      {(service.features || []).length > 3 && (
                        <li className="text-[11px] text-slate-400 italic">+{(service.features || []).length - 3} fitur lainnya</li>
                      )}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end space-x-2">
                  <button
                    onClick={() => handleOpenEditModal(service)}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-emerald-600 hover:text-white text-xs font-bold transition cursor-pointer"
                  >
                    <FontAwesomeIcon icon={faEdit} className="w-3.5 h-3.5 mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => setDeletingId(service.id)}
                    className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white text-xs font-bold transition cursor-pointer"
                  >
                    <FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5 mr-1" />
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredServices.length}
            itemsPerPage={ITEMS_PER_PAGE}
            itemLabel="layanan"
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}

      {/* Modal Form Create / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 my-8 overflow-hidden">
            <div className="px-6 py-5 bg-slate-900 text-white flex items-center justify-between">
              <h2 className="text-lg font-bold">{editingItem ? "Edit Layanan" : "Tambah Layanan Baru"}</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition cursor-pointer"
              >
                <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 sm:p-8 space-y-5 max-h-[75vh] overflow-y-auto">
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700">Judul Layanan *</label>
                <input
                  type="text"
                  required
                  placeholder="misal: Business Strategy"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700">Subtitle Layanan *</label>
                <input
                  type="text"
                  required
                  placeholder="misal: Perencanaan & Penetrasian Pasar"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700">Teks Badge *</label>
                  <input
                    type="text"
                    required
                    placeholder="misal: Strategi Utama"
                    value={formData.badgeText}
                    onChange={(e) => setFormData({ ...formData, badgeText: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700">Ikon FontAwesome *</label>
                  <select
                    value={formData.iconName}
                    onChange={(e) => setFormData({ ...formData, iconName: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    {ICON_OPTIONS.map((opt) => (
                      <option key={opt.key} value={opt.key}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700">Gambar Layanan (Opsional - growthline/services)</label>
                <div className="flex items-center space-x-3">
                  <label className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl border border-slate-300 transition cursor-pointer flex items-center space-x-2">
                    <FontAwesomeIcon icon={uploadingImage ? faSpinner : faUpload} className={uploadingImage ? "animate-spin" : ""} />
                    <span>{uploadingImage ? "Mengunggah..." : "Unggah Gambar..."}</span>
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
                    placeholder="URL gambar..."
                    value={formData.image || ""}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="flex-1 px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                {formData.image && (
                  <div className="mt-2 relative w-24 h-24 rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700">Skema Warna Tema</label>
                <select
                  onChange={(e) => {
                    const preset = COLOR_SCHEME_PRESETS.find((p) => p.value === e.target.value);
                    if (preset) {
                      setFormData({ ...formData, colorScheme: preset.scheme });
                    }
                  }}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  {COLOR_SCHEME_PRESETS.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700">Deskripsi Layanan *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Deskripsi penjelasan layanan..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Features Dynamic Input */}
              <div className="space-y-3 pt-3 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700">Cakupan Fitur Layanan</label>
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="text-xs text-emerald-600 font-bold hover:underline cursor-pointer"
                  >
                    + Tambah Fitur
                  </button>
                </div>
                {(formData.features || [""]).map((feat, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder={`Fitur ${idx + 1}`}
                      value={feat}
                      onChange={(e) => handleFeatureChange(idx, e.target.value)}
                      className="flex-1 px-4 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(idx)}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
                    >
                      <FontAwesomeIcon icon={faTimes} className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="pt-5 border-t border-slate-200 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-md shadow-emerald-600/20 disabled:opacity-60 cursor-pointer"
                >
                  {saving && <FontAwesomeIcon icon={faSpinner} className="w-3.5 h-3.5 animate-spin" />}
                  <span>{saving ? "Menyimpan..." : "Simpan Layanan"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center space-y-4 border border-slate-200 shadow-2xl">
            <FontAwesomeIcon icon={faExclamationTriangle} className="w-12 h-12 text-rose-500 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">Konfirmasi Hapus</h3>
            <p className="text-xs text-slate-600">Apakah Anda yakin ingin menghapus layanan ini dari Firestore?</p>
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
