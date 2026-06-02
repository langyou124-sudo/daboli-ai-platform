import { NextRequest, NextResponse } from 'next/server';
import { getSession, requireAdmin } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: '未登录' }, { status: 401 });

  try {
    const { default: db } = await import('@/lib/db');
    const user = await db.prepare('SELECT balance FROM users WHERE id = ?').get(session.userId) as any;
    const transactions = await db.prepare(
      'SELECT * FROM balance_transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT 50'
    ).all(session.userId);

    return NextResponse.json({ balance: user?.balance || 0, transactions });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: '未登录' }, { status: 401 });

  try {
    const { default: db } = await import('@/lib/db');
    const body = await req.json();
    const { amount, targetUserId } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: '充值金额必须大于0' }, { status: 400 });
    }

    // Admin can recharge any user; normal user can only recharge themselves
    let userId = session.userId;
    if (targetUserId && targetUserId !== session.userId) {
      if (session.role !== 'admin') {
        return NextResponse.json({ error: '无权限' }, { status: 403 });
      }
      userId = targetUserId;
    }

    await db.prepare('UPDATE users SET balance = balance + ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(amount, userId);
    await db.prepare(
      'INSERT INTO balance_transactions (user_id, amount, type, description) VALUES (?, ?, ?, ?)'
    ).run(userId, amount, 'recharge', session.role === 'admin' && targetUserId ? `管理员充值` : '自主充值');

    const user = await db.prepare('SELECT balance FROM users WHERE id = ?').get(userId) as any;
    return NextResponse.json({ balance: user?.balance || 0 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
