'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

type CookieNoticeData = { enabled: boolean; message: string; linkText?: string };

const STORAGE_KEY = 'thepainters_cookie_ack';

export default function CookieNotice() {
  const [config, setConfig] = useState<CookieNoticeData | null>(null);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const ack = localStorage.getItem(STORAGE_KEY);
    if (ack === '1') {
      setConfig(null);
      setDismissed(true);
      return;
    }
    fetch('/api/public-config')
      .then((r) => r.json())
      .then((data) => {
        const notice = data.cookieNotice;
        if (notice && notice.enabled && notice.message) {
          setConfig(notice);
          setDismissed(false);
        }
      })
      .catch(() => setDismissed(true));
  }, []);

  const handleAccept = () => {
    if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEY, '1');
    setDismissed(true);
  };

  if (!config || dismissed) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-neutral-700 bg-neutral-900/95 backdrop-blur px-4 py-3 shadow-lg">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-3 sm:justify-between sm:gap-4">
        <p className="text-sm text-neutral-300">
          {config.message}
          {config.linkText && (
            <>
              {' '}
              <Link href="/privacy" className="text-brand-yellow hover:underline">
                {config.linkText}
              </Link>
            </>
          )}
        </p>
        <button
          type="button"
          onClick={handleAccept}
          className="shrink-0 rounded-lg bg-brand-yellow px-4 py-2 text-sm font-semibold text-neutral-900 transition-colors hover:bg-brand-yellow-dark focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:ring-offset-2 focus:ring-offset-neutral-900"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
