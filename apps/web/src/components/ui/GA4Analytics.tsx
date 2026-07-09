'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';
import { CONSENT_KEY } from './CookieConsent';

export default function GA4Analytics({ gaId }: { gaId: string }) {
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    function check() {
      if (localStorage.getItem(CONSENT_KEY) === 'accepted') {
        setConsented(true);
      }
    }
    check();
    window.addEventListener('gr-consent-accepted', check);
    return () => window.removeEventListener('gr-consent-accepted', check);
  }, []);

  if (!consented || !gaId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${gaId}', { page_path: window.location.pathname });
      `}</Script>
    </>
  );
}
