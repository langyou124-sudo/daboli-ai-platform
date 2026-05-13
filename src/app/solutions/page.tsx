import Link from 'next/link';

const steps = [
  { icon: '🏫', title: '样板校示范', desc: '选择1-2所学校免费或低价做示范课，全程记录教学效果和学生反馈。' },
  { icon: '📋', title: '案例包装', desc: '产出专业案例PPT和宣传视频，用真实数据展示教学成果。' },
  { icon: '📢', title: '区域推广', desc: '通过样板校口碑和教育系统渠道，向更多学校推广AI课程方案。' },
  { icon: '🚀', title: '批量复制', desc: '标准化课程交付流程，培训兼职讲师团队，实现规模化服务。' },
];

const resources = [
  { title: '教学平台', desc: '基于百度AI Studio/讯飞开放平台，或自建轻量教学平台，支持在线编程和AI实验。', icon: '💻' },
  { title: '教具包', desc: '树莓派/Arduino套件、传感器模块、摄像头模组，让学生动手搭建AI项目。', icon: '🔧' },
  { title: '自编教材', desc: '配套讲义和视频教程，逐步形成自有知识产权，持续迭代更新。', icon: '📖' },
];

const flowSteps = [
  { step: '01', title: '需求沟通', desc: '了解学校需求、学生情况、硬件条件' },
  { step: '02', title: '方案定制', desc: '根据学校实际情况制定个性化课程方案' },
  { step: '03', title: '示范课', desc: '安排资深教师进校开展示范课体验' },
  { step: '04', title: '签约合作', desc: '确定合作方案，签订服务合同' },
  { step: '05', title: '持续服务', desc: '定期教学反馈、课程更新、师资支持' },
];

export default function SolutionsPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">解决方案</h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">从样板校到区域推广，从课程交付到持续服务，我们提供完整的AI教育进校解决方案</p>
        </div>
      </section>

      {/* Service Model */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">进校服务模式</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <div key={i} className="relative">
                <div className="bg-white p-6 rounded-xl shadow-sm text-center card-hover">
                  <div className="text-5xl mb-4">{step.icon}</div>
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.desc}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 text-2xl text-gray-300">→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Resources */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4">配套资源</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">我们不仅提供课程内容，更提供完整的教学基础设施</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {resources.map((res, i) => (
              <div key={i} className="text-center p-8 border border-gray-200 rounded-xl card-hover">
                <div className="text-5xl mb-4">{res.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{res.title}</h3>
                <p className="text-gray-600">{res.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cooperation Flow */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">合作流程</h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            {flowSteps.map((step, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="bg-white p-4 rounded-xl shadow-sm text-center w-48 card-hover">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{step.step}</div>
                  <h3 className="font-semibold mb-1">{step.title}</h3>
                  <p className="text-gray-600 text-xs">{step.desc}</p>
                </div>
                {i < flowSteps.length - 1 && <span className="text-2xl text-gray-300 hidden md:block">→</span>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">想了解更多合作细节？</h2>
          <p className="text-blue-100 mb-8">联系我们，获取专属的AI课程进校方案</p>
          <Link href="/contact" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors">
            立即咨询
          </Link>
        </div>
      </section>
    </div>
  );
}
