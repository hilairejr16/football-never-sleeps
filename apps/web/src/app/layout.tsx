import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ScoreTicker from '@/components/layout/ScoreTicker';
import FootballAgent from '@/components/ui/FootballAgent';
import { Toaster } from 'react-hot-toast';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'GoalRush Global',
  url: 'https://www.goalrushglobal.com',
  logo: 'https://www.goalrushglobal.com/og-image.jpg',
  sameAs: [
    'https://twitter.com/GoalRushGlobal',
    'https://instagram.com/GoalRushGlobal00',
    'https://tiktok.com/@goalrushglobal00',
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
    target: { '@type': 'EntryPoint', urlTemplate: 'https://www.goalrushglobal.com/news?q={search_term_string}' },
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
  themeColor: '#0f1923',
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
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        {GA_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="gtag-init" strategy="afterInteractive">{`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}', { page_path: window.location.pathname });
            `}</Script>
          </>
        )}
      </head>
      <body className="min-h-screen flex flex-col bg-brand-black">
        <ScoreTicker />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <FootballAgent />
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
