import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { hashPassword, createToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const { username, email, password, phone, school } = await req.json();

  if (!username || !email || !password) {
    return NextResponse.json({ error: '请填写必填信息' }, { status: 400 });
  }

  const existing = await db.prepare('SELECT id FROM users WHERE username = ? OR email = ?').get(username, email);
  if (existing) {
    return NextResponse.json({ error: '用户名或邮箱已存在' }, { status: 409 });
  }

  const hashedPassword = await hashPassword(password);
  const result = await db.prepare(
    'INSERT INTO users (username, email, password, phone, school) VALUES (?, ?, ?, ?, ?)'
  ).run(username, email, hashedPassword, phone || null, school || null);

  const token = await createToken({ userId: result.lastInsertRowid as number, role: 'user' });
  const res = NextResponse.json({
    user: { id: result.lastInsertRowid, username, email, role: 'user', school },
  });
  res.cookies.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });
  return res;
}
