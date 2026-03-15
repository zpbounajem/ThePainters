import { cookies } from 'next/headers';
import ContactForm from '@/components/ContactForm';
import { getContent, getLocalized } from '@/lib/content';
import { DEFAULT_LOCALE } from '@/lib/i18n';

function getPages(content: Record<string, unknown>, locale: string): Record<string, string> {
  const localeContent = (content.localeContent as Record<string, { pages?: Record<string, string> }>) || {};
  return localeContent[locale]?.pages || localeContent.en?.pages || {};
}

export async function generateMetadata() {
  const content = (await getContent()) as Record<string, unknown>;
  const seo = (content.seo as Record<string, { title?: string; description?: string }>)?.contact ?? {};
  return {
    title: seo.title ?? 'Contact | The Painters LB',
    description: seo.description ?? 'Get in touch for a quote. The Painters LB – interior painting in Lebanon.',
  };
}

export default async function ContactPage() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get('NEXT_LOCALE')?.value || DEFAULT_LOCALE).trim() || DEFAULT_LOCALE;
  const content = (await getContent()) as Record<string, unknown>;
  const pages = getPages(content, locale);
  const c = (content.contact || {}) as Record<string, unknown> & { confirmationMessageByLocale?: Record<string, string> };
  const whatsapp = (c.whatsapp as string || '').trim().replace(/\D/g, '');
  const confirmationMessage = getLocalized(
    c.confirmationMessageByLocale,
    locale,
    ((c.confirmationMessage as string) || '').trim() || "Message sent! We'll get back to you on this number."
  );

  return (
    <section className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-brand-yellow">{pages.contactTitle || 'Contact'}</h1>
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">
          {pages.contactSubtitle || 'Get in touch for a quote'}
        </p>
      </div>
      <div className="mx-auto max-w-md space-y-8">
        {whatsapp && (
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 p-6">
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-lg bg-green-600 py-3 font-semibold text-white transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-neutral-900"
            >
              <span aria-hidden>💬</span>
              {pages.chatWhatsApp || 'Chat on WhatsApp'}
            </a>
          </div>
        )}
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 p-8">
          <h2 className="mb-4 text-lg font-semibold text-neutral-800 dark:text-neutral-200">
            {pages.sendMessage || 'Send us a message'}
          </h2>
          <p className="mb-6 text-sm text-neutral-600 dark:text-neutral-400">
            {pages.leavePhone || "Leave your phone number and we'll get back to you."}
          </p>
          <ContactForm
          confirmationMessage={confirmationMessage}
          labels={{
            nameLabel: pages.contactNameLabel,
            namePlaceholder: pages.contactNamePlaceholder,
            phoneLabel: pages.contactPhoneLabel,
            phonePlaceholder: pages.contactPhonePlaceholder,
            phoneHint: pages.contactPhoneHint,
            messageLabel: pages.contactMessageLabel,
            messagePlaceholder: pages.contactMessagePlaceholder,
            sendButton: pages.contactSendButton,
            sending: pages.contactSending,
            errorPhone: pages.contactErrorPhone,
            errorGeneric: pages.contactErrorGeneric,
            errorSend: pages.contactErrorSend,
          }}
        />
        </div>
        {(c.email as string) && (
          <div className="space-y-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 p-8">
            <div className="flex items-center justify-between rounded-lg border border-neutral-200 dark:border-neutral-700 p-4">
              <span className="font-medium">Email</span>
              <a href={`mailto:${c.email as string}`} className="text-brand-yellow break-all">
                {c.email as string}
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
