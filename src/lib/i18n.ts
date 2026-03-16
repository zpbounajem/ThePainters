export const LOCALE_COOKIE = 'NEXT_LOCALE';

export type Locale = string;

/** Default locale when no cookie is set. Only localeContent (nav, pages, footer) is locale-specific. */
export const DEFAULT_LOCALE: Locale = 'ar';

/** Get locale from cookie string (client-side). */
export function getLocaleFromCookieString(cookieString: string): Locale {
  if (typeof cookieString !== 'string') return DEFAULT_LOCALE;
  const match = cookieString.match(new RegExp(`${LOCALE_COOKIE}=([^;]+)`));
  const value = match?.[1]?.trim();
  return value || DEFAULT_LOCALE;
}

/** Set locale cookie (client-side). */
export function setLocaleCookie(locale: Locale): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; SameSite=Lax`;
}

const RTL_CODES = ['ar'];

export function isRtl(locale: Locale): boolean {
  return RTL_CODES.includes(locale);
}

/** Default keys for a new language in localeContent (nav, pages, footer). */
export const DEFAULT_LOCALE_KEYS = {
  nav: { home: '', gallery: '', beforeAfter: '', about: '', contact: '', admin: '' },
  pages: {
    homeTitle: '',
    homeSubtitle: '',
    homeWelcome: '',
    viewOurWork: '',
    homeBannerTitle: '',
    homeBannerSubtitle: '',
    homeBannerCta: '',
    homeKicker: '',
    homeHeroSecondary: '',
    homePrimaryCta: '',
    homeStatProjectsLabel: '',
    homeStatProjectsValue: '',
    homeStatExperienceLabel: '',
    homeStatExperienceValue: '',
    homeStatCoverageLabel: '',
    homeStatCoverageValue: '',
    heroCardLabel: '',
    heroCardTitle: '',
    heroCardBadge: '',
    heroCardScopeLabel: '',
    heroCardScope: '',
    heroCardLocationLabel: '',
    heroCardLocation: '',
    heroCardFinishLabel: '',
    heroCardFinish: '',
    heroCardCareLabel: '',
    heroCardCare: '',
    servicesKicker: '',
    servicesTitle: '',
    servicesSubtitle: '',
    serviceApartmentsTitle: '',
    serviceApartmentsDescription: '',
    serviceHousesTitle: '',
    serviceHousesDescription: '',
    serviceOfficesTitle: '',
    serviceOfficesDescription: '',
    serviceTouchupsTitle: '',
    serviceTouchupsDescription: '',
    featuredKicker: '',
    featuredTitle: '',
    featuredSubtitle: '',
    featuredBeforeLabel: '',
    featuredBeforeText: '',
    featuredAfterLabel: '',
    featuredAfterText: '',
    featuredDetailsTitle: '',
    featuredDetailsText: '',
    featuredDurationLabel: '',
    featuredDurationValue: '',
    featuredRoomsLabel: '',
    featuredRoomsValue: '',
    featuredCityLabel: '',
    featuredCityValue: '',
    featuredFinishLabel: '',
    featuredFinishValue: '',
    featuredCta: '',
    whyUsKicker: '',
    whyUsTitle: '',
    whyUsSubtitle: '',
    whyOnTimeTitle: '',
    whyOnTimeDescription: '',
    whyCleanTitle: '',
    whyCleanDescription: '',
    whyQualityTitle: '',
    whyQualityDescription: '',
    whyPricingTitle: '',
    whyPricingDescription: '',
    processKicker: '',
    processTitle: '',
    processSubtitle: '',
    processStep1Title: '',
    processStep1Description: '',
    processStep2Title: '',
    processStep2Description: '',
    processStep3Title: '',
    processStep3Description: '',
    processStep4Title: '',
    processStep4Description: '',
    testimonialsKicker: '',
    testimonialsSubtitle: '',
    contactStripTitle: '',
    contactStripSubtitle: '',
    contactStripPrimaryCta: '',
    contactStripSecondaryCta: '',
    aboutTitle: '',
    aboutSubtitle: '',
    ourServices: '',
    areasWeServe: '',
    faq: '',
    contactTitle: '',
    contactSubtitle: '',
    sendMessage: '',
    leavePhone: '',
    chatWhatsApp: '',
    privacyTitle: '',
    beforeAfterTitle: '',
    beforeAfterSubtitle: '',
    noBeforeAfter: '',
    whatClientsSay: '',
    galleryTitle: '',
    contactNameLabel: '',
    contactNamePlaceholder: '',
    contactPhoneLabel: '',
    contactPhonePlaceholder: '',
    contactPhoneHint: '',
    contactMessageLabel: '',
    contactMessagePlaceholder: '',
    contactSendButton: '',
    contactSending: '',
    contactErrorPhone: '',
    contactErrorGeneric: '',
    contactErrorSend: '',
  },
  footer: { privacy: '' },
} as const;
