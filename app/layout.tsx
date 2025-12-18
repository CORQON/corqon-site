import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ErrorBoundary from '@/components/ErrorBoundary';
import GlobalErrorHandler from '@/components/GlobalErrorHandler';
import FaviconHead from '@/components/FaviconHead';

const inter = Inter({ 
  subsets: ['latin'], 
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter' 
});

export const metadata: Metadata = {
  title: 'CORQON - Turn vitality into measurable performance',
  description: 'AI-driven platform that improves employee vitality, focus and work performance through actionable insights.',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${inter.variable}`}>
      <body className="min-h-screen bg-[#0a0a0a] overflow-x-hidden">
        <FaviconHead />
        <GlobalErrorHandler />
        <ErrorBoundary>
          <div className="relative min-h-screen flex flex-col overflow-x-hidden">
            <Navbar />
            <main className="flex-1 overflow-x-hidden min-w-0">
              {children}
            </main>
            <Footer />
          </div>
        </ErrorBoundary>
      </body>
    </html>
  );
}
