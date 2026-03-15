'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AdminProvider, useAdmin } from '@/contexts/AdminContext';

const navItems = [
  { href: '/admin/content', label: 'Content' },
  { href: '/admin/messages', label: 'Messages' },
  { href: '/admin/gallery', label: 'Gallery' },
  { href: '/admin/before-after', label: 'Before & After' },
];

function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { auth, error, password, setPassword, handleLogin, handleLogout } = useAdmin();

  if (!auth) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-4">
        <div className="admin-grit w-full max-w-sm space-y-6 bg-neutral-900/80 p-8 shadow-xl shadow-black/20">
          <h1 className="admin-page-title">Admin</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="admin-password"
                className="admin-body mb-1.5 block font-medium text-neutral-300"
              >
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-neutral-600 bg-neutral-800 px-3 py-2.5 text-neutral-100 placeholder-neutral-500 focus:border-brand-yellow focus:outline-none focus:ring-1 focus:ring-brand-yellow"
                placeholder="Enter admin password"
                required
              />
            </div>
            {error && (
              <p className="admin-body rounded-lg bg-red-500/10 px-3 py-2 text-red-400">{error}</p>
            )}
            <button
              type="submit"
              className="w-full rounded-lg bg-brand-yellow py-2.5 font-semibold text-neutral-900 transition-colors hover:bg-brand-yellow-dark focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:ring-offset-2 focus:ring-offset-neutral-900"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="relative mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 sm:flex-row sm:gap-8">
      {/* Sidebar: in flow on mobile, fixed when scrolling on sm+ */}
      <aside className="w-56 shrink-0 sm:fixed sm:left-4 sm:top-[calc(5.5rem+1.5rem)] sm:z-30">
        <div className="admin-grit space-y-1 p-3">
          <div className="mb-3 flex items-center justify-between border-b border-neutral-700 pb-3">
            <span className="admin-section-title text-brand-yellow">Admin</span>
            <button
              type="button"
              onClick={handleLogout}
              className="admin-body rounded-lg px-2.5 py-1.5 font-medium text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-neutral-100"
            >
              Logout
            </button>
          </div>
          <nav className="flex flex-col gap-0.5">
            {navItems.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`admin-body rounded-lg px-3 py-2.5 font-medium transition-colors ${
                  pathname === href
                    ? 'bg-brand-yellow/15 text-brand-yellow'
                    : 'text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </aside>
      {/* Spacer on sm+ so main content starts to the right of the fixed sidebar */}
      <div className="hidden w-56 shrink-0 sm:block" aria-hidden />
      <div className="flex min-w-0 flex-1 justify-center">
        <main className="admin-main w-full max-w-3xl">
          {error && (
            <div className="admin-body mb-4 rounded-lg bg-red-500/10 px-4 py-3 text-red-400">
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
