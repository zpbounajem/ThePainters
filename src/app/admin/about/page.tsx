'use client';

import { useAdmin } from '@/contexts/AdminContext';
import type { FAQItem } from '@/types/admin';

const inputClass =
  'w-full rounded-lg border border-neutral-600 bg-neutral-800 px-3 py-2.5 text-neutral-100 placeholder-neutral-500 focus:border-brand-yellow focus:outline-none focus:ring-1 focus:ring-brand-yellow';
const labelClass = 'admin-body mb-1.5 block font-medium text-neutral-300';

export default function AdminAboutPage() {
  const {
    content,
    setContent,
    aboutGrids,
    addAboutGrid,
    removeAboutGrid,
    updateAboutGridByLocale,
    adminLabels,
    saving,
    saveContent,
  } = useAdmin();

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

  return (
    <div className="space-y-8">
      <h1 className="admin-page-title">{adminLabels.aboutPage}</h1>
      <p className="admin-muted">
        Edit the About page sections: bio, services grid, FAQ and areas you serve. This affects the `/about` page.
      </p>

      {/* Bio */}
      <section className="admin-grit p-6 space-y-4">
        <h2 className="admin-section-title text-brand-yellow">Artist bio</h2>
        <p className="admin-small max-w-xl text-neutral-400">
          Short intro about you / the business, shown at the top of the About page in English and Arabic.
        </p>
        <div className="space-y-3">
          <div>
            <label htmlFor="about-bio-en" className={labelClass}>
              {adminLabels.bioEnglish}
            </label>
            <textarea
              id="about-bio-en"
              rows={4}
              value={typeof content.bio === 'string' ? content.bio : content.bio?.en ?? ''}
              onChange={(e) =>
                setContent((prev) => (prev ? { ...prev, bio: e.target.value } : prev))
              }
              className={`${inputClass} resize-y`}
              placeholder="Short bio in English…"
            />
          </div>
          <div>
            <label htmlFor="about-bio-ar" className={labelClass}>
              {adminLabels.bioArabic}
            </label>
            <textarea
              id="about-bio-ar"
              rows={4}
              value={content.bioAr ?? ''}
              onChange={(e) =>
                setContent((prev) => (prev ? { ...prev, bioAr: e.target.value } : prev))
              }
              className={`${inputClass} resize-y`}
              placeholder="السيرة بالعربية..."
            />
          </div>
        </div>
      </section>

      {/* Services grid */}
      <section className="admin-grit p-6 space-y-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="admin-section-title text-brand-yellow">
            About page – Our services grid
          </h2>
          <button
            type="button"
            onClick={addAboutGrid}
            className="admin-body rounded-lg border border-neutral-600 bg-neutral-800 px-3 py-1.5 font-medium text-neutral-200 transition-colors hover:bg-neutral-700"
          >
            + Add item
          </button>
        </div>
        <p className="admin-small max-w-xl text-neutral-400">
          List of services on the About page. Each item can have text in every language.
        </p>
        <ul className="space-y-3">
          {aboutGrids.map((item) => {
            const itemWithLocale = item as { textByLocale?: Record<string, string> };
            return (
              <li
                key={item.id}
                className="admin-grit-inner flex flex-wrap items-end gap-2 rounded-lg bg-neutral-800/50 p-3"
              >
                <div className="flex min-w-0 flex-1 flex-wrap gap-2">
                  {languages.map((lang) => (
                    <div key={lang.code} className="min-w-[140px] flex-1">
                      <label className="admin-small mb-0.5 block">
                        {lang.name} ({lang.code})
                      </label>
                      <input
                        type="text"
                        value={
                          itemWithLocale.textByLocale?.[lang.code] ??
                          (lang.code === 'en' ? item.text : '')
                        }
                        onChange={(e) =>
                          updateAboutGridByLocale(item.id, lang.code, e.target.value)
                        }
                        className={inputClass}
                        placeholder={lang.code === 'en' ? 'e.g. Interior wall painting' : ''}
                      />
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => removeAboutGrid(item.id)}
                  className="admin-body shrink-0 rounded-lg px-3 py-2 text-red-400 hover:bg-red-500/10"
                >
                  {adminLabels.remove}
                </button>
              </li>
            );
          })}
        </ul>
        {aboutGrids.length === 0 && (
          <p className="admin-muted rounded-lg border border-dashed border-neutral-600 py-4 text-center">
            No services yet. Click &quot;+ Add item&quot; to add services.
          </p>
        )}
      </section>

      {/* FAQ */}
      <section className="admin-grit p-6 space-y-4">
        <h2 className="admin-section-title text-brand-yellow">
          FAQ (About page) – per language
        </h2>
        <p className="admin-small max-w-xl text-neutral-400">
          Common questions and answers shown on the About page, with text for each language.
        </p>
        <ul className="space-y-3">
          {(content.faq ?? []).map(
            (item: FAQItem & {
              questionByLocale?: Record<string, string>;
              answerByLocale?: Record<string, string>;
            }) => (
              <li
                key={item.id}
                className="admin-grit-inner space-y-3 rounded-lg bg-neutral-800/50 p-3"
              >
                {languages.map((lang) => (
                  <div key={lang.code} className="space-y-2">
                    <label className="admin-small block">
                      {lang.name} – Question
                    </label>
                    <input
                      type="text"
                      value={
                        item.questionByLocale?.[lang.code] ??
                        (lang.code === 'en' ? item.question : '')
                      }
                      onChange={(e) => {
                        const v = e.target.value;
                        setContent((prev) => {
                          if (!prev) return prev;
                          const next = (prev.faq ?? []).map((x) => {
                            if (x.id !== item.id) return x;
                            const nq = { ...(x.questionByLocale ?? {}), [lang.code]: v };
                            return {
                              ...x,
                              question: lang.code === 'en' ? v : x.question,
                              questionByLocale: nq,
                            };
                          });
                          return { ...prev, faq: next };
                        });
                      }}
                      className={inputClass}
                      placeholder="Question"
                    />
                    <label className="admin-small block">
                      {lang.name} – Answer
                    </label>
                    <textarea
                      rows={2}
                      value={
                        item.answerByLocale?.[lang.code] ??
                        (lang.code === 'en' ? item.answer : '')
                      }
                      onChange={(e) => {
                        const v = e.target.value;
                        setContent((prev) => {
                          if (!prev) return prev;
                          const next = (prev.faq ?? []).map((x) => {
                            if (x.id !== item.id) return x;
                            const na = { ...(x.answerByLocale ?? {}), [lang.code]: v };
                            return {
                              ...x,
                              answer: lang.code === 'en' ? v : x.answer,
                              answerByLocale: na,
                            };
                          });
                          return { ...prev, faq: next };
                        });
                      }}
                      className={`${inputClass} resize-y`}
                      placeholder="Answer"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    setContent((prev) =>
                      prev
                        ? {
                            ...prev,
                            faq: (prev.faq ?? []).filter((x) => x.id !== item.id),
                          }
                        : prev,
                    )
                  }
                  className="admin-body rounded px-2 py-1 text-red-400 hover:bg-red-500/10"
                >
                  {adminLabels.remove}
                </button>
              </li>
            ),
          )}
        </ul>
        <button
          type="button"
          onClick={() =>
            setContent((prev) =>
              prev
                ? {
                    ...prev,
                    faq: [
                      ...(prev.faq ?? []),
                      { id: `faq-${Date.now()}`, question: '', answer: '' },
                    ],
                  }
                : prev,
            )
          }
          className="admin-body mt-2 rounded-lg border border-neutral-600 bg-neutral-800 px-3 py-1.5 text-neutral-200"
        >
          + Add FAQ
        </button>
      </section>

      {/* Service areas */}
      <section className="admin-grit p-6 space-y-4">
        <h2 className="admin-section-title text-brand-yellow">
          Service areas (About page)
        </h2>
        <p className="admin-small max-w-xl text-neutral-400">
          Comma or newline separated list, shown on the About page in English and Arabic.
        </p>
        <div className="space-y-3">
          <div>
            <span className="admin-small mb-1 block">English</span>
            <textarea
              rows={2}
              value={content.serviceAreas ?? ''}
              onChange={(e) =>
                setContent((prev) =>
                  prev ? { ...prev, serviceAreas: e.target.value } : prev,
                )
              }
              className={`${inputClass} resize-y`}
              placeholder="Beirut, Tripoli, ..."
            />
          </div>
          <div>
            <span className="admin-small mb-1 block">العربية (Arabic)</span>
            <textarea
              rows={2}
              value={content.serviceAreasAr ?? ''}
              onChange={(e) =>
                setContent((prev) =>
                  prev ? { ...prev, serviceAreasAr: e.target.value } : prev,
                )
              }
              className={`${inputClass} resize-y`}
              placeholder="بيروت، طرابلس، ..."
            />
          </div>
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

