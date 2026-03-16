'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AdminProvider, useAdmin } from '@/contexts/AdminContext';

const NAV_LINKS = [
  { href: '/admin/home', key: 'home' as const, labelKey: 'homePage' as const },
  { href: '/admin/about', key: 'about' as const, labelKey: 'aboutPage' as const },
  { href: '/admin/gallery', key: 'gallery' as const, labelKey: 'gallery' as const },
  { href: '/admin/before-after', key: 'beforeAfter' as const, labelKey: 'beforeAfter' as const },
  { href: '/admin/messages', key: 'messages' as const, labelKey: 'messages' as const },
] as const;

function ContentIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M8 9h8M8 13h5" />
    </svg>
  );
}

function MessagesIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5A8.5 8.5 0 0 1 21 11v.5Z" />
    </svg>
  );
}

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3 12L12 3l9 9" />
      <path d="M5 10v10h5v-6h4v6h5V10" />
    </svg>
  );
}

function AboutIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12" y2="8" />
    </svg>
  );
}

function GalleryIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-4-4-3 3-2-2-4 4" />
    </svg>
  );
}

function BeforeAfterIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 3v18" />
      <path d="M7 6h5M7 12h2M7 18h3" />
      <path d="M17 6h-2M17 12h-5M17 18h-4" />
    </svg>
  );
}

const NAV_ICONS: Record<string, (props: { className?: string }) => JSX.Element> = {
  home: HomeIcon,
  about: AboutIcon,
  content: ContentIcon,
  messages: MessagesIcon,
  gallery: GalleryIcon,
  beforeAfter: BeforeAfterIcon,
};

function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { auth, error, password, setPassword, handleLogin, handleLogout, adminLabels } = useAdmin();

  if (!auth) {
    return (
      <div className="relative flex min-h-[70vh] items-center justify-center bg-gradient-to-b from-neutral-900 via-neutral-950 to-black px-4">
        <div className="w-full max-w-md rounded-3xl border border-neutral-800 bg-neutral-950/70 p-8 shadow-[0_18px_60px_rgba(0,0,0,0.75)] backdrop-blur">
          <div className="mb-6 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-yellow/80">
              {adminLabels.admin}
            </p>
            <h1 className="admin-page-title">Sign in to dashboard</h1>
            <p className="admin-small">
              Manage your site content, gallery and messages from this secure admin area.
            </p>
          </div>
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="admin-password"
                className="admin-body mb-1.5 block font-medium text-neutral-300"
              >
                {adminLabels.password}
              </label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-3.5 py-3 text-neutral-100 placeholder-neutral-500 shadow-sm focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/70"
                placeholder="Enter admin password"
                required
              />
              {error && (
                <p className="admin-small rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-red-300">
                  {error}
                </p>
              )}
            </div>
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-xl bg-brand-yellow px-4 py-2.5 text-sm font-semibold text-neutral-950 shadow-lg shadow-brand-yellow/30 transition-transform transition-colors hover:-translate-y-0.5 hover:bg-brand-yellow-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
            >
              {adminLabels.login}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="relative mx-auto flex max-w-6xl gap-4 px-4 py-6 sm:gap-6 lg:gap-8">
      {/* Sidebar */}
      <aside className="hidden w-60 shrink-0 md:block">
        <div className="h-full rounded-3xl border border-neutral-800 bg-gradient-to-b from-neutral-950/90 via-neutral-950/70 to-neutral-900/80 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.9)]">
          <div className="mb-4 flex items-center justify-between gap-3 border-b border-neutral-800 pb-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-yellow/80">
                {adminLabels.admin}
              </p>
              <p className="text-xs text-neutral-400">Site control center</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-xs font-medium text-neutral-300 transition-colors hover:border-red-400/70 hover:bg-red-500/10 hover:text-red-200"
            >
              {adminLabels.logout}
            </button>
          </div>

          <nav className="space-y-1">
            {NAV_LINKS.map(({ href, key, labelKey }) => {
              const isActive = pathname === href;
              const Icon = NAV_ICONS[key];
              return (
                <Link
                  key={href}
                  href={href}
                  className={`group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-brand-yellow/15 text-brand-yellow'
                      : 'text-neutral-300 hover:bg-neutral-800/80 hover:text-white'
                  }`}
                >
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-xl border text-xs ${
                      isActive
                        ? 'border-brand-yellow/70 bg-brand-yellow/15 text-brand-yellow'
                        : 'border-neutral-700 bg-neutral-900/70 text-neutral-400 group-hover:border-brand-yellow/40 group-hover:text-brand-yellow'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="truncate">{adminLabels[labelKey]}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-6 rounded-2xl border border-dashed border-neutral-700/80 bg-neutral-900/40 p-3">
            <p className="text-xs font-medium text-neutral-300">Tip</p>
            <p className="mt-1 text-[11px] leading-relaxed text-neutral-400">
              Use the tabs on each page to fine‑tune your content, gallery and SEO text.
            </p>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-neutral-800 bg-neutral-950/80 px-4 py-3 shadow-[0_16px_40px_rgba(0,0,0,0.7)] backdrop-blur">
          <div>
            <h1 className="admin-page-title">Admin dashboard</h1>
            <p className="admin-small">
              Edit your content, review messages, and curate the gallery in one place.
            </p>
          </div>
          <div className="rounded-full border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs text-neutral-400">
            Signed in as <span className="font-semibold text-neutral-200">Administrator</span>
          </div>
        </header>

        <main className="admin-main relative min-w-0 rounded-3xl border border-neutral-800 bg-neutral-950/80 p-4 shadow-[0_18px_50px_rgba(0,0,0,0.8)] sm:p-6">
          {error && (
            <div className="admin-body mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-red-300">
              {error}
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <AdminShell>{children}</AdminShell>
    </AdminProvider>
  );
}
