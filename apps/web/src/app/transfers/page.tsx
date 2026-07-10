import type { Metadata } from 'next';
import TransfersClient from '@/components/pages/TransfersClient';

export const metadata: Metadata = {
  title: 'Transfer News & Rumours — Summer 2026',
  description: 'Summer 2026 transfer window: confirmed deals, World Cup-driven rumours, and breaking transfer news.',
  alternates: { canonical: '/transfers' },
};

export default function TransfersPage() {
  return <TransfersClient />;
}
