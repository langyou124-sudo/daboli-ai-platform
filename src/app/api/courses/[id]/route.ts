import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const course = await db.prepare('SELECT * FROM courses WHERE id = ?').get(id);
  if (!course) {
    return NextResponse.json({ error: '课程不存在' }, { status: 404 });
  }
  const sections = await db.prepare(
    'SELECT id, title, sort_order FROM course_sections WHERE course_id = ? ORDER BY sort_order'
  ).all(id);
  return NextResponse.json({ course, sections });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await db.prepare('DELETE FROM courses WHERE id = ?').run(id);
  return NextResponse.json({ ok: true });
}
