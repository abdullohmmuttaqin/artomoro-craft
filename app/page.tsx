import Link from 'next/link';
import { ShoppingBag, MessageSquare, Sparkles, MapPin, Scissors, Truck, Flower2 } from 'lucide-react';

export default function HomePage() {
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

              {/* CTA Buttons - Responsive Stacking */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
                <Link
                  href="/katalog"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#FF4696] text-white text-sm font-bold tracking-wide uppercase hover:bg-[#e03a83] active:scale-95 transition-all shadow-md shadow-pink-200"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Lihat Katalog</span>
                </Link>

                <Link
                  href="https://wa.me/6281234567890?text=Halo%20Artomoro%20Craft,%20saya%20ingin%20konsultasi%20pemesanan%20buket%20kustom"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-white border border-pink-200 text-[#1E1033] hover:border-[#FF4696] hover:text-[#FF4696] text-sm font-bold tracking-wide uppercase active:scale-95 transition-all shadow-sm"
                >
                  <MessageSquare className="w-4 h-4 text-[#FF4696]" />
                  <span>Pesan Kustom</span>
                </Link>
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

            {/* Right Column: Visual Feature Showcase */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md aspect-square rounded-3xl bg-gradient-to-br from-pink-100/80 via-white to-pink-50 p-8 border border-pink-100 shadow-xl flex flex-col items-center justify-center text-center space-y-4">
                
                {/* Decorative Floral Ring */}
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

                {/* Micro Card Feature */}
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
    </main>
  );
}