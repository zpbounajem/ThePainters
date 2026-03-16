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

export type AdminLabels = {
  admin: string;
  logout: string;
  content: string;
  messages: string;
  gallery: string;
  beforeAfter: string;
  homePage: string;
  aboutPage: string;
  password: string;
  login: string;
  editContent: string;
  general: string;
  homeAbout: string;
  legalSeo: string;
  languages: string;
  saveContent: string;
  galleryCategories: string;
  manageGallery: string;
  bioAndContact: string;
  bioEnglish: string;
  bioArabic: string;
  contactDetails: string;
  successMessagePerLanguage: string;
  addCategory: string;
  remove: string;
  loading: string;
  saving: string;
  messagesTitle: string;
  beforeAfterTitle: string;
};

export type LocaleContent = {
  nav: Record<string, string>;
  pages: Record<string, string>;
  footer: Record<string, string>;
  admin?: Partial<AdminLabels>;
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
  featuredBeforeAfterId?: string;
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
    whatClientsSay: '',
    contactStripTitle: '',
    contactStripSubtitle: '',
    contactStripPrimaryCta: '',
    contactStripSecondaryCta: '',
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

export const DEFAULT_ADMIN_LABELS: AdminLabels = {
  admin: 'Admin',
  logout: 'Logout',
  content: 'Content',
  messages: 'Messages',
  gallery: 'Gallery',
  beforeAfter: 'Before & After',
  homePage: 'Homepage',
  aboutPage: 'About page',
  password: 'Password',
  login: 'Login',
  editContent: 'Edit content',
  general: 'General',
  homeAbout: 'Home & About',
  legalSeo: 'Legal & SEO',
  languages: 'Languages',
  saveContent: 'Save content',
  galleryCategories: 'Gallery categories',
  manageGallery: 'Manage gallery',
  bioAndContact: 'Bio & Contact',
  bioEnglish: 'Bio (English)',
  bioArabic: 'Bio (Arabic)',
  contactDetails: 'Contact details',
  successMessagePerLanguage: 'Contact form – success message (per language)',
  addCategory: '+ Add category',
  remove: 'Remove',
  loading: 'Loading content…',
  saving: 'Saving…',
  messagesTitle: 'Messages from Contact',
  beforeAfterTitle: 'Before & After',
};

export const DEFAULT_HOME_CARDS: HomeCardItem[] = [
  { id: '1', icon: '🎨', title: 'Interior Painting', description: 'Walls & ceilings, quality finishes' },
  { id: '2', icon: '📍', title: 'Lebanon', description: 'Serving all regions' },
  { id: '3', icon: '📸', title: '@thepainters_lb', description: 'Follow us on Instagram' },
];
