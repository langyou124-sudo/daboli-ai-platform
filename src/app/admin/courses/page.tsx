'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', category: 'primary', grade_range: '', hours: '', price: '', status: 'draft' });

  const loadCourses = () => {
    fetch('/api/courses?status=draft&status=published').then(r => r.json()).then(d => {
      // Fetch all courses regardless of status
      fetch('/api/courses?status=published').then(r2 => r2.json()).then(d2 => {
        fetch('/api/courses?status=draft').then(r3 => r3.json()).then(d3 => {
          setCourses([...(d2.courses || []), ...(d3.courses || [])]);
        });
      });
    });
  };

  useEffect(() => { loadCourses(); }, []);

  const handleSave = async () => {
    const url = editing ? `/api/courses/${editing.id}` : '/api/courses';
    const method = editing ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, hours: form.hours ? Number(form.hours) : null, price: form.price ? Number(form.price) : 0 }),
    });
    if (res.ok) {
      setShowForm(false);
      setEditing(null);
      setForm({ title: '', description: '', category: 'primary', grade_range: '', hours: '', price: '', status: 'draft' });
      loadCourses();
    }
  };

  const handleEdit = (course: any) => {
    setEditing(course);
    setForm({
      title: course.title,
      description: course.description || '',
      category: course.category,
      grade_range: course.grade_range || '',
      hours: course.hours?.toString() || '',
      price: course.price?.toString() || '',
      status: course.status,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定删除该课程？')) return;
    await fetch(`/api/courses/${id}`, { method: 'DELETE' });
    loadCourses();
  };

  const categoryLabel: Record<string, string> = {
    primary: 'AI启蒙', middle: 'AI基础', high: 'AI进阶', network: '网络工程', teacher: '师资培训', camp: '夏令营',
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">课程管理</h1>
        <button onClick={() => { setEditing(null); setForm({ title: '', description: '', category: 'primary', grade_range: '', hours: '', price: '', status: 'draft' }); setShowForm(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">+ 新建课程</button>
      </div>

      {/* Course Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-xl max-w-lg w-full p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4">{editing ? '编辑课程' : '新建课程'}</h2>
            <div className="space-y-3">
              <input placeholder="课程标题 *" value={form.title} onChange={e => setForm({...form, title: e.target.value})}
                className="w-full border rounded-lg px-3 py-2" />
              <textarea placeholder="课程描述" value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                className="w-full border rounded-lg px-3 py-2 h-24" />
              <div className="grid grid-cols-2 gap-3">
                <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}
                  className="border rounded-lg px-3 py-2">
                  <option value="primary">AI启蒙</option>
                  <option value="middle">AI基础</option>
                  <option value="high">AI进阶</option>
                  <option value="network">网络工程</option>
                  <option value="teacher">师资培训</option>
                  <option value="camp">夏令营</option>
                </select>
                <input placeholder="适用学段" value={form.grade_range} onChange={e => setForm({...form, grade_range: e.target.value})}
                  className="border rounded-lg px-3 py-2" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <input placeholder="课时数" type="number" value={form.hours} onChange={e => setForm({...form, hours: e.target.value})}
                  className="border rounded-lg px-3 py-2" />
                <input placeholder="价格" type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})}
                  className="border rounded-lg px-3 py-2" />
                <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}
                  className="border rounded-lg px-3 py-2">
                  <option value="draft">草稿</option>
                  <option value="published">已发布</option>
                  <option value="archived">已归档</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={handleSave} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">保存</button>
              <button onClick={() => setShowForm(false)} className="border px-6 py-2 rounded-lg hover:bg-gray-50">取消</button>
            </div>
          </div>
        </div>
      )}

      {/* Course List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="text-left py-3 px-4">课程名称</th>
              <th className="text-left py-3 px-4">分类</th>
              <th className="text-left py-3 px-4">适用学段</th>
              <th className="text-left py-3 px-4">课时</th>
              <th className="text-left py-3 px-4">价格</th>
              <th className="text-left py-3 px-4">状态</th>
              <th className="text-left py-3 px-4">内容</th>
              <th className="text-left py-3 px-4">操作</th>
            </tr>
          </thead>
          <tbody>
            {courses.map(course => (
              <tr key={course.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 font-medium">{course.title}</td>
                <td className="py-3 px-4">{categoryLabel[course.category]}</td>
                <td className="py-3 px-4">{course.grade_range}</td>
                <td className="py-3 px-4">{course.hours}</td>
                <td className="py-3 px-4 text-orange-500">¥{course.price}</td>
                <td className="py-3 px-4">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    course.status === 'published' ? 'bg-green-100 text-green-800' :
                    course.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {course.status === 'published' ? '已发布' : course.status === 'draft' ? '草稿' : '已归档'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <Link href={`/admin/content/${course.id}`} className="text-green-600 hover:text-green-700 text-sm">管理内容</Link>
                </td>
                <td className="py-3 px-4">
                  <button onClick={() => handleEdit(course)} className="text-blue-600 hover:text-blue-700 mr-3">编辑</button>
                  <button onClick={() => handleDelete(course.id)} className="text-red-600 hover:text-red-700">删除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
