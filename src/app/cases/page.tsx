export default function CasesPage() {
  const courseModules = [
    {
      type: 'AI启蒙课程',
      target: '小学3-6年级',
      hours: 16,
      students: '每班30-40人',
      description: '通过趣味实验和互动游戏，让小学生建立对AI的直觉认知。课程涵盖图像识别、语音助手、AI绘画等日常AI应用的体验与探索。',
      highlights: [
        '动手时间占70%以上，避免枯燥理论',
        '无需学生注册外部账号，保障信息安全',
        '每节课有可见产出（作品/演示）',
        '期末成果展示，家长可参与观摩',
      ],
      projects: ['图像识别体验', '语音助手探秘', 'AI绘画创作', '智能垃圾分类助手'],
    },
    {
      type: 'AI基础课程',
      target: '初中1-3年级',
      hours: 32,
      students: '每班30-40人',
      description: '从零学习Python编程，理解AI基本概念，通过实际项目培养计算思维。使用在线编程平台，避免学校机房环境配置问题。',
      highlights: [
        '使用AI Studio等在线平台，无需本地安装',
        '基础版和进阶版两套任务，适应不同水平学生',
        '调用真实AI API，体验前沿技术',
        '对接信息学竞赛基础知识',
      ],
      projects: ['Python基础项目', '数据可视化', 'AI API调用', '智能聊天机器人'],
    },
    {
      type: 'AI进阶课程',
      target: '高中1-3年级',
      hours: 32,
      students: '每班30-40人',
      description: '深入学习机器学习算法，独立完成AI项目开发。对接全国青少年科技创新大赛、NOC等赛事，为自主招生做准备。',
      highlights: [
        '覆盖监督学习、深度学习、强化学习',
        '云平台免费GPU，解决学校算力不足问题',
        '竞赛选题与方案设计辅导',
        '完整AI项目开发全流程实战',
      ],
      projects: ['图像分类模型', '自然语言处理', '强化学习游戏AI', '竞赛项目开发'],
    },
    {
      type: '师资培训',
      target: '在职信息技术教师',
      hours: 24,
      students: '每期15-20人',
      description: '帮助学校现有信息技术老师具备基础AI教学能力。培训后提供持续支持（微信群答疑、季度回访），确保老师能独立授课。',
      highlights: [
        '2-3天集中培训，配合学校教学安排',
        '可发放培训证书（与高校或行业协会联名）',
        '提供完整教学资源包（课件、教案、素材）',
        '持续社群支持，非一次性培训',
      ],
      projects: ['AI政策解读', '教学方法实操', '平台工具使用', '评价体系设计'],
    },
  ];

  const advantages = [
    {
      icon: '📋',
      title: '课程对标课标',
      desc: '所有课程内容对标教育部《中小学人工智能教育指南》要求设计',
    },
    {
      icon: '🔒',
      title: '安全合规',
      desc: '严格遵守《个人信息保护法》，小学生课程无需注册外部账号',
    },
    {
      icon: '👨‍🏫',
      title: '师资赋能',
      desc: '不是替代老师，而是帮助老师掌握AI教学能力，实现校本化落地',
    },
    {
      icon: '💰',
      title: '成本可控',
      desc: '按学期收费，无硬件采购要求，使用免费在线平台降低学校负担',
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">课程方案</h1>
          <p className="text-blue-100 text-lg">覆盖小学至高中的完整AI课程体系</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Course Modules */}
        <div className="space-y-12">
          {courseModules.map((m, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="md:flex">
                <div className="md:w-2/5 bg-gradient-to-br from-blue-500 to-blue-700 text-white p-8 flex flex-col justify-center">
                  <span className="text-xs bg-white/20 px-3 py-1 rounded-full w-fit mb-4">{m.type}</span>
                  <h2 className="text-2xl font-bold mb-2">{m.type}</h2>
                  <p className="text-blue-100 mb-6">适用对象：{m.target}</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold">{m.hours}</div>
                      <div className="text-xs text-blue-200">课时</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold">{m.students}</div>
                      <div className="text-xs text-blue-200">班额</div>
                    </div>
                  </div>
                </div>
                <div className="md:w-3/5 p-8">
                  <p className="text-gray-700 leading-relaxed mb-6">{m.description}</p>
                  <h3 className="font-semibold text-gray-900 mb-3">课程特色</h3>
                  <ul className="space-y-2 mb-6">
                    {m.highlights.map((h, hi) => (
                      <li key={hi} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-green-500 mt-0.5">✓</span>
                        {h}
                      </li>
                    ))}
                  </ul>
                  <h3 className="font-semibold text-gray-900 mb-3">代表性项目</h3>
                  <div className="flex flex-wrap gap-2">
                    {m.projects.map((p, pi) => (
                      <span key={pi} className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full">{p}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Why Choose Us */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-center mb-10">为什么选择达博理</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {advantages.map((a, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm p-6 text-center card-hover">
                <div className="text-4xl mb-4">{a.icon}</div>
                <h3 className="font-semibold mb-2">{a.title}</h3>
                <p className="text-sm text-gray-600">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 bg-blue-600 rounded-2xl p-10 text-center text-white">
          <h2 className="text-2xl font-bold mb-3">想了解更详细的课程方案？</h2>
          <p className="text-blue-100 mb-6">联系我们获取完整课程大纲和报价方案</p>
          <a href="/contact" className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors">
            索取方案
          </a>
        </div>
      </div>
    </div>
  );
}
