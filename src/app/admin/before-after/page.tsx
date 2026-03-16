'use client';

import { useState } from 'react';
import { useAdmin } from '@/contexts/AdminContext';

const inputClass =
  'w-full rounded-lg border border-neutral-600 bg-neutral-800 px-3 py-2.5 text-neutral-100 placeholder-neutral-500 focus:border-brand-yellow focus:outline-none focus:ring-1 focus:ring-brand-yellow';
const labelClass = 'admin-body mb-1.5 block font-medium text-neutral-300';

export default function AdminBeforeAfterPage() {
  const [justSetId, setJustSetId] = useState<string | null>(null);
  const {
    adminLabels,
    content,
    setFeaturedBeforeAfter,
    handleAddBeforeAfter,
    removeBeforeAfter,
    saveContent,
    saving,
    beforeAfterBefore,
    setBeforeAfterBefore,
    beforeAfterAfter,
    setBeforeAfterAfter,
    beforeAfterCaption,
    setBeforeAfterCaption,
    beforeAfterUploading,
  } = useAdmin();

  return (
    <div className="space-y-8">
      <h1 className="admin-page-title">
        {adminLabels.beforeAfterTitle}
      </h1>
      <p className="admin-muted">
        Add pairs for the Before & After page. Upload &quot;before&quot; and &quot;after&quot;
        images, then click Add pair. Save content to persist.
      </p>

      <section className="admin-grit p-6">
        <h2 className="admin-section-title mb-4 text-brand-yellow">Add new pair</h2>
        <form onSubmit={handleAddBeforeAfter} className="mb-6 flex flex-wrap gap-4">
          <div>
            <label className={labelClass}>Before image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setBeforeAfterBefore(e.target.files?.[0] ?? null)}
              className="admin-body block w-full text-neutral-400 file:mr-3 file:rounded-lg file:border-0 file:bg-neutral-700 file:px-4 file:py-2 file:font-medium file:text-neutral-200"
            />
          </div>
          <div>
            <label className={labelClass}>After image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setBeforeAfterAfter(e.target.files?.[0] ?? null)}
              className="admin-body block w-full text-neutral-400 file:mr-3 file:rounded-lg file:border-0 file:bg-neutral-700 file:px-4 file:py-2 file:font-medium file:text-neutral-200"
            />
          </div>
          <div className="min-w-[200px] flex-1">
            <label className={labelClass}>Caption (optional)</label>
            <input
              type="text"
              value={beforeAfterCaption}
              onChange={(e) => setBeforeAfterCaption(e.target.value)}
              className={inputClass}
              placeholder="Short caption"
            />
          </div>
          <button
            type="submit"
            disabled={!beforeAfterBefore || !beforeAfterAfter || beforeAfterUploading}
            className="self-end rounded-lg bg-brand-yellow px-5 py-2.5 font-semibold text-neutral-900 disabled:opacity-50"
          >
            {beforeAfterUploading ? 'Uploading…' : 'Add pair'}
          </button>
        </form>

        <h3 className="admin-section-title mb-3 text-neutral-300">
          Existing pairs
        </h3>
        <ul className="space-y-3">
          {(content?.beforeAfter ?? []).map((pair) => (
            <li
              key={pair.id}
              className="admin-grit-inner flex flex-wrap items-center gap-4 rounded-lg bg-neutral-800/50 p-3"
            >
              <div className="flex gap-2">
                {pair.beforeSrc && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={pair.beforeSrc}
                    alt="Before"
                    className="h-16 w-16 rounded object-cover"
                  />
                )}
                {pair.afterSrc && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={pair.afterSrc}
                    alt="After"
                    className="h-16 w-16 rounded object-cover"
                  />
                )}
              </div>
              <span className="admin-muted flex-1">{pair.caption || '—'}</span>
              <div className="flex gap-2">
                <div className="flex flex-col items-end gap-1">
                  <button
                    type="button"
                    onClick={async () => {
                      await setFeaturedBeforeAfter(pair.id);
                      setJustSetId(pair.id);
                    }}
                    className="admin-body rounded-lg px-3 py-1.5 bg-brand-yellow/20 text-brand-yellow hover:bg-brand-yellow/30"
                  >
                    Set in home page
                  </button>
                  {justSetId === pair.id && (
                    <span className="admin-small text-brand-yellow">
                      Set for homepage. Visit Home to see it.
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeBeforeAfter(pair.id)}
                  className="admin-body rounded-lg px-3 py-1.5 text-red-400 hover:bg-red-500/10"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
        <p className="admin-small mt-3">
          Remember to click &quot;Save content&quot; below to save before/after changes.
        </p>
      </section>

      <div>
        <button
          type="button"
          onClick={saveContent}
          disabled={saving}
          className="rounded-lg bg-brand-yellow px-5 py-2.5 font-semibold text-neutral-900 transition-colors hover:bg-brand-yellow-dark focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:ring-offset-2 focus:ring-offset-neutral-900 disabled:pointer-events-none disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save content'}
        </button>
      </div>
    </div>
  );
}
