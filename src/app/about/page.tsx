import { cookies } from 'next/headers';
import { getContent, getLocalized } from '@/lib/content';
import { DEFAULT_LOCALE } from '@/lib/i18n';

const DEFAULT_BIO =
  'We are a Lebanese team specializing in interior house painting. From walls to ceilings, we deliver clean, lasting finishes and work with you on colors and schedules.';

const DEFAULT_ABOUT_GRIDS = [
  { id: '1', text: 'Interior wall painting' },
  { id: '2', text: 'Ceiling painting' },
  { id: '3', text: 'Color consultation' },
  { id: '4', text: 'Surface preparation & finishing' },
];

function getPages(content: Record<string, unknown>, locale: string): Record<string, string> {
  const localeContent = (content.localeContent as Record<string, { pages?: Record<string, string> }>) || {};
  return localeContent[locale]?.pages || localeContent.en?.pages || {};
}

export async function generateMetadata() {
  const content = (await getContent()) as Record<string, unknown>;
  const seo = (content.seo as Record<string, { title?: string; description?: string }>)?.about ?? {};
  return {
    title: seo.title ?? 'About Us | The Painters LB',
    description: seo.description ?? 'Professional interior painting team in Lebanon.',
  };
}

export default async function AboutPage() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get('NEXT_LOCALE')?.value || DEFAULT_LOCALE).trim() || DEFAULT_LOCALE;
  const content = (await getContent()) as Record<string, unknown>;
  const pages = getPages(content, locale);
  const bio = locale === 'ar' && (content.bioAr as string)?.trim()
    ? (content.bioAr as string)
    : typeof content.bio === 'string'
      ? content.bio
      : (content.bio as { en?: string })?.en ?? DEFAULT_BIO;
  const rawGridItems: { id: string; text: string; textByLocale?: Record<string, string> }[] =
    Array.isArray(content.aboutGrids) && content.aboutGrids.length > 0
      ? (content.aboutGrids as { id: string; text: string; textByLocale?: Record<string, string> }[])
      : DEFAULT_ABOUT_GRIDS;
  const gridItems = rawGridItems.map((item) => ({
    id: item.id,
    text: getLocalized(item.textByLocale ?? undefined, locale, item.text || ''),
  }));
  const rawFaq = Array.isArray(content.faq) ? (content.faq as { id: string; question?: string; answer?: string; questionByLocale?: Record<string, string>; answerByLocale?: Record<string, string> }[]) : [];
  const faq = rawFaq.map((item) => ({
    id: item.id,
    question: getLocalized(item.questionByLocale, locale, item.question || '—'),
    answer: getLocalized(item.answerByLocale, locale, item.answer || ''),
  }));
  const serviceAreasRaw = (locale === 'ar' && (content.serviceAreasAr as string)?.trim()
    ? content.serviceAreasAr
    : content.serviceAreas) as string;
  const serviceAreas = (serviceAreasRaw || '').trim()
    ? String(serviceAreasRaw).split(/[\n,]+/).map((s: string) => s.trim()).filter(Boolean)
    : [];

  return (
    <section className="space-y-10">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-brand-yellow">{pages.aboutTitle || 'About Us'}</h1>
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">
          {pages.aboutSubtitle || 'Professional interior painting in Lebanon'}
        </p>
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-lg leading-relaxed">{bio}</p>
      </div>
      <div>
        <h2 className="text-xl font-semibold text-brand-yellow mb-4">
          {pages.ourServices || 'Our Services'}
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {gridItems.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-2 rounded-lg border border-neutral-200 dark:border-neutral-800 px-4 py-3"
            >
              <span className="text-brand-yellow">✓</span>
              {item.text}
            </li>
          ))}
        </ul>
      </div>
      {serviceAreas.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-brand-yellow mb-4">{pages.areasWeServe || 'Areas we serve'}</h2>
          <p className="text-neutral-400">{serviceAreas.join(', ')}</p>
        </div>
      )}
      {faq.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-brand-yellow mb-4">{pages.faq || 'FAQ'}</h2>
          <ul className="space-y-4">
            {faq.map((item) => (
              <li key={item.id} className="rounded-lg border border-neutral-200 dark:border-neutral-800 p-4">
                <h3 className="font-medium text-neutral-200">{item.question}</h3>
                <p className="mt-2 text-sm text-neutral-400">{item.answer}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
