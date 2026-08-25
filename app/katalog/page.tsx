'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Produk, Kategori } from '@/types';
import { ShoppingBag, Sparkles, Filter, MessageSquare, AlertCircle, Eye, Search, X } from 'lucide-react';

const getProductName = (item: Produk) => (item.nama ?? item.nama_produk ?? 'Buket Unnamed').trim();
const getCategoryName = (kategori: Kategori) => (kategori.nama ?? kategori.nama_kategori ?? `Kategori #${kategori.id}`).trim();

export default function KatalogPage() {
  const [produkList, setProdukList] = useState<Produk[]>([]);
  const [kategoriList, setKategoriList] = useState<Kategori[]>([]);
  
  // State Filter
  const [selectedKategori, setSelectedKategori] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [priceRange, setPriceRange] = useState<string>('all');

  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Fetch Data Produk & Kategori dari Supabase
  useEffect(() => {
    async function fetchData() {
      if (!isSupabaseConfigured || !supabase) {
        setLoading(false);
        setErrorMsg('Konfigurasi Supabase belum siap. Silakan isi NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY di .env.local.');
        return;
      }

      try {
        setLoading(true);
        setErrorMsg(null);

        // Fetch Kategori
        const { data: categories, error: catError } = await supabase
          .from('kategori')
          .select('*');

        if (catError) throw catError;
        if (categories) setKategoriList(categories);

        // Fetch Produk
        const { data: products, error: prodError } = await supabase
          .from('produk')
          .select('*')
          .order('id', { ascending: false });

        if (prodError) throw prodError;
        if (products) setProdukList(products);

      } catch (err: unknown) {
        console.error('Error fetching catalog data:', err);
        const message = err instanceof Error ? err.message : 'Gagal memuat data katalog dari server.';
        setErrorMsg(message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Filter Kombinasi: Kategori + Search Query + Price Range
  const filteredProduk = produkList.filter((item) => {
    const itemNama = getProductName(item).toLowerCase();
    const itemDeskripsi = (item.deskripsi || '').toLowerCase();
    const query = searchQuery.toLowerCase().trim();

    // 1. Filter Kategori
    const matchKategori = selectedKategori === 'all' || item.kategori_id === selectedKategori;

    // 2. Filter Search Query
    const matchSearch = query === '' || itemNama.includes(query) || itemDeskripsi.includes(query);

    // 3. Filter Price Range
    let matchPrice = true;
    if (priceRange === 'under100') {
      matchPrice = item.harga < 100000;
    } else if (priceRange === '100to200') {
      matchPrice = item.harga >= 100000 && item.harga <= 200000;
    } else if (priceRange === 'above200') {
      matchPrice = item.harga > 200000;
    }

    return matchKategori && matchSearch && matchPrice;
  });

  // Helper Format Rupiah
  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(angka);
  };

  const resetFilters = () => {
    setSelectedKategori('all');
    setSearchQuery('');
    setPriceRange('all');
  };

  return (
    <main className="min-h-screen bg-[#FBFBFB] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 text-[#1E1033]">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Page Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-50 border border-pink-100 text-[#FF4696] text-xs font-bold tracking-wide">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>Koleksi Eksklusif Artomoro Craft</span>
          </div>

          <h1 className="font-heading-serif text-3xl sm:text-5xl font-bold uppercase tracking-wider text-[#1E1033]">
            Katalog Buket <span className="font-brand-script text-4xl sm:text-6xl text-[#FF4696] normal-case block sm:inline sm:ml-2">Pilihan</span>
          </h1>

          <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
            Temukan rangkaian buket kustom indah yang siap menyempurnakan hari bahagiamu.
          </p>
        </div>

        {/* Search & Filter Controls Card */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl border-2 border-pink-100 shadow-sm space-y-4">
          
          {/* Top Bar: Search Input & Price Dropdown */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            
            {/* Search Bar Input */}
            <div className="sm:col-span-8 relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari buket (contoh: mawar, wisuda, satin)..."
                className="w-full pl-11 pr-10 py-3 rounded-2xl border-2 border-gray-100 focus:outline-none focus:border-[#FF4696] text-xs transition-all bg-gray-50/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Price Filter Dropdown */}
            <div className="sm:col-span-4">
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-100 focus:outline-none focus:border-[#FF4696] text-xs font-semibold bg-gray-50/50 transition-all text-[#1E1033]"
              >
                <option value="all">Semua Budget / Harga</option>
                <option value="under100">Di bawah Rp 100.000</option>
                <option value="100to200">Rp 100.000 - Rp 200.000</option>
                <option value="above200">Di atas Rp 200.000</option>
              </select>
            </div>

          </div>

          {/* Bottom Bar: Category Tabs */}
          <div className="flex items-center justify-start gap-2 overflow-x-auto pb-1 scrollbar-none pt-2 border-t border-gray-100">
            <button
              onClick={() => setSelectedKategori('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wide whitespace-nowrap transition-all ${
                selectedKategori === 'all'
                  ? 'bg-[#1E1033] text-white shadow-sm'
                  : 'bg-gray-50 border border-gray-200 text-gray-700 hover:border-pink-300'
              }`}
            >
              Semua Kategori
            </button>

            {kategoriList.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedKategori(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wide whitespace-nowrap transition-all ${
                  selectedKategori === cat.id
                    ? 'bg-[#FF4696] text-white shadow-sm'
                    : 'bg-gray-50 border border-gray-200 text-gray-700 hover:border-pink-300'
                }`}
              >
                {getCategoryName(cat)}
              </button>
            ))}
          </div>

          {/* Active Filter Indicators */}
          {(selectedKategori !== 'all' || searchQuery !== '' || priceRange !== 'all') && (
            <div className="flex items-center justify-between text-xs pt-1 border-t border-pink-50">
              <span className="text-gray-500 font-semibold">
                Menampilkan hasil pencarian filter ({filteredProduk.length} buket ditemukan)
              </span>
              <button
                onClick={resetFilters}
                className="text-[#FF4696] font-bold hover:underline"
              >
                Reset Semua Filter
              </button>
            </div>
          )}

        </div>

        {/* Loading State Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div key={idx} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-4 animate-pulse">
                <div className="w-full aspect-square bg-gray-100 rounded-xl" />
                <div className="h-4 bg-gray-100 rounded w-3/4" />
                <div className="h-4 bg-gray-100 rounded w-1/2" />
                <div className="h-10 bg-gray-100 rounded-xl" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {errorMsg && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-100 text-red-700 text-center space-y-2">
            <AlertCircle className="w-6 h-6 mx-auto text-red-500" />
            <p className="text-xs font-semibold">{errorMsg}</p>
          </div>
        )}

        {/* Empty Search Results */}
        {!loading && !errorMsg && filteredProduk.length === 0 && (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border-2 border-pink-100 text-center space-y-4 shadow-sm max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-full bg-pink-50 text-[#FF4696] flex items-center justify-center mx-auto">
              <Filter className="w-6 h-6" />
            </div>
            <h3 className="font-heading-serif text-lg font-bold text-[#1E1033] uppercase">
              Buket Tidak Ditemukan
            </h3>
            <p className="text-xs text-gray-500">
              Tidak ada buket yang sesuai dengan pencarian atau filter harga kamu. Coba kata kunci lain atau reset filter.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={resetFilters}
                className="px-4 py-2.5 rounded-xl border border-pink-200 font-bold text-xs uppercase text-[#1E1033]"
              >
                Reset Filter
              </button>
              <Link
                href="https://wa.me/6281234567890?text=Halo%20Artomoro%20Craft,%20saya%20ingin%20pesan%20buket%20kustom"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF4696] text-white text-xs font-bold uppercase tracking-wide"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Pesan Kustom WA</span>
              </Link>
            </div>
          </div>
        )}

        {/* Product Cards Grid */}
        {!loading && !errorMsg && filteredProduk.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {filteredProduk.map((item) => {
              const itemNama = getProductName(item);

              return (
                <div
                  key={item.id}
                  className="group bg-white rounded-2xl border border-pink-100 p-4 shadow-sm hover:shadow-md hover:border-pink-200 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <Link href={`/katalog/${item.id}`} className="block">
                      <div className="relative w-full aspect-square rounded-xl bg-pink-50 overflow-hidden flex items-center justify-center border border-pink-100">
                        {item.gambar_url ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={item.gambar_url}
                            alt={itemNama}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-pink-300 space-y-1">
                            <ShoppingBag className="w-8 h-8" />
                            <span className="text-[10px] font-semibold">Artomoro Craft</span>
                          </div>
                        )}

                        <span className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-md text-[10px] font-bold text-[#1E1033] shadow-sm">
                          Stok: {item.stok}
                        </span>
                      </div>
                    </Link>

                    <div className="space-y-1">
                      <Link href={`/katalog/${item.id}`} className="block">
                        <h3 className="font-heading-serif text-lg font-bold text-[#1E1033] tracking-wide uppercase line-clamp-1 hover:text-[#FF4696] transition-colors">
                          {itemNama}
                        </h3>
                      </Link>
                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed min-h-[2rem]">
                        {item.deskripsi || 'Rangkaian buket kustom spesial dari bahan pilihan berkualitas.'}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-3 border-t border-gray-100 flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase font-bold block">Harga</span>
                      <span className="text-base font-extrabold text-[#FF4696]">
                        {formatRupiah(item.harga)}
                      </span>
                    </div>

                    <Link
                      href={`/katalog/${item.id}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-pink-50 border border-pink-200 text-[#FF4696] text-xs font-bold tracking-wide uppercase hover:bg-[#FF4696] hover:text-white active:scale-95 transition-all shadow-sm"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Detail</span>
                    </Link>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </main>
  );
}