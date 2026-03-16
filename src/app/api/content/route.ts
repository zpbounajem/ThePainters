import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile } from 'fs/promises';
import path from 'path';

// Keep admin password logic in sync with /api/auth
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'zyvania';
const CONTENT_PATH = path.join(process.cwd(), 'src/data/content.json');

function checkAuth(request: NextRequest): boolean {
  if (!ADMIN_PASSWORD) return false;
  const header = request.headers.get('x-admin-auth');
  const cookie = request.cookies.get('admin_session')?.value;
  return header === ADMIN_PASSWORD || cookie === ADMIN_PASSWORD;
}

export async function GET() {
  try {
    const data = await readFile(CONTENT_PATH, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch (e) {
    return NextResponse.json({ error: 'Failed to read content' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await request.json();
    await writeFile(CONTENT_PATH, JSON.stringify(body, null, 2), 'utf-8');
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to write content' }, { status: 500 });
  }
}
