import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: '无权限' }, { status: 403 });
  }
  const contacts = await db.prepare('SELECT * FROM contacts ORDER BY created_at DESC').all();
  return NextResponse.json({ contacts });
}

export async function POST(req: NextRequest) {
  const { school_name, contact_name, phone, email, message } = await req.json();
  if (!school_name || !contact_name || !phone) {
    return NextResponse.json({ error: '请填写必填信息' }, { status: 400 });
  }
  await db.prepare(
    'INSERT INTO contacts (school_name, contact_name, phone, email, message) VALUES (?, ?, ?, ?, ?)'
  ).run(school_name, contact_name, phone, email || null, message || null);
  return NextResponse.json({ ok: true });
}
