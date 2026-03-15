export type AboutGridItem = { id: string; text: string; textByLocale?: Record<string, string> };

export type HomeCardItem = {
  id: string;
  icon: string;
  title: string;
  description: string;
  titleByLocale?: Record<string, string>;
  descriptionByLocale?: Record<string, string>;
};

export type ContactMessage = {
  id: string;
  name: string;
  phone: string;
  message: string;
  createdAt: string;
  read?: boolean;
};

export type GalleryCategory = { id: string; name: string; nameByLocale?: Record<string, string> };
export type GalleryImage = { id: string; src: string; categoryId?: string };

export type TestimonialItem = {
  id: string;
  name: string;
  quote: string;
  image?: string;
  nameByLocale?: Record<string, string>;
  quoteByLocale?: Record<string, string>;
};
export type FAQItem = {
  id: string;
  question: string;
  answer: string;
  questionByLocale?: Record<string, string>;
  answerByLocale?: Record<string, string>;
};
export type BeforeAfterItem = {
  id: string;
  beforeSrc: string;
  afterSrc: string;
  caption?: string;
  captionByLocale?: Record<string, string>;
};
export type SEOEntry = {
  title: string;
  description: string;
  titleByLocale?: Record<string, string>;
  descriptionByLocale?: Record<string, string>;
};

export type LocaleContent = {
  nav: Record<string, string>;
  pages: Record<string, string>;
  footer: Record<string, string>;
};

export type Content = {
  languages?: { code: string; name: string }[];
  localeContent?: Record<string, LocaleContent>;
  bio: string | { en: string; ar: string };
  bioAr?: string;
  contact: {
    instagram: string;
    phone: string;
    email: string;
    location: string;
    notifyEmail?: string;
    whatsapp?: string;
    confirmationMessage?: string;
    confirmationMessageByLocale?: Record<string, string>;
  };
  testimonials?: TestimonialItem[];
  faq?: FAQItem[];
  beforeAfter?: BeforeAfterItem[];
  footer?: {
    copyrightText: string;
    privacyLink?: boolean;
    copyrightTextByLocale?: Record<string, string>;
  };
  privacyContent?: string;
  privacyContentAr?: string;
  cookieNotice?: {
    enabled: boolean;
    message: string;
    linkText?: string;
    messageByLocale?: Record<string, string>;
    linkTextByLocale?: Record<string, string>;
  };
  seo?: {
    home?: SEOEntry;
    gallery?: SEOEntry;
    about?: SEOEntry;
    contact?: SEOEntry;
    privacy?: SEOEntry;
    beforeAfter?: SEOEntry;
  };
  serviceAreas?: string;
  serviceAreasAr?: string;
  galleryCategories?: GalleryCategory[];
  galleryImages: GalleryImage[];
  aboutGrids?: AboutGridItem[];
  homeCards?: HomeCardItem[];
};

export const DEFAULT_LOCALE_KEYS: LocaleContent = {
  nav: { home: '', gallery: '', beforeAfter: '', about: '', contact: '', admin: '' },
  pages: {
    homeTitle: '',
    homeSubtitle: '',
    homeWelcome: '',
    viewOurWork: '',
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
    galleryOurWork: '',
    gallerySubtitle: '',
    galleryCategoriesLabel: '',
    galleryUncategorized: '',
    galleryAlbums: '',
    galleryPhoto: '',
    galleryPhotos: '',
    galleryNoPhotos: '',
    galleryBackToAlbums: '',
  },
  footer: { privacy: '' },
};

export const DEFAULT_HOME_CARDS: HomeCardItem[] = [
  { id: '1', icon: '🎨', title: 'Interior Painting', description: 'Walls & ceilings, quality finishes' },
  { id: '2', icon: '📍', title: 'Lebanon', description: 'Serving all regions' },
  { id: '3', icon: '📸', title: '@thepainters_lb', description: 'Follow us on Instagram' },
];
