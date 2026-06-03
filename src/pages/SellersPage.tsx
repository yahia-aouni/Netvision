import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { UserService } from '../services/store';
import { categories } from '../data/mockData';

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
  createdAt: string;
}

const SellersPage: React.FC = () => {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('rating');

  useEffect(() => {
    const allSellers = UserService.getAll().filter(u => u.role === 'seller' && u.status === 'active');
    setSellers(allSellers);
  }, []);

  const filteredSellers = sellers.filter(seller => {
    const matchesSearch = seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          seller.bio?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'orders') return b.completedOrders - a.completedOrders;
    if (sortBy === 'reviews') return b.reviewsCount - a.reviewsCount;
    return 0;
  });

  const getCategoryIcon = (categoryName: string) => {
    const cat = categories.find(c => c.name === categoryName);
    return cat?.icon || '👤';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-secondary via-secondary to-secondary/90 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-white mb-4">المستقلون المحترفون</h1>
          <p className="text-white/80 text-lg">اكتشف أفضل المستقلين في مجالات متعددة</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="ابحث عن مستقل..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="px-4 py-3 rounded-xl border border-gray-200 bg-gray-50"
            >
              <option value="rating">الأعلى تقييماً</option>
              <option value="orders">الأكثر إتماماً للمشاريع</option>
              <option value="reviews">الأعلى مراجعات</option>
            </select>
          </div>
        </div>

        {/* Sellers Grid */}
        {filteredSellers.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">لا يوجد مستقلون</h3>
            <p className="text-gray-500">لم يتم العثور على مستقلين مطابقين لمعايير البحث</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSellers.map(seller => (
              <div key={seller.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
                      {seller.avatar ? (
                        <img src={seller.avatar} alt={seller.name} className="w-full h-full object-cover" />
                      ) : (
                        seller.name.charAt(0)
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{seller.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span className="text-yellow-500">★</span>
                        <span className="font-medium">{seller.rating}</span>
                        <span>({seller.reviewsCount} تقييم)</span>
                      </div>
                    </div>
                  </div>

                  {seller.bio && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{seller.bio}</p>
                  )}

                  {seller.skills && seller.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {seller.skills.slice(0, 3).map((skill, idx) => (
                        <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="text-sm text-gray-500">
                      <span className="font-bold text-primary">{seller.completedOrders}</span> مشروع مكتمل
                    </div>
                    <Link
                      to={`/seller/${seller.id}`}
                      className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
                    >
                      عرض الملف
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default SellersPage;
