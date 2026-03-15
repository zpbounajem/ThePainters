import { cookies } from 'next/headers';
import GalleryWithFilters from '@/components/GalleryWithFilters';
import { getContent, getLocalized } from '@/lib/content';
import { DEFAULT_LOCALE } from '@/lib/i18n';

type GalleryCategory = { id: string; name: string };
type GalleryImage = { id: string; src: string; categoryId?: string };

function getPages(content: Record<string, unknown>, locale: string): Record<string, string> {
  const localeContent = (content.localeContent as Record<string, { pages?: Record<string, string> }>) || {};
  return localeContent[locale]?.pages || localeContent.en?.pages || {};
}

export async function generateMetadata() {
  const content = (await getContent()) as Record<string, unknown>;
  const seo = (content.seo as Record<string, { title?: string; description?: string }>)?.gallery ?? {};
  return {
    title: seo.title ?? 'Gallery | The Painters LB',
    description: seo.description ?? 'View our interior painting projects across Lebanon.',
  };
}

export default async function GalleryPage() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get('NEXT_LOCALE')?.value || DEFAULT_LOCALE).trim() || DEFAULT_LOCALE;
  const content = (await getContent()) as Record<string, unknown>;
  const pages = getPages(content, locale);
  const images: GalleryImage[] = Array.isArray(content.galleryImages)
    ? (content.galleryImages as { id: string; src: string; categoryId?: string }[]).map((img) => ({
        id: img.id,
        src: img.src,
        categoryId: img.categoryId,
      }))
    : [];
  const rawCategories = Array.isArray(content.galleryCategories)
    ? (content.galleryCategories as { id: string; name: string; nameByLocale?: Record<string, string> }[])
    : [];
  const categories: GalleryCategory[] = rawCategories.map((cat) => ({
    id: cat.id,
    name: getLocalized(cat.nameByLocale, locale, cat.name || cat.id),
  }));

  const labels = {
    ourWork: pages.galleryOurWork || 'Our Work',
    subtitle: pages.gallerySubtitle || 'A selection of our interior painting projects',
    categoriesLabel: pages.galleryCategoriesLabel || 'Categories:',
    uncategorized: pages.galleryUncategorized || 'Uncategorized',
    albums: pages.galleryAlbums || 'Albums',
    photo: pages.galleryPhoto || 'photo',
    photos: pages.galleryPhotos || 'photos',
    noPhotos: pages.galleryNoPhotos || 'No photos in the gallery yet. Check back soon.',
    backToAlbums: pages.galleryBackToAlbums || 'Albums',
  };

  return (
    <section className="space-y-6">
      <GalleryWithFilters images={images} categories={categories} labels={labels} />
    </section>
  );
}
