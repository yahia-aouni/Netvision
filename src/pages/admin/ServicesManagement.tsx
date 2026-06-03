import React, { useState, useEffect, useCallback } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { ServiceService, NotificationService } from '../../services/store';

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

const ServicesManagement: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Load services from store
  const loadServices = useCallback(() => {
    const allServices = ServiceService.getAll();
    setServices(allServices);
  }, []);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  const filteredServices = services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || service.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || service.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleStatusChange = (id: string, newStatus: string) => {
    if (newStatus === 'active') {
      ServiceService.approve(id);
    } else if (newStatus === 'rejected') {
      ServiceService.reject(id);
    } else if (newStatus === 'paused') {
      ServiceService.pause(id);
    }
    loadServices();
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذه الخدمة؟')) {
      ServiceService.delete(id);
      loadServices();
    }
  };

  const handleAddService = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const newService = ServiceService.create({
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      category: formData.get('category') as string,
      sellerId: 'manual-' + Date.now(),
      price: {
        basic: parseInt(formData.get('priceBasic') as string) || 50,
        standard: parseInt(formData.get('priceStandard') as string) || 100,
        premium: parseInt(formData.get('pricePremium') as string) || 200,
      },
      deliveryTime: {
        basic: 3,
        standard: 5,
        premium: 7,
      },
      rating: 0,
      reviewsCount: 0,
      image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&h=400&fit=crop',
      status: 'active',
      features: {
        basic: ['ميزة 1', 'ميزة 2'],
        standard: ['ميزة 1', 'ميزة 2', 'ميزة 3'],
        premium: ['ميزة 1', 'ميزة 2', 'ميزة 3', 'ميزة 4'],
      },
    });

    // Create notification
    NotificationService.create({
      type: 'service',
      title: 'خدمة جديدة',
      message: `تمت إضافة خدمة: ${newService.title}`,
      read: false,
    });

    setShowAddModal(false);
    loadServices();
  };

  const statusColors: Record<string, string> = {
    active: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    rejected: 'bg-red-100 text-red-700',
    paused: 'bg-gray-100 text-gray-700',
  };

  const statusLabels: Record<string, string> = {
    active: 'نشط',
    pending: 'قيد المراجعة',
    rejected: 'مرفوض',
    paused: 'موقوف',
  };

  const categories = ['البرمجة والتطوير', 'التصميم الجرافيكي', 'التعليق الصوتي', 'إدارة مواقع التواصل الاجتماعي', 'إنشاء العروض التقديمية', 'إنشاء المنصات الإلكترونية'];

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar />

      <main className="lg:mr-72 p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">إدارة الخدمات</h1>
            <p className="text-gray-500">إجمالي {services.length} خدمة</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-medium hover:opacity-90 transition-all flex items-center gap-2"
          >
            <span>➕</span>
            <span>إضافة خدمة</span>
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="ابحث عن خدمة..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <select
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
              className="px-4 py-3 rounded-xl border border-gray-200 bg-gray-50"
            >
              <option value="all">جميع التصنيفات</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="px-4 py-3 rounded-xl border border-gray-200 bg-gray-50"
            >
              <option value="all">جميع الحالات</option>
              <option value="active">نشط</option>
              <option value="pending">قيد المراجعة</option>
              <option value="rejected">مرفوض</option>
              <option value="paused">موقوف</option>
            </select>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredServices.map(service => (
            <div key={service.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
              <div className="relative h-40 bg-gray-200">
                <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium ${statusColors[service.status]}`}>
                  {statusLabels[service.status]}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg mb-2 line-clamp-2">{service.title}</h3>
                <p className="text-sm text-gray-500 mb-3">التصنيف: {service.category}</p>

                <div className="grid grid-cols-3 gap-3 mb-4 p-3 bg-gray-50 rounded-xl">
                  <div className="text-center">
                    <p className="text-xs text-gray-500">ابتدائي</p>
                    <p className="font-bold text-primary">{service.price.basic} دج</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">قياسي</p>
                    <p className="font-bold text-secondary">{service.price.standard} دج</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">متقدم</p>
                    <p className="font-bold text-purple-600">{service.price.premium} دج</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-500">★</span>
                    <span className="text-sm font-medium">{service.rating}</span>
                    <span className="text-sm text-gray-400">({service.reviewsCount})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {service.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleStatusChange(service.id, 'active')}
                          className="px-3 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600"
                        >
                          ✓ قبول
                        </button>
                        <button
                          onClick={() => handleStatusChange(service.id, 'rejected')}
                          className="px-3 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600"
                        >
                          ✗ رفض
                        </button>
                      </>
                    )}
                    {service.status === 'active' && (
                      <button
                        onClick={() => handleStatusChange(service.id, 'paused')}
                        className="px-3 py-2 bg-yellow-500 text-white rounded-lg text-sm hover:bg-yellow-600"
                      >
                        ⏸️ إيقاف
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Service Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
              <h2 className="text-xl font-bold mb-6">إضافة خدمة جديدة</h2>
              <form onSubmit={handleAddService} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">عنوان الخدمة</label>
                  <input type="text" name="title" className="input-field" placeholder="عنوان الخدمة" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">الوصف</label>
                  <textarea name="description" rows={3} className="input-field" placeholder="وصف الخدمة" required></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">التصنيف</label>
                  <select name="category" className="input-field" required>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">السعر الابتدائي</label>
                    <input type="number" name="priceBasic" className="input-field" placeholder="50" defaultValue="50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">السعر القياسي</label>
                    <input type="number" name="priceStandard" className="input-field" placeholder="100" defaultValue="100" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">السعر المتقدم</label>
                    <input type="number" name="pricePremium" className="input-field" placeholder="200" defaultValue="200" />
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50">
                    إلغاء
                  </button>
                  <button type="submit" className="flex-1 px-4 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl">
                    إضافة الخدمة
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ServicesManagement;