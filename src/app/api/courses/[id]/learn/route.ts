import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: '未登录' }, { status: 401 });

  const { id } = await params;

  const order = await db.prepare(
    'SELECT id FROM orders WHERE user_id = ? AND course_id = ? AND status = ?'
  ).get(session.userId, id, 'paid');

  if (!order && session.role !== 'admin') {
    return NextResponse.json({ error: '请先购买课程' }, { status: 403 });
  }

  const course = await db.prepare('SELECT * FROM courses WHERE id = ?').get(id);
  if (!course) return NextResponse.json({ error: '课程不存在' }, { status: 404 });

  const sections = await db.prepare(
    'SELECT * FROM course_sections WHERE course_id = ? ORDER BY sort_order ASC'
  ).all(id) as any[];

  for (const section of sections) {
    section.materials = await db.prepare(
      'SELECT * FROM course_materials WHERE section_id = ? ORDER BY sort_order ASC'
    ).all(section.id);
  }

  const progress = await db.prepare(
    'SELECT * FROM user_progress WHERE user_id = ? AND material_id IN (SELECT id FROM course_materials WHERE section_id IN (SELECT id FROM course_sections WHERE course_id = ?))'
  ).all(session.userId, id) as any[];

  return NextResponse.json({ course, sections, progress });
}
