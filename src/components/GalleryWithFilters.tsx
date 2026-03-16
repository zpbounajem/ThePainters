'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Lightbox } from '@/components/Lightbox';

type GalleryCategory = { id: string; name: string };
type GalleryImage = { id: string; src: string; categoryId?: string };

export type GalleryLabels = {
  ourWork: string;
  subtitle: string;
  categoriesLabel: string;
  uncategorized: string;
  albums: string;
  photo: string;
  photos: string;
  noPhotos: string;
  backToAlbums: string;
};

type Props = {
  images: GalleryImage[];
  categories: GalleryCategory[];
  labels: GalleryLabels;
};

type Album = { id: string; name: string; images: GalleryImage[] };

export default function GalleryWithFilters({ images, categories, labels }: Props) {
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    setLightboxIndex(null);
  }, [selectedAlbum?.id]);

  // Build albums: one per category (with images) + uncategorized
  const albums: Album[] = [];
  categories.forEach((cat) => {
    const catImages = images.filter((img) => img.categoryId === cat.id);
    if (catImages.length > 0) {
      albums.push({ id: cat.id, name: cat.name || cat.id, images: catImages });
    }
  });
  const uncategorized = images.filter((img) => !img.categoryId);
  if (uncategorized.length > 0) {
    albums.push({ id: '__uncategorized__', name: labels.uncategorized, images: uncategorized });
  }

  // Album detail view – like opening an album on the phone
  if (selectedAlbum) {
    return (
      <section className="space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedAlbum(null)}
            className="flex items-center gap-1 text-brand-yellow hover:underline focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:ring-offset-2 focus:ring-offset-neutral-950 rounded"
          >
            <span className="text-lg">‹</span> {labels.backToAlbums}
          </button>
        </div>
        {albums.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-neutral-500 dark:text-neutral-400 mr-1 self-center">{labels.categoriesLabel}</span>
            {albums.map((album) => (
              <button
                key={album.id}
                type="button"
                onClick={() => setSelectedAlbum(album)}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:ring-offset-2 focus:ring-offset-neutral-950 ${
                  selectedAlbum.id === album.id
                    ? 'bg-brand-yellow text-neutral-900'
                    : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                }`}
              >
                {album.name}
              </button>
            ))}
          </div>
        )}
        <h1 className="text-2xl font-bold text-brand-yellow">{selectedAlbum.name}</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {selectedAlbum.images.length} {selectedAlbum.images.length === 1 ? labels.photo : labels.photos}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-2 sm:gap-3">
          {selectedAlbum.images.map((img, index) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setLightboxIndex(index)}
              className="relative aspect-square overflow-hidden rounded-lg bg-neutral-900/70 border border-neutral-800 text-left focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:ring-offset-2 focus:ring-offset-neutral-950"
            >
              <Image
                src={img.src}
                alt=""
                fill
                className="object-cover transition-transform duration-200 hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
              />
            </button>
          ))}
        </div>

        {lightboxIndex !== null && (
          <Lightbox
            images={selectedAlbum.images}
            currentIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onNext={() =>
              setLightboxIndex((prev) =>
                prev === null ? null : (prev + 1) % selectedAlbum.images.length
              )
            }
            onPrev={() =>
              setLightboxIndex((prev) =>
                prev === null ? null : (prev - 1 + selectedAlbum.images.length) % selectedAlbum.images.length
              )
            }
          />
        )}
      </section>
    );
  }

  // My Albums view – grid of album covers like the phone
  return (
    <section className="space-y-10">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-brand-yellow">{labels.ourWork}</h1>
        <p className="mt-2 text-neutral-400">
          {labels.subtitle}
        </p>
      </div>

      {albums.length === 0 ? (
        <div className="rounded-2xl border border-brand-yellow/30 bg-neutral-950/70 p-12 text-center text-neutral-300 shadow-[0_0_30px_rgba(0,0,0,0.6)]">
          <p>{labels.noPhotos}</p>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-neutral-500 dark:text-neutral-400 mr-1">{labels.categoriesLabel}</span>
            {albums.map((album) => (
              <button
                key={album.id}
                type="button"
                onClick={() => setSelectedAlbum(album)}
                className="rounded-full px-3 py-1.5 text-sm font-medium bg-neutral-950/60 border border-neutral-800 text-neutral-300 hover:border-brand-yellow hover:text-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:ring-offset-2 focus:ring-offset-neutral-950 transition-colors"
              >
                {album.name}
              </button>
            ))}
          </div>
          <h2 className="text-xl font-semibold text-neutral-50">{labels.albums}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
            {albums.map((album) => (
              <button
                key={album.id}
                type="button"
                onClick={() => setSelectedAlbum(album)}
                className="group text-left focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:ring-offset-2 focus:ring-offset-neutral-950 rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-950/60 hover:border-brand-yellow/70 hover:bg-neutral-900/70 transition-colors"
              >
                <div className="relative aspect-square overflow-hidden bg-neutral-900">
                  <Image
                    src={album.images[0].src}
                    alt=""
                    fill
                    className="object-cover transition-transform duration-200 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                  />
                </div>
                <div className="border-t border-neutral-800 bg-neutral-950/80 px-3 py-2.5">
                  <p className="font-medium text-neutral-50 truncate">{album.name}</p>
                  <p className="text-sm text-neutral-400">
                    {album.images.length} {album.images.length === 1 ? labels.photo : labels.photos}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
