'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { setLocaleCookie } from '@/lib/i18n';

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0h.5a2.5 2.5 0 002.5-2.5V3.935M12 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}

function GalleryIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function BeforeAfterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  );
}

function AboutIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );
}

const NAV_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  home: HomeIcon,
  gallery: GalleryIcon,
  beforeAfter: BeforeAfterIcon,
  about: AboutIcon,
  contact: PhoneIcon,
};

const NAV_KEYS = [
  { href: '/', key: 'home' },
  { href: '/gallery', key: 'gallery' },
  { href: '/before-after', key: 'beforeAfter' },
  { href: '/about', key: 'about' },
  { href: '/contact', key: 'contact' },
] as const;

type NavLabels = Record<string, string>;

type NavbarProps = {
  initialLocale: string;
  languages: { code: string; name: string }[];
  navLabels: NavLabels;
};

export default function Navbar({ initialLocale, languages, navLabels }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const languageRefDesktop = useRef<HTMLDivElement>(null);
  const languageRefMobile = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      const inside =
        languageRefDesktop.current?.contains(target) || languageRefMobile.current?.contains(target);
      if (!inside) setLanguageOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const label = (key: string, fallback: string) => navLabels[key] || fallback;

  const handleLocaleChange = (code: string) => {
    setLocaleCookie(code);
    setMobileOpen(false);
    router.refresh();
  };

  return (
    <header className="fixed left-0 right-0 top-0 z-50 w-full border-b border-neutral-800 bg-neutral-950/90 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/80">
      <nav className="mx-auto flex w-full min-w-0 max-w-[90rem] items-center gap-3 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 sm:gap-6 sm:px-6 md:gap-8 lg:px-8">
        {/* Left — logo */}
        <div className="flex min-w-0 flex-1 items-center">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2 sm:gap-3"
            aria-label="The Painters - Home"
          >
            <Image
              src="/logo.png"
              alt="THEPAINTERS - Paint It Right"
              width={48}
              height={48}
              className="h-9 w-9 sm:h-12 sm:w-12 object-contain"
              priority
            />
            <span className="text-lg font-bold text-brand-yellow tracking-tight hidden sm:inline md:text-xl">
              The Painters
            </span>
          </Link>
        </div>

        {/* Center — desktop nav links (hidden on mobile/tablet portrait, visible from md up) */}
        <div className="hidden md:flex flex-1 items-center justify-center gap-1 lg:gap-3 xl:gap-4">
          {NAV_KEYS.map(({ href, key }) => {
            const isActive =
              pathname === href ||
              (href !== '/' && pathname.startsWith(href));
            const Icon = NAV_ICONS[key];
            return (
              <Link
                key={key}
                href={href}
                className={`flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium transition-colors whitespace-nowrap lg:px-3 lg:text-base ${
                  isActive
                    ? 'bg-brand-yellow/20 text-brand-yellow'
                    : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
                }`}
              >
                {Icon && <Icon className="h-4 w-4 shrink-0" />}
                {label(key, key)}
              </Link>
            );
          })}
        </div>

        {/* Right — Admin + language switcher (desktop); language + hamburger (mobile) */}
        <div className="flex min-w-0 flex-1 items-center justify-end gap-1 sm:gap-2">
          {/* Desktop: Admin + language */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/admin"
              className="rounded-lg px-3 py-2 text-base text-neutral-400 hover:text-neutral-300"
            >
              {label('admin', 'Admin')}
            </Link>
            {languages.length > 1 && (
              <div className="relative ml-2" ref={languageRefDesktop}>
                <button
                  type="button"
                  onClick={() => setLanguageOpen((o) => !o)}
                  className="flex items-center gap-2 rounded-full border border-neutral-800 bg-black px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                  aria-expanded={languageOpen}
                  aria-haspopup="true"
                  aria-label="Select language"
                >
                  <GlobeIcon className="h-4 w-4 shrink-0" />
                  <span>{label('language', 'Language')}</span>
                  <ChevronDownIcon className={`h-4 w-4 shrink-0 transition-transform ${languageOpen ? 'rotate-180' : ''}`} />
                </button>
                {languageOpen && (
                  <div className="absolute end-0 top-full z-50 mt-1.5 min-w-[10rem] rounded-xl border border-neutral-700 bg-neutral-900 py-1.5 shadow-xl shadow-black/40">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => handleLocaleChange(lang.code)}
                        className={`w-full px-4 py-2.5 text-start text-sm font-medium transition-colors first:rounded-t-lg last:rounded-b-lg ${
                          initialLocale === lang.code
                            ? 'bg-brand-yellow/20 text-brand-yellow'
                            : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
                        }`}
                      >
                        {lang.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile / tablet: language + hamburger */}
          <div className="flex md:hidden items-center gap-1 min-[400px]:gap-2">
          {languages.length > 1 && (
            <div className="relative" ref={languageRefMobile}>
              <button
                type="button"
                onClick={() => setLanguageOpen((o) => !o)}
                className="flex min-h-[44px] min-w-[44px] items-center justify-center gap-1.5 rounded-full border border-neutral-800 bg-black px-2.5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-yellow min-[400px]:min-h-0 min-[400px]:min-w-0 min-[400px]:px-3.5"
                aria-expanded={languageOpen}
                aria-haspopup="true"
                aria-label="Select language"
              >
                <GlobeIcon className="h-4 w-4 shrink-0 min-[400px]:h-3.5 min-[400px]:w-3.5" />
                <span className="max-[399px]:sr-only">{label('language', 'Language')}</span>
                <ChevronDownIcon className={`h-4 w-4 shrink-0 transition-transform min-[400px]:h-3.5 min-[400px]:w-3.5 ${languageOpen ? 'rotate-180' : ''}`} />
              </button>
              {languageOpen && (
                <div className="absolute end-0 top-full z-50 mt-1.5 min-w-[10rem] rounded-xl border border-neutral-700 bg-neutral-900 py-1.5 shadow-xl shadow-black/40">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => handleLocaleChange(lang.code)}
                      className={`w-full px-4 py-2.5 text-start text-sm font-medium transition-colors first:rounded-t-lg last:rounded-b-lg ${
                        initialLocale === lang.code
                          ? 'bg-brand-yellow/20 text-brand-yellow'
                          : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
                      }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg p-2.5 text-neutral-400 hover:bg-neutral-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-brand-yellow"
            aria-expanded={mobileOpen}
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          </div>
        </div>
      </nav>

      {mobileOpen && (
        <div className="md:hidden max-h-[calc(100vh-4.5rem)] overflow-y-auto border-t border-neutral-800 bg-neutral-950/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <div className="flex flex-col gap-0.5">
            {NAV_KEYS.map(({ href, key }) => {
              const isActive =
                pathname === href ||
                (href !== '/' && pathname.startsWith(href));
              const Icon = NAV_ICONS[key];
              return (
                <Link
                  key={key}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-3 text-base font-medium transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-brand-yellow/20 text-brand-yellow'
                      : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
                  }`}
                >
                  {Icon && <Icon className="h-5 w-5 shrink-0" />}
                  {label(key, key)}
                </Link>
              );
            })}
            <Link
              href="/admin"
              onClick={() => setMobileOpen(false)}
              className="flex min-h-[44px] items-center rounded-lg px-3 py-3 text-base text-neutral-400 hover:bg-neutral-800 hover:text-white"
            >
              {label('admin', 'Admin')}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
