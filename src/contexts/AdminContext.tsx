'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import type {
  Content,
  ContactMessage,
  GalleryImage,
  BeforeAfterItem,
  HomeCardItem,
  AboutGridItem,
  GalleryCategory,
  TestimonialItem,
  FAQItem,
} from '@/types/admin';
import { DEFAULT_HOME_CARDS } from '@/types/admin';

const MESSAGES_PAGE_SIZE = 15;

type AdminContextValue = {
  password: string;
  setPassword: (s: string) => void;
  auth: string | null;
  error: string;
  setError: (s: string) => void;
  content: Content | null;
  setContent: React.Dispatch<React.SetStateAction<Content | null>>;
  saving: boolean;
  messages: ContactMessage[];
  messageFilter: 'all' | 'unread' | 'read';
  setMessageFilter: (f: 'all' | 'unread' | 'read') => void;
  messageSearch: string;
  setMessageSearch: (s: string) => void;
  messagePage: number;
  setMessagePage: (n: number | ((p: number) => number)) => void;
  filteredMessages: ContactMessage[];
  totalMessagePages: number;
  safeMessagePage: number;
  paginatedMessages: ContactMessage[];
  uploading: boolean;
  beforeAfterUploading: boolean;
  handleLogin: (e: React.FormEvent) => Promise<void>;
  handleLogout: () => void;
  handleSaveContent: (e: React.FormEvent) => Promise<void>;
  saveContent: () => Promise<void>;
  handleUpload: (e: React.FormEvent) => Promise<void>;
  handleDeleteImage: (id: string) => Promise<void>;
  handleMarkMessageRead: (id: string) => Promise<void>;
  handleAddBeforeAfter: (e: React.FormEvent) => Promise<void>;
  removeBeforeAfter: (id: string) => void;
  bioValue: string;
  setBioValue: (value: string) => void;
  aboutGrids: AboutGridItem[];
  addAboutGrid: () => void;
  removeAboutGrid: (id: string) => void;
  updateAboutGrid: (id: string, text: string) => void;
  homeCards: HomeCardItem[];
  updateHomeCard: (id: string, field: keyof HomeCardItem, value: string) => void;
  updateHomeCardByLocale: (id: string, field: 'title' | 'description', locale: string, value: string) => void;
  galleryCategories: GalleryCategory[];
  addGalleryCategory: () => void;
  removeGalleryCategory: (id: string) => void;
  updateGalleryCategory: (id: string, name: string) => void;
  updateGalleryCategoryNameByLocale: (id: string, locale: string, value: string) => void;
  setImageCategory: (imageId: string, categoryId: string | undefined) => void;
  uploadFile: File | null;
  setUploadFile: (f: File | null) => void;
  uploadCategory: string;
  setUploadCategory: (s: string) => void;
  beforeAfterBefore: File | null;
  setBeforeAfterBefore: (f: File | null) => void;
  beforeAfterAfter: File | null;
  setBeforeAfterAfter: (f: File | null) => void;
  beforeAfterCaption: string;
  setBeforeAfterCaption: (s: string) => void;
};

