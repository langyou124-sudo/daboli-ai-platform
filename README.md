# 达博理科技 - AI基础教育平台

一个面向中小学的产教融合AI教育SaaS平台，由小米MiMo大模型驱动开发。

## 项目概述

**达博理教育科技有限公司**专注于AI基础教育进校服务，通过此平台为学校提供：
- 完整的AI课程体系（小学启蒙→初中基础→高中进阶→师资培训→暑期营地）
- 在线学习系统（视频播放、文档浏览、进度追踪）
- 课程管理系统（章节管理、文件上传、订单处理）

## 技术架构

| 层级 | 技术栈 |
|------|--------|
| 前端 | Next.js 16 + Tailwind CSS + TypeScript |
| 后端 | Next.js API Routes + JWT认证 |
| 数据库 | SQLite (better-sqlite3) |
| 认证 | JWT + bcryptjs |
| AI辅助 | 小米MiMo V2.5 Pro / MiMo V2 Pro |

## 功能模块

### 前台（7个页面）
- **首页** - Hero展示、数据统计、课程预览、CTA
- **课程体系** - 分类筛选、课程卡片、详情页、购买流程
- **课程概况** - 公开大纲 + 付费提示（未付费用户）
- **课程学习** - 视频播放器 + PDF阅读器 + 进度追踪（付费用户）
- **解决方案** - 进校服务模式、配套资源、合作流程
- **关于我们** - 公司简介、团队、合作伙伴
- **联系我们** - 咨询表单

### 后台管理（5个页面）
- **仪表盘** - 用户数、课程数、订单数、收入统计
- **课程管理** - CRUD + 内容管理入口
- **内容管理** - 章节创建 + 视频/文档上传
- **订单管理** - 订单确认、退款
- **用户管理** - 用户列表、角色设置

### API系统（16个端点）
```
认证: /api/auth/(login|register|logout|me)
课程: /api/courses, /api/courses/[id], /api/courses/[id]/learn
章节: /api/courses/[id]/sections, /api/sections/[id]
资料: /api/sections/[id]/materials, /api/materials/[id]
订单: /api/orders, /api/orders/[id]
用户: /api/admin/users
管理: /api/admin/stats, /api/admin/contacts/[id]
上传: /api/upload
进度: /api/progress
联系: /api/contacts
```

### 数据库（8张表）
- `users` - 用户表（含角色管理）
- `courses` - 课程表
- `course_sections` - 课程章节
- `course_materials` - 课程资料（视频/文档）
- `orders` - 订单表
- `user_progress` - 学习进度
- `contacts` - 咨询表
- `news` - 新闻表

## 快速开始

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建生产版本
npm run build

# 启动生产服务
npm start
```

访问 http://localhost:3000

### 测试账号
- 管理员：admin / admin123
- 用户：通过注册页面创建

## AI辅助开发说明

本项目完全由小米MiMo大模型（通过Claude Code + OpenClaw平台）驱动开发，包括：
- 需求分析与架构设计
- 全部代码编写（前端+后端+数据库）
- UI设计与实现
- API设计与实现
- 调试与优化

AI辅助开发显著提升了开发效率，将传统需要2-4周的开发周期压缩到数小时。

## 商业模式

- **目标市场**：云南省昆明市中小学
- **核心价值**：做学校的"AI课程外包服务商"
- **收入模式**：按学期收费（课程费用）
- **进校路径**：样板校→案例包装→区域推广→批量复制

## 项目结构

```
zhiyi-web/
├── src/
│   ├── app/           # Next.js App Router页面
│   │   ├── api/       # API路由（16个端点）
│   │   ├── admin/     # 后台管理页面
│   │   └── (pages)/   # 前台页面
│   ├── components/    # 共享组件
│   └── lib/           # 工具库（数据库、认证）
├── public/            # 静态资源
├── data/              # SQLite数据库
└── README.md
```

## License

Copyright (c) 2026 达博理教育科技有限公司
