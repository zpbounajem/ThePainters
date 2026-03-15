import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile } from 'fs/promises';
import path from 'path';

const ADMIN_PASSWORD =
  process.env.NODE_ENV === 'production'
    ? process.env.ADMIN_PASSWORD
    : (process.env.ADMIN_PASSWORD || 'admin1234');
const CONTENT_PATH = path.join(process.cwd(), 'src/data/content.json');

function checkAuth(request: NextRequest): boolean {
  if (!ADMIN_PASSWORD) return false;
  const header = request.headers.get('x-admin-auth');
  const cookie = request.cookies.get('admin_session')?.value;
  return header === ADMIN_PASSWORD || cookie === ADMIN_PASSWORD;
}

export async function DELETE(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }
    const contentData = await readFile(CONTENT_PATH, 'utf-8');
    const content = JSON.parse(contentData);
    content.galleryImages = (content.galleryImages || []).filter(
      (img: { id: string }) => img.id !== id
    );
    await writeFile(CONTENT_PATH, JSON.stringify(content, null, 2), 'utf-8');
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
