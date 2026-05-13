import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const status = searchParams.get('status') || 'published';

  let query = 'SELECT * FROM courses WHERE status = ?';
  const params: any[] = [status];

  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }

  query += ' ORDER BY sort_order ASC, created_at DESC';
  const courses = await db.prepare(query).all(...params);
  return NextResponse.json({ courses });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, description, content, category, grade_range, hours, price, cover_image, status } = body;

  if (!title || !category) {
    return NextResponse.json({ error: '标题和分类为必填项' }, { status: 400 });
  }

  const result = await db.prepare(
    'INSERT INTO courses (title, description, content, category, grade_range, hours, price, cover_image, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(title, description || null, content || null, category, grade_range || null, hours || null, price || 0, cover_image || null, status || 'draft');

  return NextResponse.json({ id: result.lastInsertRowid });
}
