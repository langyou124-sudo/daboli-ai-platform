import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: '未登录' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const courseId = searchParams.get('courseId');

  if (courseId) {
    const progress = await db.prepare(`
      SELECT up.* FROM user_progress up
      JOIN course_materials cm ON up.material_id = cm.id
      JOIN course_sections cs ON cm.section_id = cs.id
      WHERE up.user_id = ? AND cs.course_id = ?
    `).all(session.userId, courseId);
    return NextResponse.json({ progress });
  }

  const progress = await db.prepare('SELECT * FROM user_progress WHERE user_id = ?').all(session.userId);
  return NextResponse.json({ progress });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: '未登录' }, { status: 401 });

  const { material_id, completed, last_position } = await req.json();
  if (!material_id) return NextResponse.json({ error: '缺少材料ID' }, { status: 400 });

  await db.prepare(`
    INSERT INTO user_progress (user_id, material_id, completed, last_position, updated_at)
    VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(user_id, material_id)
    DO UPDATE SET completed = ?, last_position = ?, updated_at = CURRENT_TIMESTAMP
  `).run(session.userId, material_id, completed ? 1 : 0, last_position || 0, completed ? 1 : 0, last_position || 0);

  return NextResponse.json({ ok: true });
}
