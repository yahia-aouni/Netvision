import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserService, initializeData } from '../services/store';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'buyer' | 'seller'>('buyer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Initialize data on mount
  useEffect(() => {
    initializeData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }

    // Check if email already exists
    const users = UserService.getAll();
    if (users.find(u => u.email === email)) {
      setError('هذا البريد الإلكتروني مسجل بالفعل');
      return;
    }

    setLoading(true);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Create new user
    const newUser = UserService.create({
      name,
      email,
      phone,
      password,
      role,
      // Sellers must be approved by admin first
      status: role === 'seller' ? 'pending' : 'active',
      balance: 0,
      rating: 0,
      reviewsCount: 0,
      completedOrders: 0,
    });

    // For sellers, show message that they're pending approval
    if (role === 'seller') {
      alert('تم إنشاء حسابك بنجاح! \nيرجى انتظار موافقة الإدارة لتفعيل حسابك.');
    }

    // Auto login after registration
    UserService.login(email, password);

    setLoading(false);
    navigate(role === 'seller' ? '/dashboard' : '/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">N</span>
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Netvision
            </span>
          </Link>
        </div>

        {/* Register Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">إنشاء حساب جديد</h1>
            <p className="text-gray-500 mt-2">انضم إلى مجتمع Netvision اليوم</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">الاسم الكامل</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="محمد أحمد"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0555123456"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">كلمة المرور</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                required
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">تأكيد كلمة المرور</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                required
              />
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">أريد أن:</label>
              <div className="grid grid-cols-2 gap-3">
                <label
                  className={`flex flex-col items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    role === 'buyer'
                      ? 'border-primary bg-orange-50 text-primary'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    checked={role === 'buyer'}
                    onChange={() => setRole('buyer')}
                    className="sr-only"
                  />
                  <span className="text-2xl mb-2">🛒</span>
                  <span className="text-sm font-medium">أشتري خدمات</span>
                </label>
                <label
                  className={`flex flex-col items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    role === 'seller'
                      ? 'border-primary bg-orange-50 text-primary'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    checked={role === 'seller'}
                    onChange={() => setRole('seller')}
                    className="sr-only"
                  />
                  <span className="text-2xl mb-2">💼</span>
                  <span className="text-sm font-medium">أبيع خدمات</span>
                </label>
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                className="w-4 h-4 mt-1 rounded border-gray-300 text-primary focus:ring-primary"
                required
              />
              <label htmlFor="terms" className="text-sm text-gray-500">
                أوافق على{' '}
                <a href="#" className="text-primary hover:underline">شروط الاستخدام</a>
                {' '}و{' '}
                <a href="#" className="text-primary hover:underline">سياسة الخصوصية</a>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>جاري إنشاء الحساب...</span>
                </>
              ) : (
                'إنشاء حساب'
              )}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-gray-500 mt-6">
            لديك حساب؟{' '}
            <Link to="/login" className="text-primary font-medium hover:underline">
              سجل دخولك
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;