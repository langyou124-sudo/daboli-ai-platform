import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: '无权限' }, { status: 403 });
  }

  const users = await db.prepare('SELECT id, username, email, role, phone, school, created_at FROM users ORDER BY created_at DESC').all();
  return NextResponse.json({ users });
}

export async function PUT(req: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: '无权限' }, { status: 403 });
  }

  const { id, role, school } = await req.json();
  if (role) await db.prepare('UPDATE users SET role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(role, id);
  if (school !== undefined) await db.prepare('UPDATE users SET school = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(school, id);
  return NextResponse.json({ ok: true });
}
