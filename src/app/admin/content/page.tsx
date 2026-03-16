'use client';

import { useState } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import type { TestimonialItem, FAQItem, LocaleContent } from '@/types/admin';
import { DEFAULT_LOCALE_KEYS } from '@/types/admin';

const inputClass =
  'w-full rounded-lg border border-neutral-600 bg-neutral-800 px-3 py-2.5 text-neutral-100 placeholder-neutral-500 focus:border-brand-yellow focus:outline-none focus:ring-1 focus:ring-brand-yellow';
const labelClass = 'admin-body mb-1.5 block font-medium text-neutral-300';

const TABS = [
  { id: 'general', labelKey: 'general' as const },
  { id: 'home-about', labelKey: 'homeAbout' as const },
  { id: 'legal-seo', labelKey: 'legalSeo' as const },
  { id: 'languages', labelKey: 'languages' as const },
] as const;

const HOME_PAGE_TEXT_KEYS: { key: keyof LocaleContent['pages']; label: string }[] = [
  { key: 'homeWelcome', label: 'Welcome paragraph' },
  { key: 'homeStatProjectsLabel', label: 'Rooms painted – label' },
  { key: 'homeStatProjectsValue', label: 'Rooms painted – value' },
  { key: 'homeStatExperienceLabel', label: 'Years experience – label' },
  { key: 'homeStatExperienceValue', label: 'Years experience – value' },
  { key: 'homeStatCoverageLabel', label: 'Areas served – label' },
  { key: 'homeStatCoverageValue', label: 'Areas served – value' },
  { key: 'servicesTitle', label: 'Services section – title' },
  { key: 'servicesSubtitle', label: 'Services section – subtitle' },
  { key: 'serviceApartmentsTitle', label: 'Card: Apartments – title' },
  { key: 'serviceApartmentsDescription', label: 'Card: Apartments – description' },
  { key: 'serviceHousesTitle', label: 'Card: Houses & villas – title' },
  { key: 'serviceHousesDescription', label: 'Card: Houses & villas – description' },
  { key: 'serviceOfficesTitle', label: 'Card: Offices & studios – title' },
  { key: 'serviceOfficesDescription', label: 'Card: Offices & studios – description' },
  { key: 'serviceTouchupsTitle', label: 'Card: Renovation touch‑ups – title' },
  { key: 'serviceTouchupsDescription', label: 'Card: Renovation touch‑ups – description' },
  { key: 'featuredSubtitle', label: 'Featured block – main subtitle' },
  { key: 'featuredBeforeLabel', label: 'Featured block – Before label' },
  { key: 'featuredBeforeText', label: 'Featured block – Before text' },
  { key: 'featuredAfterLabel', label: 'Featured block – After label' },
  { key: 'featuredAfterText', label: 'Featured block – After text' },
  { key: 'featuredDetailsTitle', label: 'Featured block – Project snapshot title' },
  { key: 'featuredDetailsText', label: 'Featured block – Project snapshot text' },
  { key: 'featuredDurationLabel', label: 'Featured stats – Duration label' },
  { key: 'featuredDurationValue', label: 'Featured stats – Duration value' },
  { key: 'featuredRoomsLabel', label: 'Featured stats – Rooms label' },
  { key: 'featuredRoomsValue', label: 'Featured stats – Rooms value' },
  { key: 'featuredCityLabel', label: 'Featured stats – City label' },
  { key: 'featuredCityValue', label: 'Featured stats – City value' },
  { key: 'featuredFinishLabel', label: 'Featured stats – Finish label' },
  { key: 'featuredFinishValue', label: 'Featured stats – Finish value' },
  { key: 'testimonialsKicker', label: 'Testimonials – small heading (e.g. CLIENT FEEDBACK)' },
  { key: 'whatClientsSay', label: 'Testimonials – main title (e.g. What clients say)' },
  { key: 'testimonialsSubtitle', label: 'Testimonials – subtitle text' },
];

