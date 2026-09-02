'use client';

import { useState } from 'react';
import Link from 'next/link';
import { WHATSAPP_NUMBER } from '@/lib/supabase';
import { 
  ShoppingBag, MessageSquare, Sparkles, MapPin, 
  Scissors, Truck, Flower2, X, Send, Heart, Banknote, User, Phone, FileText,
  Clock, ShieldCheck, CheckCircle2, PhoneCall
} from 'lucide-react';

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    nama: '',
    whatsapp: '',
    budget: '',
    deskripsi: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCustomOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let text = `Halo Artomoro Craft, saya mau pesan *Buket Kustom*:\n\n`;
    text += `*Nama Pemesan:* ${formData.nama}\n`;
    if (formData.whatsapp) text += `*Nomor WA:* ${formData.whatsapp}\n`;
    if (formData.budget) text += `*Estimasi Budget:* Rp ${formData.budget}\n`;
    text += `*Detail Buket Kustom:* "${formData.deskripsi}"\n\n`;
    text += `Mohon info estimasi pengerjaan dan konsultasi desainnya ya!`;

    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
    setIsModalOpen(false);
    setFormData({ nama: '', whatsapp: '', budget: '', deskripsi: '' });
  };

  return (
    <main className="min-h-screen bg-[#FBFBFB] text-[#1E1033]">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 md:pt-16 md:pb-24 border-b border-pink-100/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Copywriting & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-50 border border-pink-100 text-[#FF4696] text-xs font-bold tracking-wide">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>Buket & Hantaran Eksklusif Cilacap</span>
              </div>

              <h1 className="font-heading-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-wider leading-[1.15] text-[#1E1033] uppercase">
                Let Your Feelings <br />
                <span className="font-brand-script text-5xl sm:text-7xl lg:text-8xl text-[#FF4696] normal-case block pt-1">
                  Blossom
                </span>
              </h1>

              <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Hadirkan keindahan dalam setiap momen spesialmu dengan rangkaian buket kustom eksklusif dari <strong className="text-[#1E1033]">Artomoro Craft</strong>.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
                <Link
                  href="/katalog"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#FF4696] text-white text-sm font-bold tracking-wide uppercase hover:bg-[#e03a83] active:scale-95 transition-all shadow-md shadow-pink-200"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Lihat Katalog</span>
                </Link>

                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-white border border-pink-200 text-[#1E1033] hover:border-[#FF4696] hover:text-[#FF4696] text-sm font-bold tracking-wide uppercase active:scale-95 transition-all shadow-sm"
                >
                  <MessageSquare className="w-4 h-4 text-[#FF4696]" />
                  <span>Pesan Kustom</span>
                </button>
              </div>

              {/* Trust Badges Bar (Teks disesuaikan agar aman di HP sempit) */}
              <div className="pt-6 border-t border-gray-100 grid grid-cols-3 gap-2 text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-semibold text-gray-700">
                  <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FF4696] shrink-0" />
                  <span>Cilacap Area</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-semibold text-gray-700">
                  <Scissors className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FF4696] shrink-0" />
                  <span>Custom Design</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-semibold text-gray-700">
                  <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FF4696] shrink-0" />
                  <span>Pengiriman Aman</span>
                </div>
              </div>

            </div>

            {/* Right Column: Visual Showcase */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md aspect-square rounded-3xl bg-gradient-to-br from-pink-100/80 via-white to-pink-50 p-6 sm:p-8 border border-pink-100 shadow-xl flex flex-col items-center justify-center text-center space-y-4">
                
                <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-[#1E1033] flex items-center justify-center text-[#FF4696] shadow-lg animate-pulse">
                  <Flower2 className="w-10 h-10 sm:w-14 sm:h-14" />
                </div>

                <div className="space-y-1">
                  <h3 className="font-heading-serif text-xl sm:text-2xl font-bold text-[#1E1033] uppercase tracking-wide">
                    Fresh & Handcrafted
                  </h3>
                  <p className="text-xs text-gray-500 max-w-xs leading-relaxed">
                    Setiap tangkai dirangkai penuh kehangatan untuk menyampaikan perasaan terdalammu.
                  </p>
                </div>

                <div className="w-full bg-white/90 backdrop-blur-sm rounded-2xl p-3 border border-pink-100 flex items-center justify-between text-left shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-pink-50 flex items-center justify-center text-[#FF4696] font-bold text-xs">
                      5.0
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#1E1033]">Kepuasan Pelanggan</p>
                      <p className="text-[10px] text-gray-500">Ratusan buket terkirim di Cilacap</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#FF4696] px-2 py-1 bg-pink-50 rounded-lg">
                    ★ ★ ★ ★ ★
                  </span>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Section Tentang Kami */}
      <section id="tentang" className="py-16 sm:py-24 bg-white border-b border-pink-100/60 scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-50 border border-pink-100 text-[#FF4696] text-xs font-bold tracking-wide">
              <Flower2 className="w-4 h-4 shrink-0" />
              <span>Tentang Artomoro Craft</span>
            </div>
            <h2 className="font-heading-serif text-3xl sm:text-4xl font-bold uppercase tracking-wide text-[#1E1033]">
              Kerajinan Buket Penuh <span className="font-brand-script text-4xl sm:text-5xl text-[#FF4696] normal-case">Cinta & Ketelitian</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Kami percaya bahwa setiap buket bukan sekadar rangkaian bunga biasa, melainkan media pesan berharga untuk merayakan wisuda, pernikahan, ulang tahun, hingga momen hangat bersama pasangan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="p-6 rounded-3xl bg-[#FBFBFB] border-2 border-pink-100 space-y-3 text-center sm:text-left hover:border-pink-300 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-pink-50 text-[#FF4696] flex items-center justify-center font-bold shadow-inner mx-auto sm:mx-0">
                <Scissors className="w-6 h-6" />
              </div>
              <h3 className="font-heading-serif text-lg font-bold uppercase text-[#1E1033]">Bahan Premium & Awet</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Menggunakan pita satin bermutu tinggi dan rangkaian sintetis pilihan agar buket tetap cantik dikenang selamanya.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#FBFBFB] border-2 border-pink-100 space-y-3 text-center sm:text-left hover:border-pink-300 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold shadow-inner mx-auto sm:mx-0">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="font-heading-serif text-lg font-bold uppercase text-[#1E1033]">Desain Kustom Suka-Suka</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Bebas sesuaikan kombinasi warna, jumlah tangkai, tema boneka, hingga kartu ucapan sesuai budget yang kamu miliki.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#FBFBFB] border-2 border-pink-100 space-y-3 text-center sm:text-left hover:border-pink-300 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shadow-inner mx-auto sm:mx-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-heading-serif text-lg font-bold uppercase text-[#1E1033]">Pengerjaan Rapi & Cepat</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Proses pembuatan teliti dengan jaminan kebersihan dan pengiriman aman langsung ke area Cilacap dan sekitarnya.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Section Kontak WA & Informasi Operasional */}
      <section id="kontak" className="py-16 sm:py-24 bg-[#FBFBFB] scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-50 border border-pink-100 text-[#FF4696] text-xs font-bold tracking-wide">
              <PhoneCall className="w-4 h-4 shrink-0" />
              <span>Hubungi Kami</span>
            </div>
            <h2 className="font-heading-serif text-3xl sm:text-4xl font-bold uppercase tracking-wide text-[#1E1033]">
              Siap Pesan atau <span className="font-brand-script text-4xl sm:text-5xl text-[#FF4696] normal-case">Konsultasi?</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Tim Artomoro Craft siap melayani pertanyaan seputar ketersediaan stok, pesanan kustom, maupun jadwal pengiriman.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white p-6 sm:p-10 rounded-3xl border-2 border-pink-100 shadow-sm">
            
            <div className="lg:col-span-7 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                
                <div className="p-4 rounded-2xl bg-pink-50/50 border border-pink-100 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-[#1E1033] uppercase">
                    <MapPin className="w-4 h-4 text-[#FF4696]" />
                    <span>Area Toko & Workshop</span>
                  </div>
                  <p className="text-gray-600">Cilacap, Jawa Tengah, Indonesia</p>
                </div>

                <div className="p-4 rounded-2xl bg-pink-50/50 border border-pink-100 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-[#1E1033] uppercase">
                    <Clock className="w-4 h-4 text-[#FF4696]" />
                    <span>Jam Operasional</span>
                  </div>
                  <p className="text-gray-600">Senin - Sabtu: 08.00 - 17.00 WIB</p>
                </div>

              </div>

              <div className="p-4 rounded-2xl bg-pink-50/30 border border-pink-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#1E1033] text-[#FF4696] flex items-center justify-center font-bold shrink-0">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-xs uppercase text-[#1E1033]">WhatsApp Customer Service</p>
                    <p className="text-[11px] text-gray-500">+{WHATSAPP_NUMBER}</p>
                  </div>
                </div>

                <Link
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Halo Artomoro Craft, saya ingin bertanya seputar pemesanan buket')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto text-center px-4 py-2.5 rounded-xl bg-[#FF4696] text-white text-xs font-bold uppercase hover:bg-[#e03a83] transition-all shadow-sm shrink-0"
                >
                  Chat Admin
                </Link>
              </div>

            </div>

            <div className="lg:col-span-5 bg-gradient-to-br from-[#1E1033] to-[#2D1B4D] p-6 sm:p-8 rounded-2xl text-white space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-pink-200 text-[10px] font-bold uppercase tracking-widest">
                <CheckCircle2 className="w-3 h-3 text-[#FF4696]" /> Direct Contact
              </div>
              <h3 className="font-heading-serif text-xl font-bold uppercase tracking-wide">
                Ingin Respon Cepat?
              </h3>
              <p className="text-xs text-pink-100/80 leading-relaxed">
                Langsung saja klik tombol di bawah untuk tersambung ke WhatsApp admin. Kami siap membantu merealisasikan buket impianmu!
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full py-3.5 rounded-xl bg-[#FF4696] text-white text-xs font-bold uppercase tracking-wide hover:bg-[#e03a83] active:scale-95 transition-all shadow-md"
              >
                Form Pesan Kustom Cepat
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* Footer Toko */}
      <footer className="bg-[#1E1033] text-white border-t-2 border-[#FF4696] pt-12 pb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-white/10">
            
            <div className="md:col-span-6 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#FF4696] flex items-center justify-center text-white">
                  <Flower2 className="w-5 h-5" />
                </div>
                <span className="font-brand-script text-3xl text-white">
                  Artomoro<span className="text-[#FF4696]">Craft</span>
                </span>
              </div>
              <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
                Penyedia buket pita satin, bunga kustom, dan hantaran eksklusif terpercaya di Cilacap. Let Your Feelings Blossom.
              </p>
            </div>

            <div className="md:col-span-3 space-y-3 text-xs">
              <h4 className="font-bold uppercase tracking-wider text-pink-200">Navigasi Cepat</h4>
              <ul className="space-y-2 text-gray-300">
                <li><Link href="/" className="hover:text-[#FF4696]">Beranda</Link></li>
                <li><Link href="/katalog" className="hover:text-[#FF4696]">Katalog Buket</Link></li>
                <li><Link href="/#tentang" className="hover:text-[#FF4696]">Tentang Kami</Link></li>
                <li><Link href="/#kontak" className="hover:text-[#FF4696]">Kontak WA</Link></li>
              </ul>
            </div>

            <div className="md:col-span-3 space-y-3 text-xs">
              <h4 className="font-bold uppercase tracking-wider text-pink-200">Ikuti Kami</h4>
              <div className="flex items-center gap-3">
                <a 
                  href="https://www.instagram.com/artomorocraft.id/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white hover:bg-[#FF4696] transition-colors"
                  title="Instagram"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>

                <a 
                  href="https://www.tiktok.com/@qetcil" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white hover:bg-[#FF4696] transition-colors"
                  title="TikTok"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </a>
              </div>
            </div>

          </div>

          <div className="text-center text-[11px] text-gray-400">
            <p>© {new Date().getFullYear()} <a href="https://portopel.vercel.app/" target="_blank" rel="noopener noreferrer" className="hover:text-[#FF4696]">abdmmuttaqin</a> All rights reserved.</p>
          </div>

        </div>
      </footer>

      {/* Modal Form Pesanan Kustom (Ditambahkan max-h & scrollbar aman) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#1E1033]/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border-2 border-pink-200 shadow-2xl animate-in fade-in zoom-in-95 duration-200 scrollbar-none">
            
            <div className="px-6 py-5 bg-gradient-to-r from-[#1E1033] to-[#2D1B4D] text-white flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#FF4696] flex items-center justify-center text-white shadow-md">
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading-serif text-xl font-bold uppercase tracking-wide">
                    Pesan Buket Kustom
                  </h3>
                  <p className="text-[10px] text-pink-200">Konsultasikan ide buket impianmu langsung ke admin</p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="p-1.5 rounded-xl bg-white/10 text-pink-200 hover:text-white hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCustomOrderSubmit} className="p-6 space-y-4 text-xs">
              
              <div>
                <label className="block font-bold text-[#1E1033] mb-1.5 uppercase flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#FF4696]" />
                  <span>Nama Kamu *</span>
                </label>
                <input
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleChange}
                  placeholder="Contoh: Budi Santoso"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-[#FF4696] text-sm transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#1E1033] mb-1.5 uppercase flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#FF4696]" />
                    <span>Nomor WA (Opsional)</span>
                  </label>
                  <input
                    type="tel"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    placeholder="081234567890"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-[#FF4696] text-sm transition-all"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#1E1033] mb-1.5 uppercase flex items-center gap-1.5">
                    <Banknote className="w-3.5 h-3.5 text-[#FF4696]" />
                    <span>Estimasi Budget (Rp)</span>
                  </label>
                  <input
                    type="number"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    placeholder="150000"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-[#FF4696] text-sm transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#1E1033] mb-1.5 uppercase flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#FF4696]" />
                  <span>Keinginan / Detail Buket Kustom *</span>
                </label>
                <textarea
                  name="deskripsi"
                  rows={3}
                  value={formData.deskripsi}
                  onChange={handleChange}
                  placeholder="Contoh: Mau buket pita satin tema pink pastel dengan boneka wisuda dan bunga mawar sisa 5 tangkai..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-[#FF4696] text-sm transition-all"
                  required
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-3 rounded-xl border-2 border-gray-200 font-bold text-gray-600 hover:bg-[#FBFBFB] uppercase tracking-wide"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-[#FF4696] text-white font-bold uppercase tracking-wide hover:bg-[#e03a83] active:scale-95 transition-all shadow-md shadow-pink-200 inline-flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Kirim ke WhatsApp</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </main>
  );
}