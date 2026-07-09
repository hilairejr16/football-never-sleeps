import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Editorial Policy',
  description: 'How GoalRush Global creates, reviews, and publishes football content — our standards for accuracy, transparency, and AI-assisted journalism.',
  alternates: { canonical: '/editorial-policy' },
};

export default function EditorialPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 lg:px-6 py-12">
      <div className="flex items-center gap-2 text-brand-gray text-sm mb-8">
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <span>/</span>
        <span className="text-white">Editorial Policy</span>
      </div>

      <header className="mb-10">
        <h1 className="font-display text-4xl tracking-wider text-white mb-3">EDITORIAL POLICY</h1>
        <p className="text-brand-gray text-sm">Last updated: 9 July 2026</p>
        <p className="text-brand-gray mt-4 leading-relaxed">
          GoalRush Global is an AI-powered football media platform. This document explains how our content is created, edited, verified, and published — and what "GoalRush AI" authorship means.
        </p>
      </header>

      <div className="space-y-10 text-brand-gray text-sm leading-relaxed">
        <section>
          <h2 className="text-white font-semibold text-lg mb-3">Our Mission</h2>
          <p>To deliver fast, accurate, and engaging football coverage 24 hours a day. We believe football never sleeps — and neither should access to quality coverage. We use AI tools to scale production while holding ourselves to journalistic standards of accuracy, fairness, and transparency.</p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-lg mb-3">AI-Assisted Content</h2>
          <p className="mb-3">Much of our content is generated or drafted using large language models (Claude by Anthropic). Articles labelled <span className="text-brand-gold font-semibold">GoalRush AI</span> have been:</p>
          <ul className="list-disc ml-5 space-y-1.5">
            <li>Generated from verified match data, press releases, and official statistics</li>
            <li>Structured to clearly separate fact (scores, confirmed transfers) from analysis and opinion</li>
            <li>Reviewed for factual accuracy before publication</li>
          </ul>
          <p className="mt-3">AI authorship does not mean unverified content. Scores, transfer fees, and league standings are always sourced from authoritative data providers (API-Football, official club releases, FIFA/UEFA).</p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-lg mb-3">Accuracy Standards</h2>
          <ul className="list-disc ml-5 space-y-1.5">
            <li>Live scores and match data are sourced from licensed football data APIs</li>
            <li>Transfer news is clearly labelled: <em>rumour</em>, <em>confirmed</em>, or <em>completed</em></li>
            <li>Predictions and opinions are labelled as such and do not constitute gambling advice</li>
            <li>Errors discovered post-publication are corrected promptly with a correction notice appended</li>
          </ul>
        </section>

        <section>
          <h2 className="text-white font-semibold text-lg mb-3">Corrections</h2>
          <p>If you believe any content contains a factual error, contact us at <a href="mailto:goalrushglobal83@gmail.com" className="text-brand-red-light hover:underline">goalrushglobal83@gmail.com</a>. We respond to correction requests within 48 hours. Substantive corrections are noted at the top of the affected article.</p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-lg mb-3">Independence & Conflicts of Interest</h2>
          <p>GoalRush Global editorial content is independent of commercial partnerships. Sponsored or promotional content is clearly labelled. We do not accept payment to alter editorial coverage of clubs, players, or competitions.</p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-lg mb-3">Diversity & Representation</h2>
          <p>We cover football globally — all genders, all continents, all levels of the game. We are committed to accurate representation of players and clubs from under-covered regions and leagues, and to respectful coverage of all nationalities.</p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-lg mb-3">Contact the Editorial Team</h2>
          <p>Questions, complaints, or tip-offs: <a href="mailto:goalrushglobal83@gmail.com" className="text-brand-red-light hover:underline">goalrushglobal83@gmail.com</a></p>
        </section>
      </div>

      <div className="mt-12 pt-6 border-t border-brand-border flex flex-wrap gap-4 text-sm text-brand-gray">
        <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
        <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
        <Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link>
      </div>
    </div>
  );
}
