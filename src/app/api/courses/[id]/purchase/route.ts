import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: '未登录' }, { status: 401 });

  const { id } = await params;

  try {
    const { default: db } = await import('@/lib/db');

    // Read current course price at purchase time
    const course = await db.prepare('SELECT * FROM courses WHERE id = ? AND status = ?').get(id, 'published') as any;
    if (!course) return NextResponse.json({ error: '课程不存在' }, { status: 404 });

    // Check duplicate
    const existing = await db.prepare(
      'SELECT id FROM orders WHERE user_id = ? AND course_id = ? AND status = ?'
    ).get(session.userId, id, 'paid');
    if (existing) return NextResponse.json({ error: '已购买该课程' }, { status: 409 });

    const price = course.price || 0;

    // Free course: just create a paid order
    if (price === 0) {
      const result = await db.prepare(
        'INSERT INTO orders (user_id, course_id, amount, status, payment_method, paid_at) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)'
      ).run(session.userId, id, 0, 'paid', 'free');
      return NextResponse.json({ orderId: result.lastInsertRowid, amount: 0 });
    }

    // Paid course: check balance
    const user = await db.prepare('SELECT balance FROM users WHERE id = ?').get(session.userId) as any;
    const balance = user?.balance || 0;

    if (balance < price) {
      return NextResponse.json({ error: '余额不足', balance, price }, { status: 402 });
    }

    // Deduct balance + create paid order in sequence
    await db.prepare('UPDATE users SET balance = balance - ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(price, session.userId);

    const orderResult = await db.prepare(
      'INSERT INTO orders (user_id, course_id, amount, status, payment_method, paid_at) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)'
    ).run(session.userId, id, price, 'paid', 'balance');

    await db.prepare(
      'INSERT INTO balance_transactions (user_id, amount, type, description, related_order_id) VALUES (?, ?, ?, ?, ?)'
    ).run(session.userId, -price, 'purchase', `购买课程：${course.title}`, orderResult.lastInsertRowid);

    const newUser = await db.prepare('SELECT balance FROM users WHERE id = ?').get(session.userId) as any;
    return NextResponse.json({ orderId: orderResult.lastInsertRowid, amount: price, balance: newUser?.balance || 0 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