const AdminContext = createContext<AdminContextValue | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [password, setPassword] = useState('');
  const [auth, setAuth] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [content, setContent] = useState<Content | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadCategory, setUploadCategory] = useState('');
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [messageFilter, setMessageFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [messageSearch, setMessageSearch] = useState('');
  const [messagePage, setMessagePage] = useState(1);
  const [beforeAfterBefore, setBeforeAfterBefore] = useState<File | null>(null);
  const [beforeAfterAfter, setBeforeAfterAfter] = useState<File | null>(null);
  const [beforeAfterCaption, setBeforeAfterCaption] = useState('');
  const [beforeAfterUploading, setBeforeAfterUploading] = useState(false);

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? sessionStorage.getItem('adminAuth') : null;
    if (stored) setAuth(stored);
  }, []);

  useEffect(() => {
    if (auth) {
      fetch('/api/content', { method: 'GET' })
        .then((r) => r.json())
        .then((data) => {
          const homeCards =
            data.homeCards && data.homeCards.length >= 3 ? data.homeCards : DEFAULT_HOME_CARDS;
          setContent({
            ...data,
            homeCards,
            galleryCategories: data.galleryCategories ?? [],
            galleryImages: (data.galleryImages ?? []).map((img: GalleryImage) => ({
              id: img.id,
              src: img.src,
              categoryId: img.categoryId,
            })),
            contact: {
              ...(data.contact ?? {}),
              notifyEmail: data.contact?.notifyEmail ?? '',
              whatsapp: data.contact?.whatsapp ?? '',
              confirmationMessage:
                data.contact?.confirmationMessage ??
                "Message sent! We'll get back to you on this number.",
            },
            testimonials: Array.isArray(data.testimonials) ? data.testimonials : [],
            faq: Array.isArray(data.faq) ? data.faq : [],
            beforeAfter: Array.isArray(data.beforeAfter) ? data.beforeAfter : [],
            footer: data.footer ?? { copyrightText: '© 2025 The Painters LB', privacyLink: true },
            privacyContent: data.privacyContent ?? '',
            privacyContentAr: data.privacyContentAr ?? '',
            cookieNotice: data.cookieNotice ?? { enabled: true, message: '', linkText: 'Privacy' },
            seo: data.seo ?? {},
            serviceAreas: data.serviceAreas ?? '',
            serviceAreasAr: data.serviceAreasAr ?? '',
            bioAr: data.bioAr ?? '',
            languages: Array.isArray(data.languages) ? data.languages : [],
            localeContent: data.localeContent && typeof data.localeContent === 'object' ? data.localeContent : {},
          });
        })
        .catch(() => setError('Failed to load content'));
      fetch('/api/messages', { headers: { 'x-admin-auth': auth } })
        .then((r) => r.json())
        .then((data) => setMessages(Array.isArray(data) ? data : []))
        .catch(() => setMessages([]));
    }
  }, [auth]);

  const handleLogin = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.ok) {
        setAuth(password);
        if (typeof window !== 'undefined') sessionStorage.setItem('adminAuth', password);
      } else {
        setError('Wrong password');
      }
    },
    [password]
  );

  const handleLogout = useCallback(() => {
    setAuth(null);
    sessionStorage.removeItem('adminAuth');
  }, []);

  const saveContent = useCallback(async () => {
    if (!content || !auth) return;
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-admin-auth': auth },
        body: JSON.stringify(content),
      });
      if (!res.ok) throw new Error('Save failed');
    } catch {
      setError('Failed to save');
    } finally {
      setSaving(false);
    }
  }, [content, auth]);

  const handleSaveContent = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      return saveContent();
    },
    [saveContent]
  );

  const handleUpload = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!uploadFile || !auth) return;
      setUploading(true);
      setError('');
      try {
        const form = new FormData();
        form.append('file', uploadFile);
        if (uploadCategory) form.append('categoryId', uploadCategory);
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'x-admin-auth': auth },
          body: form,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Upload failed');
        setContent((prev) =>
          prev
            ? {
                ...prev,
                galleryImages: [
                  ...(prev.galleryImages || []),
                  { id: data.id, src: data.src, categoryId: data.categoryId },
                ],
              }
            : prev
        );
        setUploadFile(null);
        setUploadCategory('');
      } catch {
        setError('Upload failed');
      } finally {
        setUploading(false);
      }
    },
    [uploadFile, uploadCategory, auth]
  );

  const handleDeleteImage = useCallback(
    async (id: string) => {
      if (!auth) return;
      try {
        const res = await fetch(`/api/gallery?id=${id}`, {
          method: 'DELETE',
          headers: { 'x-admin-auth': auth },
        });
        if (!res.ok) throw new Error('Delete failed');
        setContent((prev) =>
          prev ? { ...prev, galleryImages: prev.galleryImages.filter((img) => img.id !== id) } : prev
        );
      } catch {
        setError('Delete failed');
      }
    },
    [auth]
  );

  const filteredMessages = useMemo(() => {
    return messages.filter((msg) => {
      const matchFilter =
        messageFilter === 'all' ||
        (messageFilter === 'unread' && !msg.read) ||
        (messageFilter === 'read' && msg.read);
      if (!matchFilter) return false;
      if (!messageSearch.trim()) return true;
      const q = messageSearch.trim().toLowerCase();
      return (
        msg.name.toLowerCase().includes(q) ||
        msg.phone.replace(/\s/g, '').includes(q.replace(/\s/g, '')) ||
        msg.message.toLowerCase().includes(q)
      );
    });
  }, [messages, messageFilter, messageSearch]);

  const messagesNewestFirst = useMemo(() => [...filteredMessages].reverse(), [filteredMessages]);
  const totalMessagePages = Math.max(
    1,
    Math.ceil(messagesNewestFirst.length / MESSAGES_PAGE_SIZE)
  );
  const safeMessagePage = Math.min(messagePage, totalMessagePages) || 1;
  const paginatedMessages = useMemo(
    () =>
      messagesNewestFirst.slice(
        (safeMessagePage - 1) * MESSAGES_PAGE_SIZE,
        safeMessagePage * MESSAGES_PAGE_SIZE
      ),
    [messagesNewestFirst, safeMessagePage]
  );

  useEffect(() => {
    if (messagePage > totalMessagePages && totalMessagePages >= 1) {
      setMessagePage(totalMessagePages);
    }
  }, [messagePage, totalMessagePages]);

  const handleMarkMessageRead = useCallback(
    async (id: string) => {
      if (!auth) return;
      try {
        const res = await fetch(`/api/messages?id=${id}`, {
          method: 'PATCH',
          headers: { 'x-admin-auth': auth },
        });
        if (!res.ok) throw new Error('Update failed');
        setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read: true } : m)));
      } catch {
        setError('Failed to mark as read');
      }
    },
    [auth]
  );

  const handleAddBeforeAfter = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!beforeAfterBefore || !beforeAfterAfter || !auth) return;
      setBeforeAfterUploading(true);
      setError('');
      try {
        const form1 = new FormData();
        form1.append('file', beforeAfterBefore);
        form1.append('type', 'beforeAfter');
        const r1 = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'x-admin-auth': auth },
          body: form1,
        });
        const d1 = await r1.json();
        if (!r1.ok) throw new Error(d1.error || 'Upload failed');
        const form2 = new FormData();
        form2.append('file', beforeAfterAfter);
        form2.append('type', 'beforeAfter');
        const r2 = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'x-admin-auth': auth },
          body: form2,
        });
        const d2 = await r2.json();
        if (!r2.ok) throw new Error(d2.error || 'Upload failed');
        const pair: BeforeAfterItem = {
          id: `ba-${Date.now()}`,
          beforeSrc: d1.src,
          afterSrc: d2.src,
          caption: beforeAfterCaption.trim() || undefined,
        };
        setContent((prev) =>
          prev ? { ...prev, beforeAfter: [...(prev.beforeAfter ?? []), pair] } : prev
        );
        setBeforeAfterBefore(null);
        setBeforeAfterAfter(null);
        setBeforeAfterCaption('');
      } catch {
        setError('Before/After upload failed');
      } finally {
        setBeforeAfterUploading(false);
      }
    },
    [beforeAfterBefore, beforeAfterAfter, beforeAfterCaption, auth]
  );

  const removeBeforeAfter = useCallback((id: string) => {
    setContent((prev) =>
      prev ? { ...prev, beforeAfter: (prev.beforeAfter ?? []).filter((p) => p.id !== id) } : prev
    );
  }, []);

  const bioValue = typeof content?.bio === 'string' ? content.bio : content?.bio?.en ?? '';
  const setBioValue = useCallback(
    (value: string) => setContent((prev) => (prev ? { ...prev, bio: value } : prev)),
    []
  );

  const aboutGrids = content?.aboutGrids ?? [];
  const addAboutGrid = useCallback(() => {
    setContent((prev) =>
      prev
        ? {
            ...prev,
            aboutGrids: [...(prev.aboutGrids ?? []), { id: `grid-${Date.now()}`, text: '' }],
          }
        : prev
    );
  }, []);
  const removeAboutGrid = useCallback((id: string) => {
    setContent((prev) =>
      prev ? { ...prev, aboutGrids: (prev.aboutGrids ?? []).filter((g) => g.id !== id) } : prev
    );
  }, []);
  const updateAboutGrid = useCallback((id: string, text: string) => {
    setContent((prev) =>
      prev
        ? {
            ...prev,
            aboutGrids: (prev.aboutGrids ?? []).map((g) => (g.id === id ? { ...g, text } : g)),
          }
        : prev
    );
  }, []);

  const homeCards = useMemo(
    () =>
      (content?.homeCards && content.homeCards.length >= 3 ? content.homeCards : DEFAULT_HOME_CARDS).slice(
        0,
        3
      ),
    [content?.homeCards]
  );
  const updateHomeCard = useCallback(
    (id: string, field: keyof HomeCardItem, value: string) => {
      setContent((prev) => {
        if (!prev) return prev;
        const current = (
          prev.homeCards && prev.homeCards.length >= 3 ? prev.homeCards : DEFAULT_HOME_CARDS
        ).slice(0, 3);
        const updated = current.map((c) => (c.id === id ? { ...c, [field]: value } : c));
        return { ...prev, homeCards: updated };
      });
    },
    []
  );
  const updateHomeCardByLocale = useCallback(
    (id: string, field: 'title' | 'description', locale: string, value: string) => {
      setContent((prev) => {
        if (!prev) return prev;
        const current = (
          prev.homeCards && prev.homeCards.length >= 3 ? prev.homeCards : DEFAULT_HOME_CARDS
        ).slice(0, 3);
        const byLocaleKey = field === 'title' ? 'titleByLocale' : 'descriptionByLocale';
        const updated = current.map((c) => {
          if (c.id !== id) return c;
          const nextByLocale = { ...((c as Record<string, unknown>)[byLocaleKey] as Record<string, string> || {}) };
          nextByLocale[locale] = value;
          const next = { ...c, [byLocaleKey]: nextByLocale };
          if (locale === 'en') next[field] = value;
          return next;
        });
        return { ...prev, homeCards: updated };
      });
    },
    []
  );

  const galleryCategories = content?.galleryCategories ?? [];
  const addGalleryCategory = useCallback(() => {
    setContent((prev) =>
      prev
        ? {
            ...prev,
            galleryCategories: [
              ...(prev.galleryCategories ?? []),
              { id: `cat-${Date.now()}`, name: '' },
            ],
          }
        : prev
    );
  }, []);
  const removeGalleryCategory = useCallback((id: string) => {
    setContent((prev) => {
      if (!prev) return prev;
      const newCats = (prev.galleryCategories ?? []).filter((c) => c.id !== id);
      const newImages = (prev.galleryImages ?? []).map((img) =>
        img.categoryId === id ? { ...img, categoryId: undefined } : img
      );
      return { ...prev, galleryCategories: newCats, galleryImages: newImages };
    });
  }, []);
  const updateGalleryCategory = useCallback((id: string, name: string) => {
    setContent((prev) =>
      prev
        ? {
            ...prev,
            galleryCategories: (prev.galleryCategories ?? []).map((c) =>
              c.id === id ? { ...c, name, nameByLocale: { ...(c as { nameByLocale?: Record<string, string> }).nameByLocale, en: name } } : c
            ),
          }
        : prev
    );
  }, []);
  const updateGalleryCategoryNameByLocale = useCallback((id: string, locale: string, value: string) => {
    setContent((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        galleryCategories: (prev.galleryCategories ?? []).map((c) => {
          if (c.id !== id) return c;
          const next = { ...(c as { nameByLocale?: Record<string, string> }).nameByLocale };
          next[locale] = value;
          if (locale === 'en') {
            return { ...c, name: value, nameByLocale: next };
          }
          return { ...c, nameByLocale: next };
        }),
      };
    });
  }, []);
  const setImageCategory = useCallback((imageId: string, categoryId: string | undefined) => {
    setContent((prev) =>
      prev
        ? {
            ...prev,
            galleryImages: (prev.galleryImages ?? []).map((img) =>
              img.id === imageId ? { ...img, categoryId } : img
            ),
          }
        : prev
    );
  }, []);

  const value: AdminContextValue = {
    password,
    setPassword,
    auth,
    error,
    setError,
    content,
    setContent,
    saving,
    messages,
    messageFilter,
    setMessageFilter,
    messageSearch,
    setMessageSearch,
    messagePage,
    setMessagePage,
    filteredMessages,
    totalMessagePages,
    safeMessagePage: safeMessagePage,
    paginatedMessages,
    uploading,
    beforeAfterUploading,
    handleLogin,
    handleLogout,
  handleSaveContent,
  saveContent,
  handleUpload,
    handleDeleteImage,
    handleMarkMessageRead,
    handleAddBeforeAfter,
    removeBeforeAfter,
    bioValue,
    setBioValue,
    aboutGrids,
    addAboutGrid,
    removeAboutGrid,
    updateAboutGrid,
    homeCards,
    updateHomeCard,
    updateHomeCardByLocale,
    galleryCategories,
    addGalleryCategory,
    removeGalleryCategory,
    updateGalleryCategory,
    updateGalleryCategoryNameByLocale,
    setImageCategory,
    uploadFile,
    setUploadFile,
    uploadCategory,
    setUploadCategory,
    beforeAfterBefore,
    setBeforeAfterBefore,
    beforeAfterAfter,
    setBeforeAfterAfter,
    beforeAfterCaption,
    setBeforeAfterCaption,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
}
