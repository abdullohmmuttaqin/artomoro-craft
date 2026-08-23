import { Flower2, ShoppingBag, ShieldCheck, Sparkles } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 bg-[#FBFBFB]">
      {/* Hero Container - Responsive Mobile to Desktop */}
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-sm border border-pink-100 p-6 sm:p-10 text-center space-y-6">
        
        {/* Badge Brand */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-50 text-[#FF4696] text-xs sm:text-sm font-semibold tracking-wide">
          <Sparkles className="w-4 h-4" />
          <span>ArtomoroCraft V2 Engine Ready</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl font-bold text-[#1E1033] tracking-tight leading-tight">
          Let Your Feelings <span className="text-[#FF4696]">Blossom</span>
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto leading-relaxed">
          Platform E-Commerce Buket Bunga Modern, Elegan, dan Cepat. Disiapkan dengan Next.js App Router & Tailwind CSS.
        </p>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 text-left">
          <div className="p-3 rounded-xl bg-[#FBFBFB] border border-gray-100 flex items-center gap-3">
            <Flower2 className="w-5 h-5 text-[#FF4696] shrink-0" />
            <span className="text-xs font-medium text-[#1E1033]">Buket Premium</span>
          </div>

          <div className="p-3 rounded-xl bg-[#FBFBFB] border border-gray-100 flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-[#FF4696] shrink-0" />
            <span className="text-xs font-medium text-[#1E1033]">Direct WA Order</span>
          </div>

          <div className="p-3 rounded-xl bg-[#FBFBFB] border border-gray-100 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-[#FF4696] shrink-0" />
            <span className="text-xs font-medium text-[#1E1033]">Admin Panel</span>
          </div>
        </div>

      </div>
    </main>
  );
}