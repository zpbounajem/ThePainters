import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

const MESSAGES_PATH = path.join(process.cwd(), 'src/data/messages.json');
const CONTENT_PATH = path.join(process.cwd(), 'src/data/content.json');

function sanitize(s: string): string {
  return String(s ?? '').trim().slice(0, 2000);
}

async function sendNotificationEmail(to: string, name: string, phone: string, message: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;
  const from = process.env.RESEND_FROM || 'The Painters <onboarding@resend.dev>';
  const subject = 'New contact form message – The Painters LB';
  const html = `
    <p><strong>Name:</strong> ${name || '—'}</p>
    <p><strong>Phone:</strong> ${phone}</p>
    <p><strong>Message:</strong></p>
    <p>${(message || '—').replace(/\n/g, '<br>')}</p>
  `;
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ from, to: [to], subject, html }),
    });
  } catch {
    // non-blocking; message is already saved
  }
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const { ok } = checkRateLimit(ip, 'contact');
  if (!ok) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }
  try {
    const body = await request.json();
    const name = sanitize(body.name);
    const phone = sanitize(body.phone);
    const message = sanitize(body.message);

    if (!phone) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    let messages: { id: string; name: string; phone: string; message: string; createdAt: string; read?: boolean }[] = [];
    try {
      const data = await readFile(MESSAGES_PATH, 'utf-8');
      messages = JSON.parse(data);
    } catch {
      // file missing or invalid, start fresh
    }

    const id = `msg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    messages.push({
      id,
      name: name || '—',
      phone,
      message: message || '—',
      createdAt: new Date().toISOString(),
      read: false,
    });

    await writeFile(MESSAGES_PATH, JSON.stringify(messages, null, 2), 'utf-8');

    let notifyEmail = '';
    try {
      const contentData = await readFile(CONTENT_PATH, 'utf-8');
      const content = JSON.parse(contentData);
      notifyEmail = (content.contact?.notifyEmail || '').trim();
    } catch {
      // ignore
    }
    if (notifyEmail) {
      await sendNotificationEmail(notifyEmail, name, phone, message);
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
