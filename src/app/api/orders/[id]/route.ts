import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: '未登录' }, { status: 401 });

  const { id } = await params;
  const { status, payment_method } = await req.json();

  const order = await db.prepare('SELECT * FROM orders WHERE id = ?').get(id) as any;
  if (!order) return NextResponse.json({ error: '订单不存在' }, { status: 404 });

  if (session.role !== 'admin' && order.user_id !== session.userId) {
    return NextResponse.json({ error: '无权限' }, { status: 403 });
  }

  const updates: string[] = [];
  const values: any[] = [];

  if (status) {
    updates.push('status = ?');
    values.push(status);
    if (status === 'paid') {
      updates.push('paid_at = CURRENT_TIMESTAMP');
    }
  }
  if (payment_method) {
    updates.push('payment_method = ?');
    values.push(payment_method);
  }

  values.push(id);
  await db.prepare(`UPDATE orders SET ${updates.join(', ')} WHERE id = ?`).run(...values);

  return NextResponse.json({ ok: true });
}
