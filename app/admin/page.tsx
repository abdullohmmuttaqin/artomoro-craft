'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Produk, Kategori } from '@/types';
import { MAX_ADMIN_IMAGE_BYTES, validateImageDataUrl } from '@/lib/admin-product-validation';
import { 
  Plus, Trash2, Package, Layers, Sparkles, RefreshCw, 
  AlertCircle, X, CheckCircle2, ShieldCheck, ArrowLeft,
  Tag, Banknote, Hash, UploadCloud, FileText, Flower2, Image as ImageIcon
} from 'lucide-react';

const ADMIN_KEY_HEADER = 'x-admin-key';
const ADMIN_KEY_STORAGE = 'admin_dashboard_key';

const getStoredAdminKey = () => {
  if (typeof window === 'undefined') return '';
  return window.sessionStorage.getItem(ADMIN_KEY_STORAGE) || '';
};

const getProductName = (item: Produk) => (item.nama ?? item.nama_produk ?? 'Buket Unnamed').trim();
const getCategoryName = (cat: Kategori) => (cat.nama ?? cat.nama_kategori ?? `Kategori #${cat.id}`).trim();

interface ProductInsertPayload {
  nama: string;
  harga: number;
  stok: number;
  deskripsi: string | null;
  gambar_url: string | null;
  kategori_id?: number;
}

const getErrorMessage = (err: unknown, fallback: string) => {
  if (err instanceof Error) return err.message;
  if (typeof err === 'object' && err !== null) {
    const maybeMessage = (err as { message?: unknown }).message;
    if (typeof maybeMessage === 'string' && maybeMessage.trim()) return maybeMessage;

    const maybeDetails = (err as { details?: unknown }).details;
    if (typeof maybeDetails === 'string' && maybeDetails.trim()) return maybeDetails;
  }

  return fallback;
};

