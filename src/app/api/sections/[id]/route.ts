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
  const { title, sort_order } = await req.json();

  await db.prepare(
    'UPDATE course_sections SET title = COALESCE(?, title), sort_order = COALESCE(?, sort_order) WHERE id = ?'
  ).run(title, sort_order, id);

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: '无权限' }, { status: 403 });
  }

  const { id } = await params;
  await db.prepare('DELETE FROM course_sections WHERE id = ?').run(id);
  return NextResponse.json({ ok: true });
}
