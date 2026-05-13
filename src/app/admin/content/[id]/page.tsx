'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminContentPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id;
  const [course, setCourse] = useState<any>(null);
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSectionForm, setShowSectionForm] = useState(false);
  const [showMaterialForm, setShowMaterialForm] = useState<number | null>(null);
  const [sectionForm, setSectionForm] = useState({ title: '', sort_order: '' });
  const [materialForm, setMaterialForm] = useState({ title: '', type: 'video', duration: '', sort_order: '' });
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const loadData = () => {
    Promise.all([
      fetch(`/api/courses/${courseId}`).then(r => r.json()),
      fetch(`/api/courses/${courseId}/sections`).then(r => r.json()),
    ]).then(([courseData, sectionsData]) => {
      setCourse(courseData.course);
      setSections(sectionsData.sections || []);
      setLoading(false);
    });
  };

  useEffect(() => { loadData(); }, [courseId]);

  const handleAddSection = async () => {
    const res = await fetch(`/api/courses/${courseId}/sections`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: sectionForm.title, sort_order: sectionForm.sort_order ? Number(sectionForm.sort_order) : 0 }),
    });
    if (res.ok) {
      setShowSectionForm(false);
      setSectionForm({ title: '', sort_order: '' });
      loadData();
    }
  };

  const handleDeleteSection = async (sectionId: number) => {
    if (!confirm('删除章节将同时删除其下所有资料，确定？')) return;
    await fetch(`/api/sections/${sectionId}`, { method: 'DELETE' });
    loadData();
  };

  const handleAddMaterial = async (sectionId: number) => {
    if (!selectedFile) {
      alert('请先选择文件');
      return;
    }
    setUploading(true);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('courseId', courseId as string);

    const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
    if (!uploadRes.ok) {
      const err = await uploadRes.json();
      alert(err.error || '上传失败');
      setUploading(false);
      return;
    }
    const uploadData = await uploadRes.json();

    const res = await fetch(`/api/sections/${sectionId}/materials`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: materialForm.title || selectedFile.name,
        type: uploadData.type,
        file_path: uploadData.path,
        file_size: uploadData.size,
        duration: materialForm.duration || null,
        sort_order: materialForm.sort_order ? Number(materialForm.sort_order) : 0,
      }),
    });

    if (res.ok) {
      setShowMaterialForm(null);
      setMaterialForm({ title: '', type: 'video', duration: '', sort_order: '' });
      setSelectedFile(null);
      loadData();
    }
    setUploading(false);
  };

  const handleDeleteMaterial = async (materialId: number) => {
    if (!confirm('确定删除该资料？')) return;
    await fetch(`/api/materials/${materialId}`, { method: 'DELETE' });
    loadData();
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">加载中...</div>;
  if (!course) return <div className="min-h-screen flex items-center justify-center">课程不存在</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/admin/courses" className="text-blue-600 hover:text-blue-700 text-sm">← 返回课程管理</Link>
          <h1 className="text-2xl font-bold mt-2">内容管理：{course.title}</h1>
        </div>
        <button onClick={() => setShowSectionForm(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          + 添加章节
        </button>
      </div>

      {/* Add Section Modal */}
      {showSectionForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowSectionForm(false)}>
          <div className="bg-white rounded-xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4">添加章节</h2>
            <div className="space-y-3">
              <input placeholder="章节标题 *" value={sectionForm.title} onChange={e => setSectionForm({...sectionForm, title: e.target.value})}
                className="w-full border rounded-lg px-3 py-2" />
              <input placeholder="排序号（可选）" type="number" value={sectionForm.sort_order} onChange={e => setSectionForm({...sectionForm, sort_order: e.target.value})}
                className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={handleAddSection} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">添加</button>
              <button onClick={() => setShowSectionForm(false)} className="border px-6 py-2 rounded-lg hover:bg-gray-50">取消</button>
            </div>
          </div>
        </div>
      )}

      {/* Sections List */}
      {sections.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center text-gray-500">
          <p className="text-lg mb-2">暂无章节</p>
          <p className="text-sm">点击"添加章节"开始构建课程内容</p>
        </div>
      ) : (
        <div className="space-y-6">
          {sections.map((section: any, si: number) => (
            <div key={section.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-b">
                <h3 className="font-semibold text-lg">第{si + 1}章 {section.title}</h3>
                <div className="flex gap-2">
                  <button onClick={() => setShowMaterialForm(section.id)} className="text-sm text-blue-600 hover:text-blue-700">+ 添加资料</button>
                  <button onClick={() => handleDeleteSection(section.id)} className="text-sm text-red-600 hover:text-red-700">删除章节</button>
                </div>
              </div>

              {/* Add Material Form */}
              {showMaterialForm === section.id && (
                <div className="px-6 py-4 bg-blue-50 border-b">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input placeholder="资料标题（可选，留空用文件名）" value={materialForm.title} onChange={e => setMaterialForm({...materialForm, title: e.target.value})}
                      className="border rounded-lg px-3 py-2" />
                    <input placeholder="时长（如 10:30，可选）" value={materialForm.duration} onChange={e => setMaterialForm({...materialForm, duration: e.target.value})}
                      className="border rounded-lg px-3 py-2" />
                    <div>
                      <input type="file" accept="video/mp4,video/webm,application/pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
                        onChange={e => setSelectedFile(e.target.files?.[0] || null)}
                        className="w-full border rounded-lg px-3 py-2 text-sm" />
                    </div>
                    <div className="flex gap-2">
                      <input placeholder="排序号" type="number" value={materialForm.sort_order} onChange={e => setMaterialForm({...materialForm, sort_order: e.target.value})}
                        className="border rounded-lg px-3 py-2 w-24" />
                      <button onClick={() => handleAddMaterial(section.id)} disabled={uploading}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">
                        {uploading ? '上传中...' : '上传'}
                      </button>
                      <button onClick={() => { setShowMaterialForm(null); setSelectedFile(null); }} className="border px-4 py-2 rounded-lg hover:bg-gray-50">取消</button>
                    </div>
                  </div>
                </div>
              )}

              {/* Materials List */}
              {section.materials?.length > 0 ? (
                <div className="divide-y">
                  {section.materials.map((material: any) => (
                    <div key={material.id} className="flex items-center justify-between px-6 py-3">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{material.type === 'video' ? '🎬' : '📄'}</span>
                        <div>
                          <p className="font-medium text-sm">{material.title}</p>
                          <p className="text-xs text-gray-400">
                            {material.type === 'video' ? '视频' : '文档'}
                            {material.duration && ` · ${material.duration}`}
                            {material.file_size && ` · ${(material.file_size / 1024 / 1024).toFixed(1)}MB`}
                          </p>
                        </div>
                      </div>
                      <button onClick={() => handleDeleteMaterial(material.id)} className="text-red-600 hover:text-red-700 text-sm">删除</button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-6 py-8 text-center text-gray-400 text-sm">暂无资料，点击"添加资料"上传</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
