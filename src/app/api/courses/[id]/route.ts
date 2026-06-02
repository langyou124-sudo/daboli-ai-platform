import { NextRequest, NextResponse } from 'next/server';
import { getFallbackCourseDetail, FALLBACK_COURSES, FALLBACK_SECTIONS } from '@/lib/fallback-data';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const courseId = Number(id);

  try {
    const { default: db } = await import('@/lib/db');
    const course = await db.prepare('SELECT * FROM courses WHERE id = ?').get(id) as any;
    if (course) {
      let sections = await db.prepare(
        'SELECT id, title, sort_order FROM course_sections WHERE course_id = ? ORDER BY sort_order'
      ).all(id);
      // Use fallback sections when DB has none
      if (sections.length === 0 && FALLBACK_SECTIONS[courseId]) {
        sections = FALLBACK_SECTIONS[courseId];
      }
      return NextResponse.json({ course, sections });
    }
  } catch {}

  // Fallback
  const fallback = getFallbackCourseDetail(courseId);
  if (fallback) {
    return NextResponse.json(fallback);
  }
  return NextResponse.json({ error: '课程不存在' }, { status: 404 });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { default: db } = await import('@/lib/db');
    const { id } = await params;
    const body = await req.json();
    const { title, description, content, category, grade_range, hours, price, cover_image, status, sort_order } = body;

    await db.prepare(
      `UPDATE courses SET title = COALESCE(?, title), description = COALESCE(?, description),
       content = COALESCE(?, content), category = COALESCE(?, category),
       grade_range = COALESCE(?, grade_range), hours = COALESCE(?, hours),
       price = COALESCE(?, price), cover_image = COALESCE(?, cover_image),
       status = COALESCE(?, status), sort_order = COALESCE(?, sort_order),
       updated_at = CURRENT_TIMESTAMP WHERE id = ?`
    ).run(title, description, content, category, grade_range, hours, price, cover_image, status, sort_order, id);

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Database error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { default: db } = await import('@/lib/db');
    const { id } = await params;
    await db.prepare('DELETE FROM courses WHERE id = ?').run(id);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Database error' }, { status: 500 });
  }
}
