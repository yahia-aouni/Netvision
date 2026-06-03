import React from 'react';
import ServiceCard from '../components/ServiceCard';
import { services, categories } from '../data/mockData';
const Services: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8"><h1 className="text-3xl font-bold">الخدمات</h1><p className="text-gray-500">{services.length} خدمة متاحة</p></div>
        <div className="bg-white rounded-xl p-6 mb-8 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <input type="text" placeholder="ابحث عن خدمة..." className="flex-1 px-4 py-3 border border-gray-200 rounded-lg" />
            <select className="px-4 py-3 border border-gray-200 rounded-lg"><option>الأكثر أهمية</option><option>السعر: من الأقل للأعلى</option><option>الأعلى تقييماً</option></select>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="px-4 py-2 rounded-full text-sm bg-primary text-white">جميع التصنيفات</button>
            {categories.map(c => <button key={c.id} className="px-4 py-2 rounded-full text-sm bg-gray-100 hover:bg-primary/10">{c.icon} {c.name}</button>)}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">{services.map(s => <ServiceCard key={s.id} service={s} />)}</div>
      </div>
    </div>
  );
};
export default Services;