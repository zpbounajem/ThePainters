import Link from 'next/link';
import Image from 'next/image';
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

  const heroImageSrcFromContent = (content as { homeHeroImageSrc?: string }).homeHeroImageSrc;
  const galleryImages = Array.isArray((content as any).galleryImages)
    ? ((content as any).galleryImages as { src: string }[])
    : [];
  const heroImageSrc =
    (heroImageSrcFromContent && heroImageSrcFromContent.trim()) ||
    (galleryImages[0]?.src as string | undefined) ||
    '/uploads/1773598202383-yhvmxdb.jpeg';

  const rawHomeCards =
    Array.isArray(content.homeCards) && content.homeCards.length >= 3
      ? (content.homeCards as {
          id: string;
          icon?: string;
          title?: string;
          description?: string;
          titleByLocale?: Record<string, string>;
          descriptionByLocale?: Record<string, string>;
        }[])
      : DEFAULT_HOME_CARDS;

  const homeCards = rawHomeCards.map((card) => {
    const c = card as {
      titleByLocale?: Record<string, string>;
      descriptionByLocale?: Record<string, string>;
      title?: string;
      description?: string;
    };
    return {
      id: card.id,
      icon: card.icon || '•',
      title: getLocalized(c.titleByLocale, locale, c.title || '—'),
      description: getLocalized(c.descriptionByLocale, locale, c.description || '—'),
    };
  });

  const rawTestimonials = Array.isArray(content.testimonials) ? content.testimonials : [];
  const testimonials = (rawTestimonials as {
    id: string;
    name?: string;
    quote?: string;
    nameByLocale?: Record<string, string>;
    quoteByLocale?: Record<string, string>;
  }[]).map((t) => ({
    id: t.id,
    name: getLocalized(t.nameByLocale, locale, t.name || '—'),
    quote: getLocalized(t.quoteByLocale, locale, t.quote || '—'),
  }));

  const featuredTestimonial = testimonials[0];
  const otherTestimonials = testimonials.slice(1);

  const beforeAfterPairs = Array.isArray((content as any).beforeAfter)
    ? ((content as any).beforeAfter as { id: string; beforeSrc: string; afterSrc: string; caption?: string }[])
    : [];
  const featuredBeforeAfterId = (content as any).featuredBeforeAfterId as string | undefined;
  const featuredPair =
    beforeAfterPairs.find((p) => p.id === featuredBeforeAfterId) ??
    (beforeAfterPairs.length > 0 ? beforeAfterPairs[beforeAfterPairs.length - 1] : undefined);

  return (
    <section className="space-y-16 pb-12">
      {/* Top quote banner */}
      <div className="rounded-xl border border-brand-yellow/40 bg-gradient-to-r from-brand-yellow/15 via-brand-yellow/10 to-transparent px-4 py-3 text-center text-sm sm:text-base text-neutral-900 dark:text-neutral-50 shadow-sm shadow-brand-yellow/20">
        <span className="font-semibold text-brand-yellow">
          {pages.homeBannerTitle || 'Get a free painting quote today.'}
        </span>
        <span className="mx-1.5 text-neutral-700 dark:text-neutral-300">•</span>
        <span>
          {pages.homeBannerSubtitle ||
            'Send us your photos and room sizes and we will get back to you within 24 hours.'}
        </span>
        <Link
          href="/contact"
          className="ml-3 inline-flex items-center justify-center rounded-full border border-brand-yellow bg-brand-yellow px-4 py-1.5 text-sm font-semibold text-neutral-900 hover:bg-brand-yellow-dark hover:border-brand-yellow-dark transition-colors"
        >
          {pages.homeBannerCta || 'Contact us'}
        </Link>
      </div>

      {/* Hero + image banner */}
      <section className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-center">
        <div className="space-y-5 text-center lg:text-left">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-yellow/80">
            {pages.homeKicker || 'INTERIOR HOUSE PAINTING · LEBANON'}
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            <span className="text-brand-yellow block">
              {pages.homeTitle || 'The Painters LB'}
            </span>
            <span className="mt-2 block text-neutral-50">
              {pages.homeHeroSecondary || 'Fresh walls. Clean finish. Zero hassle.'}
            </span>
          </h1>
          <p className="max-w-xl mx-auto lg:mx-0 text-lg text-neutral-400">
            {pages.homeWelcome ||
              'Professional interior painting across Lebanon with on-time delivery, protected furniture, and a smooth finish that lasts.'}
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:justify-start">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full bg-brand-yellow px-7 py-3 text-sm sm:text-base font-semibold text-neutral-900 shadow-lg shadow-brand-yellow/30 hover:bg-brand-yellow-dark transition-colors w-full sm:w-auto"
            >
              {pages.homePrimaryCta || 'Get a free quote'}
            </Link>
            <Link
              href="/gallery"
              className="inline-flex items-center justify-center rounded-full border border-neutral-700 px-7 py-3 text-sm sm:text-base font-semibold text-neutral-100 hover:border-brand-yellow hover:text-brand-yellow transition-colors w-full sm:w-auto"
            >
              {pages.viewOurWork || 'View our work'}
            </Link>
          </div>
          <dl className="mt-4 grid grid-cols-3 gap-4 max-w-xl mx-auto lg:mx-0 text-xs sm:text-sm text-neutral-400">
            <div>
              <dt className="font-semibold text-neutral-200">
                {pages.homeStatProjectsLabel || 'Rooms painted'}
              </dt>
              <dd className="text-brand-yellow">
                {pages.homeStatProjectsValue || '120+'}
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-neutral-200">
                {pages.homeStatExperienceLabel || 'Years experience'}
              </dt>
              <dd className="text-brand-yellow">
                {pages.homeStatExperienceValue || '5+'}
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-neutral-200">
                {pages.homeStatCoverageLabel || 'Areas served'}
              </dt>
              <dd className="text-brand-yellow">
                {pages.homeStatCoverageValue || 'All Lebanon'}
              </dd>
            </div>
          </dl>
        </div>

        <div className="relative mx-auto w-full max-w-md">
          <div className="relative overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900 shadow-[0_0_40px_rgba(0,0,0,0.7)]">
            <Image
              src={heroImageSrc}
              alt={
                (pages.homeHeroImageAlt as string) ||
                'Interior painting project by The Painters LB'
              }
              width={760}
              height={520}
              priority
              className="h-72 w-full object-cover sm:h-80 md:h-96"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-brand-yellow/80">
                  {pages.heroCardLabel || 'RECENT PROJECT'}
                </p>
                <p className="mt-1 text-sm font-semibold text-neutral-50">
                  {pages.heroCardTitle || 'Fresh repaint in Beirut'}
                </p>
              </div>
              <span className="inline-flex items-center rounded-full bg-brand-yellow px-3 py-1 text-xs font-semibold text-neutral-900 shadow-md shadow-brand-yellow/40">
                {pages.heroCardBadge || 'Before & after inside'}
              </span>
            </div>
          </div>
          <div className="pointer-events-none absolute -inset-2 -z-10 rounded-[2.25rem] bg-gradient-to-r from-brand-yellow/15 via-amber-500/10 to-transparent blur-xl" />
        </div>
      </section>

      {/* Featured before/after */}
      <section aria-labelledby="home-featured-project" className="space-y-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-yellow/75">
            {pages.featuredKicker || 'FEATURED TRANSFORMATION'}
          </p>
          <div className="space-y-2">
            <h2
              id="home-featured-project"
              className="text-2xl sm:text-3xl font-bold text-neutral-50"
            >
              {pages.featuredTitle || 'See the difference in one weekend'}
            </h2>
            <p className="max-w-2xl text-sm sm:text-base text-neutral-400">
              {pages.featuredSubtitle ||
                'A typical 2‑3 room repaint with full protection and a fresh, even finish.'}
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] items-stretch">
            <div className="grid gap-4 sm:grid-cols-2">
            <div className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-gradient-to-br from-neutral-900 to-black p-4">
              <p className="mb-2 inline-flex rounded-full bg-neutral-900/70 px-3 py-1 text-xs font-medium uppercase tracking-wide text-neutral-300">
                {pages.featuredBeforeLabel || 'Before'}
              </p>
              <p className="text-sm text-neutral-400">
                {pages.featuredBeforeText ||
                  'Tired walls with uneven colour and visible roller marks.'}
              </p>
              {featuredPair?.beforeSrc ? (
                <div className="mt-4 overflow-hidden rounded-xl border border-neutral-800 bg-neutral-800/60">
                  <Image
                    src={featuredPair.beforeSrc}
                    alt={
                      (pages.featuredBeforeImageAlt as string) ||
                      'Before painting project by The Painters LB'
                    }
                    width={640}
                    height={400}
                    className="h-32 w-full object-cover sm:h-40"
                  />
                </div>
              ) : (
                <div className="mt-4 h-32 rounded-xl bg-neutral-800/60" />
              )}
            </div>
            <div className="relative overflow-hidden rounded-2xl border border-brand-yellow/60 bg-gradient-to-br from-brand-yellow/15 via-brand-yellow/10 to-transparent p-4">
              <p className="mb-2 inline-flex rounded-full bg-brand-yellow px-3 py-1 text-xs font-medium uppercase tracking-wide text-neutral-900">
                {pages.featuredAfterLabel || 'After'}
              </p>
              <p className="text-sm text-neutral-100">
                {pages.featuredAfterText ||
                  'Smooth, even coverage with clean edges and a bright, modern finish.'}
              </p>
              {featuredPair?.afterSrc ? (
                <div className="mt-4 overflow-hidden rounded-xl border border-brand-yellow/60 bg-gradient-to-br from-brand-yellow/40 via-amber-300/30 to-transparent">
                  <Image
                    src={featuredPair.afterSrc}
                    alt={
                      (pages.featuredAfterImageAlt as string) ||
                      'After painting project by The Painters LB'
                    }
                    width={640}
                    height={400}
                    className="h-32 w-full object-cover sm:h-40"
                  />
                </div>
              ) : (
                <div className="mt-4 h-32 rounded-xl bg-gradient-to-br from-brand-yellow/40 via-amber-300/30 to-transparent" />
              )}
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-2xl border border-neutral-800 bg-neutral-950/60 p-5 space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-neutral-50">
                {pages.featuredDetailsTitle || 'Project snapshot'}
              </h3>
              <p className="text-sm text-neutral-400">
                {pages.featuredDetailsText ||
                  'We protect floors and furniture, fix small imperfections, and leave the space cleaner than we found it.'}
              </p>
            </div>
            <dl className="grid grid-cols-2 gap-4 text-sm text-neutral-300">
              <div>
                <dt className="text-neutral-500">
                  {pages.featuredDurationLabel || 'Duration'}
                </dt>
                <dd className="font-medium">
                  {pages.featuredDurationValue || '2 days'}
                </dd>
              </div>
              <div>
                <dt className="text-neutral-500">
                  {pages.featuredRoomsLabel || 'Rooms'}
                </dt>
                <dd className="font-medium">
                  {pages.featuredRoomsValue || 'Living + 2 bedrooms'}
                </dd>
              </div>
              <div>
                <dt className="text-neutral-500">
                  {pages.featuredCityLabel || 'City'}
                </dt>
                <dd className="font-medium">
                  {pages.featuredCityValue || 'Beirut'}
                </dd>
              </div>
              <div>
                <dt className="text-neutral-500">
                  {pages.featuredFinishLabel || 'Finish'}
                </dt>
                <dd className="font-medium">
                  {pages.featuredFinishValue || 'Washable matte'}
                </dd>
              </div>
            </dl>
            <Link
              href="/before-after"
              className="inline-flex items-center justify-center rounded-full border border-neutral-700 px-4 py-2 text-sm font-semibold text-neutral-100 hover:border-brand-yellow hover:text-brand-yellow transition-colors self-start"
            >
              {pages.featuredCta || 'See more before & afters'}
            </Link>
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section aria-labelledby="home-why-us" className="space-y-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-yellow/75">
            {pages.whyUsKicker || 'WHY THE PAINTERS'}
          </p>
          <div className="space-y-2">
            <h2
              id="home-why-us"
              className="text-2xl sm:text-3xl font-bold text-neutral-50"
            >
              {pages.whyUsTitle || 'We treat your home like our own'}
            </h2>
            <p className="max-w-2xl text-sm sm:text-base text-neutral-400">
              {pages.whyUsSubtitle ||
                'Our process is built around being on‑time, careful, and respectful of the spaces you live and work in.'}
            </p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              id: 'ontime',
              title: pages.whyOnTimeTitle || 'On‑time, as agreed',
              description:
                pages.whyOnTimeDescription ||
                'We start and finish on the days we commit to, with clear communication.',
            },
            {
              id: 'clean',
              title: pages.whyCleanTitle || 'Clean and protected',
              description:
                pages.whyCleanDescription ||
                'Floors, furniture, and sockets are covered before we open any paint.',
            },
            {
              id: 'quality',
              title: pages.whyQualityTitle || 'Quality materials',
              description:
                pages.whyQualityDescription ||
                'We use trusted brands and the right products for each room.',
            },
            {
              id: 'pricing',
              title: pages.whyPricingTitle || 'Clear pricing',
              description:
                pages.whyPricingDescription ||
                'Simple quotes without hidden extras, agreed before work starts.',
            },
          ].map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-neutral-800 bg-neutral-950/40 p-5 text-left"
            >
              <h3 className="text-base sm:text-lg font-semibold text-neutral-50">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-neutral-400">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4‑step process */}
      <section aria-labelledby="home-process" className="space-y-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-yellow/75">
            {pages.processKicker || 'HOW IT WORKS'}
          </p>
          <div className="space-y-2">
            <h2
              id="home-process"
              className="text-2xl sm:text-3xl font-bold text-neutral-50"
            >
              {pages.processTitle || 'A simple 4‑step process'}
            </h2>
            <p className="max-w-2xl text-sm sm:text-base text-neutral-400">
              {pages.processSubtitle ||
                'From first message to final walkthrough, you always know what happens next.'}
            </p>
          </div>
        </div>

        <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              step: 1,
              title:
                pages.processStep1Title || 'Send photos or book a visit',
              description:
                pages.processStep1Description ||
                'Share your rooms and colours, or we can visit to see the space.',
            },
            {
              step: 2,
              title: pages.processStep2Title || 'Get a clear quote',
              description:
                pages.processStep2Description ||
                'You receive a simple quote with scope, materials, and timing.',
            },
            {
              step: 3,
              title: pages.processStep3Title || 'Prep, protect, and paint',
              description:
                pages.processStep3Description ||
                'We carefully cover, repair small defects, and apply even coats.',
            },
            {
              step: 4,
              title: pages.processStep4Title || 'Clean‑up & walkthrough',
              description:
                pages.processStep4Description ||
                'We remove protection, clean the site, and walk the space with you.',
            },
          ].map((stepItem) => (
            <li
              key={stepItem.step}
              className="relative rounded-2xl border border-neutral-800 bg-neutral-950/40 p-5"
            >
              <div className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-yellow/20 text-sm font-semibold text-brand-yellow">
                {stepItem.step}
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-neutral-50">
                {stepItem.title}
              </h3>
              <p className="mt-2 text-sm text-neutral-400">
                {stepItem.description}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* Testimonials block */}
      <section aria-labelledby="home-testimonials" className="space-y-8">
        {testimonials.length > 0 && (
          <>
            <div className="flex flex-col items-center gap-3 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-yellow/75">
                {pages.testimonialsKicker || 'CLIENT FEEDBACK'}
              </p>
              <div className="space-y-2">
                <h2
                  id="home-testimonials"
                  className="text-2xl sm:text-3xl font-bold text-neutral-50"
                >
                  {pages.whatClientsSay || 'What clients say'}
                </h2>
                <p className="max-w-2xl text-sm sm:text-base text-neutral-400">
                  {pages.testimonialsSubtitle ||
                    'Real feedback from homes and apartments we have painted around Lebanon.'}
                </p>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] items-start">
              {featuredTestimonial && (
                <figure className="relative rounded-3xl border border-brand-yellow/40 bg-neutral-950/70 p-6 sm:p-8 shadow-[0_0_40px_rgba(0,0,0,0.7)]">
                  <div className="mb-3 text-sm text-amber-300">★★★★★</div>
                  {featuredTestimonial.quote && (
                    <blockquote className="text-lg sm:text-xl leading-relaxed text-neutral-50">
                      &ldquo;{featuredTestimonial.quote}&rdquo;
                    </blockquote>
                  )}
                  {featuredTestimonial.name && (
                    <figcaption className="mt-4 text-sm font-medium text-brand-yellow">
                      {featuredTestimonial.name}
                    </figcaption>
                  )}
                </figure>
              )}

              {otherTestimonials.length > 0 && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                  {otherTestimonials.map((t) => (
                    <div
                      key={t.id}
                      className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-5"
                    >
                      {t.quote && (
                        <p className="text-sm text-neutral-300">
                          &ldquo;{t.quote}&rdquo;
                        </p>
                      )}
                      {t.name && (
                        <p className="mt-3 text-xs font-medium text-brand-yellow">
                          {t.name}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </section>

      {/* Contact strip / final CTA */}
      <section
        aria-labelledby="home-contact-strip"
        className="mt-4 rounded-3xl border border-brand-yellow/40 bg-gradient-to-r from-brand-yellow/15 via-brand-yellow/10 to-transparent px-5 py-6 sm:px-8 sm:py-8"
      >
        <div className="grid gap-5 sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-center">
          <div className="space-y-2">
            <h2
              id="home-contact-strip"
              className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-50"
            >
              {pages.contactStripTitle || 'Ready to refresh your walls?'}
            </h2>
            <p className="text-sm sm:text-base text-neutral-800 dark:text-neutral-100">
              {pages.contactStripSubtitle ||
                'Send us photos and rough room sizes and we will share a free quote within 24 hours.'}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
            <Link
              href="/contact"
              className="inline-flex flex-1 items-center justify-center rounded-full bg-neutral-900 px-6 py-3 text-sm sm:text-base font-semibold text-brand-yellow hover:bg-black transition-colors"
            >
              {pages.contactStripPrimaryCta || 'Get a free quote'}
            </Link>
            <Link
              href="/contact"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-brand-yellow/60 bg-transparent px-6 py-3 text-sm sm:text-base font-semibold text-brand-yellow hover:bg-brand-yellow/10 hover:border-brand-yellow transition-colors"
            >
              <span aria-hidden>💬</span>
              {pages.contactStripSecondaryCta || 'WhatsApp us a project'}
            </Link>
          </div>
        </div>
      </section>
    </section>
  );
}
