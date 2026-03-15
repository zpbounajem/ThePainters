'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 px-4">
      <h2 className="text-xl font-semibold text-neutral-200">Something went wrong</h2>
      <p className="text-center text-sm text-neutral-400">
        We couldn’t load this page. Please try again.
      </p>
      <button
        type="button"
        onClick={reset}
        className="rounded-lg bg-brand-yellow px-4 py-2 font-semibold text-neutral-900 transition-colors hover:bg-brand-yellow-dark focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:ring-offset-2 focus:ring-offset-neutral-900"
      >
        Try again
      </button>
    </div>
  );
}
