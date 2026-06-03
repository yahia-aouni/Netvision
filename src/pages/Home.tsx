import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ServiceCard from '../components/ServiceCard';
import { services, categories, stats } from '../data/mockData';
import RoleSelectionModal from '../components/RoleSelectionModal';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [hasSeenModal, setHasSeenModal] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem('netvision_modal_seen');
    if (!seen) {
      setTimeout(() => setShowModal(true), 500);
    }
  }, []);

  const handleRoleSelect = (role: 'buyer' | 'seller' | 'admin') => {
    localStorage.setItem('netvision_modal_seen', 'true');
    setShowModal(false);
    setHasSeenModal(true);

    if (role === 'admin') {
      navigate('/admin/login');
    } else if (role === 'seller') {
      navigate('/register?role=seller');
    } else {
      navigate('/register?role=buyer');
    }
  };

  return (
    <div className="min-h-screen">
      <RoleSelectionModal
        isOpen={showModal}
        onClose={() => {
          localStorage.setItem('netvision_modal_seen', 'true');
          setShowModal(false);
        }}
        onSelect={handleRoleSelect}
      />

      <section className="bg-gradient-to-br from-primary/10 via-white to-secondary/10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-2xl">N</span>
              </div>
              <span className="text-3xl font-bold gradient-text">Netvision</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">اكتشف أفضل <span className="gradient-text">الخدمات الرقمية</span><br />في مكان واحد</h1>
            <p className="text-lg text-text-secondary mb-8">منصة Netvision تربطك بأفضل المحترفين لإنجاز مشاريعك بسرعة وسهولة</p>

            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <button onClick={() => handleRoleSelect('buyer')} className="btn-primary px-8 py-3 text-lg">
                🛒 أنا صاحب مشروع
              </button>
              <button onClick={() => handleRoleSelect('seller')} className="btn-secondary px-8 py-3 text-lg">
                💼 أنا مستقل
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-4 max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-2">
                <input type="text" placeholder="ما الذي تبحث عنه؟" className="flex-1 px-4 py-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20" />
                <select className="px-4 py-4 rounded-xl border border-gray-200 bg-gray-50">
                  <option>جميع التصنيفات</option>
                  {categories.map(c => <option key={c.id}>{c.name}</option>)}
                </select>
                <button onClick={() => navigate('/services')} className="btn-primary px-8">بحث</button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center p-6 bg-white rounded-xl shadow-sm card-hover">
              <div className="text-4xl font-bold gradient-text mb-2">{stats.totalServices.toLocaleString()}+</div>
              <p className="text-text-secondary font-medium">خدمة متاحة</p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-sm card-hover">
              <div className="text-4xl font-bold gradient-text mb-2">{stats.totalSellers.toLocaleString()}+</div>
              <p className="text-text-secondary font-medium">بائع محترف</p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-sm card-hover">
              <div className="text-4xl font-bold gradient-text mb-2">{stats.totalOrders.toLocaleString()}+</div>
              <p className="text-text-secondary font-medium">معاملة ناجحة</p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-sm card-hover">
              <div className="text-4xl font-bold gradient-text mb-2">{stats.satisfactionRate}%</div>
              <p className="text-text-secondary font-medium">نسبة الرضا</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">تصفح حسب التصنيف</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {categories.map(c => (
              <Link key={c.id} to="/services" className="group p-4 rounded-xl text-center hover:bg-primary/5 hover:scale-105 transition-all">
                <div className="text-4xl mb-3">{c.icon}</div>
                <p className="text-sm font-medium group-hover:text-primary">{c.name}</p>
                <p className="text-xs text-gray-400">{c.count} خدمة</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold">خدمات مميزة</h2>
              <p className="text-gray-500 mt-2">اختر من أفضل الخدمات المعروضة</p>
            </div>
            <Link to="/services" className="btn-outline">عرض الكل</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.slice(0,6).map(s => <ServiceCard key={s.id} service={s} />)}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-primary to-secondary text-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">كيف تعمل المنصة؟</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white/10 rounded-2xl backdrop-blur-sm">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 text-primary text-3xl font-bold">1</div>
              <h3 className="text-xl font-bold mb-3">ابحث عن الخدمة</h3>
              <p className="text-white/80">تصفح الخدمات أو استخدم البحث للعثور على ما تحتاجه</p>
            </div>
            <div className="text-center p-8 bg-white/10 rounded-2xl backdrop-blur-sm">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 text-secondary text-3xl font-bold">2</div>
              <h3 className="text-xl font-bold mb-3">تواصل مع البائع</h3>
              <p className="text-white/80">ناقش التفاصيل ومتطلباتك مع البائع قبل الطلب</p>
            </div>
            <div className="text-center p-8 bg-white/10 rounded-2xl backdrop-blur-sm">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 text-green-500 text-3xl font-bold">3</div>
              <h3 className="text-xl font-bold mb-3">استلم عملك</h3>
              <p className="text-white/80">تابع طلبك واستلم عملك في الوقت المحدد</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">أفضل البائعين</h2>
          <p className="text-gray-500 mb-8">محترفون موثوقون حصلوا على تقييمات عالية</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {n:'أحمد محمد', a:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop', r:4.9, o:312, s:'تصميم الشعارات'},
              {n:'سارة أحمد', a:'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop', r:4.8, o:234, s:'تطوير الويب'},
              {n:'محمد علي', a:'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop', r:4.7, o:198, s:'الترجمة'},
            ].map((s,i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-6 text-center card-hover">
                <img src={s.a} alt={s.n} className="w-20 h-20 rounded-full mx-auto mb-4 ring-4 ring-primary/20" />
                <h3 className="font-bold text-lg mb-1">{s.n}</h3>
                <p className="text-sm text-secondary mb-2">{s.s}</p>
                <div className="flex justify-center items-center gap-1 text-yellow-500 mb-2">
                  <span className="text-xl">★</span>
                  <span className="font-bold">{s.r}</span>
                  <span className="text-gray-400 text-sm">({s.o} تقييم)</span>
                </div>
                <p className="text-sm text-gray-500">{s.o} مشروع مكتمل</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-gradient-to-r from-primary to-secondary rounded-3xl p-8 md:p-16 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">هل لديك مهارة تعرضها؟</h2>
            <p className="text-lg text-white/80 mb-8">انضم كـ بائع في Netvision وابدأ بكسب المال من مهاراتك</p>
            <button onClick={() => handleRoleSelect('seller')} className="inline-block bg-white text-primary font-bold py-4 px-8 rounded-xl hover:bg-gray-100 transition-colors">
              سجّل الآن كمحترف
            </button>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="text-xl font-bold mb-4">طرق الدفع المتاحة</h3>
          <p className="text-gray-500 mb-6">ادفع بسهولة وأمان عبر بطاقتك البريدية</p>
          <div className="flex justify-center items-center gap-4">
            <div className="flex items-center gap-3 bg-gradient-to-r from-yellow-400 to-orange-500 px-6 py-4 rounded-xl text-white">
              <div className="text-2xl font-bold">BM</div>
              <div>
                <p className="font-bold">Baridimob</p>
                <p className="text-sm opacity-80">CIB • BNA • CCP</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;