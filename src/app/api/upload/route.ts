import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: '无权限' }, { status: 403 });
  }

  const formData = await req.formData();
  const file = formData.get('file') as File;
  const courseId = formData.get('courseId') as string;

  if (!file || !courseId) {
    return NextResponse.json({ error: '缺少文件或课程ID' }, { status: 400 });
  }

  const maxSize = file.type.startsWith('video/') ? 500 * 1024 * 1024 : 50 * 1024 * 1024;
  if (file.size > maxSize) {
    return NextResponse.json({ error: `文件大小超过限制（最大 ${maxSize / 1024 / 1024}MB）` }, { status: 400 });
  }

  const ext = path.extname(file.name);
  const allowedExts = ['.mp4', '.webm', '.pdf', '.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx'];
  if (!allowedExts.includes(ext.toLowerCase())) {
    return NextResponse.json({ error: '不支持的文件格式' }, { status: 400 });
  }

  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'courses', courseId);
  fs.mkdirSync(uploadDir, { recursive: true });

  const timestamp = Date.now();
  const safeName = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9._\-一-龥]/g, '_')}`;
  const filePath = path.join(uploadDir, safeName);

  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(filePath, buffer);

  const relativePath = `/uploads/courses/${courseId}/${safeName}`;
  const fileType = ['.mp4', '.webm'].includes(ext.toLowerCase()) ? 'video' : 'document';

  return NextResponse.json({
    path: relativePath,
    type: fileType,
    size: file.size,
    name: file.name,
  });
}
