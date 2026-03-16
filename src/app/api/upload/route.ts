import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile, mkdir } from 'fs/promises';
import path from 'path';

// Keep admin password logic in sync with /api/auth
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'zyvania';
const UPLOAD_DIR = path.join(process.cwd(), 'public/uploads');
const CONTENT_PATH = path.join(process.cwd(), 'src/data/content.json');

function checkAuth(request: NextRequest): boolean {
  if (!ADMIN_PASSWORD) return false;
  const header = request.headers.get('x-admin-auth');
  const cookie = request.cookies.get('admin_session')?.value;
  return header === ADMIN_PASSWORD || cookie === ADMIN_PASSWORD;
}

export async function POST(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    if (!file || !file.size) {
      return NextResponse.json({ error: 'No file' }, { status: 400 });
    }
    await mkdir(UPLOAD_DIR, { recursive: true });
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const ext = path.extname(file.name) || '.jpg';
    const filename = `${id}${ext}`;
    const filePath = path.join(UPLOAD_DIR, filename);
    const bytes = await file.arrayBuffer();
    await writeFile(filePath, Buffer.from(bytes));
    const src = `/uploads/${filename}`;
    const type = (formData.get('type') as string) || 'gallery';

    if (type === 'beforeAfter') {
      return NextResponse.json({ ok: true, src, id });
    }

    const categoryId = (formData.get('categoryId') as string) || undefined;
    const contentData = await readFile(CONTENT_PATH, 'utf-8');
    const content = JSON.parse(contentData);
    content.galleryImages = content.galleryImages || [];
    content.galleryImages.push({ id, src, ...(categoryId && { categoryId }) });
    await writeFile(CONTENT_PATH, JSON.stringify(content, null, 2), 'utf-8');

    return NextResponse.json({ ok: true, src, id, categoryId });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
