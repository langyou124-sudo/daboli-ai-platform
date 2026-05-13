'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [form, setForm] = useState({ school_name: '', contact_name: '', phone: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setSubmitted(true);
      setForm({ school_name: '', contact_name: '', phone: '', email: '', message: '' });
    }
    setLoading(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">联系我们</h1>
          <p className="text-blue-100 text-lg">预约免费示范课，让您的学生亲身体验AI的魅力</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold mb-6">预约咨询</h2>
            {submitted ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-xl font-semibold text-green-800 mb-2">提交成功！</h3>
                <p className="text-green-700">我们会在1个工作日内与您联系，感谢您的关注！</p>
                <button onClick={() => setSubmitted(false)} className="mt-4 text-blue-600 hover:text-blue-700">
                  继续咨询
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">学校名称 *</label>
                  <input type="text" required value={form.school_name} onChange={e => setForm({...form, school_name: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">联系人 *</label>
                  <input type="text" required value={form.contact_name} onChange={e => setForm({...form, contact_name: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">联系电话 *</label>
                  <input type="tel" required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
                  <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">需求描述</label>
                  <textarea rows={4} value={form.message} onChange={e => setForm({...form, message: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50">
                  {loading ? '提交中...' : '提交咨询'}
                </button>
              </form>
            )}
          </div>

          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-bold mb-6">联系方式</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-xl">📍</div>
                <div>
                  <h3 className="font-semibold">公司地址</h3>
                  <p className="text-gray-600">云南省昆明市</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-xl">📧</div>
                <div>
                  <h3 className="font-semibold">电子邮箱</h3>
                  <p className="text-gray-600">contact@daboli.com</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-xl">💬</div>
                <div>
                  <h3 className="font-semibold">微信公众号</h3>
                  <p className="text-gray-600">达博理科技</p>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-blue-50 p-6 rounded-xl">
              <h3 className="font-semibold mb-2">服务时间</h3>
              <p className="text-gray-600 text-sm">周一至周五 9:00 - 18:00</p>
              <p className="text-gray-600 text-sm">周末及节假日可预约咨询</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
