import type { Metadata } from 'next';
import { Mail, MessageSquare, Globe } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact GoalRush Global',
  description: 'Get in touch with the GoalRush Global team for editorial enquiries, advertising, or technical support.',
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 lg:px-6 py-16">
      <h1 className="text-4xl font-display tracking-wider text-white mb-3">CONTACT US</h1>
      <p className="text-brand-gray text-lg mb-12">Get in touch with the GoalRush Global team.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          { icon: Mail,          title: 'Editorial',    detail: 'goalrushglobal83@gmail.com', href: 'mailto:goalrushglobal83@gmail.com?subject=Editorial+Enquiry', desc: 'News tips, corrections, press enquiries' },
          { icon: Globe,         title: 'Advertising',  detail: 'goalrushglobal83@gmail.com', href: 'mailto:goalrushglobal83@gmail.com?subject=Advertising+Enquiry', desc: 'Partnerships and sponsorships' },
          { icon: MessageSquare, title: 'Support',      detail: 'goalrushglobal83@gmail.com', href: 'mailto:goalrushglobal83@gmail.com?subject=Support+Request', desc: 'Technical issues and feedback' },
        ].map(({ icon: Icon, title, detail, href, desc }) => (
          <div key={title} className="gr-card p-6">
            <Icon className="w-5 h-5 text-brand-gold mb-3"/>
            <h3 className="text-white font-semibold mb-1">{title}</h3>
            <a href={href} className="text-brand-red text-sm mb-2 break-all hover:underline block">{detail}</a>
            <p className="text-brand-gray text-xs">{desc}</p>
          </div>
        ))}
      </div>

      <div className="gr-card p-8">
        <h2 className="text-white font-semibold text-lg mb-6">Send a Message</h2>
        <form
          action="mailto:goalrushglobal83@gmail.com"
          method="post"
          encType="text/plain"
          className="space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="contact-name" className="text-brand-gray text-xs font-semibold uppercase tracking-wider block mb-2">Name</label>
              <input id="contact-name" name="name" type="text" placeholder="Your name" required
                className="w-full bg-brand-dark border border-brand-border rounded-lg px-4 py-3 text-white text-sm placeholder:text-brand-muted focus:outline-none focus:border-brand-red"/>
            </div>
            <div>
              <label htmlFor="contact-email" className="text-brand-gray text-xs font-semibold uppercase tracking-wider block mb-2">Email</label>
              <input id="contact-email" name="email" type="email" placeholder="your@email.com" required
                className="w-full bg-brand-dark border border-brand-border rounded-lg px-4 py-3 text-white text-sm placeholder:text-brand-muted focus:outline-none focus:border-brand-red"/>
            </div>
          </div>
          <div>
            <label htmlFor="contact-subject" className="text-brand-gray text-xs font-semibold uppercase tracking-wider block mb-2">Subject</label>
            <input id="contact-subject" name="subject" type="text" placeholder="How can we help?" required
              className="w-full bg-brand-dark border border-brand-border rounded-lg px-4 py-3 text-white text-sm placeholder:text-brand-muted focus:outline-none focus:border-brand-red"/>
          </div>
          <div>
            <label htmlFor="contact-message" className="text-brand-gray text-xs font-semibold uppercase tracking-wider block mb-2">Message</label>
            <textarea id="contact-message" name="message" rows={5} placeholder="Tell us more..." required
              className="w-full bg-brand-dark border border-brand-border rounded-lg px-4 py-3 text-white text-sm placeholder:text-brand-muted focus:outline-none focus:border-brand-red resize-none"/>
          </div>
          <button type="submit" className="gr-btn-primary px-8 w-full sm:w-auto">Send Message</button>
        </form>
      </div>
    </div>
  );
}
