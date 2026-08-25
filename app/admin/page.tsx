'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Produk, Kategori } from '@/types';
import { 
  Plus, Trash2, Package, Layers, Sparkles, RefreshCw, 
  AlertCircle, X, CheckCircle2, ShieldCheck, ArrowLeft,
  Tag, Banknote, Hash, UploadCloud, FileText, Flower2, Image as ImageIcon
} from 'lucide-react';

export default function AdminPage() {
  const [produkList, setProdukList] = useState<Produk[]>([]);
  const [kategoriList, setKategoriList] = useState<Kategori[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
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

  // Fetch Data dari Supabase
  const fetchData = async () => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      setErrorMsg('Konfigurasi Supabase belum siap. Silakan isi NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY di .env.local.');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg(null);

      // Fetch Kategori
      const { data: catData, error: catErr } = await supabase
        .from('kategori')
        .select('*');

      if (catErr) throw catErr;
      if (catData) setKategoriList(catData);

      // Fetch Produk
      const { data: prodData, error: prodErr } = await supabase
        .from('produk')
        .select('*')
        .order('id', { ascending: false });

      if (prodErr) throw prodErr;
      if (prodData) setProdukList(prodData);

    } catch (err: unknown) {
      console.error('Error loading admin data:', err);
      const msg = err instanceof Error ? err.message : 'Gagal memuat data dari server Supabase.';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
      // Baca file foto menjadi Data URL (Base64)
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
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

    if (!formData.nama || !formData.harga || !formData.stok) {
      setErrorMsg('Nama buket, harga, dan stok wajib diisi!');
      return;
    }

    if (!isSupabaseConfigured || !supabase) {
      setErrorMsg('Konfigurasi Supabase belum siap. Silakan isi NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY di .env.local.');
      return;
    }

    try {
      setSubmitting(true);

      const payload: Record<string, any> = {
        nama: formData.nama,
        nama_produk: formData.nama,
        harga: parseFloat(formData.harga),
        stok: parseInt(formData.stok, 10),
        deskripsi: formData.deskripsi || null,
        gambar_url: formData.gambar_url || null,
      };

      if (formData.kategori_id) {
        payload.kategori_id = parseInt(formData.kategori_id, 10);
      }

      // Insert pertama dengan kolom 'nama'
      let { error } = await supabase.from('produk').insert([{
        nama: formData.nama,
        harga: payload.harga,
        stok: payload.stok,
        deskripsi: payload.deskripsi,
        gambar_url: payload.gambar_url,
        kategori_id: payload.kategori_id,
      }]);

      // Fallback jika schema menggunakan 'nama_produk'
      if (error && error.code === 'PGRST204') {
        const fallbackRes = await supabase.from('produk').insert([{
          nama_produk: formData.nama,
          harga: payload.harga,
          stok: payload.stok,
          deskripsi: payload.deskripsi,
          gambar_url: payload.gambar_url,
          kategori_id: payload.kategori_id,
        }]);
        error = fallbackRes.error;
      }

      if (error) throw error;

      setSuccessMsg(`Berhasil menambahkan buket "${formData.nama}"!`);
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
      fetchData();

    } catch (err: any) {
      console.error('Error adding product:', err);
      const msg = err?.message || err?.details || 'Gagal menyimpan produk baru.';
      setErrorMsg(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // Hapus Produk
  const handleDelete = async (id: number, itemNama: string) => {
    if (!confirm(`Apakah kamu yakin ingin menghapus buket "${itemNama}"?`)) return;

    if (!isSupabaseConfigured || !supabase) {
      setErrorMsg('Konfigurasi Supabase belum siap. Silakan isi NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY di .env.local.');
      return;
    }

    try {
      setErrorMsg(null);
      const { error } = await supabase
        .from('produk')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSuccessMsg(`Berhasil menghapus buket "${itemNama}".`);
      fetchData();

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
              onClick={fetchData}
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
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#FF4696] text-white text-xs font-bold tracking-wide uppercase hover:bg-[#e03a83] active:scale-95 transition-all shadow-md shadow-pink-200"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Buket Baru</span>
            </button>
          </div>
        </div>

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
              <p className="text-xs font-bold text-emerald-600 mt-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Supabase Active
              </p>
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
                    const itemNama = (item as any).nama || item.nama_produk || 'Buket Unnamed';
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
                      <p className="text-[10px] text-gray-400">Format foto (PNG, JPG, JPEG, WEBP)</p>
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
                      {(cat as any).nama || (cat as any).nama_kategori || `Kategori #${cat.id}`}
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