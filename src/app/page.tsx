import Link from 'next/link';

const stats = [
  { number: '5', label: '课程模块' },
  { number: '150+', label: '课程课时' },
  { number: '40+', label: '章节内容' },
  { number: '100%', label: 'AI驱动开发' },
];

const advantages = [
  { icon: '🎓', title: '专业师资', desc: 'AI领域专家+教育行业资深教师，双师模式确保教学质量。' },
  { icon: '📚', title: '体系化课程', desc: '覆盖小学到高中的完整AI课程体系，分层教学，循序渐进。' },
  { icon: '🔧', title: '全套教具平台', desc: '配套教学平台、实验教具、编程环境，开箱即用。' },
  { icon: '🤝', title: '全程服务', desc: '从课程设计到师资培训，从课堂实施到效果评估，全程陪伴。' },
];

const courses = [
  { title: 'AI启蒙课程', target: '小学3-6年级', hours: '16课时/学期', color: 'bg-green-500' },
  { title: 'AI基础课程', target: '初中', hours: '32课时/学年', color: 'bg-blue-500' },
  { title: 'AI进阶课程', target: '高中', hours: '32课时/学年', color: 'bg-purple-500' },
  { title: '师资培训', target: '在职教师', hours: '24课时', color: 'bg-orange-500' },
];

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero-gradient text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center animate-fade-in-up">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">让每一所学校都开得起AI课</h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              产教融合 · AI基础教育一站式解决方案<br />
              专业师资 + 体系化课程 + 全套教具平台
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors">
                预约免费示范课
              </Link>
              <Link href="/courses" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg text-lg font-medium transition-colors">
                了解课程方案
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl md:text-5xl font-bold stat-number mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advantages */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">为什么选择达博理</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">我们是学校的AI课程外包服务商，解决学校缺师资、缺课程、缺平台的三大难题</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {advantages.map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-sm card-hover">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Course Overview */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">课程体系</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">覆盖小学到高中的完整AI教育方案，分层教学，因材施教</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.map((course, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden card-hover">
                <div className={`${course.color} h-2`} />
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.title}</h3>
                  <p className="text-sm text-gray-600 mb-1">适用：{course.target}</p>
                  <p className="text-sm text-gray-600 mb-4">课时：{course.hours}</p>
                  <Link href="/courses" className="text-blue-600 text-sm font-medium hover:text-blue-700">
                    了解详情 →
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/courses" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">
              查看全部课程
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">准备好为您的学校引入AI课程了吗？</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">预约一次免费示范课，让您的学生亲身体验AI的魅力</p>
          <Link href="/contact" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors">
            立即预约
          </Link>
        </div>
      </section>
    </div>
  );
}
