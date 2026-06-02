import { NextRequest, NextResponse } from 'next/server';
import { getSession, requireAdmin } from '@/lib/auth';
import { FALLBACK_SECTIONS } from '@/lib/fallback-data';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const courseId = Number(id);

  try {
    const { default: db } = await import('@/lib/db');
    const sections = await db.prepare(
      'SELECT * FROM course_sections WHERE course_id = ? ORDER BY sort_order ASC'
    ).all(id);

    for (const section of sections as any[]) {
      section.materials = await db.prepare(
        'SELECT id, title, type, file_size, duration, sort_order FROM course_materials WHERE section_id = ? ORDER BY sort_order ASC'
      ).all(section.id);
    }

    if (sections.length > 0) {
      return NextResponse.json({ sections });
    }
  } catch {}

  // Fallback
  const sections = FALLBACK_SECTIONS[courseId] || [];
  return NextResponse.json({ sections });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: '无权限' }, { status: 403 });
  }

  const { id } = await params;
  const { title, sort_order } = await req.json();

  if (!title) {
    return NextResponse.json({ error: '章节标题为必填项' }, { status: 400 });
  }

  const { default: db } = await import('@/lib/db');
  const result = await db.prepare(
    'INSERT INTO course_sections (course_id, title, sort_order) VALUES (?, ?, ?)'
  ).run(id, title, sort_order || 0);

  return NextResponse.json({ id: result.lastInsertRowid });
}
