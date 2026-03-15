import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';

const ADMIN_PASSWORD =
  process.env.NODE_ENV === 'production'
    ? process.env.ADMIN_PASSWORD
    : (process.env.ADMIN_PASSWORD || 'admin1234');
const MESSAGES_PATH = path.join(process.cwd(), 'src/data/messages.json');

function checkAuth(request: NextRequest): boolean {
  if (!ADMIN_PASSWORD) return false;
  const header = request.headers.get('x-admin-auth');
  const cookie = request.cookies.get('admin_session')?.value;
  return header === ADMIN_PASSWORD || cookie === ADMIN_PASSWORD;
}

export async function GET(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const data = await readFile(MESSAGES_PATH, 'utf-8');
    const messages = JSON.parse(data);
    return NextResponse.json(messages);
  } catch {
    return NextResponse.json([]);
  }
}

export async function PATCH(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Message id required' }, { status: 400 });
    }
    const data = await readFile(MESSAGES_PATH, 'utf-8');
    const messages = JSON.parse(data);
    const index = messages.findIndex((m: { id: string }) => m.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }
    messages[index] = { ...messages[index], read: true };
    await writeFile(MESSAGES_PATH, JSON.stringify(messages, null, 2), 'utf-8');
    return NextResponse.json({ ok: true, read: true });
  } catch {
    return NextResponse.json({ error: 'Failed to update message' }, { status: 500 });
  }
}
