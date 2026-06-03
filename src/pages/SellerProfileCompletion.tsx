import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PortfolioUploader from '../components/PortfolioUploader';
import { UserService, ServiceService } from '../services/store';

const categories = [
  { id: '1', name: 'التصميم الجرافيكي', icon: '🎨' },
  { id: '2', name: 'التعليق الصوتي', icon: '🎙️' },
  { id: '3', name: 'إدارة مواقع التواصل الاجتماعي', icon: '📱' },
  { id: '4', name: 'إنشاء العروض التقديمية', icon: '📊' },
  { id: '5', name: 'إنشاء المنصات الإلكترونية', icon: '🌐' },
];

const SellerProfileCompletion: React.FC = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Profile data
  const [bio, setBio] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');

  // Services/Pricing data
  const [services, setServices] = useState<any[]>([]);

  // Portfolio
  const [portfolioItems, setPortfolioItems] = useState<{ type: 'image' | 'audio'; url: string; title: string }[]>([]);

  useEffect(() => {
    const user = UserService.getCurrentUser();
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'seller') {
      navigate('/dashboard');
      return;
    }
    setCurrentUser(user);

    // Load existing data if any
    if (user.bio) setBio(user.bio);
    if (user.skills) setSkills(user.skills);
    if (user.portfolio) setPortfolioItems(user.portfolio);
    if (user.selectedCategories) setSelectedCategories(user.selectedCategories);

    // Load existing services
    const userServices = ServiceService.getBySeller(user.id);
    setServices(userServices);
  }, [navigate]);

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills(prev => [...prev, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(prev => prev.filter(s => s !== skill));
  };

  const handleAddService = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    const newService = {
      id: `temp-${Date.now()}`,
      title: '',
      description: '',
      category: category?.name || '',
      sellerId: currentUser?.id,
      price: { basic: 0, standard: 0, premium: 0 },
      deliveryTime: { basic: 1, standard: 3, premium: 7 },
      rating: 0,
      reviewsCount: 0,
      image: '',
      status: 'pending' as const,
      features: { basic: [], standard: [], premium: [] },
      createdAt: new Date().toISOString(),
    };
    setServices(prev => [...prev, newService]);
  };

  const handleServiceChange = (index: number, field: string, value: any) => {
    setServices(prev => {
      const updated = [...prev];
      if (field.startsWith('price.')) {
        const priceField = field.split('.')[1];
        updated[index] = {
          ...updated[index],
          price: { ...updated[index].price, [priceField]: parseInt(value) || 0 }
        };
      } else {
        updated[index] = { ...updated[index], [field]: value };
      }
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Update user profile
      UserService.update(currentUser.id, {
        bio,
        skills,
        portfolio: portfolioItems,
        selectedCategories,
        status: 'pending', // Set to pending for admin approval
      });

      // Save services
      services.forEach(service => {
        if (service.title && service.price.basic > 0) {
          const existing = ServiceService.getById(service.id);
          if (existing) {
            ServiceService.update(service.id, service);
          } else {
            ServiceService.create(service);
          }
        }
      });

      alert('تم حفظ ملفك الشخصي بنجاح! سيتم مراجعته من قبل الإدارة.');
      navigate('/dashboard');
    } catch (error) {
      alert('حدث خطأ أثناء الحفظ');
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg width="48" height="48" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 32C12 24.268 18.268 18 26 18C28.209 18 30.322 18.598 32.142 19.651L30 22H34C34.552 22 35 22.448 35 23V32C35 32.552 34.552 33 34 33H20C19.448 33 19 32.552 19 32V28H22V32C22 32.265 22.105 32.52 22.293 32.707C22.48 32.895 22.735 33 23 33H31C31.265 33 31.52 32.895 31.707 32.707C31.895 32.52 32 32.265 32 32V25.172C31.142 24.118 29.876 23.408 28.5 23.167C27.124 22.926 25.712 23.076 24.43 23.6C23.148 24.124 22.051 25 21.284 26.184C20.517 27.368 20.119 28.8 20.142 30.264C20.165 31.728 20.608 33.148 21.414 34.328C22.22 35.508 23.349 36.393 24.66 36.87C25.971 37.347 27.404 37.393 28.767 36.999C30.13 36.605 31.362 35.789 32.315 34.658C33.268 33.527 33.897 32.133 34.128 30.635C34.359 29.137 34.182 27.6 33.616 26.206L35 24V23C35 22.448 34.552 22 34 22H30L31.858 19.651C30.322 18.598 28.209 18 26 18C18.268 18 12 24.268 12 32Z" fill="white"/>
              <circle cx="26" cy="32" r="5" fill="white"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">إكمال الملف الشخصي</h1>
          <p className="text-gray-500 mt-2">أكمل ملفك لبدء بيع خدماتك على Netvision</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                step >= s ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {s}
              </div>
              {s < 3 && (
                <div className={`w-20 h-1 mx-2 ${step > s ? 'bg-primary' : 'bg-gray-200'}`}></div>
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">المعلومات الأساسية</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">نبذة عنك</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  placeholder="اكتب نبذة مختصرة عن نفسك وخبراتك..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">الخدمات التي تقدمها</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {categories.map(cat => (
                    <label
                      key={cat.id}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedCategories.includes(cat.id)
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-primary/50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat.id)}
                        onChange={() => handleCategoryToggle(cat.id)}
                        className="sr-only"
                      />
                      <span className="text-2xl">{cat.icon}</span>
                      <span className="font-medium">{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">المهارات</label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                    placeholder="أضف مهارة..."
                    className="flex-1 px-4 py-2 rounded-xl border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-4 py-2 bg-primary text-white rounded-xl"
                  >
                    إضافة
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.map(skill => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full flex items-center gap-2"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full py-3 bg-primary text-white rounded-xl font-medium"
              >
                التالي ←
              </button>
            </div>
          )}

          {/* Step 2: Services & Pricing */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">الخدمات والأسعار</h2>

              {selectedCategories.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>اختر الخدمات أولاً في الخطوة السابقة</p>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="mt-4 text-primary hover:underline"
                  >
                    العودة للخطوة السابقة
                  </button>
                </div>
              ) : (
                <>
                  {selectedCategories.map(catId => {
                    const category = categories.find(c => c.id === catId);
                    return (
                      <div key={catId} className="border border-gray-200 rounded-xl p-6">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                          <span>{category?.icon}</span>
                          {category?.name}
                        </h3>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">عنوان الخدمة</label>
                            <input
                              type="text"
                              placeholder="مثال: تصميم شعار احترافي"
                              className="w-full px-4 py-2 rounded-xl border border-gray-200"
                              value={services.find(s => s.category === category?.name)?.title || ''}
                              onChange={(e) => {
                                const idx = services.findIndex(s => s.category === category?.name);
                                if (idx >= 0) handleServiceChange(idx, 'title', e.target.value);
                                else handleAddService(catId);
                              }}
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">وصف الخدمة</label>
                            <textarea
                              rows={2}
                              placeholder="اشرح تفاصيل الخدمة..."
                              className="w-full px-4 py-2 rounded-xl border border-gray-200"
                              value={services.find(s => s.category === category?.name)?.description || ''}
                              onChange={(e) => {
                                const idx = services.findIndex(s => s.category === category?.name);
                                if (idx >= 0) handleServiceChange(idx, 'description', e.target.value);
                              }}
                            />
                          </div>

                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-600 mb-2">الباقة الأساسية</label>
                              <div className="relative">
                                <input
                                  type="number"
                                  placeholder="0"
                                  className="w-full px-4 py-2 rounded-xl border border-gray-200"
                                  value={services.find(s => s.category === category?.name)?.price.basic || ''}
                                  onChange={(e) => {
                                    const idx = services.findIndex(s => s.category === category?.name);
                                    if (idx >= 0) handleServiceChange(idx, 'price.basic', e.target.value);
                                  }}
                                />
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">دج</span>
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-600 mb-2">الباقة القياسية</label>
                              <div className="relative">
                                <input
                                  type="number"
                                  placeholder="0"
                                  className="w-full px-4 py-2 rounded-xl border border-gray-200"
                                  value={services.find(s => s.category === category?.name)?.price.standard || ''}
                                  onChange={(e) => {
                                    const idx = services.findIndex(s => s.category === category?.name);
                                    if (idx >= 0) handleServiceChange(idx, 'price.standard', e.target.value);
                                  }}
                                />
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">دج</span>
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-600 mb-2">الباقة الاحترافية</label>
                              <div className="relative">
                                <input
                                  type="number"
                                  placeholder="0"
                                  className="w-full px-4 py-2 rounded-xl border border-gray-200"
                                  value={services.find(s => s.category === category?.name)?.price.premium || ''}
                                  onChange={(e) => {
                                    const idx = services.findIndex(s => s.category === category?.name);
                                    if (idx >= 0) handleServiceChange(idx, 'price.premium', e.target.value);
                                  }}
                                />
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">دج</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 border border-gray-200 rounded-xl font-medium"
                >
                  السابق
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex-1 py-3 bg-primary text-white rounded-xl font-medium"
                >
                  التالي ←
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Portfolio & Review */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">المعرض والمراجعة</h2>

              <PortfolioUploader userId={currentUser?.id || ''} />

              {/* Review Summary */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-bold mb-4">ملخص الملف الشخصي</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">الاسم:</span>
                    <span className="font-medium">{currentUser?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">البريد:</span>
                    <span className="font-medium">{currentUser?.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">الخدمات:</span>
                    <span className="font-medium">{selectedCategories.length} خدمة</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">المهارات:</span>
                    <span className="font-medium">{skills.length} مهارة</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 py-3 border border-gray-200 rounded-xl font-medium"
                >
                  السابق
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 bg-primary text-white rounded-xl font-medium disabled:opacity-50"
                >
                  {loading ? 'جاري الحفظ...' : 'حفظ وإرسال للمراجعة'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default SellerProfileCompletion;