import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Accessibility Statement',
  description: 'GoalRush Global\'s commitment to web accessibility — WCAG 2.1 AA compliance, known issues, and how to request assistance.',
  alternates: { canonical: '/accessibility' },
};

export default function AccessibilityPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 lg:px-6 py-12">
      <div className="flex items-center gap-2 text-brand-gray text-sm mb-8">
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <span>/</span>
        <span className="text-white">Accessibility</span>
      </div>

      <header className="mb-10">
        <h1 className="font-display text-4xl tracking-wider text-white mb-3">ACCESSIBILITY</h1>
        <p className="text-brand-gray text-sm">Last updated: 9 July 2026</p>
        <p className="text-brand-gray mt-4 leading-relaxed">
          GoalRush Global is committed to making our website accessible to everyone, including people with disabilities. We are working toward conformance with the Web Content Accessibility Guidelines (WCAG) 2.1 at Level AA.
        </p>
      </header>

      <div className="space-y-10 text-brand-gray text-sm leading-relaxed">
        <section>
          <h2 className="text-white font-semibold text-lg mb-3">Technical Specification</h2>
          <p>GoalRush Global is built with semantic HTML5, ARIA landmarks and labels, sufficient colour contrast, keyboard navigation support, and screen reader-compatible components. Our frontend uses React/Next.js and Tailwind CSS with a focus on progressive enhancement.</p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-lg mb-3">What We've Done</h2>
          <ul className="list-disc ml-5 space-y-1.5">
            <li>Semantic landmarks: <code className="bg-brand-card px-1 py-0.5 rounded text-xs font-mono">&lt;header&gt;</code>, <code className="bg-brand-card px-1 py-0.5 rounded text-xs font-mono">&lt;main&gt;</code>, <code className="bg-brand-card px-1 py-0.5 rounded text-xs font-mono">&lt;footer&gt;</code>, <code className="bg-brand-card px-1 py-0.5 rounded text-xs font-mono">&lt;nav&gt;</code></li>
            <li>Skip-to-main-content link available on every page</li>
            <li>All interactive elements are keyboard focusable with visible focus indicators</li>
            <li>Images include descriptive alt text</li>
            <li>Form inputs are associated with labels via <code className="bg-brand-card px-1 py-0.5 rounded text-xs font-mono">htmlFor</code></li>
            <li>Colour contrast meets WCAG 2.1 AA (minimum 4.5:1 for body text)</li>
            <li>Live score updates use <code className="bg-brand-card px-1 py-0.5 rounded text-xs font-mono">aria-live</code> regions</li>
            <li>Animations respect <code className="bg-brand-card px-1 py-0.5 rounded text-xs font-mono">prefers-reduced-motion</code></li>
            <li>Cookie consent dialog uses <code className="bg-brand-card px-1 py-0.5 rounded text-xs font-mono">role="dialog"</code> and <code className="bg-brand-card px-1 py-0.5 rounded text-xs font-mono">aria-live="polite"</code></li>
          </ul>
        </section>

        <section>
          <h2 className="text-white font-semibold text-lg mb-3">Known Limitations</h2>
          <ul className="list-disc ml-5 space-y-1.5">
            <li>The live score ticker pauses on focus but may be difficult to read with screen magnification at high scroll speeds</li>
            <li>Some embedded third-party content (ad units) may not meet our accessibility standards — we are working with partners to address this</li>
            <li>The AI football assistant chat widget is currently only accessible via pointer; keyboard-only access is planned</li>
          </ul>
        </section>

        <section>
          <h2 className="text-white font-semibold text-lg mb-3">How to Get Help</h2>
          <p>If you experience any accessibility barriers on GoalRush Global, or if you need content in an alternative format, please contact us:</p>
          <div className="mt-3 bg-brand-card border border-brand-border rounded-xl p-4">
            <p className="text-white font-semibold mb-1">GoalRush Global Accessibility Team</p>
            <a href="mailto:goalrushglobal83@gmail.com" className="text-brand-red-light hover:underline">goalrushglobal83@gmail.com</a>
            <p className="text-brand-gray text-xs mt-2">We aim to respond within 2 business days.</p>
          </div>
        </section>

        <section>
          <h2 className="text-white font-semibold text-lg mb-3">Enforcement</h2>
          <p>If you are not satisfied with our response, you can contact the relevant national accessibility authority in your country. In the United States, this is the Department of Justice Civil Rights Division. In the EU, national equality bodies handle such complaints.</p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-lg mb-3">Feedback</h2>
          <p>We welcome feedback on the accessibility of GoalRush Global. Your reports help us improve for everyone.</p>
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
