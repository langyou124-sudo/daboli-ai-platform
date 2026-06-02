// Static fallback data for Vercel serverless where SQLite doesn't persist
// Each cold start gets a fresh /tmp, so DB data is lost between function instances

export const FALLBACK_COURSES: Record<number, any> = {
  1: { id: 1, title: 'AI启蒙：认识人工智能', description: '通过趣味实验和互动游戏，让小学生建立对AI的直觉认知。', category: 'primary', grade_range: '小学3-6年级', hours: 16, price: 2800, status: 'published', sort_order: 0 },
  2: { id: 2, title: 'AI基础：Python编程入门', description: '理解AI基本概念，能用Python做简单项目，培养计算思维。', category: 'middle', grade_range: '初中1-3年级', hours: 32, price: 4800, status: 'published', sort_order: 0 },
  3: { id: 3, title: 'AI进阶：机器学习实战', description: '深入学习机器学习算法，独立完成AI项目开发。', category: 'high', grade_range: '高中1-3年级', hours: 32, price: 6800, status: 'published', sort_order: 0 },
  4: { id: 4, title: 'AI师资培训营', description: '面向在校信息技术教师的集中培训课程。', category: 'teacher', grade_range: '在职教师', hours: 24, price: 3600, status: 'published', sort_order: 0 },
  5: { id: 5, title: '暑期AI探索营地', description: '5-7天沉浸式AI体验营，动手搭建智能项目。', category: 'camp', grade_range: '小学4年级-初中', hours: 40, price: 5200, status: 'published', sort_order: 0 },
  6: { id: 6, title: '网络工程基础', description: '系统学习网络工程核心知识，涵盖网络基础、物理层与数据链路层、网络层、传输层、应用层等10大模块，共22个课题。', category: 'network', grade_range: '高中/大学', hours: 48, price: 0, status: 'published', sort_order: 99 },
};

export const FALLBACK_SECTIONS: Record<number, any[]> = {
  6: [
    { id: 101, course_id: 6, title: '网络基础', sort_order: 1, materials: [
      { id: 1001, section_id: 101, title: '计算机网络概述', type: 'document', file_path: '/course-content/network-engineering/topic-01.html', sort_order: 1 },
      { id: 1002, section_id: 101, title: 'OSI七层模型与TCP/IP四层模型', type: 'document', file_path: '/course-content/network-engineering/topic-02.html', sort_order: 2 },
      { id: 1003, section_id: 101, title: '数据封装与解封装', type: 'document', file_path: '/course-content/network-engineering/topic-03.html', sort_order: 3 },
      { id: 1004, section_id: 101, title: '网络拓扑结构', type: 'document', file_path: '/course-content/network-engineering/topic-04.html', sort_order: 4 },
    ]},
    { id: 102, course_id: 6, title: '物理层与数据链路层', sort_order: 2, materials: [
      { id: 1005, section_id: 102, title: '物理层传输介质', type: 'document', file_path: '/course-content/network-engineering/topic-05.html', sort_order: 1 },
      { id: 1006, section_id: 102, title: '以太网帧结构', type: 'document', file_path: '/course-content/network-engineering/topic-06.html', sort_order: 2 },
      { id: 1007, section_id: 102, title: 'MAC地址与ARP协议', type: 'document', file_path: '/course-content/network-engineering/topic-07.html', sort_order: 3 },
      { id: 1008, section_id: 102, title: 'VLAN与交换机工作原理', type: 'document', file_path: '/course-content/network-engineering/topic-08.html', sort_order: 4 },
    ]},
    { id: 103, course_id: 6, title: '网络层', sort_order: 3, materials: [
      { id: 1009, section_id: 103, title: 'IP地址与子网划分', type: 'document', file_path: '/course-content/network-engineering/topic-09.html', sort_order: 1 },
      { id: 1010, section_id: 103, title: 'CIDR与VLSM', type: 'document', file_path: '/course-content/network-engineering/topic-10.html', sort_order: 2 },
      { id: 1011, section_id: 103, title: 'IP数据包格式', type: 'document', file_path: '/course-content/network-engineering/topic-11.html', sort_order: 3 },
      { id: 1012, section_id: 103, title: 'ICMP协议', type: 'document', file_path: '/course-content/network-engineering/topic-12.html', sort_order: 4 },
      { id: 1013, section_id: 103, title: '路由基础与路由表', type: 'document', file_path: '/course-content/network-engineering/topic-13.html', sort_order: 5 },
    ]},
    { id: 104, course_id: 6, title: '传输层', sort_order: 4, materials: [
      { id: 1014, section_id: 104, title: 'TCP协议与三次握手', type: 'document', file_path: '/course-content/network-engineering/topic-14.html', sort_order: 1 },
      { id: 1015, section_id: 104, title: 'TCP流量控制与拥塞控制', type: 'document', file_path: '/course-content/network-engineering/topic-15.html', sort_order: 2 },
      { id: 1016, section_id: 104, title: 'UDP协议', type: 'document', file_path: '/course-content/network-engineering/topic-16.html', sort_order: 3 },
      { id: 1017, section_id: 104, title: '端口号与套接字', type: 'document', file_path: '/course-content/network-engineering/topic-17.html', sort_order: 4 },
    ]},
    { id: 105, course_id: 6, title: '应用层', sort_order: 5, materials: [
      { id: 1018, section_id: 105, title: 'DNS域名系统', type: 'document', file_path: '/course-content/network-engineering/topic-18.html', sort_order: 1 },
      { id: 1019, section_id: 105, title: 'HTTP/HTTPS协议', type: 'document', file_path: '/course-content/network-engineering/topic-19.html', sort_order: 2 },
      { id: 1020, section_id: 105, title: 'DHCP协议', type: 'document', file_path: '/course-content/network-engineering/topic-20.html', sort_order: 3 },
      { id: 1021, section_id: 105, title: 'FTP/TFTP文件传输', type: 'document', file_path: '/course-content/network-engineering/topic-21.html', sort_order: 4 },
      { id: 1022, section_id: 105, title: 'SMTP/POP3/IMAP邮件协议', type: 'document', file_path: '/course-content/network-engineering/topic-22.html', sort_order: 5 },
    ]},
  ],
};

export function getFallbackCourseDetail(id: number) {
  const course = FALLBACK_COURSES[id];
  if (!course) return null;
  const sections = FALLBACK_SECTIONS[id] || [];
  return { course, sections };
}