export default function AdminContentPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]['id']>('general');
  const {
    content,
    setContent,
    saving,
    handleSaveContent,
    saveContent,
    bioValue,
    setBioValue,
    aboutGrids,
    addAboutGrid,
    removeAboutGrid,
    updateAboutGrid,
    updateAboutGridByLocale,
    homeCards,
    updateHomeCard,
    updateHomeCardByLocale,
    adminLabels,
  } = useAdmin();

  if (!content) {
    return (
      <div className="admin-grit admin-body p-8 text-center text-neutral-500">
        {adminLabels.loading}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="admin-page-title">
          {adminLabels.editContent}
        </h1>
        <div className="admin-grit-inner flex rounded-lg bg-neutral-800/50 p-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`admin-body rounded-md px-3 py-2 font-medium transition-colors ${
                tab === t.id ? 'bg-brand-yellow text-neutral-900' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {adminLabels[t.labelKey]}
            </button>
          ))}
        </div>
      </div>

      <form
        id="edit-content-form"
        onSubmit={handleSaveContent}
        className="admin-grit p-6"
      >
        {tab === 'general' && (
          <div className="space-y-6">
            <section>
              <h2 className="admin-section-title mb-3 uppercase tracking-wider text-neutral-400">
                {adminLabels.bioAndContact}
              </h2>
              <div>
                <label htmlFor="admin-bio" className={labelClass}>
                  {adminLabels.bioEnglish}
                </label>
                <textarea
                  id="admin-bio"
                  value={bioValue}
                  onChange={(e) => setBioValue(e.target.value)}
                  rows={4}
                  className={`${inputClass} min-h-[100px] resize-y`}
                  placeholder="Artist bio..."
                />
              </div>
              <div className="mt-3">
                <label htmlFor="admin-bio-ar" className={labelClass}>
                  {adminLabels.bioArabic}
                </label>
                <textarea
                  id="admin-bio-ar"
                  value={content.bioAr ?? ''}
                  onChange={(e) => setContent((prev) => (prev ? { ...prev, bioAr: e.target.value } : prev))}
                  rows={4}
                  className={`${inputClass} min-h-[100px] resize-y`}
                  placeholder="السيرة بالعربية..."
                />
              </div>
              <h3 className="admin-section-title mt-6 mb-2 text-neutral-400">
                {adminLabels.contactDetails}
              </h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="admin-instagram" className={labelClass}>
                    Instagram
                  </label>
                  <input
                    id="admin-instagram"
                    type="text"
                    value={content.contact?.instagram ?? ''}
                    onChange={(e) =>
                      setContent((prev) =>
                        prev ? { ...prev, contact: { ...prev.contact, instagram: e.target.value } } : prev
                      )
                    }
                    className={inputClass}
                    placeholder="@username"
                  />
                </div>
                <div>
                  <label htmlFor="admin-phone" className={labelClass}>
                    Phone
                  </label>
                  <input
                    id="admin-phone"
                    type="text"
                    value={content.contact?.phone ?? ''}
                    onChange={(e) =>
                      setContent((prev) =>
                        prev ? { ...prev, contact: { ...prev.contact, phone: e.target.value } } : prev
                      )
                    }
                    className={inputClass}
                    placeholder="+961 ..."
                  />
                </div>
                <div>
                  <label htmlFor="admin-email" className={labelClass}>
                    Email
                  </label>
                  <input
                    id="admin-email"
                    type="email"
                    value={content.contact?.email ?? ''}
                    onChange={(e) =>
                      setContent((prev) =>
                        prev ? { ...prev, contact: { ...prev.contact, email: e.target.value } } : prev
                      )
                    }
                    className={inputClass}
                    placeholder="contact@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="admin-location" className={labelClass}>
                    Location
                  </label>
                  <input
                    id="admin-location"
                    type="text"
                    value={content.contact?.location ?? ''}
                    onChange={(e) =>
                      setContent((prev) =>
                        prev ? { ...prev, contact: { ...prev.contact, location: e.target.value } } : prev
                      )
                    }
                    className={inputClass}
                    placeholder="Lebanon"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="admin-notify-email" className={labelClass}>
                    Notify email (contact form)
                  </label>
                  <input
                    id="admin-notify-email"
                    type="email"
                    value={content.contact?.notifyEmail ?? ''}
                    onChange={(e) =>
                      setContent((prev) =>
                        prev ? { ...prev, contact: { ...prev.contact, notifyEmail: e.target.value } } : prev
                      )
                    }
                    className={inputClass}
                    placeholder="Email to receive new contact messages"
                  />
                </div>
                <div>
                  <label htmlFor="admin-whatsapp" className={labelClass}>
                    WhatsApp number
                  </label>
                  <input
                    id="admin-whatsapp"
                    type="text"
                    value={content.contact?.whatsapp ?? ''}
                    onChange={(e) =>
                      setContent((prev) =>
                        prev ? { ...prev, contact: { ...prev.contact, whatsapp: e.target.value } } : prev
                      )
                    }
                    className={inputClass}
                    placeholder="961... (digits only for link)"
                  />
                </div>
                <div className="sm:col-span-2">
                  <h3 className="admin-section-title mb-2 text-neutral-300">
                    {adminLabels.successMessagePerLanguage}
                  </h3>
                  <p className="admin-small mb-2">
                    Message shown after the user submits the contact form. Add one per language.
                  </p>
                  {(content.languages ?? [{ code: 'en', name: 'English' }, { code: 'ar', name: 'العربية' }]).map(
                    (lang: { code: string; name: string }) => (
                      <div key={lang.code} className="mb-3">
                        <label htmlFor={`admin-confirmation-${lang.code}`} className="admin-small mb-0.5 block">
                          {lang.name} ({lang.code})
                        </label>
                        <input
                          id={`admin-confirmation-${lang.code}`}
                          type="text"
                          value={(content.contact?.confirmationMessageByLocale as Record<string, string>)?.[lang.code] ?? (lang.code === 'en' ? (content.contact?.confirmationMessage ?? '') : '')}
                          onChange={(e) => {
                            const v = e.target.value;
                            setContent((prev) => {
                              if (!prev) return prev;
                              const next = { ...(prev.contact?.confirmationMessageByLocale ?? {}) };
                              next[lang.code] = v;
                              if (lang.code === 'en') {
                                return { ...prev, contact: { ...prev.contact, confirmationMessage: v, confirmationMessageByLocale: next } };
                              }
                              return { ...prev, contact: { ...prev.contact, confirmationMessageByLocale: next } };
                            });
                          }}
                          className={inputClass}
                          placeholder={lang.code === 'en' ? 'Message sent! We\'ll get back to you.' : ''}
                        />
                      </div>
                    )
                  )}
                </div>
              </div>
            </section>
          </div>
        )}

        {tab === 'home-about' && (
          <div className="space-y-8">
            <section>
              <h2 className="admin-section-title mb-3 uppercase tracking-wider text-neutral-400">
                Home page – Text (per language)
              </h2>
              <p className="admin-small mb-3">
                Edit the main homepage texts in English and Arabic. These control the welcome paragraph, stats,
                service cards, featured before/after block, and testimonials heading.
              </p>
              <div className="space-y-4">
                {(content.languages ?? [{ code: 'en', name: 'English' }, { code: 'ar', name: 'العربية' }]).map(
                  (lang: { code: string; name: string }) => {
                    const loc =
                      (content.localeContent?.[lang.code] as LocaleContent | undefined) ?? DEFAULT_LOCALE_KEYS;
                    return (
                      <div
                        key={lang.code}
                        className="admin-grit-inner rounded-lg bg-neutral-800/40 p-4 space-y-3"
                      >
                        <h3 className="admin-body font-semibold text-brand-yellow">
                          {lang.name} ({lang.code})
                        </h3>
                        <div className="grid gap-3 md:grid-cols-2">
                          {HOME_PAGE_TEXT_KEYS.map(({ key, label }) => (
                            <div key={key}>
                              <label className="admin-small mb-0.5 block">{label}</label>
                              <input
                                type="text"
                                value={loc.pages?.[key] ?? ''}
                                onChange={(e) =>
                                  setContent((prev) => {
                                    if (!prev) return prev;
                                    const nextLocale = { ...(prev.localeContent ?? {}) };
                                    const current =
                                      (nextLocale[lang.code] as LocaleContent | undefined) ??
                                      DEFAULT_LOCALE_KEYS;
                                    nextLocale[lang.code] = {
                                      ...current,
                                      pages: { ...(current.pages ?? {}), [key]: e.target.value },
                                    };
                                    return { ...prev, localeContent: nextLocale };
                                  })
                                }
                                className={inputClass}
                                placeholder={label}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={saveContent}
                  disabled={saving}
                  className="rounded-lg bg-brand-yellow px-4 py-2 text-sm font-semibold text-neutral-900 hover:bg-brand-yellow-dark disabled:opacity-60 disabled:pointer-events-none"
                >
                  {saving ? adminLabels.saving : 'Save home page'}
                </button>
              </div>
            </section>

            <section>
              <h2 className="admin-section-title mb-3 uppercase tracking-wider text-neutral-400">
                Home page – Hero image
              </h2>
              <p className="admin-small mb-2">
                Choose which gallery image appears on the right of the homepage hero.
              </p>
              <div className="grid gap-3 sm:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] items-start">
                <select
                  value={(content as any).homeHeroImageSrc ?? ''}
                  onChange={(e) =>
                    setContent((prev) =>
                      prev ? ({ ...prev, homeHeroImageSrc: e.target.value } as any) : prev
                    )
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
                        {/* Preview rendered on client via regular <img> to avoid Next/Image in admin */}
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

            {/* Home page – old feature cards removed since they are no longer used */}

            <section>
              <div className="mb-2 flex items-center justify-between">
                <h2 className="admin-section-title uppercase tracking-wider text-neutral-400">
                  About page – Our Services grid
                </h2>
                <button
                  type="button"
                  onClick={addAboutGrid}
                  className="admin-body rounded-lg border border-neutral-600 bg-neutral-800 px-3 py-1.5 font-medium text-neutral-200 transition-colors hover:bg-neutral-700"
                >
                  + Add item
                </button>
              </div>
              <p className="admin-small mb-3">
                Service list on the About page.
              </p>
              <ul className="space-y-3">
                {aboutGrids.map((item) => {
                  const itemWithLocale = item as { textByLocale?: Record<string, string> };
                  const languages = content.languages ?? [{ code: 'en', name: 'English' }, { code: 'ar', name: 'العربية' }];
                  return (
                    <li
                      key={item.id}
                      className="admin-grit-inner flex flex-wrap items-end gap-2 rounded-lg bg-neutral-800/50 p-3"
                    >
                      <div className="flex flex-wrap gap-2 min-w-0 flex-1">
                        {languages.map((lang: { code: string; name: string }) => (
                          <div key={lang.code} className="min-w-[140px] flex-1">
                            <label className="admin-small mb-0.5 block">{lang.name} ({lang.code})</label>
                            <input
                              type="text"
                              value={itemWithLocale.textByLocale?.[lang.code] ?? (lang.code === 'en' ? item.text : '')}
                              onChange={(e) => updateAboutGridByLocale(item.id, lang.code, e.target.value)}
                              className={`${inputClass} py-2`}
                              placeholder={lang.code === 'en' ? 'e.g. Interior wall painting' : ''}
                            />
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAboutGrid(item.id)}
                        className="admin-body shrink-0 rounded-lg px-3 py-2 text-red-400 hover:bg-red-500/10"
                        aria-label={adminLabels.remove}
                      >
                        {adminLabels.remove}
                      </button>
                    </li>
                  );
                })}
              </ul>
              {aboutGrids.length === 0 && (
                <p className="admin-muted rounded-lg border border-dashed border-neutral-600 py-4 text-center">
                  No grid items. Click &quot;+ Add item&quot; to add services.
                </p>
              )}
            </section>

            <section>
              <h2 className="admin-section-title mb-3 uppercase tracking-wider text-neutral-400">
                Testimonials (home page) – per language
              </h2>
              <p className="admin-small mb-3">Name and quote in each language. Optional: image URL.</p>
              <ul className="space-y-3">
                {(content.testimonials ?? []).map((t: TestimonialItem & { nameByLocale?: Record<string, string>; quoteByLocale?: Record<string, string> }) => {
                  const langs = content.languages ?? [{ code: 'en', name: 'English' }, { code: 'ar', name: 'العربية' }];
                  return (
                  <li
                    key={t.id}
                    className="admin-grit-inner space-y-3 rounded-lg bg-neutral-800/50 p-3"
                  >
                    {langs.map((lang: { code: string; name: string }) => (
                      <div key={lang.code} className="grid gap-2 sm:grid-cols-2">
                        <div>
                          <label className="admin-small mb-0.5 block">{lang.name} – Name</label>
                          <input
                            type="text"
                            value={t.nameByLocale?.[lang.code] ?? (lang.code === 'en' ? t.name : '')}
                            onChange={(e) => {
                              const v = e.target.value;
                              setContent((prev) => {
                                if (!prev) return prev;
                                const next = (prev.testimonials ?? []).map((x) => {
                                  if (x.id !== t.id) return x;
                                  const nextName = { ...((x as { nameByLocale?: Record<string, string> }).nameByLocale ?? {}) };
                                  nextName[lang.code] = v;
                                  return { ...x, name: lang.code === 'en' ? v : x.name, nameByLocale: nextName };
                                });
                                return { ...prev, testimonials: next };
                              });
                            }}
                            className={`${inputClass} py-2`}
                            placeholder="Name"
                          />
                        </div>
                        <div>
                          <label className="admin-small mb-0.5 block">{lang.name} – Quote</label>
                          <input
                            type="text"
                            value={t.quoteByLocale?.[lang.code] ?? (lang.code === 'en' ? t.quote : '')}
                            onChange={(e) => {
                              const v = e.target.value;
                              setContent((prev) => {
                                if (!prev) return prev;
                                const next = (prev.testimonials ?? []).map((x) => {
                                  if (x.id !== t.id) return x;
                                  const nextQuote = { ...((x as { quoteByLocale?: Record<string, string> }).quoteByLocale ?? {}) };
                                  nextQuote[lang.code] = v;
                                  return { ...x, quote: lang.code === 'en' ? v : x.quote, quoteByLocale: nextQuote };
                                });
                                return { ...prev, testimonials: next };
                              });
                            }}
                            className={`${inputClass} py-2`}
                            placeholder="Quote"
                          />
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-between gap-2 border-t border-neutral-600 pt-2">
                      <input
                        type="text"
                        value={t.image ?? ''}
                        onChange={(e) =>
                          setContent((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  testimonials: (prev.testimonials ?? []).map((x) =>
                                    x.id === t.id ? { ...x, image: e.target.value } : x
                                  ),
                                }
                              : prev
                          )
                        }
                        className={`${inputClass} min-w-0 flex-1 py-2`}
                        placeholder="Image URL (optional)"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setContent((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  testimonials: (prev.testimonials ?? []).filter((x) => x.id !== t.id),
                                }
                              : prev
                          )
                        }
                        className="admin-body shrink-0 rounded-lg px-3 py-2 text-red-400 hover:bg-red-500/10"
                      >
                        {adminLabels.remove}
                      </button>
                    </div>
                  </li>
                  );
                })}
              </ul>
              <button
                type="button"
                onClick={() =>
                  setContent((prev) =>
                    prev
                      ? {
                          ...prev,
                          testimonials: [
                            ...(prev.testimonials ?? []),
                            { id: `t-${Date.now()}`, name: '', quote: '', image: '' },
                          ],
                        }
                      : prev
                  )
                }
                className="admin-body mt-2 rounded-lg border border-neutral-600 bg-neutral-800 px-3 py-1.5 text-neutral-200"
              >
                + Add testimonial
              </button>
            </section>

            <section>
              <h2 className="admin-section-title mb-3 uppercase tracking-wider text-neutral-400">
                FAQ (about page) – per language
              </h2>
              <p className="admin-small mb-3">Question and answer in each language.</p>
              <ul className="space-y-3">
                {(content.faq ?? []).map((item: FAQItem & { questionByLocale?: Record<string, string>; answerByLocale?: Record<string, string> }) => {
                  const faqLangs = content.languages ?? [{ code: 'en', name: 'English' }, { code: 'ar', name: 'العربية' }];
                  return (
                  <li
                    key={item.id}
                    className="admin-grit-inner space-y-3 rounded-lg bg-neutral-800/50 p-3"
                  >
                    {faqLangs.map((lang: { code: string; name: string }) => (
                      <div key={lang.code} className="space-y-2">
                        <label className="admin-small block">{lang.name} – Question</label>
                        <input
                          type="text"
                          value={item.questionByLocale?.[lang.code] ?? (lang.code === 'en' ? item.question : '')}
                          onChange={(e) => {
                            const v = e.target.value;
                            setContent((prev) => {
                              if (!prev) return prev;
                              const next = (prev.faq ?? []).map((x) => {
                                if (x.id !== item.id) return x;
                                const nq = { ...(x.questionByLocale ?? {}), [lang.code]: v };
                                return { ...x, question: lang.code === 'en' ? v : x.question, questionByLocale: nq };
                              });
                              return { ...prev, faq: next };
                            });
                          }}
                          className={`${inputClass} py-2`}
                          placeholder="Question"
                        />
                        <label className="admin-small block">{lang.name} – Answer</label>
                        <textarea
                          value={item.answerByLocale?.[lang.code] ?? (lang.code === 'en' ? item.answer : '')}
                          onChange={(e) => {
                            const v = e.target.value;
                            setContent((prev) => {
                              if (!prev) return prev;
                              const next = (prev.faq ?? []).map((x) => {
                                if (x.id !== item.id) return x;
                                const na = { ...(x.answerByLocale ?? {}), [lang.code]: v };
                                return { ...x, answer: lang.code === 'en' ? v : x.answer, answerByLocale: na };
                              });
                              return { ...prev, faq: next };
                            });
                          }}
                          rows={2}
                          className={`${inputClass} py-2`}
                          placeholder="Answer"
                        />
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        setContent((prev) =>
                          prev ? { ...prev, faq: (prev.faq ?? []).filter((x) => x.id !== item.id) } : prev
                        )
                      }
                      className="admin-body rounded px-2 py-1 text-red-400 hover:bg-red-500/10"
                    >
                      {adminLabels.remove}
                    </button>
                  </li>
                  );
                })}
              </ul>
              <button
                type="button"
                onClick={() =>
                  setContent((prev) =>
                    prev
                      ? {
                          ...prev,
                          faq: [...(prev.faq ?? []), { id: `faq-${Date.now()}`, question: '', answer: '' }],
                        }
                      : prev
                  )
                }
                className="admin-body mt-2 rounded-lg border border-neutral-600 bg-neutral-800 px-3 py-1.5 text-neutral-200"
              >
                + Add FAQ
              </button>
            </section>

            <section>
              <label className={labelClass}>Service areas (about page) – per language</label>
              <p className="admin-small mb-2">
                Comma or newline separated, e.g. Beirut, Tripoli, Mount Lebanon. Add one per language.
              </p>
              <div className="space-y-3">
                <div>
                  <span className="admin-small block mb-1">English</span>
                  <textarea
                    value={content.serviceAreas ?? ''}
                    onChange={(e) => setContent((prev) => (prev ? { ...prev, serviceAreas: e.target.value } : prev))}
                    rows={2}
                    className={`${inputClass} resize-y`}
                    placeholder="Beirut, Tripoli, ..."
                  />
                </div>
                <div>
                  <span className="admin-small block mb-1">العربية (Arabic)</span>
                  <textarea
                    value={content.serviceAreasAr ?? ''}
                    onChange={(e) => setContent((prev) => (prev ? { ...prev, serviceAreasAr: e.target.value } : prev))}
                    rows={2}
                    className={`${inputClass} resize-y`}
                    placeholder="بيروت، طرابلس، ..."
                  />
                </div>
              </div>
            </section>
          </div>
        )}

        {tab === 'legal-seo' && (
          <div className="space-y-8">
            <section>
              <h2 className="admin-section-title mb-3 uppercase tracking-wider text-neutral-400">
                Footer (per language)
              </h2>
              <p className="admin-small mb-2">Copyright text shown in the footer. Add one per language.</p>
              {(content.languages ?? [{ code: 'en', name: 'English' }, { code: 'ar', name: 'العربية' }]).map(
                (lang: { code: string; name: string }) => (
                  <div key={lang.code} className="mb-3">
                    <label htmlFor={`footer-copyright-${lang.code}`} className="admin-small mb-0.5 block">
                      {lang.name} ({lang.code})
                    </label>
                    <input
                      id={`footer-copyright-${lang.code}`}
                      type="text"
                      value={(content.footer?.copyrightTextByLocale as Record<string, string>)?.[lang.code] ?? (lang.code === 'en' ? (content.footer?.copyrightText ?? '') : '')}
                      onChange={(e) => {
                        const v = e.target.value;
                        setContent((prev) => {
                          if (!prev) return prev;
                          const next = { ...(prev.footer?.copyrightTextByLocale ?? {}) };
                          next[lang.code] = v;
                          return {
                            ...prev,
                            footer: {
                              ...prev.footer!,
                              copyrightText: lang.code === 'en' ? v : (prev.footer?.copyrightText ?? ''),
                              copyrightTextByLocale: next,
                              privacyLink: prev.footer?.privacyLink,
                            },
                          };
                        });
                      }}
                      className={inputClass}
                      placeholder={lang.code === 'en' ? '© 2025 The Painters LB' : ''}
                    />
                  </div>
                )
              )}
              <label className="admin-muted mt-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={content.footer?.privacyLink !== false}
                  onChange={(e) =>
                    setContent((prev) =>
                      prev ? { ...prev, footer: { ...prev.footer!, privacyLink: e.target.checked } } : prev
                    )
                  }
                />
                Show Privacy link
              </label>
            </section>

            <section>
              <label className={labelClass}>Privacy page content</label>
              <textarea
                value={content.privacyContent ?? ''}
                onChange={(e) =>
                  setContent((prev) => (prev ? { ...prev, privacyContent: e.target.value } : prev))
                }
                rows={5}
                className={`${inputClass} resize-y`}
                placeholder="Text shown on /privacy"
              />
            </section>

            <section>
              <h2 className="admin-section-title mb-3 uppercase tracking-wider text-neutral-400">
                Cookie notice (per language)
              </h2>
              <label className="admin-muted mb-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={content.cookieNotice?.enabled !== false}
                  onChange={(e) =>
                    setContent((prev) =>
                      prev ? { ...prev, cookieNotice: { ...prev.cookieNotice!, enabled: e.target.checked } } : prev
                    )
                  }
                />
                Show cookie notice
              </label>
              <p className="admin-small mb-2">Message and link text. Add one per language.</p>
              {(content.languages ?? [{ code: 'en', name: 'English' }, { code: 'ar', name: 'العربية' }]).map(
                (lang: { code: string; name: string }) => (
                  <div key={lang.code} className="admin-grit-inner mb-3 rounded-lg p-3 space-y-2">
                    <span className="admin-small font-medium">{lang.name} ({lang.code})</span>
                    <input
                      type="text"
                      value={(content.cookieNotice?.messageByLocale as Record<string, string>)?.[lang.code] ?? (lang.code === 'en' ? (content.cookieNotice?.message ?? '') : '')}
                      onChange={(e) => {
                        const v = e.target.value;
                        setContent((prev) => {
                          if (!prev) return prev;
                          const next = { ...(prev.cookieNotice?.messageByLocale ?? {}) };
                          next[lang.code] = v;
                          return {
                            ...prev,
                            cookieNotice: {
                              ...prev.cookieNotice!,
                              enabled: prev.cookieNotice?.enabled !== false,
                              message: lang.code === 'en' ? v : (prev.cookieNotice?.message ?? ''),
                              messageByLocale: next,
                              linkText: prev.cookieNotice?.linkText ?? 'Privacy',
                              linkTextByLocale: prev.cookieNotice?.linkTextByLocale,
                            },
                          };
                        });
                      }}
                      className={inputClass}
                      placeholder="Notice message"
                    />
                    <input
                      type="text"
                      value={(content.cookieNotice?.linkTextByLocale as Record<string, string>)?.[lang.code] ?? (lang.code === 'en' ? (content.cookieNotice?.linkText ?? 'Privacy') : '')}
                      onChange={(e) => {
                        const v = e.target.value;
                        setContent((prev) => {
                          if (!prev) return prev;
                          const next = { ...(prev.cookieNotice?.linkTextByLocale ?? {}) };
                          next[lang.code] = v;
                          return {
                            ...prev,
                            cookieNotice: {
                              ...prev.cookieNotice!,
                              enabled: prev.cookieNotice?.enabled !== false,
                              linkText: lang.code === 'en' ? v : (prev.cookieNotice?.linkText ?? 'Privacy'),
                              linkTextByLocale: next,
                              message: prev.cookieNotice?.message ?? '',
                              messageByLocale: prev.cookieNotice?.messageByLocale,
                            },
                          };
                        });
                      }}
                      className={inputClass}
                      placeholder="Link text (e.g. Privacy)"
                    />
                  </div>
                )
              )}
            </section>

            <section>
              <h2 className="admin-section-title mb-3 uppercase tracking-wider text-neutral-400">
                SEO – page titles & descriptions
              </h2>
              <p className="admin-small mb-3">
                Used in search results. Leave blank to use defaults.
              </p>
              {(['home', 'gallery', 'about', 'contact', 'privacy', 'beforeAfter'] as const).map(
                (page) => (
                  <div
                    key={page}
                    className="admin-grit-inner mb-4 rounded-lg bg-neutral-800/50 p-3"
                  >
                    <span className="admin-body font-medium capitalize text-brand-yellow">
                      {page === 'beforeAfter' ? 'Before & After' : page}
                    </span>
                    <input
                      type="text"
                      value={content.seo?.[page]?.title ?? ''}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev!,
                          seo: {
                            ...prev!.seo,
                            [page]: {
                              ...(prev!.seo?.[page] ?? {}),
                              title: e.target.value,
                              description: prev!.seo?.[page]?.description ?? '',
                            },
                          },
                        }))
                      }
                      className={`${inputClass} mt-1 py-2`}
                      placeholder="Meta title"
                    />
                    <input
                      type="text"
                      value={content.seo?.[page]?.description ?? ''}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev!,
                          seo: {
                            ...prev!.seo,
                            [page]: {
                              ...(prev!.seo?.[page] ?? {}),
                              title: prev!.seo?.[page]?.title ?? '',
                              description: e.target.value,
                            },
                          },
                        }))
                      }
                      className={`${inputClass} mt-1 py-2`}
                      placeholder="Meta description"
                    />
                  </div>
                )
              )}
            </section>

          </div>
        )}

        {tab === 'languages' && (
          <div className="space-y-8">
            <section>
              <h2 className="admin-section-title mb-3 uppercase tracking-wider text-neutral-400">
                Languages & site text
              </h2>
              <p className="admin-muted mb-4">
                Add languages (e.g. English, Arabic). For each language, fill in the text used in the navbar, page titles, and footer. The site shows a language switcher in the navbar and uses RTL for Arabic (ar).
              </p>
              <div className="space-y-3">
                {(content.languages ?? []).map((lang, idx) => (
                  <div
                    key={lang.code}
                    className="admin-grit-inner flex flex-wrap items-center gap-3 rounded-lg bg-neutral-800/50 p-3"
                  >
                    <span className="font-medium text-brand-yellow">{lang.name}</span>
                    <span className="admin-small">({lang.code})</span>
                    <button
                      type="button"
                      onClick={() => {
                        setContent((prev) => {
                          if (!prev) return prev;
                          const nextLangs = (prev.languages ?? []).filter((l) => l.code !== lang.code);
                          const nextLocale = { ...prev.localeContent };
                          delete nextLocale[lang.code];
                          return { ...prev, languages: nextLangs, localeContent: nextLocale };
                        });
                      }}
                      className="admin-body ml-auto rounded px-2 py-1 text-red-400 hover:bg-red-500/10"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <input
                  type="text"
                  id="new-lang-code"
                  placeholder="Code (e.g. en, ar)"
                  className={`${inputClass} w-24 py-2`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const code = (e.target as HTMLInputElement).value.trim().toLowerCase();
                      const nameInput = document.getElementById('new-lang-name') as HTMLInputElement;
                      const name = nameInput?.value?.trim() || code;
                      if (code && !(content.languages ?? []).some((l) => l.code === code)) {
                        setContent((prev) => {
                          if (!prev) return prev;
                          const nextLangs = [...(prev.languages ?? []), { code, name }];
                          const nextLocale = { ...prev.localeContent };
                          nextLocale[code] = {
                            nav: { ...DEFAULT_LOCALE_KEYS.nav },
                            pages: { ...DEFAULT_LOCALE_KEYS.pages },
                            footer: { ...DEFAULT_LOCALE_KEYS.footer },
                          };
                          (e.target as HTMLInputElement).value = '';
                          if (nameInput) nameInput.value = '';
                          return { ...prev, languages: nextLangs, localeContent: nextLocale };
                        });
                      }
                    }
                  }}
                />
                <input
                  type="text"
                  id="new-lang-name"
                  placeholder="Display name (e.g. English, العربية)"
                  className={`${inputClass} min-w-[140px] flex-1 py-2`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const name = (e.target as HTMLInputElement).value.trim();
                      const codeInput = document.getElementById('new-lang-code') as HTMLInputElement;
                      const code = codeInput?.value?.trim().toLowerCase() || name.slice(0, 2).toLowerCase();
                      if (code && !(content.languages ?? []).some((l) => l.code === code)) {
                        setContent((prev) => {
                          if (!prev) return prev;
                          const nextLangs = [...(prev.languages ?? []), { code, name: name || code }];
                          const nextLocale = { ...prev.localeContent };
                          nextLocale[code] = {
                            nav: { ...DEFAULT_LOCALE_KEYS.nav },
                            pages: { ...DEFAULT_LOCALE_KEYS.pages },
                            footer: { ...DEFAULT_LOCALE_KEYS.footer },
                          };
                          (e.target as HTMLInputElement).value = '';
                          if (codeInput) codeInput.value = '';
                          return { ...prev, languages: nextLangs, localeContent: nextLocale };
                        });
                      }
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const codeInput = document.getElementById('new-lang-code') as HTMLInputElement;
                    const nameInput = document.getElementById('new-lang-name') as HTMLInputElement;
                    const code = (codeInput?.value?.trim() || '').toLowerCase();
                    const name = nameInput?.value?.trim() || code;
                    if (!code || (content.languages ?? []).some((l) => l.code === code)) return;
                    setContent((prev) => {
                      if (!prev) return prev;
                      const nextLangs = [...(prev.languages ?? []), { code, name }];
                      const nextLocale = { ...prev.localeContent };
                      nextLocale[code] = {
                        nav: { ...DEFAULT_LOCALE_KEYS.nav },
                        pages: { ...DEFAULT_LOCALE_KEYS.pages },
                        footer: { ...DEFAULT_LOCALE_KEYS.footer },
                      };
                      if (codeInput) codeInput.value = '';
                      if (nameInput) nameInput.value = '';
                      return { ...prev, languages: nextLangs, localeContent: nextLocale };
                    });
                  }}
                  className="admin-body rounded-lg border border-neutral-600 bg-neutral-800 px-4 py-2 font-medium text-neutral-200 hover:bg-neutral-700"
                >
                  + Add language
                </button>
              </div>
            </section>

            {(content.languages ?? []).map((lang) => {
              const loc = (content.localeContent ?? {})[lang.code] ?? DEFAULT_LOCALE_KEYS;
              const setLoc = (section: keyof LocaleContent, key: string, value: string) => {
                setContent((prev) => {
                  if (!prev) return prev;
                  const next = { ...prev.localeContent };
                  next[lang.code] = { ...next[lang.code], [section]: { ...(next[lang.code]?.[section] ?? {}), [key]: value } };
                  return { ...prev, localeContent: next };
                });
              };
              return (
                <section key={lang.code} className="admin-grit-inner rounded-xl bg-neutral-800/30 p-4">
                  <h3 className="admin-section-title mb-4 text-brand-yellow">
                    {lang.name} ({lang.code})
                  </h3>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <h4 className="admin-small mb-2 font-semibold uppercase text-neutral-500">Nav labels</h4>
                      <div className="space-y-2">
                        {(Object.keys(DEFAULT_LOCALE_KEYS.nav) as (keyof typeof DEFAULT_LOCALE_KEYS.nav)[]).map((k) => (
                          <div key={k}>
                            <label className="admin-small mb-0.5 block">{k}</label>
                            <input
                              type="text"
                              value={loc.nav?.[k] ?? ''}
                              onChange={(e) => setLoc('nav', k, e.target.value)}
                              className={`${inputClass} py-2`}
                              placeholder={k}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="admin-small mb-2 font-semibold uppercase text-neutral-500">Page titles & text</h4>
                      <div className="space-y-2 max-h-[320px] overflow-y-auto">
                        {(Object.keys(DEFAULT_LOCALE_KEYS.pages) as (keyof typeof DEFAULT_LOCALE_KEYS.pages)[]).map((k) => (
                          <div key={k}>
                            <label className="admin-small mb-0.5 block">{k}</label>
                            <input
                              type="text"
                              value={loc.pages?.[k] ?? ''}
                              onChange={(e) => setLoc('pages', k, e.target.value)}
                              className={`${inputClass} py-2`}
                              placeholder={k}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h4 className="admin-small mb-2 font-semibold uppercase text-neutral-500">Footer</h4>
                    <div className="flex gap-4">
                      {(Object.keys(DEFAULT_LOCALE_KEYS.footer) as (keyof typeof DEFAULT_LOCALE_KEYS.footer)[]).map((k) => (
                        <div key={k} className="flex-1">
                          <label className="admin-small mb-0.5 block">{k}</label>
                          <input
                            type="text"
                            value={loc.footer?.[k] ?? ''}
                            onChange={(e) => setLoc('footer', k, e.target.value)}
                            className={inputClass}
                            placeholder={k}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              );
            })}
          </div>
        )}

        <div className="mt-8 border-t border-neutral-700 pt-6">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-brand-yellow px-5 py-2.5 font-semibold text-neutral-900 transition-colors hover:bg-brand-yellow-dark focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:ring-offset-2 focus:ring-offset-neutral-900 disabled:pointer-events-none disabled:opacity-50"
          >
            {saving ? adminLabels.saving : adminLabels.saveContent}
          </button>
        </div>
      </form>
    </div>
  );
}
