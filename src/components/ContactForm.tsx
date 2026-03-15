'use client';

import { useState } from 'react';

export type ContactFormLabels = {
  nameLabel?: string;
  namePlaceholder?: string;
  phoneLabel?: string;
  phonePlaceholder?: string;
  phoneHint?: string;
  messageLabel?: string;
  messagePlaceholder?: string;
  sendButton?: string;
  sending?: string;
  errorPhone?: string;
  errorGeneric?: string;
  errorSend?: string;
};

type ContactFormProps = {
  confirmationMessage?: string;
  labels?: ContactFormLabels;
};

export default function ContactForm({ confirmationMessage, labels = {} }: ContactFormProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorText, setErrorText] = useState('');

  const nameLabel = labels.nameLabel ?? 'Name (optional)';
  const namePlaceholder = labels.namePlaceholder ?? 'Your name';
  const phoneLabel = labels.phoneLabel ?? 'Phone number';
  const phonePlaceholder = labels.phonePlaceholder ?? '+961 ...';
  const phoneHint = labels.phoneHint ?? 'So we can reach you back';
  const messageLabel = labels.messageLabel ?? 'Message (optional)';
  const messagePlaceholder = labels.messagePlaceholder ?? 'Tell us about your project or ask for a quote...';
  const sendButton = labels.sendButton ?? 'Send message';
  const sending = labels.sending ?? 'Sending…';
  const errorPhone = labels.errorPhone ?? 'Please enter your phone number so we can get back to you.';
  const errorGeneric = labels.errorGeneric ?? 'Something went wrong. Please try again.';
  const errorSend = labels.errorSend ?? 'Failed to send. Please try again.';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText('');
    const trimmedPhone = phone.trim();
    if (!trimmedPhone) {
      setErrorText(errorPhone);
      return;
    }
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: trimmedPhone,
          message: message.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorText(data.error || errorGeneric);
        setStatus('error');
        return;
      }
      setStatus('success');
      setName('');
      setPhone('');
      setMessage('');
    } catch {
      setErrorText(errorSend);
      setStatus('error');
    }
  };

  const inputClass =
    'w-full rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-3 py-2.5 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 focus:border-brand-yellow focus:outline-none focus:ring-1 focus:ring-brand-yellow';
  const labelClass = 'mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="contact-name" className={labelClass}>
          {nameLabel}
        </label>
        <input
          id="contact-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
          placeholder={namePlaceholder}
          disabled={status === 'sending'}
        />
      </div>
      <div>
        <label htmlFor="contact-phone" className={labelClass}>
          {phoneLabel} <span className="text-red-500">*</span>
        </label>
        <input
          id="contact-phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className={inputClass}
          placeholder={phonePlaceholder}
          required
          disabled={status === 'sending'}
        />
        <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
          {phoneHint}
        </p>
      </div>
      <div>
        <label htmlFor="contact-message" className={labelClass}>
          {messageLabel}
        </label>
        <textarea
          id="contact-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          className={`${inputClass} min-h-[100px] resize-y`}
          placeholder={messagePlaceholder}
          disabled={status === 'sending'}
        />
      </div>
      {errorText && (
        <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400">
          {errorText}
        </p>
      )}
      {status === 'success' && (
        <p className="rounded-lg bg-green-500/10 px-3 py-2 text-sm text-green-700 dark:text-green-400">
          {confirmationMessage || "Message sent! We'll get back to you on this number."}
        </p>
      )}
      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full rounded-lg bg-brand-yellow py-2.5 font-semibold text-neutral-900 transition-colors hover:bg-brand-yellow-dark focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:ring-offset-2 focus:ring-offset-neutral-50 dark:focus:ring-offset-neutral-900 disabled:opacity-50 disabled:pointer-events-none"
      >
        {status === 'sending' ? sending : sendButton}
      </button>
    </form>
  );
}
