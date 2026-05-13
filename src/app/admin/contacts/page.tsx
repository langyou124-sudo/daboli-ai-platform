'use client';

import { useState, useEffect } from 'react';

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/contacts').then(r => r.json()).then(d => setContacts(d.contacts || []));
  }, []);

  const handleStatus = async (id: number, status: string) => {
    await fetch(`/api/admin/contacts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    setContacts(contacts.map(c => c.id === id ? { ...c, status } : c));
  };

  const statusLabel: Record<string, string> = {
    new: '新咨询', contacted: '已联系', closed: '已关闭',
  };
  const statusColor: Record<string, string> = {
    new: 'bg-red-100 text-red-800',
    contacted: 'bg-yellow-100 text-yellow-800',
    closed: 'bg-gray-100 text-gray-800',
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">咨询管理</h1>

      <div className="space-y-4">
        {contacts.map(contact => (
          <div key={contact.id} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-lg">{contact.school_name}</h3>
                <p className="text-sm text-gray-500">联系人：{contact.contact_name} · {contact.phone}</p>
                {contact.email && <p className="text-sm text-gray-500">邮箱：{contact.email}</p>}
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${statusColor[contact.status]}`}>
                {statusLabel[contact.status]}
              </span>
            </div>
            {contact.message && <p className="text-gray-700 mb-4">{contact.message}</p>}
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">{new Date(contact.created_at).toLocaleString()}</span>
              <div className="flex gap-2">
                {contact.status === 'new' && (
                  <button onClick={() => handleStatus(contact.id, 'contacted')} className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">标记已联系</button>
                )}
                {contact.status !== 'closed' && (
                  <button onClick={() => handleStatus(contact.id, 'closed')} className="text-xs border text-gray-600 px-3 py-1 rounded hover:bg-gray-50">关闭</button>
                )}
              </div>
            </div>
          </div>
        ))}
        {contacts.length === 0 && <p className="text-center text-gray-500 py-8">暂无咨询</p>}
      </div>
    </div>
  );
}
