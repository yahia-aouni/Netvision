import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { services } from '../data/mockData';
import ServiceRequestModal from '../components/ServiceRequestModal';
import { ServiceService } from '../services/store';

const ServiceDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState<'basic' | 'standard' | 'premium'>('standard');
  const [showRequestModal, setShowRequestModal] = useState(false);

  // Get service data
  const serviceData = services.find(s => s.id === id);
  const storeService = ServiceService.getById(id || '');

  const service = storeService || serviceData;

  if (!service) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">الخدمة غير موجودة</h2>
        <button onClick={() => navigate('/services')} className="btn-primary mt-4">
          تصفح الخدمات
        </button>
      </div>
    );
  }

  const pkgNames = { basic: 'الأساسية', standard: 'القياسية', premium: 'الاحترافية' };

  // Get seller info
  const sellerInfo = serviceData?.seller || {
    id: service.sellerId,
    name: 'مستقل محترف',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    completedOrders: 150,
    rating: 4.8,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm">
          <a href="/" className="text-gray-500 hover:text-primary transition-colors">الرئيسية</a>
          <span className="text-gray-300">/</span>
          <a href="/services" className="text-gray-500 hover:text-primary transition-colors">الخدمات</a>
          <span className="text-gray-300">/</span>
          <span className="text-primary font-medium">{service.category}</span>
        </nav>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Service Image */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
              <img
                src={service.image || 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=400&fit=crop'}
                alt={service.title}
                className="w-full aspect-video object-cover"
              />
            </div>

            {/* Seller Info Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <img
                  src={sellerInfo.avatar}
                  alt={sellerInfo.name}
                  className="w-16 h-16 rounded-full border-2 border-primary"
                />
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900">{service.title}</h1>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="font-medium">{sellerInfo.name}</span>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="font-bold">{service.rating}</span>
                      <span className="text-gray-400 text-sm">({service.reviewsCount} تقييم)</span>
                    </div>
                  </div>
                </div>
                <div className="hidden md:block">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    متاح للطلب
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span>📋</span>
                وصف الخدمة
              </h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">{service.description}</p>
            </div>

            {/* Packages */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span>📦</span>
                الباقات المتاحة
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {(['basic', 'standard', 'premium'] as const).map(pkg => (
                  <div
                    key={pkg}
                    className={`p-6 rounded-2xl border-2 transition-all cursor-pointer ${
                      selectedPackage === pkg
                        ? 'border-primary bg-orange-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedPackage(pkg)}
                  >
                    <div className="text-center mb-4">
                      <span className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-bold mb-2">
                        {pkgNames[pkg]}
                      </span>
                      <div className="text-3xl font-bold text-primary">
                        {service.price[pkg]} <span className="text-base">دج</span>
                      </div>
                    </div>

                    <div className="space-y-3 mb-6">
                      {service.features[pkg].map((feature, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-sm text-gray-600">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <div className="text-center text-sm text-gray-500">
                      <svg className="w-4 h-4 inline-block ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      التسليم خلال {service.deliveryTime[pkg]} أيام
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span>⭐</span>
                التقييمات ({service.reviewsCount})
              </h2>
              <div className="space-y-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="border-b pb-6 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                        م
                      </div>
                      <div>
                        <p className="font-bold">عميل {i}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span className="text-yellow-500">★★★★★</span>
                          <span>•</span>
                          <span>منذ {i * 5} أيام</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600">
                      خدمة ممتازة جداً، تواصل ممتاز وتسليم في الوقت المحدد. أنصح بالتعامل مع هذا البائع.
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Order Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
              <h3 className="text-xl font-bold mb-6">اطلب الخدمة</h3>

              {/* Package Selection */}
              <div className="space-y-3 mb-6">
                {(['basic', 'standard', 'premium'] as const).map(pkg => (
                  <label
                    key={pkg}
                    className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedPackage === pkg
                        ? 'border-primary bg-orange-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        checked={selectedPackage === pkg}
                        onChange={() => setSelectedPackage(pkg)}
                        className="w-4 h-4 text-primary"
                      />
                      <div>
                        <p className="font-medium">{pkgNames[pkg]}</p>
                        <p className="text-sm text-gray-500">
                          <svg className="w-3 h-3 inline-block ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {service.deliveryTime[pkg]} أيام
                        </p>
                      </div>
                    </div>
                    <span className="text-xl font-bold text-primary">{service.price[pkg]} دج</span>
                  </label>
                ))}
              </div>

              {/* Total */}
              <div className="bg-gradient-to-l from-primary to-secondary text-white rounded-xl p-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-medium">المجموع</span>
                  <div className="text-2xl font-bold">
                    {service.price[selectedPackage]} <span className="text-sm">دج</span>
                  </div>
                </div>
              </div>

              {/* Request Button */}
              <button
                onClick={() => setShowRequestModal(true)}
                className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>تواصل مع البائع</span>
              </button>

              <p className="text-center text-sm text-gray-500 mt-4">
                💳 الدفع آمن 100% عبر Baridimob
              </p>

              {/* Seller Info */}
              <div className="mt-6 pt-6 border-t">
                <h4 className="font-bold mb-4">عن البائع</h4>
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={sellerInfo.avatar}
                    alt={sellerInfo.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <p className="font-medium">{sellerInfo.name}</p>
                    <p className="text-sm text-gray-500">
                      {sellerInfo.completedOrders} مشروع مكتمل
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/seller/${sellerInfo.id}`)}
                  className="w-full btn-outline py-2"
                >
                  عرض الملف الشخصي
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Request Modal */}
      <ServiceRequestModal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        service={service}
        seller={sellerInfo}
        selectedPackage={selectedPackage}
      />
    </div>
  );
};

export default ServiceDetail;