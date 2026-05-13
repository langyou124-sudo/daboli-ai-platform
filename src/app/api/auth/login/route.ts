import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyPassword, createToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  if (!username || !password) {
    return NextResponse.json({ error: '请填写用户名和密码' }, { status: 400 });
  }

  const user = await db.prepare('SELECT * FROM users WHERE username = ? OR email = ? OR phone = ?').get(username, username, username) as any;
  if (!user) {
    return NextResponse.json({ error: '用户名或密码错误' }, { status: 401 });
  }

  const valid = await verifyPassword(password, user.password);
  if (!valid) {
    return NextResponse.json({ error: '用户名或密码错误' }, { status: 401 });
  }

  const token = await createToken({ userId: user.id, role: user.role });
  const res = NextResponse.json({
    user: { id: user.id, username: user.username, email: user.email, role: user.role, school: user.school },
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
