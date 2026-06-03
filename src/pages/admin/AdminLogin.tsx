import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserService, initializeData } from '../../services/store';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Check if already logged in as admin
  useEffect(() => {
    initializeData();
    const admin = UserService.getAdminUser();
    if (admin) {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const admin = UserService.adminLogin(email, password);

    if (admin) {
      navigate('/admin/dashboard');
    } else {
      setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <span className="text-3xl font-bold text-white">N</span>
            </div>
            <div className="text-right">
              <span className="text-3xl font-bold text-white">Netvision</span>
              <p className="text-purple-300 text-sm">لوحة التحكم</p>
            </div>
          </Link>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex items-center gap-3 mb-6 p-4 bg-purple-50 rounded-xl">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-xl">🔐</span>
            </div>
            <div>
              <p className="font-medium text-purple-900">تسجيل دخول المشرف</p>
              <p className="text-sm text-purple-600">للوصول إلى لوحة التحكم</p>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@netvision.dz"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">كلمة المرور</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                <span className="text-sm text-gray-500">تذكرني</span>
              </label>
              <a href="#" className="text-sm text-purple-600 hover:text-purple-700">نسيت كلمة المرور؟</a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold py-4 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  جاري التحقق...
                </>
              ) : (
                <>
                  <span>🔐</span>
                  تسجيل الدخول
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <p className="text-sm text-amber-800 text-center">
              <span className="font-medium">ملاحظة:</span> بيانات الدخول التجريبية:
            </p>
            <div className="mt-2 text-center space-y-1">
              <p className="text-sm"><strong>البريد:</strong> admin@netvision.dz</p>
              <p className="text-sm"><strong>كلمة المرور:</strong> admin123</p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link to="/" className="text-sm text-gray-500 hover:text-primary">
              ← العودة للصفحة الرئيسية
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-purple-300 text-sm mt-6">
          © 2024 Netvision. جميع الحقوق محفوظة.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;