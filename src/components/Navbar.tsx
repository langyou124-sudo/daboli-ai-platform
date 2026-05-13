'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/', label: '首页' },
  { href: '/courses', label: '课程体系' },
  { href: '/solutions', label: '解决方案' },
  { href: '/cases', label: '案例展示' },
  { href: '/about', label: '关于我们' },
  { href: '/news', label: '新闻动态' },
  { href: '/contact', label: '联系我们' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.ok ? r.json() : null).then(d => d && setUser(d.user)).catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    window.location.href = '/';
  };

  // Don't show navbar on admin pages
  if (pathname.startsWith('/admin')) return null;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">达</div>
              <span className="text-xl font-bold text-blue-600">达博理科技</span>
            </Link>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium">{user.username[0]}</div>
                  {user.username}
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link href="/user" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setUserMenuOpen(false)}>个人中心</Link>
                    {user.role === 'admin' && (
                      <Link href="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setUserMenuOpen(false)}>管理后台</Link>
                    )}
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">退出登录</button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className="text-sm text-gray-700 hover:text-blue-600 font-medium">登录</Link>
                <Link href="/register" className="text-sm bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">注册</Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} className={`block px-3 py-2 rounded-md text-sm ${pathname === link.href ? 'text-blue-600 bg-blue-50' : 'text-gray-700'}`} onClick={() => setMenuOpen(false)}>
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link href="/user" className="block px-3 py-2 text-sm text-gray-700" onClick={() => setMenuOpen(false)}>个人中心</Link>
                {user.role === 'admin' && <Link href="/admin" className="block px-3 py-2 text-sm text-gray-700" onClick={() => setMenuOpen(false)}>管理后台</Link>}
                <button onClick={handleLogout} className="block w-full text-left px-3 py-2 text-sm text-gray-700">退出登录</button>
              </>
            ) : (
              <div className="flex gap-3 px-3 py-2">
                <Link href="/login" className="text-sm text-gray-700" onClick={() => setMenuOpen(false)}>登录</Link>
                <Link href="/register" className="text-sm bg-blue-600 text-white px-4 py-2 rounded-md" onClick={() => setMenuOpen(false)}>注册</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
