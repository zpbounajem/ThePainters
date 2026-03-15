import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { Outfit, Inter } from 'next/font/google';
import { ThemeProvider } from '@/contexts/ThemeContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CookieNotice from '@/components/CookieNotice';
import { getContent } from '@/lib/content';
import { isRtl, DEFAULT_LOCALE } from '@/lib/i18n';
import './globals.css';

const outfit = Outfit({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'The Painters LB | Interior House Painting Lebanon',
  description: 'Professional interior house painting in Lebanon. Quality finishes, on time. @thepainters_lb',
  icons: {
    icon: '/logo.png',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const locale = (cookieStore.get('NEXT_LOCALE')?.value || DEFAULT_LOCALE).trim() || DEFAULT_LOCALE;
  const content = (await getContent()) as Record<string, unknown>;
  const languages = (Array.isArray(content.languages) ? content.languages : []) as { code: string; name: string }[];
  const localeContent = (content.localeContent as Record<string, { nav?: Record<string, string>; pages?: Record<string, string>; footer?: Record<string, string> }>) || {};
  const current = localeContent[locale] || localeContent.ar || localeContent.en || {};
  const navLabels = current.nav || localeContent.ar?.nav || localeContent.en?.nav || {};
  const footerPrivacy = current.footer?.privacy ?? localeContent.ar?.footer?.privacy ?? localeContent.en?.footer?.privacy ?? 'Privacy';

  return (
    <html
      lang={locale}
      dir={isRtl(locale) ? 'rtl' : 'ltr'}
      suppressHydrationWarning
      className={`dark ${outfit.variable} ${inter.variable}`}
    >
      <body className="min-h-screen overflow-x-hidden bg-stone-950 text-stone-100 antialiased font-sans text-lg">
        <ThemeProvider>
          <Navbar
            initialLocale={locale}
            languages={languages}
            navLabels={navLabels}
          />
          <main className="mx-auto flex min-w-0 max-w-6xl flex-col px-4 pb-8 pt-[5.5rem] min-h-screen bg-neutral-950 text-neutral-100">
            <div className="pt-8 flex-1 flex flex-col">
              {children}
            </div>
          </main>
          <Footer privacyLabel={footerPrivacy} />
          <CookieNotice />
        </ThemeProvider>
      </body>
    </html>
  );
}
