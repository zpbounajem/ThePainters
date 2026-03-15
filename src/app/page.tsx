import Link from 'next/link';
import { cookies } from 'next/headers';
import { getContent, getLocalized } from '@/lib/content';
import { DEFAULT_LOCALE } from '@/lib/i18n';

const DEFAULT_HOME_CARDS = [
  { id: '1', icon: '🎨', title: 'Interior Painting', description: 'Walls & ceilings, quality finishes' },
  { id: '2', icon: '📍', title: 'Lebanon', description: 'Serving all regions' },
  { id: '3', icon: '📸', title: '@thepainters_lb', description: 'Follow us on Instagram' },
];

function getPages(content: Record<string, unknown>, locale: string): Record<string, string> {
  const localeContent = (content.localeContent as Record<string, { pages?: Record<string, string> }>) || {};
  return localeContent[locale]?.pages || localeContent.en?.pages || {};
}

export async function generateMetadata() {
  const content = (await getContent()) as Record<string, unknown>;
  const seo = (content.seo as Record<string, { title?: string; description?: string }>)?.home ?? {};
  return {
    title: seo.title ?? 'The Painters LB | Interior House Painting Lebanon',
    description: seo.description ?? 'Professional interior house painting in Lebanon. Quality finishes, on time.',
  };
}

export default async function HomePage() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get('NEXT_LOCALE')?.value || DEFAULT_LOCALE).trim() || DEFAULT_LOCALE;
  const content = (await getContent()) as Record<string, unknown>;
  const pages = getPages(content, locale);
  const rawHomeCards = Array.isArray(content.homeCards) && content.homeCards.length >= 3
    ? (content.homeCards as { id: string; icon?: string; title?: string; description?: string; titleByLocale?: Record<string, string>; descriptionByLocale?: Record<string, string> }[])
    : DEFAULT_HOME_CARDS;
  const homeCards = rawHomeCards.map((card) => {
    const c = card as { titleByLocale?: Record<string, string>; descriptionByLocale?: Record<string, string>; title?: string; description?: string };
    return {
      id: card.id,
      icon: card.icon || '•',
      title: getLocalized(c.titleByLocale, locale, c.title || '—'),
      description: getLocalized(c.descriptionByLocale, locale, c.description || '—'),
    };
  });
  const rawTestimonials = Array.isArray(content.testimonials) ? content.testimonials : [];
  const testimonials = (rawTestimonials as { id: string; name?: string; quote?: string; nameByLocale?: Record<string, string>; quoteByLocale?: Record<string, string> }[]).map((t) => ({
    id: t.id,
    name: getLocalized(t.nameByLocale, locale, t.name || '—'),
    quote: getLocalized(t.quoteByLocale, locale, t.quote || '—'),
  }));

  return (
    <section className="space-y-12 pb-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
          <span className="text-brand-yellow">{pages.homeTitle || 'The Painters LB'}</span>
        </h1>
        <p className="text-xl text-neutral-600 dark:text-neutral-400">
          {pages.homeSubtitle || 'Interior House Painting in Lebanon'}
        </p>
        <p className="max-w-2xl mx-auto text-neutral-600 dark:text-neutral-400">
          {pages.homeWelcome || "Welcome to The Painters — professional interior painting across Lebanon. Quality finishes, on time."}
        </p>
        <Link
          href="/gallery"
          className="inline-flex items-center justify-center rounded-lg bg-brand-yellow px-6 py-3 font-semibold text-neutral-900 hover:bg-brand-yellow-dark transition-colors"
        >
          {pages.viewOurWork || 'View Our Work'}
        </Link>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 text-center">
        {homeCards.slice(0, 3).map((card) => (
          <div
            key={card.id}
            className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 sm:col-span-2 lg:col-span-1 last:sm:col-span-2 last:lg:col-span-1"
          >
            <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-brand-yellow/20 flex items-center justify-center text-brand-yellow text-2xl">
              {card.icon}
            </div>
            <h3 className="font-semibold text-lg">{card.title}</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              {card.description}
            </p>
          </div>
        ))}
      </div>
      {testimonials.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-brand-yellow text-center mb-6">
            {pages.whatClientsSay || 'What clients say'}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 bg-neutral-900/30"
              >
                {t.quote && <p className="text-neutral-300 italic">&ldquo;{t.quote}&rdquo;</p>}
                {t.name && <p className="mt-3 font-medium text-brand-yellow">{t.name}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
