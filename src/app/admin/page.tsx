'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch('/api/admin/stats').then(r => r.json()).then(setStats);
  }, []);

  if (!stats) return <div>加载中...</div>;

  const cards = [
    { label: '注册用户', value: stats.userCount, icon: '👥', color: 'bg-blue-500', href: '/admin/users' },
    { label: '课程数量', value: stats.courseCount, icon: '📚', color: 'bg-green-500', href: '/admin/courses' },
    { label: '订单总数', value: stats.orderCount, icon: '🛒', color: 'bg-purple-500', href: '/admin/orders' },
    { label: '总收入', value: `¥${stats.totalRevenue}`, icon: '💰', color: 'bg-orange-500', href: '/admin/orders' },
    { label: '待处理咨询', value: stats.newContacts, icon: '📬', color: 'bg-red-500', href: '/admin/contacts' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">仪表盘</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
        {cards.map((card, i) => (
          <Link key={i} href={card.href} className="bg-white rounded-xl shadow-sm p-6 card-hover">
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl">{card.icon}</span>
              <span className={`${card.color} text-white text-xs px-2 py-1 rounded-full`}>查看</span>
            </div>
            <p className="text-2xl font-bold">{card.value}</p>
            <p className="text-sm text-gray-500">{card.label}</p>
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">最近订单</h2>
        {stats.recentOrders.length === 0 ? (
          <p className="text-gray-500 py-4">暂无订单</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2">订单号</th>
                  <th className="text-left py-3 px-2">用户</th>
                  <th className="text-left py-3 px-2">课程</th>
                  <th className="text-left py-3 px-2">金额</th>
                  <th className="text-left py-3 px-2">状态</th>
                  <th className="text-left py-3 px-2">时间</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order: any) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-2">#{order.id}</td>
                    <td className="py-3 px-2">{order.username}</td>
                    <td className="py-3 px-2">{order.course_title}</td>
                    <td className="py-3 px-2 text-orange-500 font-medium">¥{order.amount}</td>
                    <td className="py-3 px-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        order.status === 'paid' ? 'bg-green-100 text-green-800' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status === 'paid' ? '已支付' : order.status === 'pending' ? '待支付' : order.status}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-gray-500">{new Date(order.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
