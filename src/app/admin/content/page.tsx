'use client';

import { useState } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import type { TestimonialItem, FAQItem, LocaleContent } from '@/types/admin';
import { DEFAULT_LOCALE_KEYS } from '@/types/admin';

const inputClass =
  'w-full rounded-lg border border-neutral-600 bg-neutral-800 px-3 py-2.5 text-neutral-100 placeholder-neutral-500 focus:border-brand-yellow focus:outline-none focus:ring-1 focus:ring-brand-yellow';
const labelClass = 'admin-body mb-1.5 block font-medium text-neutral-300';

const TABS = [
  { id: 'general', label: 'General' },
  { id: 'home-about', label: 'Home & About' },
  { id: 'legal-seo', label: 'Legal & SEO' },
  { id: 'languages', label: 'Languages' },
] as const;

export default function AdminContentPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]['id']>('general');
  const {
    content,
    setContent,
    saving,
    handleSaveContent,
    bioValue,
    setBioValue,
    aboutGrids,
    addAboutGrid,
    removeAboutGrid,
    updateAboutGrid,
    homeCards,
    updateHomeCard,
    updateHomeCardByLocale,
  } = useAdmin();

  if (!content) {
    return (
      <div className="admin-grit admin-body p-8 text-center text-neutral-500">
        Loading content…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="admin-page-title">
          Edit content
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
              {t.label}
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
                Bio & Contact
              </h2>
              <div>
                <label htmlFor="admin-bio" className={labelClass}>
                  Bio
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
                    Contact form – success message (per language)
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
                Home page – Feature cards
              </h2>
              <p className="admin-small mb-3">
                The three cards on the homepage. Icon can be an emoji (e.g. 🎨 📍 📸).
              </p>
              <div className="space-y-4">
                {homeCards.map((card) => (
                  <div
                    key={card.id}
                    className="admin-grit-inner space-y-3 rounded-lg bg-neutral-800/50 p-4"
                  >
                    <div className="admin-muted font-medium">
                      Card {card.id === '1' ? '1' : card.id === '2' ? '2' : '3'}
                    </div>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div>
                        <label className="admin-small mb-1 block">Icon (emoji)</label>
                        <input
                          type="text"
                          value={card.icon}
                          onChange={(e) => updateHomeCard(card.id, 'icon', e.target.value)}
                          className={`${inputClass} py-2`}
                          placeholder="🎨"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="admin-small mb-1 block">Title</label>
                        <input
                          type="text"
                          value={card.title}
                          onChange={(e) => updateHomeCard(card.id, 'title', e.target.value)}
                          className={`${inputClass} py-2`}
                          placeholder="e.g. Interior Painting"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="admin-small mb-1 block">Description</label>
                      <input
                        type="text"
                        value={card.description}
                        onChange={(e) => updateHomeCard(card.id, 'description', e.target.value)}
                        className={`${inputClass} py-2`}
                        placeholder="e.g. Walls & ceilings, quality finishes"
                      />
                    </div>
                    <div className="border-t border-neutral-600 pt-3 mt-3">
                      <span className="admin-small font-medium block mb-2">Per language (optional)</span>
                      {(content.languages ?? [{ code: 'en', name: 'English' }, { code: 'ar', name: 'العربية' }]).map(
                        (lang: { code: string; name: string }) => (
                          <div key={lang.code} className="grid gap-2 sm:grid-cols-2 mb-2">
                            <div>
                              <label className="admin-small mb-0.5 block">{lang.name} – Title</label>
                              <input
                                type="text"
                                value={(card as { titleByLocale?: Record<string, string> }).titleByLocale?.[lang.code] ?? (lang.code === 'en' ? card.title : '')}
                                onChange={(e) => updateHomeCardByLocale(card.id, 'title', lang.code, e.target.value)}
                                className={`${inputClass} py-1.5 text-sm`}
                                placeholder={lang.code === 'en' ? card.title : ''}
                              />
                            </div>
                            <div>
                              <label className="admin-small mb-0.5 block">{lang.name} – Description</label>
                              <input
                                type="text"
                                value={(card as { descriptionByLocale?: Record<string, string> }).descriptionByLocale?.[lang.code] ?? (lang.code === 'en' ? card.description : '')}
                                onChange={(e) => updateHomeCardByLocale(card.id, 'description', lang.code, e.target.value)}
                                className={`${inputClass} py-1.5 text-sm`}
                                placeholder={lang.code === 'en' ? card.description : ''}
                              />
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

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
              <ul className="space-y-2">
                {aboutGrids.map((item) => (
                  <li
                    key={item.id}
                    className="admin-grit-inner flex flex-wrap items-center gap-2 rounded-lg bg-neutral-800/50 p-2 sm:flex-nowrap"
                  >
                    <input
                      type="text"
                      value={item.text}
                      onChange={(e) => updateAboutGrid(item.id, e.target.value)}
                      className={`${inputClass} min-w-0 flex-1 py-2`}
                      placeholder="e.g. Interior wall painting"
                    />
                    <button
                      type="button"
                      onClick={() => removeAboutGrid(item.id)}
                      className="admin-body shrink-0 rounded-lg px-3 py-2 text-red-400 hover:bg-red-500/10"
                      aria-label="Remove"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
              {aboutGrids.length === 0 && (
                <p className="admin-muted rounded-lg border border-dashed border-neutral-600 py-4 text-center">
                  No grid items. Click &quot;+ Add item&quot; to add services.
                </p>
              )}
            </section>

            <section>
              <h2 className="admin-section-title mb-3 uppercase tracking-wider text-neutral-400">
                Testimonials (home page)
              </h2>
              <p className="admin-small mb-3">Name and quote. Optional: image URL.</p>
              <ul className="space-y-3">
                {(content.testimonials ?? []).map((t: TestimonialItem) => (
                  <li
                    key={t.id}
                    className="admin-grit-inner space-y-2 rounded-lg bg-neutral-800/50 p-3"
                  >
                    <input
                      type="text"
                      value={t.name}
                      onChange={(e) =>
                        setContent((prev) =>
                          prev
                            ? {
                                ...prev,
                                testimonials: (prev.testimonials ?? []).map((x) =>
                                  x.id === t.id ? { ...x, name: e.target.value } : x
                                ),
                              }
                            : prev
                        )
                      }
                      className={`${inputClass} py-2`}
                      placeholder="Name"
                    />
                    <textarea
                      value={t.quote}
                      onChange={(e) =>
                        setContent((prev) =>
                          prev
                            ? {
                                ...prev,
                                testimonials: (prev.testimonials ?? []).map((x) =>
                                  x.id === t.id ? { ...x, quote: e.target.value } : x
                                ),
                              }
                            : prev
                        )
                      }
                      rows={2}
                      className={`${inputClass} py-2`}
                      placeholder="Quote"
                    />
                    <div className="flex justify-between gap-2">
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
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
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
                FAQ (about page)
              </h2>
              <p className="admin-small mb-3">Question and answer pairs.</p>
              <ul className="space-y-3">
                {(content.faq ?? []).map((item: FAQItem) => (
                  <li
                    key={item.id}
                    className="admin-grit-inner space-y-2 rounded-lg bg-neutral-800/50 p-3"
                  >
                    <input
                      type="text"
                      value={item.question}
                      onChange={(e) =>
                        setContent((prev) =>
                          prev
                            ? {
                                ...prev,
                                faq: (prev.faq ?? []).map((x) =>
                                  x.id === item.id ? { ...x, question: e.target.value } : x
                                ),
                              }
                            : prev
                        )
                      }
                      className={`${inputClass} py-2`}
                      placeholder="Question"
                    />
                    <textarea
                      value={item.answer}
                      onChange={(e) =>
                        setContent((prev) =>
                          prev
                            ? {
                                ...prev,
                                faq: (prev.faq ?? []).map((x) =>
                                  x.id === item.id ? { ...x, answer: e.target.value } : x
                                ),
                              }
                            : prev
                        )
                      }
                      rows={2}
                      className={`${inputClass} py-2`}
                      placeholder="Answer"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setContent((prev) =>
                          prev ? { ...prev, faq: (prev.faq ?? []).filter((x) => x.id !== item.id) } : prev
                        )
                      }
                      className="admin-body rounded px-2 py-1 text-red-400 hover:bg-red-500/10"
                    >
                      Remove
                    </button>
                  </li>
                ))}
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

            <section>
              <label className={labelClass}>Bio (Arabic, optional)</label>
              <textarea
                value={content.bioAr ?? ''}
                onChange={(e) => setContent((prev) => (prev ? { ...prev, bioAr: e.target.value } : prev))}
                rows={3}
                className={`${inputClass} resize-y`}
                placeholder="Same as bio in Arabic for bilingual support"
              />
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
            {saving ? 'Saving…' : 'Save content'}
          </button>
        </div>
      </form>
    </div>
  );
}
