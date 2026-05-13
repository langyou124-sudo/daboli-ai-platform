'use client';

import { useState } from 'react';

export default function NewsPage() {
  const [activeCategory, setActiveCategory] = useState('all');

  const news = [
    {
      id: 1,
      title: '教育部发布《关于加强中小学人工智能教育的通知》',
      category: 'policy',
      date: '2024年12月',
      summary: '教育部明确要求在中小学阶段加强人工智能教育，提出到2030年前在中小学基本普及人工智能教育。通知鼓励有条件的学校在课后服务中开设AI相关课程，支持学校与社会机构合作引入优质教学资源。',
      featured: true,
      source: '教育部官网',
    },
    {
      id: 2,
      title: '国务院《新一代人工智能发展规划》持续推进落地',
      category: 'policy',
      date: '持续推进',
      summary: '国务院此前印发的《新一代人工智能发展规划》明确提出在中小学阶段设置人工智能相关课程，逐步推广编程教育。各地正陆续出台配套实施方案，云南省也在积极推进中小学AI教育进校园工作。',
      featured: true,
      source: '国务院',
    },
    {
      id: 3,
      title: '全国青少年人工智能创新大赛持续举办',
      category: 'industry',
      date: '年度赛事',
      summary: '由中国科协主办的全国青少年人工智能创新大赛是国内最具影响力的青少年AI赛事之一，涵盖AI创意、机器人、编程等多个赛道，为中小学生提供展示AI学习成果的舞台。',
      source: '中国科协',
    },
    {
      id: 4,
      title: '云南省推进中小学信息技术教育改革',
      category: 'policy',
      date: '持续推进',
      summary: '云南省教育厅持续推动中小学信息技术课程改革，鼓励各地探索人工智能、编程等新兴科技教育，支持学校利用课后服务时间开展科技创新类活动。',
      source: '云南省教育厅',
    },
    {
      id: 5,
      title: '百度AI Studio教育版向中小学免费开放',
      category: 'industry',
      date: '持续服务',
      summary: '百度AI Studio教育版面向中小学提供免费的在线编程环境和GPU算力支持，学生可在浏览器中直接编写Python代码并训练AI模型，大幅降低了学校开展AI教学的技术门槛。',
      source: '百度',
    },
    {
      id: 6,
      title: '达博理科技启动"AI进校园"合作计划',
      category: 'company',
      date: '2026年',
      summary: '达博理科技正式启动面向昆明市中小学的"AI进校园"合作计划，为合作学校提供完整的AI课程体系、在线学习平台和师资培训服务，助力学校AI教育落地。',
    },
    {
      id: 7,
      title: '达博理AI课程体系完成1.0版本开发',
      category: 'company',
      date: '2025年',
      summary: '覆盖小学3年级至高中3年级的完整AI课程体系已完成开发，包含AI启蒙、AI基础、AI进阶、师资培训、暑期营地5大模块，共计150+课时。课程遵循"动手为主、理论为辅"的设计原则。',
    },
  ];

  const categories = [
    { key: 'all', label: '全部' },
    { key: 'company', label: '公司动态' },
    { key: 'industry', label: '行业资讯' },
    { key: 'policy', label: '政策解读' },
  ];

  const categoryLabel: Record<string, string> = {
    company: '公司动态',
    industry: '行业资讯',
    policy: '政策解读',
  };

  const filtered = activeCategory === 'all' ? news : news.filter(n => n.category === activeCategory);
  const featured = filtered.filter(n => n.featured);
  const regular = filtered.filter(n => !n.featured);

  return (
    <div className="bg-gray-50 min-h-screen">
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">新闻动态</h1>
          <p className="text-blue-100 text-lg">了解AI教育最新资讯和政策动向</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Filter */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Featured News */}
        {featured.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {featured.map(n => (
              <article key={n.id} className="bg-white rounded-xl shadow-sm overflow-hidden card-hover">
                <div className="bg-gradient-to-br from-blue-500 to-blue-700 h-2"></div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">
                      {categoryLabel[n.category]}
                    </span>
                    <span className="text-sm text-gray-500">{n.date}</span>
                    {n.featured && <span className="text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-700">重要</span>}
                    {n.source && <span className="text-xs text-gray-400">来源：{n.source}</span>}
                  </div>
                  <h2 className="text-lg font-bold text-gray-900 mb-3">{n.title}</h2>
                  <p className="text-gray-600 text-sm leading-relaxed">{n.summary}</p>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Regular News */}
        <div className="space-y-4">
          {regular.map(n => (
            <article key={n.id} className="bg-white rounded-xl shadow-sm p-6 card-hover">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  n.category === 'company' ? 'bg-green-100 text-green-700' :
                  n.category === 'policy' ? 'bg-purple-100 text-purple-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {categoryLabel[n.category]}
                </span>
                <span className="text-sm text-gray-500">{n.date}</span>
                {n.source && <span className="text-xs text-gray-400">来源：{n.source}</span>}
              </div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">{n.title}</h2>
              <p className="text-gray-600 text-sm">{n.summary}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
