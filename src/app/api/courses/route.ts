import { NextRequest, NextResponse } from 'next/server';
import { FALLBACK_COURSES } from '@/lib/fallback-data';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const status = searchParams.get('status') || 'published';

  // Try database first
  try {
    const { default: db } = await import('@/lib/db');
    let query = 'SELECT * FROM courses WHERE status = ?';
    const params: any[] = [status];
    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }
    query += ' ORDER BY sort_order ASC, created_at DESC';
    const courses = await db.prepare(query).all(...params);
    if (courses.length > 0) {
      return NextResponse.json({ courses });
    }
  } catch {}

  // Fallback
  let courses = Object.values(FALLBACK_COURSES).filter(c => c.status === status);
  if (category) {
    courses = courses.filter(c => c.category === category);
  }
  return NextResponse.json({ courses });
}

export async function POST(req: NextRequest) {
  try {
    const { default: db } = await import('@/lib/db');
    const body = await req.json();
    const { title, description, content, category, grade_range, hours, price, cover_image, status } = body;

    if (!title || !category) {
      return NextResponse.json({ error: '标题和分类为必填项' }, { status: 400 });
    }

    const result = await db.prepare(
      'INSERT INTO courses (title, description, content, category, grade_range, hours, price, cover_image, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
    ).run(title, description || null, content || null, category, grade_range || null, hours || null, price || 0, cover_image || null, status || 'draft');

    return NextResponse.json({ id: result.lastInsertRowid });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Database error' }, { status: 500 });
  }
}
