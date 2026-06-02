'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const categories = [
  { key: '', label: '全部课程' },
  { key: 'primary', label: 'AI启蒙' },
  { key: 'middle', label: 'AI基础' },
  { key: 'high', label: 'AI进阶' },
  { key: 'network', label: '网络工程' },
  { key: 'teacher', label: '师资培训' },
  { key: 'camp', label: '夏令营' },
];

const categoryColors: Record<string, string> = {
  primary: 'bg-green-500',
  middle: 'bg-blue-500',
  high: 'bg-purple-500',
  network: 'bg-teal-500',
  teacher: 'bg-orange-500',
  camp: 'bg-pink-500',
};

export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<any>(null);

  useEffect(() => {
    const url = activeCategory ? `/api/courses?category=${activeCategory}` : '/api/courses';
    fetch(url).then(r => r.json()).then(d => setCourses(d.courses || []));
  }, [activeCategory]);

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.ok ? r.json() : null).then(d => { if (d) setUser(d.user); });
  }, []);

  const handleBuy = async (courseId: number) => {
    if (!user) { window.location.href = '/login'; return; }
    const res = await fetch(`/api/courses/${courseId}/purchase`, { method: 'POST' });
    const data = await res.json();
    if (res.ok) {
      window.location.href = `/courses/${courseId}/learn`;
    } else if (res.status === 402) {
      alert(`余额不足！当前余额 ¥${data.balance}，课程价格 ¥${data.price}。请先充值。`);
      window.location.href = '/user';
    } else {
      alert(data.error || '操作失败');
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">课程体系</h1>
          <p className="text-blue-100 text-lg">覆盖小学到高中的完整AI教育方案，分层教学，因材施教</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {categories.map(cat => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Course Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course: any) => (
            <div key={course.id} className="bg-white rounded-xl shadow-sm overflow-hidden card-hover">
              <div className={`${categoryColors[course.category] || 'bg-gray-500'} h-3`} />
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs px-2 py-1 rounded-full text-white ${categoryColors[course.category] || 'bg-gray-500'}`}>
                    {categories.find(c => c.key === course.category)?.label || course.category}
                  </span>
                  <span className="text-xs text-gray-500">{course.grade_range}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{course.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{course.description}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm text-gray-500">{course.hours}课时</span>
                    <span className="text-2xl font-bold text-orange-500 ml-3">¥{course.price}</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Link href={`/courses/${course.id}`} className="flex-1 border border-blue-600 text-blue-600 py-2 rounded-lg text-sm hover:bg-blue-50 transition-colors text-center">
                    了解详情
                  </Link>
                  <button onClick={() => handleBuy(course.id)} className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">
                    立即购买
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {courses.length === 0 && (
          <div className="text-center py-12 text-gray-500">暂无课程</div>
        )}
      </div>

      {/* Course Detail Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedCourse(null)}>
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8" onClick={e => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-4">{selectedCourse.title}</h2>
            <div className="flex gap-3 mb-4">
              <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">{selectedCourse.grade_range}</span>
              <span className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full">{selectedCourse.hours}课时</span>
              <span className="text-sm bg-orange-100 text-orange-700 px-3 py-1 rounded-full">¥{selectedCourse.price}</span>
            </div>
            <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">{selectedCourse.description}</div>
            <div className="mt-6 flex gap-3">
              <button onClick={() => { handleBuy(selectedCourse.id); setSelectedCourse(null); }} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                立即购买
              </button>
              <button onClick={() => setSelectedCourse(null)} className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50">
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
