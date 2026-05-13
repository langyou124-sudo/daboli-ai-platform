import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">达</div>
              <span className="text-xl font-bold text-white">达博理科技</span>
            </div>
            <p className="text-sm">专注AI基础教育，让每一所学校都开得起AI课。</p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">课程体系</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/courses" className="hover:text-white transition-colors">AI启蒙课程</Link></li>
              <li><Link href="/courses" className="hover:text-white transition-colors">AI基础课程</Link></li>
              <li><Link href="/courses" className="hover:text-white transition-colors">AI进阶课程</Link></li>
              <li><Link href="/courses" className="hover:text-white transition-colors">师资培训</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">服务支持</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/solutions" className="hover:text-white transition-colors">解决方案</Link></li>
              <li><Link href="/cases" className="hover:text-white transition-colors">案例展示</Link></li>
              <li><Link href="/news" className="hover:text-white transition-colors">新闻动态</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">联系我们</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">联系方式</h3>
            <ul className="space-y-2 text-sm">
              <li>地址：云南省昆明市</li>
              <li>邮箱：contact@zhiyi-tech.com</li>
              <li>微信公众号：达博理科技</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} 达博理教育科技有限公司 版权所有</p>
        </div>
      </div>
    </footer>
  );
}
