'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CourseLearnPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id;
  const videoRef = useRef<HTMLVideoElement>(null);

  const [course, setCourse] = useState<any>(null);
  const [sections, setSections] = useState<any[]>([]);
  const [progress, setProgress] = useState<any[]>([]);
  const [activeMaterial, setActiveMaterial] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/courses/${courseId}/learn`)
      .then(r => {
        if (r.status === 403) {
          alert('请先购买课程');
          router.push(`/courses/${courseId}`);
          return null;
        }
        if (r.status === 401) {
          router.push('/login');
          return null;
        }
        return r.json();
      })
      .then(data => {
        if (!data) return;
        setCourse(data.course);
        setSections(data.sections || []);
        setProgress(data.progress || []);
        if (data.sections?.length > 0 && data.sections[0].materials?.length > 0) {
          setActiveMaterial(data.sections[0].materials[0]);
        }
        setLoading(false);
      });
  }, [courseId, router]);

  const handleMaterialClick = (material: any) => {
    setActiveMaterial(material);
  };

  const handleProgress = async (materialId: number, completed: boolean, position?: number) => {
    await fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ material_id: materialId, completed, last_position: position }),
    });
    setProgress(prev => {
      const existing = prev.find(p => p.material_id === materialId);
      if (existing) {
        return prev.map(p => p.material_id === materialId ? { ...p, completed: completed ? 1 : 0, last_position: position } : p);
      }
      return [...prev, { material_id: materialId, completed: completed ? 1 : 0, last_position: position }];
    });
  };

  const isCompleted = (materialId: number) => progress.some(p => p.material_id === materialId && p.completed);

  const getProgressPercent = () => {
    const totalMaterials = sections.reduce((sum, s) => sum + (s.materials?.length || 0), 0);
    if (totalMaterials === 0) return 0;
    const completedCount = progress.filter(p => p.completed).length;
    return Math.round((completedCount / totalMaterials) * 100);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">加载中...</div>;
  if (!course) return null;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top Bar */}
      <div className="bg-white shadow-sm px-4 py-3 flex items-center justify-between">
        <Link href={`/courses/${courseId}`} className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1">
          ← 返回课程详情
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">{course.title}</span>
          <div className="flex items-center gap-2">
            <div className="w-32 bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full transition-all" style={{ width: `${getProgressPercent()}%` }} />
            </div>
            <span className="text-xs text-gray-500">{getProgressPercent()}%</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Sidebar - Chapter Navigation */}
        <aside className="w-80 bg-white border-r overflow-y-auto shrink-0">
          <div className="p-4">
            <h2 className="font-bold text-lg mb-4">课程目录</h2>
            <div className="space-y-3">
              {sections.map((section: any, si: number) => (
                <div key={section.id}>
                  <h3 className="text-sm font-semibold text-gray-500 mb-2">第{si + 1}章 {section.title}</h3>
                  <div className="space-y-1">
                    {section.materials?.map((material: any) => (
                      <button
                        key={material.id}
                        onClick={() => handleMaterialClick(material)}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left transition-colors ${
                          activeMaterial?.id === material.id
                            ? 'bg-blue-50 text-blue-700'
                            : 'hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        <span>{material.type === 'video' ? '🎬' : '📄'}</span>
                        <span className="flex-1 truncate">{material.title}</span>
                        {isCompleted(material.id) && <span className="text-green-500">✓</span>}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-8 overflow-y-auto">
          {activeMaterial ? (
            <div className="max-w-4xl mx-auto">
              <h1 className="text-2xl font-bold mb-6">{activeMaterial.title}</h1>

              {activeMaterial.type === 'video' ? (
                <div className="bg-black rounded-xl overflow-hidden mb-6">
                  <video
                    ref={videoRef}
                    src={activeMaterial.file_path}
                    controls
                    className="w-full aspect-video"
                    onEnded={() => handleProgress(activeMaterial.id, true)}
                    onTimeUpdate={() => {
                      if (videoRef.current) {
                        handleProgress(activeMaterial.id, false, videoRef.current.currentTime);
                      }
                    }}
                  >
                    您的浏览器不支持视频播放
                  </video>
                </div>
              ) : activeMaterial.file_path?.endsWith('.pdf') ? (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
                  <iframe
                    src={activeMaterial.file_path}
                    className="w-full h-[600px]"
                    title={activeMaterial.title}
                  />
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm p-8 text-center mb-6">
                  <div className="text-5xl mb-4">📄</div>
                  <p className="text-gray-600 mb-4">该文档格式暂不支持在线预览</p>
                  <a
                    href={activeMaterial.file_path}
                    download
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                  >
                    下载文档
                  </a>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  类型：{activeMaterial.type === 'video' ? '视频' : '文档'}
                  {activeMaterial.duration && ` · 时长：${activeMaterial.duration}`}
                </span>
                <button
                  onClick={() => handleProgress(activeMaterial.id, !isCompleted(activeMaterial.id))}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isCompleted(activeMaterial.id)
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {isCompleted(activeMaterial.id) ? '✓ 已完成' : '标记为已完成'}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              请从左侧目录选择一个课时开始学习
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
