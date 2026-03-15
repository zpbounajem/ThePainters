import { NextRequest, NextResponse } from 'next/server';
import { getContent, getLocalized } from '@/lib/content';

export async function GET(request: NextRequest) {
  const content = (await getContent()) as Record<string, unknown>;
  const locale = request.cookies.get('NEXT_LOCALE')?.value?.trim() || request.nextUrl.searchParams.get('locale') || 'en';

  const rawFooter = content.footer as { copyrightText?: string; privacyLink?: boolean; copyrightTextByLocale?: Record<string, string> } | undefined;
  const footer = rawFooter
    ? {
        copyrightText: getLocalized(rawFooter.copyrightTextByLocale, locale, rawFooter.copyrightText || '© 2025 The Painters LB'),
        privacyLink: rawFooter.privacyLink !== false,
      }
    : { copyrightText: '© 2025 The Painters LB', privacyLink: true };

  const rawCookie = content.cookieNotice as {
    enabled?: boolean;
    message?: string;
    linkText?: string;
    messageByLocale?: Record<string, string>;
    linkTextByLocale?: Record<string, string>;
  } | undefined;
  const cookieNotice = rawCookie
    ? {
        enabled: Boolean(rawCookie.enabled),
        message: getLocalized(rawCookie.messageByLocale, locale, rawCookie.message || ''),
        linkText: getLocalized(rawCookie.linkTextByLocale, locale, rawCookie.linkText || 'Privacy'),
      }
    : { enabled: false, message: '', linkText: 'Privacy' };

  return NextResponse.json({ footer, cookieNotice });
}
