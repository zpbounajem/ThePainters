import { readFile } from 'fs/promises';
import path from 'path';

const CONTENT_PATH = path.join(process.cwd(), 'src/data/content.json');

/** Resolve a localized value from ByLocale map with fallback. */
export function getLocalized(
  byLocale: Record<string, string> | undefined,
  locale: string,
  fallback: string,
  fallbackLocale = 'en'
): string {
  if (!byLocale || typeof byLocale !== 'object') return fallback;
  const value = byLocale[locale] ?? byLocale[fallbackLocale];
  return typeof value === 'string' && value.trim() !== '' ? value : fallback;
}

export type SEOEntry = { title: string; description: string };
export type CookieNotice = { enabled: boolean; message: string; linkText?: string };
export type FooterContent = { copyrightText: string; privacyLink?: boolean };

export async function getContent(): Promise<Record<string, unknown>> {
  try {
    const data = await readFile(CONTENT_PATH, 'utf-8');
    return JSON.parse(data) as Record<string, unknown>;
  } catch {
    return {};
  }
}
