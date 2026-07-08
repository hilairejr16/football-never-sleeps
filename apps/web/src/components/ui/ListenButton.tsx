'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Headphones, Pause, Play, Loader2 } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

type State = 'idle' | 'loading' | 'playing' | 'paused';

interface ListenButtonProps {
  text: string;
  title?: string;
  className?: string;
}

export default function ListenButton({ text, title, className }: ListenButtonProps) {
  const [state, setState] = useState<State>('idle');
  const audioRef    = useRef<HTMLAudioElement | null>(null);
  const blobUrlRef  = useRef<string | null>(null);

  // Clean up audio + blob URL on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
    };
  }, []);

  const handleClick = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const audio = audioRef.current;

    if (audio && blobUrlRef.current) {
      if (state === 'playing') {
        audio.pause();
        setState('paused');
      } else {
        await audio.play().catch(() => setState('idle'));
        setState('playing');
      }
      return;
    }

    setState('loading');
    try {
      const res = await fetch(`${API_BASE}/tts/article`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: (title ? `${title}. ` : '') + text.slice(0, 4800) }),
      });

      if (!res.ok) throw new Error('TTS failed');

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      blobUrlRef.current = url;

      const newAudio = new Audio(url);
      audioRef.current = newAudio;

      newAudio.onended = () => setState('idle');
      newAudio.onpause = () => {
        if (!newAudio.ended) setState('paused');
      };

      await newAudio.play();
      setState('playing');
    } catch {
      setState('idle');
    }
  }, [state, text, title]);

  const ICON: Record<State, React.ReactNode> = {
    idle:    <Headphones className="w-3 h-3" />,
    loading: <Loader2    className="w-3 h-3 animate-spin" />,
    playing: <Pause      className="w-3 h-3" />,
    paused:  <Play       className="w-3 h-3" />,
  };

  const LABEL: Record<State, string> = {
    idle: 'Listen', loading: 'Loading…', playing: 'Pause', paused: 'Resume',
  };

  return (
    <button
      onClick={handleClick}
      disabled={state === 'loading'}
      aria-label={`${LABEL[state]} article`}
      className={[
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all select-none',
        state === 'playing'
          ? 'bg-brand-red text-white'
          : 'bg-brand-card border border-brand-border text-brand-gray hover:text-white hover:border-brand-muted disabled:opacity-50',
        className ?? '',
      ].join(' ')}
    >
      {ICON[state]}
      {LABEL[state]}
    </button>
  );
}
