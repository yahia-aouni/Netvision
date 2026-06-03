import React from 'react';
import { Link } from 'react-router-dom';
const Navbar: React.FC = () => {
  return (
    <nav className="bg-secondary sticky top-0 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-3">
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="44" height="44" rx="12" fill="#FF6B00"/>
              <path d="M12 32C12 24.268 18.268 18 26 18C28.209 18 30.322 18.598 32.142 19.651L30 22H34C34.552 22 35 22.448 35 23V32C35 32.552 34.552 33 34 33H20C19.448 33 19 32.552 19 32V28H22V32C22 32.265 22.105 32.52 22.293 32.707C22.48 32.895 22.735 33 23 33H31C31.265 33 31.52 32.895 31.707 32.707C31.895 32.52 32 32.265 32 32V25.172C31.142 24.118 29.876 23.408 28.5 23.167C27.124 22.926 25.712 23.076 24.43 23.6C23.148 24.124 22.051 25 21.284 26.184C20.517 27.368 20.119 28.8 20.142 30.264C20.165 31.728 20.608 33.148 21.414 34.328C22.22 35.508 23.349 36.393 24.66 36.87C25.971 37.347 27.404 37.393 28.767 36.999C30.13 36.605 31.362 35.789 32.315 34.658C33.268 33.527 33.897 32.133 34.128 30.635C34.359 29.137 34.182 27.6 33.616 26.206L35 24V23C35 22.448 34.552 22 34 22H30L31.858 19.651C30.322 18.598 28.209 18 26 18C18.268 18 12 24.268 12 32Z" fill="white"/>
              <circle cx="26" cy="32" r="5" fill="white"/>
            </svg>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-white">Netvision</span>
              <span className="text-xs text-primary font-medium">منصة الخدمات المصغرة</span>
            </div>
          </Link>
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <input type="text" placeholder="ابحث عن خدمات..." className="w-full px-4 py-2 pr-10 border border-white/20 bg-white/10 text-white placeholder-white/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white focus:text-gray-800" />
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-white/80 hover:text-primary transition-colors">الرئيسية</Link>
            <Link to="/services" className="text-white/80 hover:text-primary transition-colors">الخدمات</Link>
            <Link to="/sellers" className="text-white/80 hover:text-primary transition-colors">المستقلون</Link>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Link to="/login" className="text-white hover:text-primary font-medium">تسجيل الدخول</Link>
            <Link to="/register" className="px-5 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors">إنشاء حساب</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;