export default function AdminPage() {
  const [produkList, setProdukList] = useState<Produk[]>([]);
  const [kategoriList, setKategoriList] = useState<Kategori[]>([]);
  const [adminKeyInput, setAdminKeyInput] = useState<string>(() => getStoredAdminKey());
  const [adminKey, setAdminKey] = useState<string>(() => getStoredAdminKey());
  const [loading, setLoading] = useState<boolean>(() => Boolean(getStoredAdminKey()));
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Form State
  const [formData, setFormData] = useState({
    nama: '',
    harga: '',
    stok: '',
    deskripsi: '',
    gambar_url: '',
    kategori_id: '',
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const callAdminApi = useCallback(async <T,>(path: string, options?: RequestInit): Promise<T> => {
    if (!adminKey) {
      throw new Error('Masukkan kunci admin terlebih dahulu.');
    }

    const response = await fetch(path, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        [ADMIN_KEY_HEADER]: adminKey,
        ...(options?.headers ?? {}),
      },
    });

    const data = (await response.json()) as { message?: string } & T;
    if (!response.ok) {
      throw new Error(data.message || 'Permintaan admin gagal diproses.');
    }

    return data;
  }, [adminKey]);

  // Fetch Data Admin melalui API Server
  const fetchData = useCallback(async () => {
    if (!adminKey) {
      setLoading(false);
      setProdukList([]);
      setKategoriList([]);
      return;
    }

    try {
      setLoading(true);
      setErrorMsg(null);

      const data = await callAdminApi<{ kategori: Kategori[]; produk: Produk[] }>('/api/admin/bootstrap');
      setKategoriList(data.kategori || []);
      setProdukList(data.produk || []);

    } catch (err: unknown) {
      console.error('Error loading admin data:', err);
      const msg = getErrorMessage(err, 'Gagal memuat data admin dari server.');
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  }, [adminKey, callAdminApi]);

  useEffect(() => {
    queueMicrotask(() => {
      void fetchData();
    });
  }, [fetchData]);

  const handleAdminUnlock = () => {
    const trimmed = adminKeyInput.trim();
    if (!trimmed) {
      setErrorMsg('Kunci admin wajib diisi untuk membuka dashboard.');
      return;
    }

    window.sessionStorage.setItem(ADMIN_KEY_STORAGE, trimmed);
    setErrorMsg(null);
    setAdminKey(trimmed);
  };

  const handleAdminLock = () => {
    window.sessionStorage.removeItem(ADMIN_KEY_STORAGE);
    setAdminKey('');
    setAdminKeyInput('');
    setProdukList([]);
    setKategoriList([]);
    setIsModalOpen(false);
    setSuccessMsg('Sesi admin dikunci kembali.');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handler Upload File Gambar Langsung dari Komputer/HP
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setErrorMsg('Format gambar tidak didukung. Gunakan JPG, PNG, atau WEBP.');
        e.target.value = '';
        return;
      }

      if (file.size > MAX_ADMIN_IMAGE_BYTES) {
        setErrorMsg('Ukuran gambar maksimal 2MB.');
        e.target.value = '';
        return;
      }

      // Baca file foto menjadi Data URL (Base64)
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const imageValidationError = validateImageDataUrl(result);
        if (imageValidationError) {
          setErrorMsg(imageValidationError);
          return;
        }

        setErrorMsg(null);
        setPreviewImage(result);
        setFormData((prev) => ({
          ...prev,
          gambar_url: result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit Form Tambah Produk
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const productName = formData.nama.trim();

    if (!productName || !formData.harga || !formData.stok) {
      setErrorMsg('Nama buket, harga, dan stok wajib diisi!');
      return;
    }

    if (!adminKey) {
      setErrorMsg('Masukkan kunci admin terlebih dahulu.');
      return;
    }

    try {
      setSubmitting(true);

      const payload: ProductInsertPayload = {
        nama: productName,
        harga: parseFloat(formData.harga),
        stok: parseInt(formData.stok, 10),
        deskripsi: formData.deskripsi || null,
        gambar_url: formData.gambar_url || null,
      };

      if (formData.kategori_id) {
        payload.kategori_id = parseInt(formData.kategori_id, 10);
      }

      await callAdminApi<{ message: string }>('/api/admin/products', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      setSuccessMsg(`Berhasil menambahkan buket "${productName}"!`);
      setFormData({
        nama: '',
        harga: '',
        stok: '',
        deskripsi: '',
        gambar_url: '',
        kategori_id: '',
      });
      setPreviewImage(null);
      setIsModalOpen(false);
      void fetchData();

    } catch (err: unknown) {
      console.error('Error adding product:', err);
      const msg = getErrorMessage(err, 'Gagal menyimpan produk baru.');
      setErrorMsg(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // Hapus Produk
  const handleDelete = async (id: number, itemNama: string) => {
    if (!confirm(`Apakah kamu yakin ingin menghapus buket "${itemNama}"?`)) return;

    if (!adminKey) {
      setErrorMsg('Masukkan kunci admin terlebih dahulu.');
      return;
    }

    try {
      setErrorMsg(null);
      await callAdminApi<{ message: string }>(`/api/admin/products/${id}`, {
        method: 'DELETE',
      });

      setSuccessMsg(`Berhasil menghapus buket "${itemNama}".`);
      void fetchData();

    } catch (err: unknown) {
      console.error('Error deleting product:', err);
      const msg = err instanceof Error ? err.message : 'Gagal menghapus produk.';
      setErrorMsg(msg);
    }
  };

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(angka);
  };

  return (
    <div className="min-h-screen bg-[#FBFBFB] text-[#1E1033]">
      
      {/* Header Admin Bar */}
      <header className="sticky top-0 z-40 bg-[#1E1033] text-white border-b-2 border-[#FF4696] shadow-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#FF4696] flex items-center justify-center text-white shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-heading-serif font-bold tracking-wider text-base uppercase block leading-none">
                Artomoro<span className="text-[#FF4696]">Craft</span> Admin
              </span>
              <span className="text-[10px] text-pink-200 tracking-widest uppercase">Management Portal</span>
            </div>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors border border-white/10"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Ke Web Customer</span>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto py-8 sm:py-10 px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Title & Top Action Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-pink-100 shadow-sm">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-50 border border-pink-200 text-[#FF4696] text-xs font-bold tracking-wide mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Control Panel</span>
            </div>
            <h1 className="font-heading-serif text-2xl sm:text-4xl font-bold uppercase tracking-wide text-[#1E1033]">
              Manajemen <span className="font-brand-script text-3xl sm:text-5xl text-[#FF4696] normal-case">Katalog Buket</span>
            </h1>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                void fetchData();
              }}
              disabled={!adminKey}
              className="p-3 rounded-xl bg-white border-2 border-pink-100 text-gray-700 hover:border-[#FF4696] hover:text-[#FF4696] transition-all shadow-sm"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={() => {
                setFormData({ nama: '', harga: '', stok: '', deskripsi: '', gambar_url: '', kategori_id: '' });
                setPreviewImage(null);
                setIsModalOpen(true);
              }}
              disabled={!adminKey}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#FF4696] text-white text-xs font-bold tracking-wide uppercase hover:bg-[#e03a83] active:scale-95 transition-all shadow-md shadow-pink-200"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Buket Baru</span>
            </button>

            {adminKey && (
              <button
                onClick={handleAdminLock}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-700 text-xs font-bold tracking-wide uppercase hover:border-red-200 hover:text-red-600 transition-all"
              >
                Kunci
              </button>
            )}
          </div>
        </div>

        {!adminKey && (
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border-2 border-amber-200 text-amber-900 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-end gap-3">
              <div className="flex-1">
                <p className="text-xs font-bold uppercase tracking-wide">Akses Admin Terkunci</p>
                <p className="text-xs mt-1">Masukkan kunci admin untuk memuat data dan mengaktifkan operasi CRUD.</p>
                <input
                  type="password"
                  value={adminKeyInput}
                  onChange={(e) => setAdminKeyInput(e.target.value)}
                  placeholder="Masukkan ADMIN_DASHBOARD_KEY"
                  className="mt-3 w-full px-4 py-3 rounded-xl border-2 border-amber-300 bg-white text-sm focus:outline-none focus:border-amber-500"
                />
              </div>
              <button
                onClick={handleAdminUnlock}
                className="px-5 py-3 rounded-xl bg-amber-500 text-white text-xs font-bold tracking-wide uppercase hover:bg-amber-600 transition-all"
              >
                Buka Dashboard
              </button>
            </div>
          </div>
        )}

        {/* Alerts */}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-red-50 border-2 border-red-200 text-red-700 flex items-center gap-3 text-xs font-semibold shadow-sm animate-in fade-in">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            <span className="flex-1">{errorMsg}</span>
            <button onClick={() => setErrorMsg(null)}><X className="w-4 h-4 text-red-400 hover:text-red-600" /></button>
          </div>
        )}

        {successMsg && (
          <div className="p-4 rounded-xl bg-emerald-50 border-2 border-emerald-200 text-emerald-800 flex items-center gap-3 text-xs font-semibold shadow-sm animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="flex-1">{successMsg}</span>
            <button onClick={() => setSuccessMsg(null)}><X className="w-4 h-4 text-emerald-400 hover:text-emerald-600" /></button>
          </div>
        )}

        {/* Overview Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border-2 border-pink-100 shadow-sm flex items-center gap-4 hover:border-pink-300 transition-all">
            <div className="w-12 h-12 rounded-xl bg-pink-50 border border-pink-200 text-[#FF4696] flex items-center justify-center shadow-inner">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Produk Buket</p>
              <p className="text-2xl font-extrabold text-[#1E1033]">{produkList.length} Item</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border-2 border-pink-100 shadow-sm flex items-center gap-4 hover:border-pink-300 transition-all">
            <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center shadow-inner">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Kategori</p>
              <p className="text-2xl font-extrabold text-[#1E1033]">{kategoriList.length} Kategori</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border-2 border-pink-100 shadow-sm flex items-center gap-4 sm:col-span-2 lg:col-span-1 hover:border-pink-300 transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shadow-inner">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Koneksi Database</p>
              {adminKey ? (
                <p className="text-xs font-bold text-emerald-600 mt-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  API Guard Active
                </p>
              ) : (
                <p className="text-xs font-bold text-amber-600 mt-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Locked
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Product Table Container */}
        <div className="bg-white rounded-2xl border-2 border-pink-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-pink-50/80 via-white to-pink-50/30 border-b-2 border-pink-100 flex items-center justify-between">
            <h2 className="font-heading-serif text-lg font-bold uppercase tracking-wide text-[#1E1033] flex items-center gap-2">
              <Flower2 className="w-5 h-5 text-[#FF4696]" />
              <span>Daftar Buket Tersedia</span>
            </h2>
            <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-white border border-pink-200 text-[#FF4696] shadow-sm">
              {produkList.length} Items Listed
            </span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-gray-400 text-xs space-y-2">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#FF4696]" />
              <p className="font-semibold text-gray-600">Sinkronisasi data Supabase...</p>
            </div>
          ) : produkList.length === 0 ? (
            <div className="p-12 text-center text-gray-400 text-xs space-y-3">
              <Package className="w-10 h-10 mx-auto text-pink-300" />
              <p className="font-semibold text-gray-600">Belum ada data produk di Supabase.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#1E1033] text-white uppercase tracking-wider font-bold">
                    <th className="py-4 px-5">Gambar & Nama Buket</th>
                    <th className="py-4 px-5">Harga</th>
                    <th className="py-4 px-5">Stok</th>
                    <th className="py-4 px-5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {produkList.map((item, index) => {
                    const itemNama = getProductName(item);
                    const isEven = index % 2 === 0;

                    return (
                      <tr 
                        key={item.id} 
                        className={`transition-colors hover:bg-pink-100/50 ${
                          isEven ? 'bg-white' : 'bg-pink-50/30'
                        }`}
                      >
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3">
                            {/* Standard <img> Tag untuk Menghindari Lock Exception Next.js Image Config */}
                            <div className="relative w-12 h-12 rounded-xl bg-white border-2 border-pink-100 shadow-sm overflow-hidden shrink-0 flex items-center justify-center">
                              {item.gambar_url ? (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img 
                                  src={item.gambar_url} 
                                  alt={itemNama} 
                                  className="w-full h-full object-cover" 
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-pink-300 bg-pink-50">
                                  <Package className="w-6 h-6" />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-[#1E1033] text-sm uppercase tracking-wide">{itemNama}</p>
                              <p className="text-[11px] text-gray-500 line-clamp-1">{item.deskripsi || 'Rangkaian buket kustom indah'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-5 font-extrabold text-[#FF4696] text-sm">
                          {formatRupiah(item.harga)}
                        </td>
                        <td className="py-4 px-5">
                          <span className="px-3 py-1 rounded-lg bg-white border border-gray-200 font-extrabold text-gray-700 shadow-sm">
                            {item.stok} pcs
                          </span>
                        </td>
                        <td className="py-4 px-5 text-right">
                          <button
                            onClick={() => handleDelete(item.id, itemNama)}
                            className="p-2.5 rounded-xl bg-white border border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 transition-all shadow-sm"
                            title="Hapus Produk"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </main>

      {/* Modal Modern Tambah Buket Baru (Dengan File Upload Gambar) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#1E1033]/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl border-2 border-pink-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="px-6 py-5 bg-gradient-to-r from-[#1E1033] to-[#2D1B4D] text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#FF4696] flex items-center justify-center text-white shadow-md">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading-serif text-xl font-bold uppercase tracking-wide">
                    Tambah Buket Baru
                  </h3>
                  <p className="text-[10px] text-pink-200">Isi detail produk untuk ditambahkan ke katalog</p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="p-1.5 rounded-xl bg-white/10 text-pink-200 hover:text-white hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs overflow-y-auto">
              
              {/* Upload Foto Berkas - Simpel & Tanpa Batasan Ukuran Ribet */}
              <div>
                <label className="block font-bold text-[#1E1033] mb-1.5 uppercase flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-[#FF4696]" />
                  <span>Foto Buket / Produk</span>
                </label>

                <div className="relative border-2 border-dashed border-pink-200 hover:border-[#FF4696] rounded-2xl p-4 bg-pink-50/40 text-center transition-all">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  
                  {previewImage ? (
                    <div className="flex items-center justify-center gap-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={previewImage}
                        alt="Preview Foto Buket"
                        className="w-20 h-20 object-cover rounded-xl border-2 border-[#FF4696] shadow-sm"
                      />
                      <div className="text-left space-y-1">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                          <CheckCircle2 className="w-3 h-3" /> Foto Siap Digunakan
                        </span>
                        <p className="text-[10px] text-gray-500">Klik di sini jika ingin mengganti foto lain</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1 py-2">
                      <UploadCloud className="w-8 h-8 text-[#FF4696] mx-auto" />
                      <p className="font-bold text-gray-700 text-xs">Klik / Ambil Foto Buket dari Device</p>
                      <p className="text-[10px] text-gray-400">Format foto JPG/PNG/WEBP, maksimal 2MB</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Field: Nama Buket */}
              <div>
                <label className="block font-bold text-[#1E1033] mb-1.5 uppercase flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-[#FF4696]" />
                  <span>Nama Buket *</span>
                </label>
                <input
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleChange}
                  placeholder="Contoh: Buket Mawar Soft Pink Wisuda"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-[#FF4696] text-sm transition-all"
                  required
                />
              </div>

              {/* Grid 2 Kolom: Harga & Stok */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#1E1033] mb-1.5 uppercase flex items-center gap-1.5">
                    <Banknote className="w-3.5 h-3.5 text-[#FF4696]" />
                    <span>Harga (Rp) *</span>
                  </label>
                  <input
                    type="number"
                    name="harga"
                    value={formData.harga}
                    onChange={handleChange}
                    placeholder="150000"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-[#FF4696] text-sm transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#1E1033] mb-1.5 uppercase flex items-center gap-1.5">
                    <Hash className="w-3.5 h-3.5 text-[#FF4696]" />
                    <span>Jumlah Stok *</span>
                  </label>
                  <input
                    type="number"
                    name="stok"
                    value={formData.stok}
                    onChange={handleChange}
                    placeholder="10"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-[#FF4696] text-sm transition-all"
                    required
                  />
                </div>
              </div>

              {/* Field: Kategori */}
              <div>
                <label className="block font-bold text-[#1E1033] mb-1.5 uppercase flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#FF4696]" />
                  <span>Kategori Buket</span>
                </label>
                <select
                  name="kategori_id"
                  value={formData.kategori_id}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-[#FF4696] text-sm bg-white transition-all"
                >
                  <option value="">-- Tanpa Kategori / Pilih Kategori --</option>
                  {kategoriList.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {getCategoryName(cat)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Field: Deskripsi */}
              <div>
                <label className="block font-bold text-[#1E1033] mb-1.5 uppercase flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#FF4696]" />
                  <span>Deskripsi Buket</span>
                </label>
                <textarea
                  name="deskripsi"
                  rows={3}
                  value={formData.deskripsi}
                  onChange={handleChange}
                  placeholder="Rangkaian bunga sintetis tahan lama dengan pita satin premium..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-[#FF4696] text-sm transition-all"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex items-center justify-end gap-3 border-t border-gray-100 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-3 rounded-xl border-2 border-gray-200 font-bold text-gray-600 hover:bg-gray-50 uppercase tracking-wide"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-3 rounded-xl bg-[#FF4696] text-white font-bold uppercase tracking-wide hover:bg-[#e03a83] active:scale-95 disabled:opacity-50 transition-all shadow-md shadow-pink-200"
                >
                  {submitting ? 'Menyimpan...' : 'Simpan Buket Baru'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}