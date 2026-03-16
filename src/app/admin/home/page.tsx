'use client';

import { useAdmin } from '@/contexts/AdminContext';
import type { LocaleContent, BeforeAfterItem } from '@/types/admin';

const inputClass =
  'w-full rounded-lg border border-neutral-600 bg-neutral-800 px-3 py-2.5 text-neutral-100 placeholder-neutral-500 focus:border-brand-yellow focus:outline-none focus:ring-1 focus:ring-brand-yellow';

export default function AdminHomePage() {
  const { content, setContent, homeCards, updateHomeCard, updateHomeCardByLocale, adminLabels, saving, saveContent } =
    useAdmin();

  if (!content) {
    return (
      <div className="admin-grit admin-body p-8 text-center text-neutral-500">
        {adminLabels.loading}
      </div>
    );
  }

  const languages =
    content.languages ?? [
      { code: 'en', name: 'English' },
      { code: 'ar', name: 'العربية' },
    ];

  const getLocale = (code: string): LocaleContent =>
    (content.localeContent?.[code] as LocaleContent | undefined) ?? { nav: {}, pages: {}, footer: {} };

  const beforeAfterPairs = (content.beforeAfter ?? []) as BeforeAfterItem[];

  return (
    <div className="space-y-8">
      <h1 className="admin-page-title">{adminLabels.homePage}</h1>
      <p className="admin-muted">
        A focused editor just for the homepage. Update hero text, stats, cards, featured block, testimonials heading,
        and the main hero image.
      </p>

      {/* Hero text + stats */}
      <section className="admin-grit p-6 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="admin-section-title text-brand-yellow">Hero & intro</h2>
          <p className="admin-small max-w-xl text-neutral-400">
            This controls the main hero text at the top of the homepage: kicker, title, subtitle, welcome paragraph and
            stats.
          </p>
        </div>
        <div className="space-y-4">
          {languages.map((lang) => {
            const loc = getLocale(lang.code);
            return (
              <div
                key={lang.code}
                className="admin-grit-inner rounded-lg bg-neutral-800/40 p-4 space-y-3"
              >
                <h3 className="admin-body font-semibold text-brand-yellow">
                  {lang.name} ({lang.code})
                </h3>
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label className="admin-small mb-0.5 block">Kicker (small text above title)</label>
                    <input
                      type="text"
                      value={loc.pages?.homeKicker ?? ''}
                      onChange={(e) =>
                        setContent((prev) => {
                          if (!prev) return prev;
                          const nextLocale = { ...(prev.localeContent ?? {}) };
                          const current = (nextLocale[lang.code] as LocaleContent | undefined) ?? {
                            nav: {},
                            pages: {},
                            footer: {},
                          };
                          nextLocale[lang.code] = {
                            ...current,
                            pages: { ...(current.pages ?? {}), homeKicker: e.target.value },
                          };
                          return { ...prev, localeContent: nextLocale };
                        })
                      }
                      className={inputClass}
                      placeholder="INTERIOR HOUSE PAINTING · LEBANON"
                    />
                  </div>
                  <div>
                    <label className="admin-small mb-0.5 block">Main title (brand name)</label>
                    <input
                      type="text"
                      value={loc.pages?.homeTitle ?? ''}
                      onChange={(e) =>
                        setContent((prev) => {
                          if (!prev) return prev;
                          const nextLocale = { ...(prev.localeContent ?? {}) };
                          const current = (nextLocale[lang.code] as LocaleContent | undefined) ?? {
                            nav: {},
                            pages: {},
                            footer: {},
                          };
                          nextLocale[lang.code] = {
                            ...current,
                            pages: { ...(current.pages ?? {}), homeTitle: e.target.value },
                          };
                          return { ...prev, localeContent: nextLocale };
                        })
                      }
                      className={inputClass}
                      placeholder="The Painters LB"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="admin-small mb-0.5 block">Hero secondary line</label>
                    <input
                      type="text"
                      value={loc.pages?.homeHeroSecondary ?? ''}
                      onChange={(e) =>
                        setContent((prev) => {
                          if (!prev) return prev;
                          const nextLocale = { ...(prev.localeContent ?? {}) };
                          const current = (nextLocale[lang.code] as LocaleContent | undefined) ?? {
                            nav: {},
                            pages: {},
                            footer: {},
                          };
                          nextLocale[lang.code] = {
                            ...current,
                            pages: { ...(current.pages ?? {}), homeHeroSecondary: e.target.value },
                          };
                          return { ...prev, localeContent: nextLocale };
                        })
                      }
                      className={inputClass}
                      placeholder="Fresh walls. Clean finish. Zero hassle."
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="admin-small mb-0.5 block">Welcome paragraph</label>
                    <textarea
                      rows={3}
                      value={loc.pages?.homeWelcome ?? ''}
                      onChange={(e) =>
                        setContent((prev) => {
                          if (!prev) return prev;
                          const nextLocale = { ...(prev.localeContent ?? {}) };
                          const current = (nextLocale[lang.code] as LocaleContent | undefined) ?? {
                            nav: {},
                            pages: {},
                            footer: {},
                          };
                          nextLocale[lang.code] = {
                            ...current,
                            pages: { ...(current.pages ?? {}), homeWelcome: e.target.value },
                          };
                          return { ...prev, localeContent: nextLocale };
                        })
                      }
                      className={`${inputClass} resize-y`}
                      placeholder="Short intro about your painting service…"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Hero image */}
      <section className="admin-grit p-6 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="admin-section-title text-brand-yellow">Hero image</h2>
          <p className="admin-small max-w-xl text-neutral-400">
            This image appears on the right of the homepage hero. Pick a specific gallery image or let it use the first
            gallery photo automatically.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] items-start">
          <select
            value={(content as any).homeHeroImageSrc ?? ''}
            onChange={(e) =>
              setContent((prev) => (prev ? ({ ...prev, homeHeroImageSrc: e.target.value } as any) : prev))
            }
            className={inputClass}
          >
            <option value="">Use first gallery image automatically</option>
            {(content.galleryImages ?? []).map((img: { id: string; src: string }) => (
              <option key={img.id} value={img.src}>
                {img.src}
              </option>
            ))}
          </select>
          <div className="admin-grit-inner rounded-lg border border-neutral-700 bg-neutral-900/60 p-2 text-center text-xs text-neutral-400">
            {(content as any).homeHeroImageSrc ? (
              <div className="space-y-2">
                <div className="aspect-video w-full overflow-hidden rounded-md bg-neutral-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={(content as any).homeHeroImageSrc}
                    alt="Hero preview"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="break-all">
                  {(content as any).homeHeroImageSrc}
                </div>
              </div>
            ) : (
              <span>No image selected – homepage will use the first gallery image.</span>
            )}
          </div>
        </div>
      </section>

      {/* Hero card text (info on the hero image) */}
      <section className="admin-grit p-6 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="admin-section-title text-brand-yellow">Hero card text</h2>
          <p className="admin-small max-w-xl text-neutral-400">
            Text shown on top of the hero image: small label (e.g. TYPICAL PROJECT), title (e.g. 2-bedroom apartment repaint), and badge (e.g. Done in 2 days). Edit per language.
          </p>
        </div>
        <div className="space-y-4">
          {languages.map((lang) => {
            const loc = getLocale(lang.code);
            const setHeroCard = (key: 'heroCardLabel' | 'heroCardTitle' | 'heroCardBadge', value: string) =>
              setContent((prev) => {
                if (!prev) return prev;
                const nextLocale = { ...(prev.localeContent ?? {}) };
                const current = (nextLocale[lang.code] as LocaleContent | undefined) ?? {
                  nav: {},
                  pages: {},
                  footer: {},
                };
                nextLocale[lang.code] = {
                  ...current,
                  pages: { ...(current.pages ?? {}), [key]: value },
                };
                return { ...prev, localeContent: nextLocale };
              });
            return (
              <div
                key={lang.code}
                className="admin-grit-inner rounded-lg bg-neutral-800/40 p-4 space-y-3"
              >
                <h3 className="admin-body font-semibold text-brand-yellow">
                  {lang.name} ({lang.code})
                </h3>
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label className="admin-small mb-0.5 block">Label (e.g. TYPICAL PROJECT)</label>
                    <input
                      type="text"
                      value={loc.pages?.heroCardLabel ?? ''}
                      onChange={(e) => setHeroCard('heroCardLabel', e.target.value)}
                      className={inputClass}
                      placeholder="TYPICAL PROJECT"
                    />
                  </div>
                  <div>
                    <label className="admin-small mb-0.5 block">Title (e.g. 2-bedroom apartment repaint)</label>
                    <input
                      type="text"
                      value={loc.pages?.heroCardTitle ?? ''}
                      onChange={(e) => setHeroCard('heroCardTitle', e.target.value)}
                      className={inputClass}
                      placeholder="2-bedroom apartment repaint"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="admin-small mb-0.5 block">Badge (e.g. Done in 2 days)</label>
                    <input
                      type="text"
                      value={loc.pages?.heroCardBadge ?? ''}
                      onChange={(e) => setHeroCard('heroCardBadge', e.target.value)}
                      className={inputClass}
                      placeholder="Done in 2 days"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured before/after images source */}
      <section className="admin-grit p-6 space-y-4">
        <h2 className="admin-section-title text-brand-yellow">Featured Before & After images</h2>
        <p className="admin-small max-w-xl text-neutral-400">
          Choose which Before & After pair from the Before & After admin page is highlighted on the homepage. If you
          leave this empty, the most recently added pair will be used automatically.
        </p>
        {beforeAfterPairs.length === 0 ? (
          <p className="admin-muted">
            No Before & After pairs yet. Add some under &quot;Before & After&quot; in the admin sidebar.
          </p>
        ) : (
          <>
            <div className="grid gap-3 sm:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] items-start">
              <select
                value={content.featuredBeforeAfterId ?? ''}
                onChange={(e) =>
                  setContent((prev) =>
                    prev ? { ...prev, featuredBeforeAfterId: e.target.value || undefined } : prev,
                  )
                }
                className={inputClass}
              >
                <option value="">Use latest added pair automatically</option>
                {beforeAfterPairs.map((pair) => (
                  <option key={pair.id} value={pair.id}>
                    {pair.caption || pair.id}
                  </option>
                ))}
              </select>
              <div className="admin-grit-inner rounded-lg border border-neutral-700 bg-neutral-900/60 p-3 text-xs text-neutral-400">
                <p>
                  The selected pair controls the images in the &quot;Featured transformation&quot; Before/After cards
                  on the homepage.
                </p>
                <p className="mt-2">
                  You can also customise the <span className="font-semibold">Project snapshot</span> card below.
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-4">
              {languages.map((lang) => {
                const loc = getLocale(lang.code);
                const setStat = (
                  key:
                    | 'featuredDurationLabel'
                    | 'featuredDurationValue'
                    | 'featuredRoomsLabel'
                    | 'featuredRoomsValue'
                    | 'featuredCityLabel'
                    | 'featuredCityValue'
                    | 'featuredFinishLabel'
                    | 'featuredFinishValue',
                  value: string,
                ) =>
                  setContent((prev) => {
                    if (!prev) return prev;
                    const nextLocale = { ...(prev.localeContent ?? {}) };
                    const current = (nextLocale[lang.code] as LocaleContent | undefined) ?? {
                      nav: {},
                      pages: {},
                      footer: {},
                    };
                    nextLocale[lang.code] = {
                      ...current,
                      pages: { ...(current.pages ?? {}), [key]: value },
                    };
                    return { ...prev, localeContent: nextLocale };
                  });

                return (
                  <div
                    key={lang.code}
                    className="admin-grit-inner rounded-lg bg-neutral-800/40 p-4 space-y-3"
                  >
                    <h3 className="admin-body font-semibold text-brand-yellow">
                      {lang.name} ({lang.code}) – Project snapshot stats
                    </h3>
                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                      <div>
                        <label className="admin-small mb-0.5 block">Duration label</label>
                        <input
                          type="text"
                          value={loc.pages?.featuredDurationLabel ?? ''}
                          onChange={(e) => setStat('featuredDurationLabel', e.target.value)}
                          className={inputClass}
                          placeholder="Duration"
                        />
                      </div>
                      <div>
                        <label className="admin-small mb-0.5 block">Duration value</label>
                        <input
                          type="text"
                          value={loc.pages?.featuredDurationValue ?? ''}
                          onChange={(e) => setStat('featuredDurationValue', e.target.value)}
                          className={inputClass}
                          placeholder="2 days"
                        />
                      </div>
                      <div>
                        <label className="admin-small mb-0.5 block">Rooms label</label>
                        <input
                          type="text"
                          value={loc.pages?.featuredRoomsLabel ?? ''}
                          onChange={(e) => setStat('featuredRoomsLabel', e.target.value)}
                          className={inputClass}
                          placeholder="Rooms"
                        />
                      </div>
                      <div>
                        <label className="admin-small mb-0.5 block">Rooms value</label>
                        <input
                          type="text"
                          value={loc.pages?.featuredRoomsValue ?? ''}
                          onChange={(e) => setStat('featuredRoomsValue', e.target.value)}
                          className={inputClass}
                          placeholder="Living + 2 bedrooms"
                        />
                      </div>
                      <div>
                        <label className="admin-small mb-0.5 block">City label</label>
                        <input
                          type="text"
                          value={loc.pages?.featuredCityLabel ?? ''}
                          onChange={(e) => setStat('featuredCityLabel', e.target.value)}
                          className={inputClass}
                          placeholder="City"
                        />
                      </div>
                      <div>
                        <label className="admin-small mb-0.5 block">City value</label>
                        <input
                          type="text"
                          value={loc.pages?.featuredCityValue ?? ''}
                          onChange={(e) => setStat('featuredCityValue', e.target.value)}
                          className={inputClass}
                          placeholder="Beirut"
                        />
                      </div>
                      <div>
                        <label className="admin-small mb-0.5 block">Finish label</label>
                        <input
                          type="text"
                          value={loc.pages?.featuredFinishLabel ?? ''}
                          onChange={(e) => setStat('featuredFinishLabel', e.target.value)}
                          className={inputClass}
                          placeholder="Finish"
                        />
                      </div>
                      <div>
                        <label className="admin-small mb-0.5 block">Finish value</label>
                        <input
                          type="text"
                          value={loc.pages?.featuredFinishValue ?? ''}
                          onChange={(e) => setStat('featuredFinishValue', e.target.value)}
                          className={inputClass}
                          placeholder="Washable matte"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </section>

      {/* Featured block + testimonials heading (just key texts that appear on home) */}
      <section className="admin-grit p-6 space-y-4">
        <h2 className="admin-section-title text-brand-yellow">
          Featured block & testimonials headings
        </h2>
        <p className="admin-small max-w-xl text-neutral-400">
          Text that appears in the featured before/after section and at the top of the testimonials block on the
          homepage.
        </p>
        <div className="space-y-4">
          {languages.map((lang) => {
            const loc = getLocale(lang.code);
            return (
              <div
                key={lang.code}
                className="admin-grit-inner rounded-lg bg-neutral-800/40 p-4 space-y-3"
              >
                <h3 className="admin-body font-semibold text-brand-yellow">
                  {lang.name} ({lang.code})
                </h3>
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label className="admin-small mb-0.5 block">Featured – kicker</label>
                    <input
                      type="text"
                      value={loc.pages?.featuredKicker ?? ''}
                      onChange={(e) =>
                        setContent((prev) => {
                          if (!prev) return prev;
                          const nextLocale = { ...(prev.localeContent ?? {}) };
                          const current = (nextLocale[lang.code] as LocaleContent | undefined) ?? {
                            nav: {},
                            pages: {},
                            footer: {},
                          };
                          nextLocale[lang.code] = {
                            ...current,
                            pages: { ...(current.pages ?? {}), featuredKicker: e.target.value },
                          };
                          return { ...prev, localeContent: nextLocale };
                        })
                      }
                      className={inputClass}
                      placeholder="FEATURED TRANSFORMATION"
                    />
                  </div>
                  <div>
                    <label className="admin-small mb-0.5 block">Featured – title</label>
                    <input
                      type="text"
                      value={loc.pages?.featuredTitle ?? ''}
                      onChange={(e) =>
                        setContent((prev) => {
                          if (!prev) return prev;
                          const nextLocale = { ...(prev.localeContent ?? {}) };
                          const current = (nextLocale[lang.code] as LocaleContent | undefined) ?? {
                            nav: {},
                            pages: {},
                            footer: {},
                          };
                          nextLocale[lang.code] = {
                            ...current,
                            pages: { ...(current.pages ?? {}), featuredTitle: e.target.value },
                          };
                          return { ...prev, localeContent: nextLocale };
                        })
                      }
                      className={inputClass}
                      placeholder="See the difference in one weekend"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="admin-small mb-0.5 block">Featured – subtitle</label>
                    <input
                      type="text"
                      value={loc.pages?.featuredSubtitle ?? ''}
                      onChange={(e) =>
                        setContent((prev) => {
                          if (!prev) return prev;
                          const nextLocale = { ...(prev.localeContent ?? {}) };
                          const current = (nextLocale[lang.code] as LocaleContent | undefined) ?? {
                            nav: {},
                            pages: {},
                            footer: {},
                          };
                          nextLocale[lang.code] = {
                            ...current,
                            pages: { ...(current.pages ?? {}), featuredSubtitle: e.target.value },
                          };
                          return { ...prev, localeContent: nextLocale };
                        })
                      }
                      className={inputClass}
                      placeholder="Short description of the featured project…"
                    />
                  </div>
                  <div>
                    <label className="admin-small mb-0.5 block">Testimonials – kicker</label>
                    <input
                      type="text"
                      value={loc.pages?.testimonialsKicker ?? ''}
                      onChange={(e) =>
                        setContent((prev) => {
                          if (!prev) return prev;
                          const nextLocale = { ...(prev.localeContent ?? {}) };
                          const current = (nextLocale[lang.code] as LocaleContent | undefined) ?? {
                            nav: {},
                            pages: {},
                            footer: {},
                          };
                          nextLocale[lang.code] = {
                            ...current,
                            pages: { ...(current.pages ?? {}), testimonialsKicker: e.target.value },
                          };
                          return { ...prev, localeContent: nextLocale };
                        })
                      }
                      className={inputClass}
                      placeholder="CLIENT FEEDBACK"
                    />
                  </div>
                  <div>
                    <label className="admin-small mb-0.5 block">Testimonials – title</label>
                    <input
                      type="text"
                      value={loc.pages?.whatClientsSay ?? ''}
                      onChange={(e) =>
                        setContent((prev) => {
                          if (!prev) return prev;
                          const nextLocale = { ...(prev.localeContent ?? {}) };
                          const current = (nextLocale[lang.code] as LocaleContent | undefined) ?? {
                            nav: {},
                            pages: {},
                            footer: {},
                          };
                          nextLocale[lang.code] = {
                            ...current,
                            pages: { ...(current.pages ?? {}), whatClientsSay: e.target.value },
                          };
                          return { ...prev, localeContent: nextLocale };
                        })
                      }
                      className={inputClass}
                      placeholder="What clients say"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="admin-small mb-0.5 block">Testimonials – subtitle</label>
                    <input
                      type="text"
                      value={loc.pages?.testimonialsSubtitle ?? ''}
                      onChange={(e) =>
                        setContent((prev) => {
                          if (!prev) return prev;
                          const nextLocale = { ...(prev.localeContent ?? {}) };
                          const current = (nextLocale[lang.code] as LocaleContent | undefined) ?? {
                            nav: {},
                            pages: {},
                            footer: {},
                          };
                          nextLocale[lang.code] = {
                            ...current,
                            pages: { ...(current.pages ?? {}), testimonialsSubtitle: e.target.value },
                          };
                          return { ...prev, localeContent: nextLocale };
                        })
                      }
                      className={inputClass}
                      placeholder="Intro line above testimonials"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="mt-4 border-t border-neutral-700 pt-4">
        <button
          type="button"
          onClick={saveContent}
          disabled={saving}
          className="rounded-lg bg-brand-yellow px-5 py-2.5 font-semibold text-neutral-900 transition-colors hover:bg-brand-yellow-dark focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:ring-offset-2 focus:ring-offset-neutral-900 disabled:pointer-events-none disabled:opacity-50"
        >
          {saving ? adminLabels.saving : adminLabels.saveContent}
        </button>
      </div>
    </div>
  );
}

