import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: '未登录' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const all = searchParams.get('all') === 'true';

  let orders;
  if (all && session.role === 'admin') {
    orders = await db.prepare(`
      SELECT o.*, u.username, u.school, c.title as course_title
      FROM orders o
      JOIN users u ON o.user_id = u.id
      JOIN courses c ON o.course_id = c.id
      ORDER BY o.created_at DESC
    `).all();
  } else {
    orders = await db.prepare(`
      SELECT o.*, c.title as course_title
      FROM orders o
      JOIN courses c ON o.course_id = c.id
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC
    `).all(session.userId);
  }

  return NextResponse.json({ orders });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: '未登录' }, { status: 401 });

  const { course_id } = await req.json();
  if (!course_id) return NextResponse.json({ error: '课程ID为必填项' }, { status: 400 });

  const course = await db.prepare('SELECT * FROM courses WHERE id = ? AND status = ?').get(course_id, 'published') as any;
  if (!course) return NextResponse.json({ error: '课程不存在或未发布' }, { status: 404 });

  const existing = await db.prepare('SELECT id FROM orders WHERE user_id = ? AND course_id = ? AND status IN (?, ?)').get(session.userId, course_id, 'pending', 'paid');
  if (existing) return NextResponse.json({ error: '您已购买或正在购买该课程' }, { status: 409 });

  const result = await db.prepare(
    'INSERT INTO orders (user_id, course_id, amount, status) VALUES (?, ?, ?, ?)'
  ).run(session.userId, course_id, course.price, 'pending');

  return NextResponse.json({ id: result.lastInsertRowid, amount: course.price });
}
