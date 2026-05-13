'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function UserCenterPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [progress, setProgress] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ phone: '', school: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/auth/me').then(r => r.ok ? r.json() : null),
      fetch('/api/orders').then(r => r.ok ? r.json() : null),
    ]).then(([userData, orderData]) => {
      if (!userData) {
        router.push('/login');
        return;
      }
      setUser(userData.user);
      setEditForm({ phone: userData.user.phone || '', school: userData.user.school || '' });
      setOrders(orderData?.orders || []);

      // Fetch progress for paid courses
      const paidOrders = (orderData?.orders || []).filter((o: any) => o.status === 'paid');
      if (paidOrders.length > 0) {
        fetch('/api/progress').then(r => r.ok ? r.json() : null).then(pData => {
          setProgress(pData?.progress || []);
        });
      }
      setLoading(false);
    });
  }, [router]);

  const handlePay = async (orderId: number) => {
    const res = await fetch(`/api/orders/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'paid', payment_method: 'online' }),
    });
    if (res.ok) {
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'paid' } : o));
    }
  };

  const handleCancel = async (orderId: number) => {
    const res = await fetch(`/api/orders/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'cancelled' }),
    });
    if (res.ok) {
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'cancelled' } : o));
    }
  };

  const handleSaveProfile = async () => {
    const res = await fetch('/api/user/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm),
    });
    if (res.ok) {
      const data = await res.json();
      setUser(data.user);
    }
    setEditing(false);
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">加载中...</div>;

  const statusLabel: Record<string, string> = {
    pending: '待支付', paid: '已支付', cancelled: '已取消', refunded: '已退款',
  };
  const statusColor: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-green-100 text-green-800',
    cancelled: 'bg-gray-100 text-gray-800',
    refunded: 'bg-red-100 text-red-800',
  };

  const paidOrders = orders.filter(o => o.status === 'paid');
  const pendingOrders = orders.filter(o => o.status === 'pending');

  const tabs = [
    { key: 'overview', label: '概览', icon: '📊' },
    { key: 'courses', label: '我的课程', icon: '📚' },
    { key: 'orders', label: '订单管理', icon: '🧾' },
    { key: 'profile', label: '账户设置', icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-lg font-bold">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-lg font-bold">欢迎回来，{user.username}</h1>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-gray-700">退出登录</button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <nav className="w-48 shrink-0">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {tabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`w-full text-left px-4 py-3 flex items-center gap-3 text-sm transition-colors ${
                    activeTab === tab.key
                      ? 'bg-blue-50 text-blue-600 font-medium border-r-2 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </nav>

          {/* Content */}
          <div className="flex-1">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white rounded-xl shadow-sm p-5">
                    <div className="text-sm text-gray-500 mb-1">已购课程</div>
                    <div className="text-2xl font-bold text-blue-600">{paidOrders.length}</div>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm p-5">
                    <div className="text-sm text-gray-500 mb-1">待支付</div>
                    <div className="text-2xl font-bold text-orange-500">{pendingOrders.length}</div>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm p-5">
                    <div className="text-sm text-gray-500 mb-1">学习进度</div>
                    <div className="text-2xl font-bold text-green-600">{progress.filter(p => p.completed).length}节</div>
                  </div>
                </div>

                {/* Quick Access - My Courses */}
                {paidOrders.length > 0 && (
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold mb-4">继续学习</h2>
                    <div className="space-y-3">
                      {paidOrders.map(order => (
                        <Link
                          key={order.id}
                          href={`/courses/${order.course_id}/learn`}
                          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-lg">📚</div>
                            <div>
                              <h3 className="font-medium">{order.course_title}</h3>
                              <p className="text-xs text-gray-500">点击继续学习</p>
                            </div>
                          </div>
                          <span className="text-blue-600 text-sm">进入 →</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pending Orders Alert */}
                {pendingOrders.length > 0 && (
                  <div className="bg-orange-50 border border-orange-200 rounded-xl p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-orange-800">你有 {pendingOrders.length} 个待支付订单</h3>
                        <p className="text-sm text-orange-600">完成支付后即可开始学习</p>
                      </div>
                      <button onClick={() => setActiveTab('orders')} className="text-sm bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600">
                        去支付
                      </button>
                    </div>
                  </div>
                )}

                {/* Empty State */}
                {paidOrders.length === 0 && pendingOrders.length === 0 && (
                  <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                    <div className="text-5xl mb-4">🎓</div>
                    <h2 className="text-xl font-bold mb-2">开始你的AI学习之旅</h2>
                    <p className="text-gray-500 mb-6">浏览课程体系，选择适合你的AI课程</p>
                    <Link href="/courses" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700">
                      浏览课程
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Courses Tab */}
            {activeTab === 'courses' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">我的课程</h2>
                {paidOrders.length === 0 ? (
                  <p className="text-gray-500 py-8 text-center">暂无已购课程，去<Link href="/courses" className="text-blue-600 hover:text-blue-700">课程页面</Link>看看吧</p>
                ) : (
                  <div className="space-y-4">
                    {paidOrders.map(order => (
                      <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">{order.course_title}</h3>
                            <p className="text-sm text-gray-500">购买时间：{new Date(order.paid_at || order.created_at).toLocaleDateString()}</p>
                          </div>
                          <Link href={`/courses/${order.course_id}/learn`} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
                            开始学习
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">订单管理</h2>
                {orders.length === 0 ? (
                  <p className="text-gray-500 py-8 text-center">暂无订单，去<Link href="/courses" className="text-blue-600 hover:text-blue-700">课程页面</Link>看看吧</p>
                ) : (
                  <div className="space-y-4">
                    {orders.map(order => (
                      <div key={order.id} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{order.course_title}</h3>
                          <p className="text-sm text-gray-500">订单号：{order.id} · {new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-xl font-bold text-orange-500">¥{order.amount}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${statusColor[order.status]}`}>
                            {statusLabel[order.status]}
                          </span>
                          {order.status === 'pending' && (
                            <div className="flex gap-2">
                              <button onClick={() => handlePay(order.id)} className="text-sm bg-blue-600 text-white px-4 py-1 rounded-lg hover:bg-blue-700">
                                支付
                              </button>
                              <button onClick={() => handleCancel(order.id)} className="text-sm border border-gray-300 text-gray-700 px-4 py-1 rounded-lg hover:bg-gray-50">
                                取消
                              </button>
                            </div>
                          )}
                          {order.status === 'paid' && (
                            <Link href={`/courses/${order.course_id}/learn`} className="text-sm text-blue-600 hover:text-blue-700">
                              去学习 →
                            </Link>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold">账户设置</h2>
                  {!editing && (
                    <button onClick={() => setEditing(true)} className="text-sm text-blue-600 hover:text-blue-700">编辑</button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm text-gray-500 block mb-1">用户名</label>
                    <p className="font-medium">{user.username}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 block mb-1">邮箱</label>
                    <p className="font-medium">{user.email}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 block mb-1">手机号</label>
                    {editing ? (
                      <input value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})}
                        className="border rounded-lg px-3 py-2 w-full" placeholder="请输入手机号" />
                    ) : (
                      <p className="font-medium">{user.phone || '未设置'}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 block mb-1">学校/机构</label>
                    {editing ? (
                      <input value={editForm.school} onChange={e => setEditForm({...editForm, school: e.target.value})}
                        className="border rounded-lg px-3 py-2 w-full" placeholder="请输入学校名称" />
                    ) : (
                      <p className="font-medium">{user.school || '未设置'}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 block mb-1">角色</label>
                    <p className="font-medium">{user.role === 'admin' ? '管理员' : '普通用户'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 block mb-1">注册时间</label>
                    <p className="font-medium">{new Date(user.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                {editing && (
                  <div className="flex gap-3 mt-6 pt-6 border-t">
                    <button onClick={handleSaveProfile} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">保存</button>
                    <button onClick={() => setEditing(false)} className="border px-6 py-2 rounded-lg hover:bg-gray-50">取消</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
