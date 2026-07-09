import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'How GoalRush Global uses cookies and similar tracking technologies on our website.',
  alternates: { canonical: '/cookies' },
};

const SECTIONS = [
  {
    title: 'What Are Cookies?',
    body: `Cookies are small text files placed on your device when you visit a website. They allow the site to remember your preferences, understand how you interact with content, and improve your experience over time. They are not programs and cannot carry viruses.`,
  },
  {
    title: 'How We Use Cookies',
    body: `GoalRush Global uses cookies solely to improve your experience and to understand how our content is used. We do not sell your data or use cookies for advertising profiling.`,
  },
  {
    title: 'Types of Cookies We Use',
    body: null,
    table: [
      { type: 'Strictly Necessary', purpose: 'Required for the site to function. No personal data collected. Cannot be disabled.', examples: 'Session state, security tokens' },
      { type: 'Analytics (optional)', purpose: 'Help us understand which pages are most popular and how visitors navigate the site. Only loaded after you accept.', examples: 'Google Analytics 4 (GA4)' },
      { type: 'Preference', purpose: 'Remember your choices — e.g. whether you accepted or declined cookies.', examples: 'gr-cookie-consent (localStorage)' },
    ],
  },
  {
    title: 'Google Analytics 4',
    body: `With your consent, we use Google Analytics 4 (GA4) to collect anonymised usage data — pages visited, time on site, country, device type. We have enabled IP anonymisation. This data is aggregated and never identifies you personally. GA4 is governed by Google's Privacy Policy. You can opt out at any time by declining cookies via our consent banner, or by installing the Google Analytics Opt-out Browser Add-on.`,
  },
  {
    title: 'Our Cookie Consent Key',
    body: `When you make a choice on our consent banner, we store a single key in your browser's localStorage: \`gr-cookie-consent\` with value \`accepted\` or \`declined\`. This is not a cookie — it does not leave your device and is not transmitted to any server.`,
  },
  {
    title: 'Managing Cookies',
    body: `You can manage or delete cookies at any time through your browser settings. Most browsers let you block all cookies, accept only first-party cookies, or delete existing cookies. Note that disabling strictly necessary items may affect site functionality.`,
  },
  {
    title: 'Changes to This Policy',
    body: `We may update this Cookie Policy from time to time. The "Last updated" date at the bottom of this page reflects the most recent revision. Continued use of GoalRush Global after any changes constitutes acceptance of the updated policy.`,
  },
  {
    title: 'Contact Us',
    body: `Questions about our use of cookies? Reach us at goalrushglobal83@gmail.com or via our Contact page.`,
  },
];

export default function CookiePolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 lg:px-6 py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-brand-gray text-sm mb-8">
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <span>/</span>
        <span className="text-white">Cookie Policy</span>
      </div>

      <header className="mb-10">
        <h1 className="font-display text-4xl tracking-wider text-white mb-3">COOKIE POLICY</h1>
        <p className="text-brand-gray text-sm">
          Last updated: <span className="text-white font-medium">9 July 2026</span>
        </p>
        <p className="text-brand-gray mt-4 leading-relaxed">
          This policy explains what cookies are, which ones GoalRush Global uses, and how you can control them. We use cookies sparingly — only what's needed to run the site and (with your permission) understand how it's used.
        </p>
      </header>

      <div className="space-y-10">
        {SECTIONS.map((section, i) => (
          <section key={i}>
            <h2 className="text-white font-semibold text-lg mb-3 flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-brand-red/15 border border-brand-red/30 flex items-center justify-center text-brand-red-light text-xs font-bold flex-shrink-0">
                {i + 1}
              </span>
              {section.title}
            </h2>

            {section.body && (
              <p className="text-brand-gray leading-relaxed text-sm ml-9">{section.body}</p>
            )}

            {section.table && (
              <div className="ml-9 overflow-x-auto rounded-xl border border-brand-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-brand-dark border-b border-brand-border">
                      <th className="text-left text-white font-semibold px-4 py-3 w-40">Type</th>
                      <th className="text-left text-white font-semibold px-4 py-3">Purpose</th>
                      <th className="text-left text-white font-semibold px-4 py-3 w-44">Examples</th>
                    </tr>
                  </thead>
                  <tbody>
                    {section.table.map((row, j) => (
                      <tr key={j} className={j < section.table!.length - 1 ? 'border-b border-brand-border' : ''}>
                        <td className="px-4 py-3 text-brand-gold font-semibold align-top">{row.type}</td>
                        <td className="px-4 py-3 text-brand-gray align-top leading-relaxed">{row.purpose}</td>
                        <td className="px-4 py-3 text-brand-gray font-mono text-xs align-top">{row.examples}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        ))}
      </div>

      {/* Footer links */}
      <div className="mt-12 pt-6 border-t border-brand-border flex flex-wrap gap-4 text-sm text-brand-gray">
        <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
        <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
        <Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link>
      </div>
    </div>
  );
}
