'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Headphones, Pause, Play, Loader2 } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

type State = 'idle' | 'loading' | 'playing' | 'paused';
type Engine = 'elevenlabs' | 'speechsynthesis' | null;

interface ListenButtonProps {
  text: string;
  title?: string;
  className?: string;
}

export default function ListenButton({ text, title, className }: ListenButtonProps) {
  const [state, setState] = useState<State>('idle');
  const audioRef    = useRef<HTMLAudioElement | null>(null);
  const blobUrlRef  = useRef<string | null>(null);
  const engineRef   = useRef<Engine>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Pre-load voices so they're ready on first click (Chrome loads them async)
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.addEventListener('voiceschanged', () => {
        window.speechSynthesis.getVoices();
      }, { once: true });
    }
  }, []);

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
      if (engineRef.current === 'speechsynthesis') {
        window.speechSynthesis?.cancel();
      }
    };
  }, []);

  const playWithSpeechSynthesis = useCallback((content: string) => {
    if (!('speechSynthesis' in window)) {
      setState('idle');
      return;
    }
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(content);
    utterance.rate = 0.92;
    utterance.pitch = 1;
    utterance.lang = 'en-GB';

    // Prefer a higher-quality English voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v =>
      v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Daniel') || v.name.includes('Samantha'))
    ) ?? voices.find(v => v.lang.startsWith('en'));
    if (preferred) utterance.voice = preferred;

    utterance.onstart  = () => setState('playing');
    utterance.onend    = () => { setState('idle'); engineRef.current = null; };
    utterance.onpause  = () => setState('paused');
    utterance.onresume = () => setState('playing');
    utterance.onerror  = () => { setState('idle'); engineRef.current = null; };

    utteranceRef.current = utterance;
    engineRef.current = 'speechsynthesis';
    window.speechSynthesis.speak(utterance);
    setState('playing');
  }, []);

  const handleClick = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // ── Pause / resume ElevenLabs audio ─────────────────────────
    if (engineRef.current === 'elevenlabs' && audioRef.current && blobUrlRef.current) {
      if (state === 'playing') {
        audioRef.current.pause();
        setState('paused');
      } else {
        await audioRef.current.play().catch(() => setState('idle'));
        setState('playing');
      }
      return;
    }

    // ── Pause / resume Web Speech ────────────────────────────────
    if (engineRef.current === 'speechsynthesis') {
      if (state === 'playing') {
        window.speechSynthesis.pause();
        setState('paused');
      } else {
        window.speechSynthesis.resume();
        setState('playing');
      }
      return;
    }

    const content = (title ? `${title}. ` : '') + text.slice(0, 4800);

    // ── Start Web Speech SYNCHRONOUSLY first ─────────────────────
    // Chrome drops the user-gesture context after any `await`, so
    // speechSynthesis.speak() must be called before the ElevenLabs fetch.
    playWithSpeechSynthesis(content);

    // ── Try ElevenLabs in background — upgrade if available ───────
    try {
      const controller = new AbortController();
      const tid = setTimeout(() => controller.abort(), 5000);
      const res = await fetch(`${API_BASE}/tts/article`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: content }),
        signal: controller.signal,
      });
      clearTimeout(tid);

      const engineNow = engineRef.current as Engine;
      if (res.ok && engineNow === 'speechsynthesis') {
        // Upgrade from browser TTS to ElevenLabs audio
        window.speechSynthesis.cancel();
        const blob = await res.blob();
        const url  = URL.createObjectURL(blob);
        blobUrlRef.current = url;

        const audio = new Audio(url);
        audioRef.current  = audio;
        engineRef.current = 'elevenlabs';

        audio.onended = () => { setState('idle'); engineRef.current = null; };
        audio.onpause = () => { if (!audio.ended) setState('paused'); };

        await audio.play();
        setState('playing');
      }
    } catch {
      // ElevenLabs unavailable or timed out — browser TTS already playing
    }
  }, [state, text, title, playWithSpeechSynthesis]);

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
