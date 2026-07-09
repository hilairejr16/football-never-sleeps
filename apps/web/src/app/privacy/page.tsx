import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy — GoalRush Global',
  description: 'GoalRush Global privacy policy — how we collect, use, and protect your data.',
};

const SECTIONS = [
  {
    title: '1. Information We Collect',
    body: `We collect information you provide directly (email address when subscribing to our newsletter), information collected automatically (pages visited, device type, IP address, referring URLs), and analytics data to improve our service. We do not sell your personal information.`,
  },
  {
    title: '2. How We Use Your Information',
    body: `We use collected information to deliver and improve our services, send newsletters you have opted into, personalise content recommendations, and monitor the security and performance of the platform.`,
  },
  {
    title: '3. Cookies',
    body: `GoalRush Global uses cookies and similar tracking technologies to remember your preferences, analyse site traffic, and serve relevant content. You can control cookie settings through your browser. Disabling cookies may affect some site functionality.`,
  },
  {
    title: '4. Third-Party Services',
    body: `We use third-party services including API-Sports for match data and Anthropic's Claude for AI-generated content. These services have their own privacy policies. We may also display third-party advertising; advertisers may use cookies governed by their own policies.`,
  },
  {
    title: '5. Data Retention',
    body: `We retain personal data only as long as necessary to provide our services or as required by law. Newsletter subscriptions are retained until unsubscribed. Analytics data is retained in aggregate form.`,
  },
  {
    title: '6. Your Rights',
    body: `You have the right to access, correct, or delete your personal data. To exercise these rights, contact us at goalrushglobal83@gmail.com. EU/UK users have additional rights under GDPR/UK GDPR.`,
  },
  {
    title: '7. Changes to This Policy',
    body: `We may update this privacy policy from time to time. We will notify subscribers of material changes by email. Continued use of the site after changes constitutes acceptance of the updated policy.`,
  },
  {
    title: '8. Contact',
    body: `Questions about this policy? Contact our privacy team at goalrushglobal83@gmail.com or write to: GoalRush Global, Privacy Team, c/o editorial@goalrushglobal.com.`,
  },
];

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 lg:px-6 py-16">
      <h1 className="text-4xl font-display tracking-wider text-white mb-3">PRIVACY POLICY</h1>
      <p className="text-brand-gray mb-2">Last updated: 1 July 2026</p>
      <p className="text-brand-gray text-sm mb-12">
        This policy describes how GoalRush Global (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;) handles your personal information.
      </p>
      <div className="space-y-8">
        {SECTIONS.map(s => (
          <div key={s.title} className="gr-card p-6">
            <h2 className="text-white font-semibold mb-3">{s.title}</h2>
            <p className="text-brand-gray text-sm leading-relaxed">{s.body}</p>
          </div>
        ))}
      </div>
      <div className="mt-10 flex gap-4">
        <Link href="/terms" className="text-brand-red text-sm hover:underline">Terms of Service</Link>
        <Link href="/contact" className="text-brand-red text-sm hover:underline">Contact Us</Link>
      </div>
    </div>
  );
}
