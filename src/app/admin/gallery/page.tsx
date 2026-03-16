'use client';

import { useAdmin } from '@/contexts/AdminContext';

const inputClass =
  'w-full rounded-lg border border-neutral-600 bg-neutral-800 px-3 py-2.5 text-neutral-100 placeholder-neutral-500 focus:border-brand-yellow focus:outline-none focus:ring-1 focus:ring-brand-yellow';
const labelClass = 'admin-body mb-1.5 block font-medium text-neutral-300';

export default function AdminGalleryPage() {
  const {
    content,
    galleryCategories,
    addGalleryCategory,
    removeGalleryCategory,
    updateGalleryCategory,
    updateGalleryCategoryNameByLocale,
    setImageCategory,
    adminLabels,
    handleUpload,
    handleDeleteImage,
    saveContent,
    saving,
    uploading,
    uploadFile,
    setUploadFile,
    uploadCategory,
    setUploadCategory,
  } = useAdmin();

  return (
    <div className="space-y-8">
      <h1 className="admin-page-title">{adminLabels.gallery}</h1>

      <section className="admin-grit p-6">
        <h2 className="admin-section-title mb-4 text-brand-yellow">
          {adminLabels.galleryCategories}
        </h2>
        <p className="admin-muted mb-4">
          Create categories (e.g. Doors, Walls, Ceilings) and add names in each language so visitors
          see them in their selected language.
        </p>
        <ul className="mb-4 space-y-3">
          {galleryCategories.map((cat) => {
            const catWithLocale = cat as { nameByLocale?: Record<string, string> };
            const languages = content?.languages ?? [{ code: 'en', name: 'English' }, { code: 'ar', name: 'العربية' }];
            return (
              <li
                key={cat.id}
                className="admin-grit-inner flex flex-wrap items-end gap-2 rounded-lg bg-neutral-800/50 p-3"
              >
                <div className="flex flex-wrap gap-2 min-w-0 flex-1">
                  {languages.map((lang) => (
                    <div key={lang.code} className="min-w-[120px] flex-1">
                      <label className="admin-small mb-0.5 block">
                        {lang.name} ({lang.code})
                      </label>
                      <input
                        type="text"
                        value={catWithLocale.nameByLocale?.[lang.code] ?? (lang.code === 'en' ? cat.name : '')}
                        onChange={(e) => updateGalleryCategoryNameByLocale(cat.id, lang.code, e.target.value)}
                        className={`${inputClass} py-2`}
                        placeholder={lang.code === 'en' ? 'e.g. Doors' : ''}
                      />
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => removeGalleryCategory(cat.id)}
                  className="admin-body shrink-0 rounded-lg px-3 py-2 text-red-400 transition-colors hover:bg-red-500/10 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-neutral-900"
                aria-label={`${adminLabels.remove} ${cat.name || cat.id}`}
              >
                {adminLabels.remove}
              </button>
              </li>
            );
          })}
        </ul>
        <button
          type="button"
          onClick={addGalleryCategory}
          className="admin-body rounded-lg border border-neutral-600 bg-neutral-800 px-3 py-1.5 font-medium text-neutral-200 transition-colors hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:ring-offset-2 focus:ring-offset-neutral-900"
        >
          {adminLabels.addCategory}
        </button>
      </section>

      <section className="admin-grit p-6">
        <h2 className="admin-section-title mb-4 text-brand-yellow">
          {adminLabels.manageGallery}
        </h2>
        <p className="admin-muted mb-4">
          Assign each image to a category. Images without a category appear under
          &quot;Uncategorized&quot;. Click Save content to persist category changes.
        </p>
        <form onSubmit={handleUpload} className="mb-6 flex flex-wrap items-end gap-3">
          <div className="min-w-[180px] flex-1">
            <label htmlFor="gallery-file" className={labelClass}>
              Choose image
            </label>
            <input
              id="gallery-file"
              type="file"
              accept="image/*"
              onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)}
              className="admin-body block w-full text-neutral-400 file:mr-3 file:rounded-lg file:border-0 file:bg-neutral-700 file:px-4 file:py-2 file:font-medium file:text-neutral-200 file:transition-colors hover:file:bg-neutral-600"
            />
          </div>
          <div className="min-w-[140px]">
            <label htmlFor="upload-category" className={labelClass}>
              Category (optional)
            </label>
            <select
              id="upload-category"
              value={uploadCategory}
              onChange={(e) => setUploadCategory(e.target.value)}
              className={inputClass}
            >
              <option value="">Uncategorized</option>
              {galleryCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name || c.id}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={!uploadFile || uploading}
            className="rounded-lg bg-brand-yellow px-5 py-2.5 font-semibold text-neutral-900 transition-colors hover:bg-brand-yellow-dark focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:ring-offset-2 focus:ring-offset-neutral-900 disabled:pointer-events-none disabled:opacity-50"
          >
            {uploading ? 'Uploading…' : 'Add photo'}
          </button>
        </form>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {(content?.galleryImages ?? []).map((img) => (
            <div
              key={img.id}
              className="admin-grit-inner group relative aspect-square overflow-hidden rounded-lg bg-neutral-800"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.src} alt="" className="h-full w-full object-cover" />
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100 focus-within:opacity-100">
                <div className="p-2">
                  <label htmlFor={`cat-${img.id}`} className="sr-only">
                    Category
                  </label>
                  <select
                    id={`cat-${img.id}`}
                    value={img.categoryId ?? ''}
                    onChange={(e) => setImageCategory(img.id, e.target.value || undefined)}
                    className="admin-body mb-2 w-full rounded border border-neutral-600 bg-neutral-800 px-2 py-1.5 text-neutral-100 focus:border-brand-yellow focus:outline-none focus:ring-1 focus:ring-brand-yellow"
                  >
                    <option value="">Uncategorized</option>
                    {galleryCategories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name || c.id}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(img.id)}
                    className="admin-body w-full rounded bg-red-500/20 py-1.5 text-red-400 transition-colors hover:bg-red-500/30 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-inset"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <button
            type="button"
            onClick={saveContent}
            disabled={saving}
            className="rounded-lg bg-brand-yellow px-5 py-2.5 font-semibold text-neutral-900 transition-colors hover:bg-brand-yellow-dark focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:ring-offset-2 focus:ring-offset-neutral-900 disabled:pointer-events-none disabled:opacity-50"
          >
            {saving ? adminLabels.saving : adminLabels.saveContent}
          </button>
        </div>
      </section>
    </div>
  );
}
