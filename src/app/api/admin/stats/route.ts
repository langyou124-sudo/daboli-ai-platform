import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: '无权限' }, { status: 403 });
  }

  const userCount = (await db.prepare('SELECT COUNT(*) as count FROM users').get() as any).count;
  const courseCount = (await db.prepare('SELECT COUNT(*) as count FROM courses').get() as any).count;
  const orderCount = (await db.prepare('SELECT COUNT(*) as count FROM orders').get() as any).count;
  const totalRevenue = (await db.prepare('SELECT COALESCE(SUM(amount), 0) as total FROM orders WHERE status = ?').get('paid') as any).total;
  const newContacts = (await db.prepare('SELECT COUNT(*) as count FROM contacts WHERE status = ?').get('new') as any).count;
  const recentOrders = await db.prepare(`
    SELECT o.*, u.username, c.title as course_title
    FROM orders o JOIN users u ON o.user_id = u.id JOIN courses c ON o.course_id = c.id
    ORDER BY o.created_at DESC LIMIT 10
  `).all();

  return NextResponse.json({ userCount, courseCount, orderCount, totalRevenue, newContacts, recentOrders });
}
