import { createClient, Client } from '@libsql/client';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

// Vercel: use /tmp (ephemeral but writable). Local: use project data/ dir
const isVercel = !!process.env.VERCEL;
const dataDir = isVercel ? '/tmp' : path.join(process.cwd(), 'data');
if (!isVercel && !fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Create client: local file for dev, Turso cloud for production
const client: Client = createClient({
  url: process.env.TURSO_DATABASE_URL || `file:${path.join(dataDir, 'daboli.db')}`,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// Compatibility layer: wrap @libsql/client to match better-sqlite3's .prepare() API
// Key difference: all methods return Promises (callers must use await)
function prepare(sql: string) {
  return {
    run: async (...args: any[]) => {
      const result = await client.execute({ sql, args: args.filter(a => a !== undefined) });
      return {
        changes: result.rowsAffected,
        lastInsertRowid: result.lastInsertRowid != null ? Number(result.lastInsertRowid) : undefined,
      };
    },
    get: async (...args: any[]) => {
      const result = await client.execute({ sql, args: args.filter(a => a !== undefined) });
      return result.rows[0] || undefined;
    },
    all: async (...args: any[]) => {
      const result = await client.execute({ sql, args: args.filter(a => a !== undefined) });
      return result.rows;
    },
  };
}

// Execute multiple SQL statements (for schema creation)
async function exec(sql: string) {
  const statements = sql.split(';').map(s => s.trim()).filter(s => s.length > 0);
  for (const stmt of statements) {
    try {
      await client.execute({ sql: stmt, args: [] });
    } catch {}
  }
}

// Export db object
const db = {
  prepare: (sql: string) => prepare(sql),
  exec: async (sql: string) => exec(sql),
};

// Initialize schema
await db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user' CHECK(role IN ('user', 'admin')),
    phone TEXT,
    school TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    content TEXT,
    category TEXT NOT NULL CHECK(category IN ('primary', 'middle', 'high', 'teacher', 'camp')),
    grade_range TEXT,
    hours INTEGER,
    price REAL DEFAULT 0,
    cover_image TEXT,
    status TEXT DEFAULT 'draft' CHECK(status IN ('draft', 'published', 'archived')),
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    amount REAL NOT NULL,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'paid', 'cancelled', 'refunded')),
    payment_method TEXT,
    paid_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (course_id) REFERENCES courses(id)
  );

  CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    school_name TEXT NOT NULL,
    contact_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    message TEXT,
    status TEXT DEFAULT 'new' CHECK(status IN ('new', 'contacted', 'closed')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS news (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    summary TEXT,
    content TEXT,
    cover_image TEXT,
    category TEXT DEFAULT 'company' CHECK(category IN ('company', 'industry', 'policy')),
    status TEXT DEFAULT 'draft' CHECK(status IN ('draft', 'published')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS course_sections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS course_materials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    section_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('video', 'document')),
    file_path TEXT NOT NULL,
    file_size INTEGER,
    duration TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (section_id) REFERENCES course_sections(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS user_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    material_id INTEGER NOT NULL,
    completed INTEGER DEFAULT 0,
    last_position REAL DEFAULT 0,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, material_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (material_id) REFERENCES course_materials(id)
  );
`);

// Seed data
async function seedData() {
  try {
    const admin = await db.prepare('SELECT id FROM users WHERE role = ?').get('admin');
    if (!admin) {
      const hashedPassword = bcrypt.hashSync('admin123', 10);
      await db.prepare(
        'INSERT OR IGNORE INTO users (username, email, password, role) VALUES (?, ?, ?, ?)'
      ).run('admin', 'admin@daboli.com', hashedPassword, 'admin');
    }
  } catch {}

  try {
    const courseCount = await db.prepare('SELECT COUNT(*) as count FROM courses').get() as any;
    if (courseCount && Number(courseCount.count) === 0) {
      const sampleCourses = [
        {
          title: 'AI启蒙：认识人工智能',
          description: '通过趣味实验和互动游戏，让小学生建立对AI的直觉认知。课程涵盖图像识别、语音助手等日常AI应用的体验与探索。设计原则：动手为主、理论为辅、每节课有可见产出。',
          category: 'primary', grade_range: '小学3-6年级', hours: 16, price: 2800,
          sections: ['AI是什么？——从身边的AI说起','让电脑"看见"——图像识别初体验','让电脑"听见"——语音助手探秘','AI画画——创意图像生成','AI与游戏——智能小游戏设计','AI在身边——日常生活中的AI应用','动手项目：智能垃圾分类助手','学期成果展示与总结'],
        },
        {
          title: 'AI基础：Python编程入门',
          description: '理解AI基本概念，能用Python做简单项目，培养计算思维。建议使用在线平台（AI Studio、Replit）避免本地环境配置问题。',
          category: 'middle', grade_range: '初中1-3年级', hours: 32, price: 4800,
          sections: ['编程思维启蒙与Python初识','Python基础语法：变量与数据类型','控制流：条件判断与循环','函数与模块化编程','数据处理入门：列表与字典','数据可视化：用图表说话','AI概念：什么是机器学习','动手项目：简单的数据分类器','调用AI API：让程序更智能','项目实战：智能聊天机器人','期末项目开发与展示','竞赛入门与进阶学习路径'],
        },
        {
          title: 'AI进阶：机器学习实战',
          description: '深入学习机器学习算法，独立完成AI项目开发。对接信息学竞赛和科创比赛，为自主招生做准备。',
          category: 'high', grade_range: '高中1-3年级', hours: 32, price: 6800,
          sections: ['机器学习核心概念与数学基础','监督学习：回归与分类算法','无监督学习：聚类与降维','深度学习入门：神经网络原理','CNN卷积神经网络与图像识别','RNN/LSTM与自然语言处理','强化学习基础','AI项目全流程：数据→训练→部署','竞赛实战：选题与方案设计','竞赛实战：模型训练与优化','期末项目：完整AI应用开发','自主招生准备与学习路径规划'],
        },
        {
          title: 'AI师资培训营',
          description: '面向在校信息技术教师的集中培训课程（16-24课时），帮助老师掌握AI教学能力。培训后提供持续支持。',
          category: 'teacher', grade_range: '在职教师', hours: 24, price: 3600,
          sections: ['AI教育政策解读与课程标准对标','AI核心概念速览（非技术背景友好）','小学段AI教学方法与案例','初中段Python教学设计与实操','高中段机器学习教学资源与工具','课堂管理：学生水平差异应对策略','评价体系设计与教学成果展示','持续支持机制与教学社群建设'],
        },
        {
          title: '暑期AI探索营地',
          description: '5-7天沉浸式AI体验营（40课时），动手搭建智能项目，激发科技创新兴趣。含食宿和保险。',
          category: 'camp', grade_range: '小学4年级-初中', hours: 40, price: 5200,
          sections: ['开营仪式与AI世界初探','创意编程：用代码画画','AI视觉：图像识别挑战赛','AI听觉：语音交互项目','智能硬件：动手搭建AI小车','团队协作：AI应用创意工坊','结营展示与成果汇报'],
        },
      ];

      for (const course of sampleCourses) {
        const result = await db.prepare(
          'INSERT INTO courses (title, description, category, grade_range, hours, price, status) VALUES (?, ?, ?, ?, ?, ?, ?)'
        ).run(course.title, course.description, course.category, course.grade_range, course.hours, course.price, 'published');
        const courseId = result.lastInsertRowid as number;
        if (course.sections && courseId) {
          for (let i = 0; i < course.sections.length; i++) {
            await db.prepare('INSERT INTO course_sections (course_id, title, sort_order) VALUES (?, ?, ?)').run(courseId, course.sections[i], i + 1);
          }
        }
      }

      // Network engineering course with materials
      const netEngSections = [
        { title: '网络基础', topics: ['topic-01','topic-02','topic-03','topic-04'], titles: ['计算机网络概述','OSI七层模型与TCP/IP四层模型','数据封装与解封装','网络拓扑结构'] },
        { title: '物理层与数据链路层', topics: ['topic-05','topic-06','topic-07','topic-08'], titles: ['物理层传输介质','以太网帧结构','MAC地址与ARP协议','VLAN与交换机工作原理'] },
        { title: '网络层', topics: ['topic-09','topic-10','topic-11','topic-12','topic-13'], titles: ['IP地址与子网划分','CIDR与VLSM','IP数据包格式','ICMP协议','路由基础与路由表'] },
        { title: '传输层', topics: ['topic-14','topic-15','topic-16','topic-17'], titles: ['TCP协议与三次握手','TCP流量控制与拥塞控制','UDP协议','端口号与套接字'] },
        { title: '应用层', topics: ['topic-18','topic-19','topic-20','topic-21','topic-22'], titles: ['DNS域名系统','HTTP/HTTPS协议','DHCP协议','FTP/TFTP文件传输','SMTP/POP3/IMAP邮件协议'] },
      ];
      const netEngResult = await db.prepare(
        "INSERT INTO courses (title, description, category, grade_range, hours, price, status, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
      ).run('网络工程基础', '系统学习网络工程核心知识，涵盖网络基础、物理层与数据链路层、网络层、传输层、应用层等10大模块，共22个课题。', 'network', '高中/大学', 48, 0, 'published', 99);
      const netEngId = netEngResult.lastInsertRowid as number;
      if (netEngId) {
        for (let si = 0; si < netEngSections.length; si++) {
          const sec = netEngSections[si];
          const secResult = await db.prepare('INSERT INTO course_sections (course_id, title, sort_order) VALUES (?, ?, ?)').run(netEngId, sec.title, si + 1);
          const secId = secResult.lastInsertRowid as number;
          for (let mi = 0; mi < sec.topics.length; mi++) {
            await db.prepare('INSERT INTO course_materials (section_id, title, type, file_path, sort_order) VALUES (?, ?, ?, ?, ?)').run(secId, sec.titles[mi], 'document', `/course-content/network-engineering/${sec.topics[mi]}.html`, mi + 1);
          }
        }
      }
    }
  } catch {}
}

await seedData();

export default db;
