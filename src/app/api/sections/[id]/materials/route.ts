import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const materials = await db.prepare(
    'SELECT * FROM course_materials WHERE section_id = ? ORDER BY sort_order ASC'
  ).all(id);
  return NextResponse.json({ materials });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: '无权限' }, { status: 403 });
  }

  const { id } = await params;
  const { title, type, file_path, file_size, duration, sort_order } = await req.json();

  if (!title || !type || !file_path) {
    return NextResponse.json({ error: '标题、类型和文件路径为必填项' }, { status: 400 });
  }

  const result = await db.prepare(
    'INSERT INTO course_materials (section_id, title, type, file_path, file_size, duration, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).run(id, title, type, file_path, file_size || null, duration || null, sort_order || 0);

  return NextResponse.json({ id: result.lastInsertRowid });
}
