'use client';

export default function NewsletterForm() {
  return (
    <form
      className="flex gap-2 w-full md:w-auto"
      onSubmit={e => {
        e.preventDefault();
        const input = (e.currentTarget as HTMLFormElement).elements.namedItem('email') as HTMLInputElement;
        if (input?.value) {
          window.location.href = `mailto:goalrushglobal83@gmail.com?subject=Newsletter+Subscription&body=Please+add+${encodeURIComponent(input.value)}+to+the+GoalRush+Global+newsletter.`;
        }
      }}
    >
      <label htmlFor="footer-email" className="sr-only">Email address</label>
      <input
        id="footer-email"
        name="email"
        type="email"
        required
        placeholder="your@email.com"
        className="bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder:text-blue-200 text-sm focus:outline-none focus:border-white flex-1 md:w-72"
      />
      <button
        type="submit"
        className="bg-white text-brand-red font-bold px-6 py-2.5 rounded-lg hover:bg-red-50 transition-colors text-sm"
      >
        Subscribe
      </button>
    </form>
  );
}
