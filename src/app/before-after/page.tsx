import { cookies } from 'next/headers';
import { getContent, getLocalized } from '@/lib/content';
import { DEFAULT_LOCALE } from '@/lib/i18n';
import BeforeAfterGallery from '@/components/BeforeAfterGallery';

function getPages(content: Record<string, unknown>, locale: string): Record<string, string> {
  const localeContent = (content.localeContent as Record<string, { pages?: Record<string, string> }>) || {};
  return localeContent[locale]?.pages || localeContent.en?.pages || {};
}

export async function generateMetadata() {
  const content = (await getContent()) as Record<string, unknown>;
  const seo = (content.seo as Record<string, { title?: string; description?: string }>)?.beforeAfter
    ?? (content.seo as Record<string, { title?: string; description?: string }>)?.gallery ?? {};
  return {
    title: seo.title ?? 'Before & After | The Painters LB',
    description: seo.description ?? 'See the transformation. Before and after our interior painting projects.',
  };
}

export default async function BeforeAfterPage() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get('NEXT_LOCALE')?.value || DEFAULT_LOCALE).trim() || DEFAULT_LOCALE;
  const content = (await getContent()) as Record<string, unknown>;
  const pages = getPages(content, locale);
  const rawPairs = Array.isArray(content.beforeAfter)
    ? (content.beforeAfter as { id: string; beforeSrc?: string; afterSrc?: string; caption?: string; captionByLocale?: Record<string, string> }[])
    : [];
  const pairs = rawPairs.map((pair) => ({
    id: pair.id,
    beforeSrc: pair.beforeSrc,
    afterSrc: pair.afterSrc,
    caption: getLocalized(pair.captionByLocale, locale, pair.caption || ''),
  }));

  return (
    <section className="space-y-8 pb-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-brand-yellow">{pages.beforeAfterTitle || 'Before & After'}</h1>
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">
          {pages.beforeAfterSubtitle || 'See the transformation'}
        </p>
      </div>
      <BeforeAfterGallery pairs={pairs} noBeforeAfterText={pages.noBeforeAfter} />
    </section>
  );
}
