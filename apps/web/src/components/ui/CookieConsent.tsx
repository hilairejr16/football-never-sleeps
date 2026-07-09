'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export const CONSENT_KEY = 'gr-cookie-consent';

export function getConsentValue(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(CONSENT_KEY);
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    setVisible(false);
    window.dispatchEvent(new Event('gr-consent-accepted'));
  }

  function decline() {
    localStorage.setItem(CONSENT_KEY, 'declined');
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      aria-live="polite"
      style={{ zIndex: 9999 }}
      className="fixed bottom-0 left-0 right-0 bg-brand-dark border-t border-brand-border shadow-2xl shadow-black/60"
    >
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-semibold mb-1">
            🍪 We use cookies
          </p>
          <p className="text-brand-gray text-xs leading-relaxed">
            We use analytics cookies (Google Analytics) to understand how you use GoalRush Global and improve your experience.
            No personal data is sold. See our{' '}
            <Link href="/privacy" className="text-brand-red hover:underline">Privacy Policy</Link>
            {' '}and{' '}
            <Link href="/cookies" className="text-brand-red hover:underline">Cookie Policy</Link>
            {' '}for details.
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={decline}
            className="text-brand-gray hover:text-white text-sm font-medium px-4 py-2 rounded-lg border border-brand-border hover:border-brand-muted transition-colors"
            aria-label="Decline non-essential cookies"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="bg-brand-red hover:bg-brand-red-hover text-white text-sm font-bold px-5 py-2 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2 focus-visible:ring-offset-brand-black"
            aria-label="Accept analytics cookies"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
