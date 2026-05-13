'use client';

import { useState, useEffect } from 'react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/orders?all=true').then(r => r.json()).then(d => setOrders(d.orders || []));
  }, []);

  const handleStatus = async (id: number, status: string) => {
    await fetch(`/api/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
  };

  const statusLabel: Record<string, string> = {
    pending: '待支付', paid: '已支付', cancelled: '已取消', refunded: '已退款',
  };
  const statusColor: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-green-100 text-green-800',
    cancelled: 'bg-gray-100 text-gray-800',
    refunded: 'bg-red-100 text-red-800',
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">订单管理</h1>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="text-left py-3 px-4">订单号</th>
              <th className="text-left py-3 px-4">用户</th>
              <th className="text-left py-3 px-4">学校</th>
              <th className="text-left py-3 px-4">课程</th>
              <th className="text-left py-3 px-4">金额</th>
              <th className="text-left py-3 px-4">状态</th>
              <th className="text-left py-3 px-4">时间</th>
              <th className="text-left py-3 px-4">操作</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">#{order.id}</td>
                <td className="py-3 px-4">{order.username}</td>
                <td className="py-3 px-4">{order.school || '-'}</td>
                <td className="py-3 px-4">{order.course_title}</td>
                <td className="py-3 px-4 text-orange-500 font-medium">¥{order.amount}</td>
                <td className="py-3 px-4">
                  <span className={`text-xs px-2 py-1 rounded-full ${statusColor[order.status]}`}>
                    {statusLabel[order.status]}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-500">{new Date(order.created_at).toLocaleDateString()}</td>
                <td className="py-3 px-4">
                  {order.status === 'pending' && (
                    <div className="flex gap-2">
                      <button onClick={() => handleStatus(order.id, 'paid')} className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">确认支付</button>
                      <button onClick={() => handleStatus(order.id, 'cancelled')} className="text-xs border text-gray-600 px-3 py-1 rounded hover:bg-gray-50">取消</button>
                    </div>
                  )}
                  {order.status === 'paid' && (
                    <button onClick={() => handleStatus(order.id, 'refunded')} className="text-xs text-red-600 hover:text-red-700">退款</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && <p className="text-center text-gray-500 py-8">暂无订单</p>}
      </div>
    </div>
  );
}
