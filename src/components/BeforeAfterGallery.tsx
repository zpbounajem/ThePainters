'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Lightbox, type LightboxImage } from '@/components/Lightbox';

type Pair = { id: string; beforeSrc?: string; afterSrc?: string; caption?: string };

type Props = {
  pairs: Pair[];
  noBeforeAfterText?: string;
};

export default function BeforeAfterGallery({ pairs, noBeforeAfterText }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Flatten all before/after images into one list for lightbox navigation
  const flatImages: LightboxImage[] = [];
  pairs.forEach((pair) => {
    if (pair.beforeSrc) flatImages.push({ id: `${pair.id}-before`, src: pair.beforeSrc });
    if (pair.afterSrc) flatImages.push({ id: `${pair.id}-after`, src: pair.afterSrc });
  });

  // Map pair index + 'before'|'after' to flat index (for opening lightbox on click)
  function getFlatIndex(pairIndex: number, kind: 'before' | 'after'): number {
    let idx = 0;
    for (let i = 0; i < pairIndex; i++) {
      if (pairs[i].beforeSrc) idx++;
      if (pairs[i].afterSrc) idx++;
    }
    if (kind === 'before' && pairs[pairIndex].beforeSrc) return idx;
    if (kind === 'after') return pairs[pairIndex].beforeSrc ? idx + 1 : idx;
    return idx;
  }

  if (pairs.length === 0) {
    return (
      <p className="text-center text-neutral-500">
        {noBeforeAfterText || 'No before/after photos yet. Check back soon.'}
      </p>
    );
  }

  return (
    <>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {pairs.map((pair, pairIndex) => (
          <div
            key={pair.id}
            className="rounded-2xl border border-neutral-800 overflow-hidden bg-neutral-900/50"
          >
            <div className="grid grid-cols-2 gap-0">
              {pair.beforeSrc && (
                <button
                  type="button"
                  onClick={() => setLightboxIndex(getFlatIndex(pairIndex, 'before'))}
                  className="relative aspect-square focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:ring-inset"
                >
                  <Image
                    src={pair.beforeSrc}
                    alt="Before"
                    fill
                    className="object-cover transition-transform duration-200 hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <span className="absolute bottom-1 left-1 rounded bg-black/70 px-2 py-0.5 text-xs text-white">
                    Before
                  </span>
                </button>
              )}
              {pair.afterSrc && (
                <button
                  type="button"
                  onClick={() => setLightboxIndex(getFlatIndex(pairIndex, 'after'))}
                  className="relative aspect-square focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:ring-inset"
                >
                  <Image
                    src={pair.afterSrc}
                    alt="After"
                    fill
                    className="object-cover transition-transform duration-200 hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <span className="absolute bottom-1 left-1 rounded bg-black/70 px-2 py-0.5 text-xs text-white">
                    After
                  </span>
                </button>
              )}
            </div>
            {pair.caption && (
              <p className="p-3 text-sm text-neutral-400">{pair.caption}</p>
            )}
          </div>
        ))}
      </div>

      {lightboxIndex !== null && flatImages.length > 0 && (
        <Lightbox
          images={flatImages}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNext={() =>
            setLightboxIndex((prev) =>
              prev === null ? null : (prev + 1) % flatImages.length
            )
          }
          onPrev={() =>
            setLightboxIndex((prev) =>
              prev === null ? null : (prev - 1 + flatImages.length) % flatImages.length
            )
          }
        />
      )}
    </>
  );
}
