import type { Metadata, Viewport } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ScoreTicker from '@/components/layout/ScoreTicker';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: {
    default: 'GoalRush Global — Football Never Sleeps',
    template: '%s | GoalRush Global',
  },
  description:
    'Your ultimate source for live football scores, breaking news, transfer updates, match predictions, and tactical analysis. Football never sleeps.',
  keywords: [
    'football news',
    'live scores',
    'soccer',
    'Premier League',
    'Champions League',
    'transfer news',
    'match predictions',
    'La Liga',
    'Serie A',
    'Bundesliga',
  ],
  authors: [{ name: 'GoalRush Global' }],
  creator: 'GoalRush Global',
  publisher: 'GoalRush Global',
  metadataBase: new URL(process.env.APP_URL ?? 'https://goalrushglobal.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'GoalRush Global',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@GoalRushGlobal',
    site: '@GoalRushGlobal',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#dc2626',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-brand-black">
        <ScoreTicker />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#1a1a1a',
              color: '#ffffff',
              border: '1px solid #2a2a2a',
            },
          }}
        />
      </body>
    </html>
  );
}
