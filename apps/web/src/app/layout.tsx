import type { Metadata, Viewport } from 'next';
import { Inter, Bebas_Neue, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-bebas-neue',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});
import Footer from '@/components/layout/Footer';
import ScoreTicker from '@/components/layout/ScoreTicker';
import FootballAgent from '@/components/ui/FootballAgent';
import CookieConsent from '@/components/ui/CookieConsent';
import GA4Analytics from '@/components/ui/GA4Analytics';
import { Toaster } from 'react-hot-toast';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'GoalRush Global',
  url: 'https://www.goalrushglobal.com',
  logo: 'https://www.goalrushglobal.com/og-image.jpg',
  sameAs: [
    'https://x.com/GoalRushGlobal',
    'https://instagram.com/GoalRushGlobal00',
    'https://tiktok.com/@goalrushglobal00',
    'https://www.youtube.com/@GoalRushGlobal00',
  ],
  description: 'AI-powered football media platform delivering live scores, breaking news, and analysis 24/7.',
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'GoalRush Global',
  url: 'https://www.goalrushglobal.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: 'https://www.goalrushglobal.com/search?q={search_term_string}' },
    'query-input': 'required name=search_term_string',
  },
};

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
    icon: '/icon.png',
    apple: '/apple-icon.png',
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#091410',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${bebasNeue.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-brand-black">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:bg-brand-black focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:border focus:border-brand-gold focus:text-sm focus:font-semibold"
        >
          Skip to main content
        </a>
        <ScoreTicker />
        <Header />
        <main id="main-content" className="flex-1">{children}</main>
        <Footer />
        <FootballAgent />
        <CookieConsent />
        <GA4Analytics gaId={GA_ID ?? ''} />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#1e2d3d',
              color: '#f0f4f8',
              border: '1px solid #2d4258',
            },
          }}
        />
      </body>
    </html>
  );
}
