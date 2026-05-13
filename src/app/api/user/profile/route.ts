import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: '请先登录' }, { status: 401 });
  }

  const body = await req.json();
  const { phone, school, email } = body;

  const updates: string[] = [];
  const values: any[] = [];

  if (phone !== undefined) { updates.push('phone = ?'); values.push(phone || null); }
  if (school !== undefined) { updates.push('school = ?'); values.push(school || null); }
  if (email !== undefined) {
    const existing = await db.prepare('SELECT id FROM users WHERE email = ? AND id != ?').get(email, session.userId);
    if (existing) {
      return NextResponse.json({ error: '邮箱已被使用' }, { status: 409 });
    }
    updates.push('email = ?'); values.push(email);
  }

  if (updates.length === 0) {
    return NextResponse.json({ error: '没有需要更新的内容' }, { status: 400 });
  }

  updates.push('updated_at = CURRENT_TIMESTAMP');
  values.push(session.userId);

  await db.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`).run(...values);

  const user = await db.prepare('SELECT id, username, email, phone, school, role, created_at FROM users WHERE id = ?').get(session.userId);
  return NextResponse.json({ user });
}
