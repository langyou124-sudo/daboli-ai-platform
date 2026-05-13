import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: '无权限' }, { status: 403 });
  }

  const { id } = await params;
  const { status } = await req.json();
  await db.prepare('UPDATE contacts SET status = ? WHERE id = ?').run(status, id);
  return NextResponse.json({ ok: true });
}
