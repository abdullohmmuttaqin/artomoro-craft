'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { supabase, isSupabaseConfigured, WHATSAPP_NUMBER } from '@/lib/supabase';
import { Produk } from '@/types';
import { 
  ArrowLeft, Sparkles, CheckCircle2, 
  AlertCircle, RefreshCw, Plus, Minus, MessageSquare, Package
} from 'lucide-react';

const getProductName = (item: Produk) => (item.nama ?? item.nama_produk ?? 'Buket Unnamed').trim();

interface DetailPageProps {
  params: Promise<{ id: string }>;
}

export default function DetailProdukPage({ params }: DetailPageProps) {
  // Unwrap params menggunakan `use()` untuk kompatibilitas Next.js 15/16+
  const resolvedParams = use(params);
  const produkId = resolvedParams.id;

  const [produk, setProduk] = useState<Produk | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State Pemesanan
  const [jumlah, setJumlah] = useState<number>(1);
  const [catatan, setCatatan] = useState<string>('');

  // Fetch Detail Produk dari Supabase berdasarkan ID
  useEffect(() => {
    async function fetchProdukDetail() {
      if (!isSupabaseConfigured || !supabase) {
        setLoading(false);
        setErrorMsg('Konfigurasi Supabase belum siap. Silakan isi NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY di .env.local.');
        return;
      }

      try {
        setLoading(true);
        setErrorMsg(null);

        let { data, error } = await supabase
          .from('produk')
          .select('*')
          .eq('id', parseInt(produkId, 10))
          .eq('is_active', true)
          .single();

        if (error?.code === '42703') {
          const legacyProduct = await supabase.from('produk').select('*').eq('id', parseInt(produkId, 10)).single();
          data = legacyProduct.data;
          error = legacyProduct.error;
        }

        if (error) throw error;
        if (data) setProduk(data);

      } catch (err: unknown) {
        console.error('Error fetching product detail:', err);
        const msg = err instanceof Error ? err.message : 'Produk tidak ditemukan atau telah dihapus.';
        setErrorMsg(msg);
      } finally {
        setLoading(false);
      }
    }

    if (produkId) {
      fetchProdukDetail();
    }
  }, [produkId]);

  // Format Rupiah
  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(angka);
  };

  // Hitung total harga
  const totalHarga = produk ? produk.harga * jumlah : 0;
  const itemNama = produk ? getProductName(produk) : '';

  // Format Pesan WhatsApp
  const generateWaMessage = () => {
    if (!produk) return '';

    let text = `Halo Artomoro Craft, saya mau pesan buket:\n\n`;
    text += `*Nama Buket:* ${itemNama}\n`;
    text += `*Harga Satuan:* ${formatRupiah(produk.harga)}\n`;
    text += `*Jumlah:* ${jumlah} pcs\n`;
    text += `*Total Harga:* ${formatRupiah(totalHarga)}\n`;
    
    if (catatan.trim()) {
      text += `*Catatan/Kartu Ucapan:* "${catatan.trim()}"\n`;
    }
    
    text += `\nMohon petunjuk untuk alur pembayaran dan pengirimannya ya. Terima kasih!`;
    return encodeURIComponent(text);
  };

  return (
    <main className="min-h-screen bg-[var(--bg-base)] py-10 pb-28 sm:py-14 sm:pb-14 px-4 sm:px-6 lg:px-8 text-[#1E1033]">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Back Button */}
        <div>
          <Link
            href="/katalog"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-600 hover:text-[#FF4696] transition-colors bg-white px-4 py-2.5 rounded-lg border border-[#eadde5]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Katalog</span>
          </Link>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-3xl p-12 border-2 border-pink-100 shadow-sm text-center space-y-3">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#FF4696]" />
            <p className="font-semibold text-xs text-gray-500">Memuat detail buket...</p>
          </div>
        )}

        {/* Error State */}
        {errorMsg && (
          <div className="bg-white rounded-3xl p-8 border-2 border-red-200 shadow-sm text-center space-y-4 max-w-md mx-auto">
            <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
            <h2 className="font-heading-serif text-xl font-bold uppercase text-red-700">Gagal Memuat Produk</h2>
            <p className="text-xs text-gray-600">{errorMsg}</p>
            <Link
              href="/katalog"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-[#FF4696] text-white text-xs font-bold uppercase"
            >
              Lihat Buket Lainnya
            </Link>
          </div>
        )}

        {/* Product Detail Content */}
        {!loading && !errorMsg && produk && (
          <div className="bg-white rounded-2xl border border-[#eadde5] shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0">
            
            {/* Left Column: Big Image Display */}
            <div className="lg:col-span-6 bg-[var(--bg-soft)] p-5 sm:p-8 flex items-center justify-center border-b lg:border-b-0 lg:border-r border-[#eadde5]">
              <div className="relative w-full aspect-[4/5] max-w-md rounded-xl bg-white overflow-hidden flex items-center justify-center">
                {produk.gambar_url ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={produk.gambar_url}
                    alt={itemNama}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-pink-300 space-y-2">
                    <Package className="w-12 h-12" />
                    <span className="text-xs font-semibold">Artomoro Craft</span>
                  </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-3 left-3">
                  {produk.stok > 0 ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-bold uppercase shadow-sm">
                      <CheckCircle2 className="w-3 h-3" /> Stok Tersedia ({produk.stok})
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500 text-white text-[10px] font-bold uppercase shadow-sm">
                      Stok Habis
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Information & Checkout Options */}
            <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-between space-y-6">
              
              <div className="space-y-4">
                {/* Badge Category / Brand */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--bg-soft)] border border-[#eadde5] text-[#FF4696] text-[11px] font-bold tracking-[0.12em] uppercase">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Artomoro Craft Premium</span>
                </div>

                {/* Product Title & Price */}
                <div>
                  <h1 className="font-heading-serif text-3xl sm:text-5xl font-semibold leading-tight text-[#1E1033]">
                    {itemNama}
                  </h1>
                  <p className="text-2xl sm:text-3xl font-extrabold text-[#FF4696] mt-2">
                    {formatRupiah(produk.harga)}
                  </p>
                </div>

                {/* Description */}
                <div className="border-t border-b border-[#eadde5] py-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Deskripsi Produk</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {produk.deskripsi || 'Rangkaian buket kustom indah yang dirangkai secara hand-crafted dengan bahan pilihan berkualitas tinggi.'}
                  </p>
                </div>

                {/* Form Options: Quantity & Greeting Card Note */}
                <div className="space-y-4 pt-1">
                  
                  {/* Quantity Selector */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#1E1033] mb-2">
                      Jumlah Pesanan
                    </label>
                    <div className="inline-flex items-center gap-3 bg-[var(--bg-soft)] p-1.5 rounded-lg border border-[#eadde5]">
                      <button
                        onClick={() => setJumlah((prev) => Math.max(1, prev - 1))}
                        disabled={jumlah <= 1}
                        className="w-8 h-8 rounded-md bg-white border border-[#eadde5] flex items-center justify-center text-[#1E1033] hover:border-[#FF4696] disabled:opacity-40 transition-all font-bold"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>

                      <span className="w-8 text-center font-extrabold text-sm">{jumlah}</span>

                      <button
                        onClick={() => setJumlah((prev) => Math.min(produk.stok || 99, prev + 1))}
                        disabled={jumlah >= (produk.stok || 99)}
                        className="w-8 h-8 rounded-md bg-white border border-[#eadde5] flex items-center justify-center text-[#1E1033] hover:border-[#FF4696] disabled:opacity-40 transition-all font-bold"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Greeting Note Input */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#1E1033] mb-1.5">
                      Catatan / Kartu Ucapan (Opsional)
                    </label>
                    <textarea
                      rows={3}
                      value={catatan}
                      onChange={(e) => setCatatan(e.target.value)}
                      placeholder="Contoh: Selamat Wisuda ya Sarah! Wish you all the best. - From Budi"
                      className="w-full px-4 py-3 rounded-lg border border-[#eadde5] focus:outline-none focus:border-[#FF4696] text-xs transition-all"
                    />
                  </div>

                </div>
              </div>

              {/* Total Price Summary & Checkout WA Button */}
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-bold text-gray-500 uppercase text-xs">Total Estimasi</span>
                  <span className="font-extrabold text-xl text-[#FF4696]">{formatRupiah(totalHarga)}</span>
                </div>

                <Link
                  href={produk.stok > 0 ? `https://wa.me/${WHATSAPP_NUMBER}?text=${generateWaMessage()}` : '#'}
                  target={produk.stok > 0 ? '_blank' : '_self'}
                  rel="noopener noreferrer"
                  className={`w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-lg text-white text-xs font-bold tracking-wide uppercase shadow-md transition-all ${
                    produk.stok > 0
                      ? 'bg-[#FF4696] hover:bg-[#e03a83] active:scale-95 shadow-pink-200'
                      : 'bg-gray-300 cursor-not-allowed shadow-none'
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{produk.stok > 0 ? 'Pesan Sekarang via WhatsApp' : 'Stok Buket Habis'}</span>
                </Link>
              </div>

            </div>

          </div>
        )}

      </div>

      {!loading && !errorMsg && produk && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#eadde5] bg-white/95 p-3 shadow-[0_-8px_24px_rgba(30,16,51,0.12)] backdrop-blur sm:hidden">
          <Link
            href={produk.stok > 0 ? `https://wa.me/${WHATSAPP_NUMBER}?text=${generateWaMessage()}` : '#'}
            target={produk.stok > 0 ? '_blank' : '_self'}
            rel="noopener noreferrer"
            className={`w-full inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3.5 text-xs font-bold uppercase tracking-wide text-white ${produk.stok > 0 ? 'bg-[#FF4696]' : 'bg-gray-300 pointer-events-none'}`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>{produk.stok > 0 ? 'Pesan via WhatsApp' : 'Stok Buket Habis'}</span>
          </Link>
        </div>
      )}
    </main>
  );
}