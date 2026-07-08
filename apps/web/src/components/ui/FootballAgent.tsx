'use client';

import Script from 'next/script';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'elevenlabs-convai': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & { 'agent-id': string },
        HTMLElement
      >;
    }
  }
}

const AGENT_ID = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;

export default function FootballAgent() {
  if (!AGENT_ID) return null;

  return (
    <>
      <Script
        src="https://elevenlabs.io/convai-widget/index.js"
        strategy="lazyOnload"
      />
      <elevenlabs-convai agent-id={AGENT_ID} />
    </>
  );
}
