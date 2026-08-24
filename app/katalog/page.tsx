'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Produk, Kategori } from '@/types';
import { ShoppingBag, Sparkles, Filter, MessageSquare, AlertCircle } from 'lucide-react';

export default function KatalogPage() {
    const [produkList, setProdukList] = useState<Produk[]>([]);
    const [kategoriList, setKategoriList] = useState<Kategori[]>([]);
    const [selectedKategori, setSelectedKategori] = useState<number | 'all'>('all');
    const [loading, setLoading] = useState<boolean>(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // Fetch Data Produk & Kategori dari Supabase
    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                setErrorMsg(null);

                // Fetch Kategori tanpa sorting kolom spesifik
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

    // Filter Produk Berdasarkan Kategori yang Dipilih
    const filteredProduk = selectedKategori === 'all'
        ? produkList
        : produkList.filter((item) => item.kategori_id === selectedKategori);

    // Helper Format Rupiah
    const formatRupiah = (angka: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(angka);
    };

    return (
        <main className="min-h-screen bg-[#FBFBFB] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
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

                {/* Filter Bar - Scrollable di Mobile */}
                <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                    <button
                        onClick={() => setSelectedKategori('all')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wide whitespace-nowrap transition-all ${selectedKategori === 'all'
                                ? 'bg-[#1E1033] text-white shadow-sm'
                                : 'bg-white border border-gray-200 text-gray-700 hover:border-pink-300'
                            }`}
                    >
                        Semua Buket
                    </button>

                    {kategoriList.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedKategori(cat.id)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wide whitespace-nowrap transition-all ${selectedKategori === cat.id
                                    ? 'bg-[#FF4696] text-white shadow-sm'
                                    : 'bg-white border border-gray-200 text-gray-700 hover:border-pink-300'
                                }`}
                        >
                            {cat.nama_kategori}
                        </button>
                    ))}
                </div>

                {/* Loading State Skeleton */}
                {loading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
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

                {/* Empty State */}
                {!loading && !errorMsg && filteredProduk.length === 0 && (
                    <div className="bg-white rounded-2xl p-8 sm:p-12 border border-pink-100 text-center space-y-4 shadow-sm max-w-lg mx-auto">
                        <div className="w-12 h-12 rounded-full bg-pink-50 text-[#FF4696] flex items-center justify-center mx-auto">
                            <Filter className="w-6 h-6" />
                        </div>
                        <h3 className="font-heading-serif text-lg font-bold text-[#1E1033] uppercase">
                            Buket Belum Tersedia
                        </h3>
                        <p className="text-xs text-gray-500">
                            Belum ada item untuk kategori ini. Kamu bisa memesan model buket kustom secara langsung!
                        </p>
                        <Link
                            href="https://wa.me/6281234567890?text=Halo%20Artomoro%20Craft,%20saya%20ingin%20pesan%20buket%20kustom"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF4696] text-white text-xs font-bold uppercase tracking-wide"
                        >
                            <MessageSquare className="w-4 h-4" />
                            <span>Tanya via WhatsApp</span>
                        </Link>
                    </div>
                )}

                {/* Product Cards Grid - Responsive (1 col HP, 2 col Tablet, 3 col Laptop) */}
                {!loading && !errorMsg && filteredProduk.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                        {filteredProduk.map((item) => {
                            const waMessage = encodeURIComponent(
                                `Halo Artomoro Craft, saya mau pesan buket:\n\n*Nama Buket:* ${item.nama_produk}\n*Harga:* ${formatRupiah(item.harga)}\n\nMohon informasi ketersediaan dan alur pemesanannya ya.`
                            );

                            return (
                                <div
                                    key={item.id}
                                    className="group bg-white rounded-2xl border border-pink-100 p-4 shadow-sm hover:shadow-md hover:border-pink-200 transition-all flex flex-col justify-between"
                                >
                                    <div className="space-y-3">
                                        {/* Image Container */}
                                        <div className="relative w-full aspect-square rounded-xl bg-pink-50 overflow-hidden">
                                            {item.gambar_url ? (
                                                <Image
                                                    src={item.gambar_url}
                                                    alt={item.nama_produk}
                                                    fill
                                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center text-pink-300 space-y-1">
                                                    <ShoppingBag className="w-8 h-8" />
                                                    <span className="text-[10px] font-semibold">Artomoro Craft</span>
                                                </div>
                                            )}

                                            {/* Stock Badge */}
                                            <span className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-md text-[10px] font-bold text-[#1E1033] shadow-sm">
                                                Stok: {item.stok}
                                            </span>
                                        </div>

                                        {/* Product Info */}
                                        <div className="space-y-1">
                                            <h3 className="font-heading-serif text-lg font-bold text-[#1E1033] tracking-wide uppercase line-clamp-1">
                                                {item.nama_produk}
                                            </h3>
                                            <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed min-h-[2rem]">
                                                {item.deskripsi || 'Rangkaian buket kustom spesial dari bahan pilihan berkualitas.'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Price & Action Button */}
                                    <div className="pt-4 mt-3 border-t border-gray-100 flex items-center justify-between gap-3">
                                        <div>
                                            <span className="text-[10px] text-gray-400 uppercase font-bold block">Harga</span>
                                            <span className="text-base font-extrabold text-[#FF4696]">
                                                {formatRupiah(item.harga)}
                                            </span>
                                        </div>

                                        <Link
                                            href={`https://wa.me/6281234567890?text=${waMessage}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FF4696] text-white text-xs font-bold tracking-wide uppercase hover:bg-[#e03a83] active:scale-95 transition-all shadow-sm"
                                        >
                                            <ShoppingBag className="w-3.5 h-3.5" />
                                            <span>Pesan</span>
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