'use client';

import { useState, useEffect } from 'react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);

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
                <td className="py-3 px-4 text-gray-500">{new Date(user.created_at).toLocaleDateString()}</td>
                <td className="py-3 px-4">
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
    </div>
  );
}
