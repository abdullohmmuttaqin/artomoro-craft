import type { Metadata } from 'next';
import { Cormorant_Garamond, Sacramento, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';

// 1. Font Heading Serif Mewah
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-serif',
  display: 'swap',
});

// 2. Font Script Cursive (Sesuai Logo)
const sacramento = Sacramento({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-script',
  display: 'swap',
});

// 3. Font UI Body Text (Clean & Modern)
const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ArtomoroCraft - Premium Flower & Bouquet',
  description: 'E-Commerce Buket Bunga Modern & Elegan Cilacap. Pesan buket kustom dengan mudah via WhatsApp.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${cormorant.variable} ${sacramento.variable} ${jakarta.variable}`}>
      <body className="antialiased bg-[#FBFBFB] text-[#1E1033] font-sans">
        <Navbar />
        {children}
      </body>
    </html>
  );
}