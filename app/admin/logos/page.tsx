"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { CldImage } from "next-cloudinary";
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
  faBuilding,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import {
  getClientLogos,
  createClientLogo,
  updateClientLogo,
  deleteClientLogo,
  ClientLogoInput,
} from "@/lib/services/logoService";
import { ClientLogo } from "@/app/components/ClientMarquee";
import { uploadToCloudinary, deleteFromCloudinary } from "@/lib/cloudinaryClient";
import { slugify } from "@/lib/utils/slugify";
import Pagination from "@/app/admin/components/Pagination";

const ITEMS_PER_PAGE = 4;

const emptyFormState: ClientLogoInput & { id?: string } = {
  name: "",
  alt: "",
  src: "",
  publicId: "",
  slug: "",
  folder: "growthline/logos",
  width: 170,
  height: 60,
  cloudinary: true,
  active: true,
};

export default function AdminLogosPage() {
  const [logos, setLogos] = useState<ClientLogo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ClientLogo | null>(null);
  const [formData, setFormData] = useState<ClientLogoInput & { id?: string }>(emptyFormState);
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
      const data = await getClientLogos();
      setLogos(data);
    } catch (err) {
      console.error("Gagal memuat logo klien:", err);
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
      order: logos.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: ClientLogo) => {
    setEditingItem(item);
    setFormData({
      id: item.id,
      name: item.name || "",
      alt: item.alt || "",
      src: item.src || "",
      publicId: item.publicId || "",
      width: item.width || 170,
      height: item.height || 60,
      cloudinary: item.cloudinary !== undefined ? item.cloudinary : true,
      active: item.active !== undefined ? item.active : true,
      order: item.order || 1,
    });
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const customSlug = slugify(formData.name || file.name.split(".")[0]);

      // Delete previous Cloudinary image if publicId changed
      const targetPublicId = `growthline/logos/${customSlug}`;
      if (formData.publicId && formData.publicId !== targetPublicId) {
        await deleteFromCloudinary(formData.publicId);
      }

      const res = await uploadToCloudinary(file, "growthline/logos", customSlug);

      setFormData((prev) => ({
        ...prev,
        src: res.url,
        publicId: res.public_id,
        slug: res.slug || customSlug,
        folder: "growthline/logos",
        cloudinary: false,
      }));
      showToast(`Logo berhasil diunggah ke ${res.public_id}!`);
    } catch (err: any) {
      console.error("Upload error:", err);
      showToast(err.message || "Gagal mengunggah logo", "error");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.src) {
      showToast("Harap isi Nama Klien dan Logo Gambar!", "error");
      return;
    }

    try {
      setSaving(true);
      const logoSlug = formData.slug || slugify(formData.name);
      const payload = {
        ...formData,
        slug: logoSlug,
        folder: "growthline/logos",
        alt: formData.alt || `${formData.name} Logo`,
      };

      if (editingItem) {
        await updateClientLogo(editingItem.id, payload);
        showToast("Logo klien berhasil diperbarui!");
      } else {
        await createClientLogo(payload);
        showToast("Logo klien baru berhasil ditambahkan!");
      }

      setIsModalOpen(false);
      loadData();
    } catch (err) {
      console.error("Save error:", err);
      showToast("Gagal menyimpan logo klien", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (item: ClientLogo) => {
    try {
      const newStatus = !item.active;
      await updateClientLogo(item.id, { active: newStatus });
      showToast(`Logo ${item.name} ${newStatus ? "diaktifkan" : "dinonaktifkan"}`);
      loadData();
    } catch (err) {
      console.error("Toggle active error:", err);
      showToast("Gagal mengubah status logo", "error");
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      setIsDeleting(true);
      const itemToDelete = logos.find((l) => l.id === deletingId);
      if (itemToDelete?.publicId) {
        await deleteFromCloudinary(itemToDelete.publicId);
      }

      await deleteClientLogo(deletingId);
      showToast("Logo klien berhasil dihapus!");
      setDeletingId(null);

      const remainingCount = logos.filter((l) => l.id !== deletingId).length;
      const newTotalPages = Math.ceil(remainingCount / ITEMS_PER_PAGE) || 1;
      if (currentPage > newTotalPages) {
        setCurrentPage(newTotalPages);
      }

      loadData();
    } catch (err) {
      console.error("Delete error:", err);
      showToast("Gagal menghapus logo klien", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredLogos = logos.filter(
    (l) =>
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.alt && l.alt.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredLogos.length / ITEMS_PER_PAGE) || 1;
  const paginatedLogos = filteredLogos.slice(
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
            <FontAwesomeIcon icon={faBuilding} className="w-6 h-6 text-purple-600" />
            <span>Manajemen Logo Klien</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Kelola logo perusahaan mitra & klien yang tampil pada running marquee website.
          </p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs sm:text-sm font-bold transition-all shadow-md shadow-purple-600/20 cursor-pointer"
        >
          <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
          <span>Tambah Logo Klien</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <FontAwesomeIcon
          icon={faSearch}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4"
        />
        <input
          type="text"
          placeholder="Cari berdasarkan nama perusahaan..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition"
        />
      </div>

      {/* Data Cards Grid */}
      {loading ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
          <FontAwesomeIcon icon={faSpinner} className="w-8 h-8 text-purple-600 animate-spin mx-auto" />
          <p className="text-sm font-medium text-slate-600">Memuat logo klien dari Firestore...</p>
        </div>
      ) : filteredLogos.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
          <FontAwesomeIcon icon={faBuilding} className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-base font-bold text-slate-700">Belum ada logo klien</p>
          <p className="text-xs text-slate-500">Tidak ada data logo yang cocok.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {paginatedLogos.map((logo) => (
              <div
                key={logo.id}
                className={`bg-white rounded-2xl border ${
                  logo.active !== false ? "border-slate-200" : "border-slate-200/50 opacity-60"
                } p-5 shadow-sm flex flex-col justify-between space-y-4`}
              >
                <div>
                  <div className="relative w-full h-24 rounded-xl bg-slate-50 border border-slate-100 p-4 flex items-center justify-center overflow-hidden mb-3">
                    {logo.cloudinary ? (
                      <CldImage
                        src={logo.src}
                        alt={logo.alt || logo.name}
                        width={logo.width || 170}
                        height={logo.height || 60}
                        className="max-h-16 w-auto object-contain"
                      />
                    ) : (
                      <Image
                        src={logo.src}
                        alt={logo.alt || logo.name}
                        width={logo.width || 170}
                        height={logo.height || 60}
                        className="max-h-16 w-auto object-contain"
                      />
                    )}
                  </div>
                  <h3 className="font-extrabold text-sm text-slate-900 truncate">{logo.name}</h3>
                  <p className="text-[11px] text-slate-400 truncate">{logo.alt}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => handleToggleActive(logo)}
                    className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      logo.active !== false
                        ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                    }`}
                  >
                    <FontAwesomeIcon icon={logo.active !== false ? faEye : faEyeSlash} className="w-3 h-3" />
                    <span>{logo.active !== false ? "Aktif" : "Non-aktif"}</span>
                  </button>

                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => handleOpenEditModal(logo)}
                      className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-purple-600 hover:text-white transition cursor-pointer"
                    >
                      <FontAwesomeIcon icon={faEdit} className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeletingId(logo.id)}
                      className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition cursor-pointer"
                    >
                      <FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredLogos.length}
            itemsPerPage={ITEMS_PER_PAGE}
            itemLabel="logo klien"
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 my-8 overflow-hidden">
            <div className="px-6 py-5 bg-slate-900 text-white flex items-center justify-between">
              <h2 className="text-lg font-bold">{editingItem ? "Edit Logo Klien" : "Tambah Logo Klien Baru"}</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition cursor-pointer"
              >
                <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700">Nama Perusahaan / Klien *</label>
                <input
                  type="text"
                  required
                  placeholder="misal: Telkom Indonesia"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700">Teks Alt Gambar</label>
                <input
                  type="text"
                  placeholder="misal: Telkom Indonesia Logo"
                  value={formData.alt}
                  onChange={(e) => setFormData({ ...formData, alt: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700">File Logo (Cloudinary) *</label>
                <div className="flex items-center space-x-3">
                  {formData.src && (
                    <div className="relative w-16 h-12 rounded-lg bg-slate-100 border border-slate-300 overflow-hidden flex items-center justify-center p-1">
                      <img src={formData.src} alt="Preview" className="max-h-10 w-auto object-contain" />
                    </div>
                  )}
                  <label className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition cursor-pointer border border-slate-300">
                    <FontAwesomeIcon icon={uploadingImage ? faSpinner : faUpload} className={uploadingImage ? "animate-spin" : ""} />
                    <span>{uploadingImage ? "Mengunggah..." : "Pilih Logo..."}</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} className="hidden" />
                  </label>
                </div>
                <input
                  type="text"
                  placeholder="Atau masukkan URL / Public ID Cloudinary..."
                  value={formData.src}
                  onChange={(e) => setFormData({ ...formData, src: e.target.value })}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 mt-2"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end space-x-3">
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
                  className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition shadow-md shadow-purple-600/20 disabled:opacity-60 cursor-pointer"
                >
                  {saving && <FontAwesomeIcon icon={faSpinner} className="w-3.5 h-3.5 animate-spin" />}
                  <span>{saving ? "Menyimpan..." : "Simpan Logo"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center space-y-4 border border-slate-200 shadow-2xl">
            <FontAwesomeIcon icon={faExclamationTriangle} className="w-12 h-12 text-rose-500 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">Konfirmasi Hapus</h3>
            <p className="text-xs text-slate-600">Apakah Anda yakin ingin menghapus logo klien ini dari Firestore?</p>
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
