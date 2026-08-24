'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ShoppingBag, MessageSquare, Sparkles, MapPin, 
  Scissors, Truck, Flower2, X, Send, Heart, Banknote, User, Phone, FileText
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

    const waUrl = `https://wa.me/6281234567890?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
    setIsModalOpen(false);
    setFormData({ nama: '', whatsapp: '', budget: '', deskripsi: '' });
  };

  return (
    <main className="min-h-screen bg-[#FBFBFB] text-[#1E1033]">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 md:pt-16 md:pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Copywriting & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              {/* Badge Highlight */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-50 border border-pink-100 text-[#FF4696] text-xs font-bold tracking-wide">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>Buket & Hantaran Eksklusif Cilacap</span>
              </div>

              {/* Main Headline */}
              <h1 className="font-heading-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-wider leading-[1.15] text-[#1E1033] uppercase">
                Let Your Feelings <br />
                <span className="font-brand-script text-5xl sm:text-7xl lg:text-8xl text-[#FF4696] normal-case block pt-1">
                  Blossom
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Hadirkan keindahan dalam setiap momen spesialmu dengan rangkaian buket kustom eksklusif dari <strong className="text-[#1E1033]">Artomoro Craft</strong>.
              </p>

              {/* CTA Buttons */}
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

              {/* Trust Badges Bar */}
              <div className="pt-6 border-t border-gray-100 grid grid-cols-3 gap-2 text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-2 text-xs font-semibold text-gray-700">
                  <MapPin className="w-4 h-4 text-[#FF4696] shrink-0" />
                  <span>Cilacap Area</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start gap-2 text-xs font-semibold text-gray-700">
                  <Scissors className="w-4 h-4 text-[#FF4696] shrink-0" />
                  <span>Custom Design</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start gap-2 text-xs font-semibold text-gray-700">
                  <Truck className="w-4 h-4 text-[#FF4696] shrink-0" />
                  <span>Pengiriman Aman</span>
                </div>
              </div>

            </div>

            {/* Right Column: Visual Showcase */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md aspect-square rounded-3xl bg-gradient-to-br from-pink-100/80 via-white to-pink-50 p-8 border border-pink-100 shadow-xl flex flex-col items-center justify-center text-center space-y-4">
                
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#1E1033] flex items-center justify-center text-[#FF4696] shadow-lg animate-pulse">
                  <Flower2 className="w-12 h-12 sm:w-14 sm:h-14" />
                </div>

                <div className="space-y-1">
                  <h3 className="font-heading-serif text-2xl font-bold text-[#1E1033] uppercase tracking-wide">
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

      {/* Modal Form Pesanan Kustom */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#1E1033]/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl border-2 border-pink-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="px-6 py-5 bg-gradient-to-r from-[#1E1033] to-[#2D1B4D] text-white flex items-center justify-between">
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

            {/* Modal Body */}
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
                  className="px-5 py-3 rounded-xl border-2 border-gray-200 font-bold text-gray-600 hover:bg-gray-50 uppercase tracking-wide"
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