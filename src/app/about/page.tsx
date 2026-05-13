export default function AboutPage() {
  const milestones = [
    { date: '2025年9月', event: '公司成立', detail: '达博理教育科技有限公司在昆明注册成立，确立"AI课程外包服务商"定位' },
    { date: '2025年10月', event: '课程体系1.0完成', detail: '完成覆盖小学至高中的完整AI课程体系设计，含5大课程模块' },
    { date: '2025年12月', event: '在线学习平台上线', detail: '自研SaaS平台上线，支持视频教学、文档浏览、进度追踪等功能' },
    { date: '2026年2月', event: '首批合作校签约', detail: '与昆明市3所中小学签署合作协议，启动AI示范课程' },
    { date: '2026年3月', event: '首期师资培训完成', detail: '12名参训教师全部通过考核，具备独立授课能力' },
    { date: '2026年4月', event: '产学研合作落地', detail: '与昆明理工大学信息学院达成共建"AI基础教育研究中心"合作' },
  ];

  const team = [
    {
      name: '创始团队',
      role: 'CEO · 产品方向',
      desc: '10年科技行业经验，深信AI教育是未来刚需。从技术岗位转型教育创业，致力于用技术降低教育门槛。',
      highlights: ['产品规划', '商务拓展', '融资对接'],
    },
    {
      name: '教研团队',
      role: '课程总监 · 教学设计',
      desc: '计算机科学硕士，5年K12教育经验。主导课程体系设计，确保内容符合课标要求且学生爱学。',
      highlights: ['课程设计', '教材编写', '教师培训'],
    },
    {
      name: '技术团队',
      role: 'CTO · 平台开发',
      desc: '全栈工程师，专注教育科技产品开发。主导在线学习平台的架构设计与功能迭代。',
      highlights: ['平台架构', 'AI工具集成', '数据分析'],
    },
  ];

  const partners = [
    {
      name: '昆明理工大学信息学院',
      type: '教研合作',
      detail: '共建AI基础教育研究中心，提供教研支持、师资培训资源',
    },
    {
      name: '云南大学软件学院',
      type: '人才合作',
      detail: '联合培养AI教育方向实习生，为公司输送教研人才',
    },
    {
      name: '云南师范大学',
      type: '教育研究',
      detail: '合作开展中小学AI教育效果评估研究',
    },
    {
      name: '百度AI Studio',
      type: '技术合作',
      detail: '教育版平台作为初高中课程的在线编程与AI训练环境',
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">关于我们</h1>
          <p className="text-blue-100 text-lg">专注AI基础教育，赋能每一所学校</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Company Intro */}
        <section className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">公司简介</h2>
              <p className="text-gray-600 mb-4">
                <strong>达博理教育科技有限公司</strong>成立于2025年，是一家专注于AI基础教育的科技公司，注册地为云南省昆明市。
              </p>
              <p className="text-gray-600 mb-4">
                我们响应国家《中小学人工智能教育指南》政策号召，以"产教融合"为核心理念，做学校的<strong>"AI课程外包服务商"</strong>——帮助学校解决AI教育中缺师资、缺课程、缺平台的三大难题。
              </p>
              <p className="text-gray-600 mb-4">
                我们的课程体系覆盖<strong>小学3年级至高中3年级</strong>，分启蒙、基础、进阶三个层次，并配套师资培训和暑期营地服务。所有课程均按照"动手为主、理论为辅、每节课有可见产出"的原则设计。
              </p>
              <p className="text-gray-600">
                从昆明起步，服务云南，辐射西南。我们相信，每一所学校都应该有能力开设AI课程，每一个学生都有机会接触和学习人工智能。
              </p>
            </div>
            <div className="bg-blue-50 p-8 rounded-2xl">
              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm shrink-0">1</div>
                  <div>
                    <h4 className="font-semibold">使命</h4>
                    <p className="text-sm text-gray-600">让每一所学校都开得起AI课</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm shrink-0">2</div>
                  <div>
                    <h4 className="font-semibold">愿景</h4>
                    <p className="text-sm text-gray-600">成为西南地区最专业的K12-AI教育服务商</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm shrink-0">3</div>
                  <div>
                    <h4 className="font-semibold">价值观</h4>
                    <p className="text-sm text-gray-600">专业、务实、创新、共赢</p>
                  </div>
                </div>
                <div className="border-t pt-4 mt-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">2025</div>
                      <div className="text-xs text-gray-500">成立年份</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600">昆明</div>
                      <div className="text-xs text-gray-500">总部所在地</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">发展历程</h2>
          <div className="max-w-3xl mx-auto">
            {milestones.map((m, i) => (
              <div key={i} className="flex gap-6 mb-8 last:mb-0">
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 bg-blue-600 rounded-full shrink-0"></div>
                  {i < milestones.length - 1 && <div className="w-0.5 bg-blue-200 flex-1 mt-1"></div>}
                </div>
                <div className="pb-8">
                  <div className="text-xs text-blue-600 font-medium mb-1">{m.date}</div>
                  <h3 className="font-semibold text-gray-900 mb-1">{m.event}</h3>
                  <p className="text-sm text-gray-600">{m.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-4">核心团队</h2>
          <p className="text-gray-600 text-center mb-12">技术+教育+市场的复合型团队</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {team.map((member, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-sm card-hover">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-xl font-bold">
                  {member.name.charAt(0)}
                </div>
                <h3 className="font-semibold text-lg text-center">{member.name}</h3>
                <p className="text-blue-600 text-sm text-center mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm mb-4">{member.desc}</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {member.highlights.map((h, hi) => (
                    <span key={hi} className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">{h}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Partners */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-4">合作伙伴</h2>
          <p className="text-gray-600 text-center mb-12">与高校、科技企业建立深度合作</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {partners.map((p, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-sm flex gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-xl">{p.type === '教研合作' ? '🔬' : p.type === '人才合作' ? '🎓' : p.type === '教育研究' ? '📊' : '💻'}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{p.name}</h3>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{p.type}</span>
                  </div>
                  <p className="text-sm text-gray-600">{p.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
