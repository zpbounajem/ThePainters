import { cookies } from 'next/headers';
import { getContent } from '@/lib/content';
import { DEFAULT_LOCALE } from '@/lib/i18n';

function getPages(content: Record<string, unknown>, locale: string): Record<string, string> {
  const localeContent = (content.localeContent as Record<string, { pages?: Record<string, string> }>) || {};
  return localeContent[locale]?.pages || localeContent.en?.pages || {};
}

export async function generateMetadata() {
  const content = (await getContent()) as Record<string, unknown>;
  const seo = (content.seo as Record<string, { title?: string; description?: string }>)?.privacy ?? {};
  return {
    title: seo.title ?? 'Privacy | The Painters LB',
    description: seo.description ?? 'Privacy and data use policy.',
  };
}

export default async function PrivacyPage() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get('NEXT_LOCALE')?.value || DEFAULT_LOCALE).trim() || DEFAULT_LOCALE;
  const content = (await getContent()) as Record<string, unknown>;
  const pages = getPages(content, locale);
  const text = locale === 'ar' && (content.privacyContentAr as string)?.trim()
    ? (content.privacyContentAr as string)
    : (content.privacyContent as string) || 'We use your contact details only to respond to your inquiry. We do not share your data with third parties.';

  return (
    <section className="space-y-8 pb-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-brand-yellow">{pages.privacyTitle || 'Privacy'}</h1>
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none mx-auto">
        <p className="whitespace-pre-wrap text-neutral-300">{text}</p>
      </div>
    </section>
  );
}
