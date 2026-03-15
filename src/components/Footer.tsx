'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

type FooterData = { copyrightText?: string; privacyLink?: boolean };

type FooterProps = {
  privacyLabel?: string;
};

export default function Footer({ privacyLabel = 'Privacy' }: FooterProps) {
  const [footer, setFooter] = useState<FooterData>({ copyrightText: '© 2025 The Painters LB', privacyLink: true });

  useEffect(() => {
    fetch('/api/public-config')
      .then((r) => r.json())
      .then((data) => data.footer && setFooter(data.footer))
      .catch(() => {});
  }, []);

  return (
    <footer className="mt-auto border-t border-neutral-800 py-6">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-4 gap-y-2 px-4 text-center text-sm text-neutral-500">
        <span>{footer.copyrightText || '© 2025 The Painters LB'}</span>
        {footer.privacyLink !== false && (
          <>
            <span className="hidden sm:inline">·</span>
            <Link href="/privacy" className="text-neutral-400 hover:text-brand-yellow transition-colors">
              {privacyLabel}
            </Link>
          </>
        )}
      </div>
    </footer>
  );
}
