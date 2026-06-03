import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NotificationBell from './NotificationBell';
import { UserService } from '../../services/store';

interface SidebarItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  badge?: number;
}

const AdminSidebar: React.FC = () => {
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState<any>(null);

  useEffect(() => {
    const user = UserService.getAdminUser();
    setAdminUser(user);
  }, []);

  const menuItems: SidebarItem[] = [
    { id: 'overview', label: 'نظرة عامة', icon: '📊', path: '/admin/dashboard' },
    { id: 'users', label: 'إدارة المستخدمين', icon: '👥', path: '/admin/users' },
    { id: 'services', label: 'إدارة الخدمات', icon: '🎯', path: '/admin/services' },
    { id: 'orders', label: 'إدارة الطلبات', icon: '📋', path: '/admin/orders' },
    { id: 'wallets', label: 'المحافظ والمعاملات', icon: '💰', path: '/admin/wallets' },
    { id: 'disputes', label: 'النزاعات', icon: '⚖️', path: '/admin/disputes', badge: 3 },
    { id: 'categories', label: 'التصنيفات', icon: '📁', path: '/admin/categories' },
    { id: 'settings', label: 'الإعدادات', icon: '⚙️', path: '/admin/settings' },
    { id: 'reports', label: 'التقارير', icon: '📈', path: '/admin/reports' },
  ];

  const [activeItem, setActiveItem] = useState('overview');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = () => {
    UserService.logout();
    navigate('/admin/login');
  };

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 w-12 h-12 bg-secondary text-white rounded-xl shadow-lg flex items-center justify-center"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar */}
      <aside className={`fixed right-0 top-0 h-full w-72 bg-secondary text-white z-40 transform transition-transform lg:translate-x-0 ${isMobileOpen ? 'translate-x-0' : 'translate-x-full'} lg:block`}>
        {/* Logo & Notification */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <svg width="40" height="40" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="44" height="44" rx="12" fill="#FF6B00"/>
              <path d="M12 32C12 24.268 18.268 18 26 18C28.209 18 30.322 18.598 32.142 19.651L30 22H34C34.552 22 35 22.448 35 23V32C35 32.552 34.552 33 34 33H20C19.448 33 19 32.552 19 32V28H22V32C22 32.265 22.105 32.52 22.293 32.707C22.48 32.895 22.735 33 23 33H31C31.265 33 31.52 32.895 31.707 32.707C31.895 32.52 32 32.265 32 32V25.172C31.142 24.118 29.876 23.408 28.5 23.167C27.124 22.926 25.712 23.076 24.43 23.6C23.148 24.124 22.051 25 21.284 26.184C20.517 27.368 20.119 28.8 20.142 30.264C20.165 31.728 20.608 33.148 21.414 34.328C22.22 35.508 23.349 36.393 24.66 36.87C25.971 37.347 27.404 37.393 28.767 36.999C30.13 36.605 31.362 35.789 32.315 34.658C33.268 33.527 33.897 32.133 34.128 30.635C34.359 29.137 34.182 27.6 33.616 26.206L35 24V23C35 22.448 34.552 22 34 22H30L31.858 19.651C30.322 18.598 28.209 18 26 18C18.268 18 12 24.268 12 32Z" fill="white"/>
              <circle cx="26" cy="32" r="5" fill="white"/>
            </svg>
            <div>
              <span className="text-lg font-bold text-white">Netvision</span>
              <p className="text-xs text-primary">لوحة التحكم</p>
            </div>
          </Link>
          <NotificationBell />
        </div>

        {/* Admin Info */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-lg font-bold">{adminUser?.name?.charAt(0) || 'م'}</span>
            </div>
            <div>
              <p className="font-medium">{adminUser?.name || 'مدير النظام'}</p>
              <p className="text-xs text-white/60">مشرف رئيسي</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 overflow-y-auto h-[calc(100vh-200px)]">
          <ul className="space-y-2">
            {menuItems.map(item => (
              <li key={item.id}>
                <Link
                  to={item.path}
                  onClick={() => { setActiveItem(item.id); setIsMobileOpen(false); }}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                    activeItem === item.id
                      ? 'bg-primary text-white'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/20 text-red-300 hover:bg-red-500 hover:text-white rounded-xl transition-all"
          >
            <span>🚪</span>
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
};

export default AdminSidebar;