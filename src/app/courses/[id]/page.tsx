'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CourseOverviewPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id;
  const [course, setCourse] = useState<any>(null);
  const [sections, setSections] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [hasPaid, setHasPaid] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`/api/courses/${courseId}`).then(r => r.json()),
      fetch(`/api/courses/${courseId}/sections`).then(r => r.json()),
      fetch('/api/auth/me').then(r => r.ok ? r.json() : null),
    ]).then(([courseData, sectionsData, userData]) => {
      setCourse(courseData.course);
      setSections(sectionsData.sections || []);
      if (userData) {
        setUser(userData.user);
        fetch('/api/orders').then(r => r.json()).then(orderData => {
          const paid = orderData.orders?.some((o: any) => o.course_id === Number(courseId) && o.status === 'paid');
          setHasPaid(paid || userData.user.role === 'admin');
        });
      }
      setLoading(false);
    });
  }, [courseId]);

  const handleMaterialClick = () => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (hasPaid || course?.price === 0) {
      router.push(`/courses/${courseId}/learn`);
    } else {
      setShowPaywall(true);
    }
  };

  const handleBuy = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    const res = await fetch(`/api/courses/${courseId}/purchase`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    if (res.ok) {
      setHasPaid(true);
      setShowPaywall(false);
    } else if (res.status === 402) {
      alert(`余额不足！当前余额 ¥${data.balance}，课程价格 ¥${data.price}。请先充值。`);
      router.push('/user');
    } else {
      alert(data.error || '操作失败');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">加载中...</div>;
  if (!course) return <div className="min-h-screen flex items-center justify-center">课程不存在</div>;

  const totalMaterials = sections.reduce((sum: number, s: any) => sum + (s.materials?.length || 0), 0);

  const categoryLabel: Record<string, string> = {
    primary: 'AI启蒙', middle: 'AI基础', high: 'AI进阶', network: '网络工程', teacher: '师资培训', camp: '夏令营',
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Course Header */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-4">
            <Link href="/courses" className="text-blue-200 hover:text-white text-sm">← 返回课程列表</Link>
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <span className="text-xs bg-white/20 px-3 py-1 rounded-full">{categoryLabel[course.category]}</span>
              <h1 className="text-3xl font-bold mt-3">{course.title}</h1>
              <p className="text-blue-100 mt-2">{course.grade_range} · {course.hours}课时</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-orange-300">¥{course.price}</div>
              {hasPaid || course.price === 0 ? (
                <Link href={`/courses/${courseId}/learn`} className="inline-block mt-3 bg-green-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-600">
                  开始学习
                </Link>
              ) : (
                <button onClick={handleBuy} className="mt-3 bg-orange-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-600">
                  立即购买
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Course Description */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <h2 className="text-xl font-bold mb-4">课程简介</h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{course.description}</p>
          {course.content && (
            <div className="mt-6 pt-6 border-t">
              <h3 className="font-semibold mb-3">详细内容</h3>
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">{course.content}</div>
            </div>
          )}
        </div>

        {/* Course Outline */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">课程大纲</h2>
            <span className="text-sm text-gray-500">{sections.length} 个章节 · {totalMaterials} 个课时</span>
          </div>

          {sections.length === 0 ? (
            <p className="text-gray-500 py-8 text-center">课程内容即将上线</p>
          ) : (
            <div className="space-y-3">
              {sections.map((section: any, si: number) => (
                <div key={section.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={handleMaterialClick}
                    className="w-full flex items-center justify-between px-6 py-4 hover:bg-blue-50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-sm font-bold">{si + 1}</span>
                      <span className="font-medium text-gray-800">{section.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {section.materials && section.materials.length > 0 && (
                        <span className="text-xs text-gray-400">{section.materials.length} 个资料</span>
                      )}
                      {!hasPaid && <span className="text-xs text-orange-500">🔒</span>}
                    </div>
                  </button>
                  {section.materials && section.materials.length > 0 && (
                    <div className="divide-y border-t">
                      {section.materials.map((material: any) => (
                        <button
                          key={material.id}
                          onClick={handleMaterialClick}
                          className="w-full flex items-center justify-between px-6 py-3 pl-16 hover:bg-blue-50 transition-colors text-left"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-lg">{material.type === 'video' ? '🎬' : '📄'}</span>
                            <span className="text-sm text-gray-700">{material.title}</span>
                            <span className="text-xs text-gray-400">{material.type === 'video' ? '视频' : '文档'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {material.duration && <span className="text-xs text-gray-400">{material.duration}</span>}
                            {!hasPaid && <span className="text-xs text-orange-500">🔒</span>}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Paywall Modal */}
      {showPaywall && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowPaywall(false)}>
          <div className="bg-white rounded-xl max-w-md w-full p-8 text-center" onClick={e => e.stopPropagation()}>
            <div className="text-5xl mb-4">🔒</div>
            <h3 className="text-xl font-bold mb-2">付费课程</h3>
            <p className="text-gray-600 mb-6">购买后即可观看全部视频和文档内容</p>
            <div className="text-3xl font-bold text-orange-500 mb-6">¥{course.price}</div>
            <div className="flex gap-3">
              <button onClick={() => { handleBuy(); setShowPaywall(false); }} className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700">
                立即购买
              </button>
              <button onClick={() => setShowPaywall(false)} className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50">
                再想想
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
