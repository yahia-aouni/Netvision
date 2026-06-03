import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { UserService, ServiceService, OrderService } from '../services/store';

interface Seller {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'seller' | 'buyer';
  status: 'active' | 'suspended' | 'pending';
  balance: number;
  rating: number;
  reviewsCount: number;
  completedOrders: number;
  avatar?: string;
  bio?: string;
  skills?: string[];
  portfolio?: { type: 'image' | 'audio'; url: string; title: string }[];
  createdAt: string;
}

interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
  sellerId: string;
  price: { basic: number; standard: number; premium: number };
  deliveryTime: { basic: number; standard: number; premium: number };
  rating: number;
  reviewsCount: number;
  image: string;
  status: 'active' | 'pending' | 'rejected' | 'paused';
  features: { basic: string[]; standard: string[]; premium: string[] };
  createdAt: string;
}

const SellerProfile: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [seller, setSeller] = useState<Seller | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<'basic' | 'standard' | 'premium'>('standard');

  // Form state
  const [projectDescription, setProjectDescription] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [orderType, setOrderType] = useState<'normal' | 'professional'>('normal');

  useEffect(() => {
    const loadSeller = () => {
      const foundSeller = UserService.getById(id || '');
      if (foundSeller && foundSeller.role === 'seller') {
        setSeller(foundSeller as Seller);
        const sellerServices = ServiceService.getAll().filter(s => s.sellerId === id);
        setServices(sellerServices);
      }
      setIsLoading(false);
    };
    loadSeller();
  }, [id]);

  const handleOrder = (service: Service) => {
    setSelectedService(service);
    setShowOrderModal(true);
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !seller) return;

    const currentUser = UserService.getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const packageNames = { basic: 'الأساسية', standard: 'القياسية', premium: 'الاحترافية' };
    const price = selectedService.price[selectedPackage];
    const deliveryDays = selectedService.deliveryTime[selectedPackage];

    OrderService.create({
      serviceId: selectedService.id,
      sellerId: seller.id,
      buyerId: currentUser.id,
      package: selectedPackage,
      price: price,
      deliveryTime: deliveryDays,
      description: projectDescription,
      status: 'pending',
      serviceType: orderType,
    });

    alert('تم إرسال طلبك بنجاح!');
    setShowOrderModal(false);
    setProjectDescription('');
    setAttachments([]);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-96">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">المستقل غير موجود</h2>
          <button onClick={() => navigate('/sellers')} className="px-6 py-3 bg-primary text-white rounded-xl">
            العودة للمستقلين
          </button>
        </div>
      </div>
    );
  }

  const packageNames = { basic: 'الأساسية', standard: 'القياسية', premium: 'الاحترافية' };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Profile Header */}
      <div className="bg-gradient-to-br from-secondary to-secondary/80 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-32 h-32 rounded-full bg-primary flex items-center justify-center text-white text-4xl font-bold overflow-hidden border-4 border-white shadow-xl">
              {seller.avatar ? (
                <img src={seller.avatar} alt={seller.name} className="w-full h-full object-cover" />
              ) : (
                seller.name.charAt(0)
              )}
            </div>
            <div className="text-center md:text-right">
              <h1 className="text-4xl font-bold text-white mb-2">{seller.name}</h1>
              <p className="text-white/80 text-lg mb-4">مقدم خدمات مستقل</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <div className="bg-white/20 backdrop-blur px-4 py-2 rounded-xl">
                  <span className="text-yellow-400">★</span> {seller.rating} ({seller.reviewsCount} تقييم)
                </div>
                <div className="bg-white/20 backdrop-blur px-4 py-2 rounded-xl">
                  {seller.completedOrders} مشروع مكتمل
                </div>
                <div className="bg-white/20 backdrop-blur px-4 py-2 rounded-xl">
                  انضم {new Date(seller.createdAt).toLocaleDateString('ar-DZ')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio */}
            {seller.bio && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold mb-4">نبذة عني</h2>
                <p className="text-gray-600 leading-relaxed">{seller.bio}</p>
              </div>
            )}

            {/* Skills */}
            {seller.skills && seller.skills.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold mb-4">مهاراتي</h2>
                <div className="flex flex-wrap gap-3">
                  {seller.skills.map((skill, idx) => (
                    <span key={idx} className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Portfolio */}
            {seller.portfolio && seller.portfolio.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold mb-4">أعمالي</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {seller.portfolio.map((item, idx) => (
                    <div key={idx} className="relative group">
                      {item.type === 'image' ? (
                        <img src={item.url} alt={item.title} className="w-full h-40 object-cover rounded-xl" />
                      ) : (
                        <div className="w-full h-40 bg-gray-100 rounded-xl flex items-center justify-center">
                          <div className="text-center">
                            <span className="text-4xl">🎙️</span>
                            <p className="text-sm text-gray-500 mt-2">{item.title}</p>
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                        <span className="text-white font-medium">{item.title}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Services */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-6">خدماتي</h2>
              {services.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>لا توجد خدمات حالياً</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {services.map(service => (
                    <div key={service.id} className="border border-gray-200 rounded-xl p-4 hover:border-primary transition-colors">
                      <div className="flex gap-4">
                        <img src={service.image} alt={service.title} className="w-24 h-24 object-cover rounded-lg" />
                        <div className="flex-1">
                          <h3 className="font-bold mb-2">{service.title}</h3>
                          <p className="text-sm text-gray-500 mb-2 line-clamp-2">{service.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-yellow-500">★</span>
                              <span>{service.rating}</span>
                              <span className="text-gray-400">({service.reviewsCount})</span>
                            </div>
                            <div className="text-sm text-gray-500">
                              من <span className="font-bold text-primary">{service.price.basic} دج</span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleOrder(service)}
                          className="self-center px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark"
                        >
                          اطلب الآن
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold mb-4">تواصل معي</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-xl">📧</span>
                  <span className="text-gray-600">{seller.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xl">📱</span>
                  <span className="text-gray-600">{seller.phone}</span>
                </div>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold mb-4">إحصائياتي</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">المشاريع المكتملة</span>
                  <span className="font-bold text-primary">{seller.completedOrders}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">متوسط التقييم</span>
                  <span className="font-bold text-yellow-500">{seller.rating} ★</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">إجمالي المراجعات</span>
                  <span className="font-bold">{seller.reviewsCount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Modal */}
      {showOrderModal && selectedService && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowOrderModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-secondary to-secondary/90 p-6 text-white">
              <h2 className="text-2xl font-bold">إرسال طلب</h2>
              <p className="text-white/80">{selectedService.title}</p>
            </div>

            <form onSubmit={handleSubmitOrder} className="p-6 space-y-6">
              {/* Package Selection */}
              <div>
                <label className="block text-sm font-medium mb-3">اختر الباقة</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['basic', 'standard', 'premium'] as const).map(pkg => (
                    <label
                      key={pkg}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedPackage === pkg
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-primary/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="package"
                        checked={selectedPackage === pkg}
                        onChange={() => setSelectedPackage(pkg)}
                        className="hidden"
                      />
                      <div className="text-center">
                        <p className="font-bold mb-1">{packageNames[pkg]}</p>
                        <p className="text-xl font-bold text-primary">{selectedService.price[pkg]} دج</p>
                        <p className="text-sm text-gray-500 mt-1">{selectedService.deliveryTime[pkg]} أيام</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Order Type */}
              <div>
                <label className="block text-sm font-medium mb-3">نوع الطلب</label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${orderType === 'normal' ? 'border-primary bg-primary/5' : 'border-gray-200'}`}>
                    <input type="radio" name="orderType" checked={orderType === 'normal'} onChange={() => setOrderType('normal')} className="hidden" />
                    <div className="text-center">
                      <span className="text-2xl mb-2 block">📋</span>
                      <p className="font-medium">عادي</p>
                      <p className="text-sm text-gray-500">طلب قياسي</p>
                    </div>
                  </label>
                  <label className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${orderType === 'professional' ? 'border-primary bg-primary/5' : 'border-gray-200'}`}>
                    <input type="radio" name="orderType" checked={orderType === 'professional'} onChange={() => setOrderType('professional')} className="hidden" />
                    <div className="text-center">
                      <span className="text-2xl mb-2 block">⭐</span>
                      <p className="font-medium">احترافي</p>
                      <p className="text-sm text-gray-500">دعم مميز + متابعة</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Project Description */}
              <div>
                <label className="block text-sm font-medium mb-2">وصف المشروع</label>
                <textarea
                  value={projectDescription}
                  onChange={e => setProjectDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="اشرح تفاصيل مشروعك..."
                  required
                />
              </div>

              {/* File Attachments */}
              <div>
                <label className="block text-sm font-medium mb-2">المرفقات (اختياري)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-primary transition-colors">
                  <input
                    type="file"
                    multiple
                    onChange={e => setAttachments(Array.from(e.target.files || []))}
                    className="hidden"
                    id="file-upload"
                    accept="image/*,audio/*,.pdf,.doc,.docx"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <span className="text-4xl mb-2 block">📎</span>
                    <p className="text-gray-600">اضغط لرفع الملفات</p>
                    <p className="text-sm text-gray-400 mt-1">صور، ملفات صوتية، PDF، Word</p>
                  </label>
                  {attachments.length > 0 && (
                    <div className="mt-4 text-sm text-gray-600">
                      {attachments.length} ملف محدد
                    </div>
                  )}
                </div>
              </div>

              {/* Summary */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex justify-between mb-2">
                  <span>الباقة</span>
                  <span className="font-medium">{packageNames[selectedPackage]}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>مدة التسليم</span>
                  <span className="font-medium">{selectedService.deliveryTime[selectedPackage]} أيام</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="font-bold">المجموع</span>
                  <span className="text-2xl font-bold text-primary">{selectedService.price[selectedPackage]} دج</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowOrderModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark"
                >
                  إرسال الطلب
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default SellerProfile;
