'use client';

import { useState, useEffect } from 'react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [rechargeTarget, setRechargeTarget] = useState<any>(null);
  const [rechargeAmount, setRechargeAmount] = useState('');

  useEffect(() => {
    fetch('/api/admin/users').then(r => r.json()).then(d => setUsers(d.users || []));
  }, []);

  const handleRole = async (id: number, role: string) => {
    await fetch('/api/admin/users', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, role }),
    });
    setUsers(users.map(u => u.id === id ? { ...u, role } : u));
  };

  const handleRecharge = async () => {
    const amount = Number(rechargeAmount);
    if (!amount || amount <= 0 || !rechargeTarget) return;
    const res = await fetch('/api/user/balance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, targetUserId: rechargeTarget.id }),
    });
    const data = await res.json();
    if (res.ok) {
      setUsers(users.map(u => u.id === rechargeTarget.id ? { ...u, balance: data.balance } : u));
      setRechargeTarget(null);
      setRechargeAmount('');
    } else {
      alert(data.error || '充值失败');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">用户管理</h1>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="text-left py-3 px-4">ID</th>
              <th className="text-left py-3 px-4">用户名</th>
              <th className="text-left py-3 px-4">邮箱</th>
              <th className="text-left py-3 px-4">手机号</th>
              <th className="text-left py-3 px-4">学校</th>
              <th className="text-left py-3 px-4">角色</th>
              <th className="text-left py-3 px-4">余额</th>
              <th className="text-left py-3 px-4">注册时间</th>
              <th className="text-left py-3 px-4">操作</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">{user.id}</td>
                <td className="py-3 px-4 font-medium">{user.username}</td>
                <td className="py-3 px-4">{user.email}</td>
                <td className="py-3 px-4">{user.phone || '-'}</td>
                <td className="py-3 px-4">{user.school || '-'}</td>
                <td className="py-3 px-4">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role === 'admin' ? '管理员' : '普通用户'}
                  </span>
                </td>
                <td className="py-3 px-4 font-medium text-emerald-600">¥{(user.balance || 0).toFixed(2)}</td>
                <td className="py-3 px-4 text-gray-500">{new Date(user.created_at).toLocaleDateString()}</td>
                <td className="py-3 px-4">
                  <button onClick={() => setRechargeTarget(user)} className="text-xs text-emerald-600 hover:text-emerald-700 mr-3">充值</button>
                  {user.role === 'user' ? (
                    <button onClick={() => handleRole(user.id, 'admin')} className="text-xs text-purple-600 hover:text-purple-700">设为管理员</button>
                  ) : (
                    <button onClick={() => handleRole(user.id, 'user')} className="text-xs text-gray-600 hover:text-gray-700">设为普通用户</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Recharge Modal */}
      {rechargeTarget && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setRechargeTarget(null)}>
          <div className="bg-white rounded-xl max-w-sm w-full p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold mb-4">给 {rechargeTarget.username} 充值</h2>
            <p className="text-sm text-gray-500 mb-4">当前余额：¥{(rechargeTarget.balance || 0).toFixed(2)}</p>
            <input
              type="number"
              placeholder="充值金额"
              value={rechargeAmount}
              onChange={e => setRechargeAmount(e.target.value)}
              className="border rounded-lg px-3 py-2 w-full mb-4"
              min="1"
            />
            <div className="flex gap-3">
              <button onClick={handleRecharge} className="flex-1 bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700">确认充值</button>
              <button onClick={() => { setRechargeTarget(null); setRechargeAmount(''); }} className="flex-1 border py-2 rounded-lg hover:bg-gray-50">取消</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
