'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Flower2, ShoppingBag, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-[#FBFBFB]/85 border-b border-pink-100/60 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand Name - Sinkron dengan Logo Asli */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#1E1033] flex items-center justify-center text-[#FF4696] shadow-sm group-hover:scale-105 transition-transform duration-200">
              <Flower2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-brand-script text-2xl sm:text-3xl text-[#1E1033] group-hover:text-[#FF4696] transition-colors leading-none pt-1">
                Artomoro<span className="text-[#FF4696]">Craft</span>
              </span>
              <span className="font-heading-serif text-[9px] sm:text-[10px] font-bold text-gray-500 tracking-[0.2em] uppercase mt-0.5">
                Let Your Feelings Blossom
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              href="/" 
              className="text-xs sm:text-sm font-semibold tracking-wide uppercase text-[#1E1033] hover:text-[#FF4696] transition-colors"
            >
              Beranda
            </Link>
            <Link 
              href="/katalog" 
              className="text-xs sm:text-sm font-semibold tracking-wide uppercase text-[#1E1033] hover:text-[#FF4696] transition-colors"
            >
              Katalog Buket
            </Link>
            <Link 
              href="/#tentang" 
              className="text-xs sm:text-sm font-semibold tracking-wide uppercase text-[#1E1033] hover:text-[#FF4696] transition-colors"
            >
              Tentang Kami
            </Link>
            <Link 
              href="/#kontak" 
              className="text-xs sm:text-sm font-semibold tracking-wide uppercase text-[#1E1033] hover:text-[#FF4696] transition-colors"
            >
              Kontak WA
            </Link>
          </nav>

          {/* Action Button & Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            <Link
              href="/katalog"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FF4696] text-white text-xs font-bold tracking-wide uppercase hover:bg-[#e03a83] active:scale-95 transition-all shadow-sm"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Pesan Sekarang</span>
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-xl text-[#1E1033] hover:bg-pink-50 transition-colors"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-[#FBFBFB] border-b border-pink-100 px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-200">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold uppercase tracking-wide text-[#1E1033] hover:bg-pink-50 hover:text-[#FF4696] transition-colors"
          >
            Beranda
          </Link>
          <Link
            href="/katalog"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold uppercase tracking-wide text-[#1E1033] hover:bg-pink-50 hover:text-[#FF4696] transition-colors"
          >
            Katalog Buket
          </Link>
          <Link
            href="/#tentang"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold uppercase tracking-wide text-[#1E1033] hover:bg-pink-50 hover:text-[#FF4696] transition-colors"
          >
            Tentang Kami
          </Link>
          <Link
            href="/#kontak"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold uppercase tracking-wide text-[#1E1033] hover:bg-pink-50 hover:text-[#FF4696] transition-colors"
          >
            Kontak WA
          </Link>
          
          <div className="pt-2">
            <Link
              href="/katalog"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#FF4696] text-white text-xs font-bold uppercase tracking-wide shadow-sm"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Pesan Sekarang</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}