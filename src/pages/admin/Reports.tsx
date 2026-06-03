import React, { useState } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';

const Reports: React.FC = () => {
  const adminToken = localStorage.getItem('admin_token');
  const [dateRange, setDateRange] = useState('30');

  const stats = {
    totalUsers: { value: 12450, change: 12 },
    totalOrders: { value: 8234, change: 8 },
    totalSales: { value: 2500000, change: 15 },
    platformEarnings: { value: 125000, change: 10 },
    activeServices: { value: 812, change: 5 },
    disputes: { value: 23, change: -15 },
  };

  const topSellers = [
    { id: 1, name: 'أحمد محمد', services: 45, earnings: 125000, rating: 4.9 },
    { id: 2, name: 'سارة أحمد', services: 38, earnings: 98000, rating: 4.8 },
    { id: 3, name: 'محمد علي', services: 32, earnings: 85000, rating: 4.7 },
    { id: 4, name: 'نورة سعيد', services: 28, earnings: 72000, rating: 4.6 },
    { id: 5, name: 'خالد عمر', services: 25, earnings: 65000, rating: 4.8 },
  ];

  const topCategories = [
    { name: 'البرمجة', services: 243, revenue: 485000 },
    { name: 'التصميم', services: 156, revenue: 312000 },
    { name: 'التسويق', services: 134, revenue: 268000 },
    { name: 'الترجمة', services: 89, revenue: 89000 },
    { name: 'الفيديو', services: 67, revenue: 134000 },
  ];

  const monthlyData = [
    { month: 'أكتوبر', users: 850, orders: 620, sales: 185000 },
    { month: 'نوفمبر', users: 920, orders: 710, sales: 210000 },
    { month: 'ديسمبر', users: 1100, orders: 850, sales: 255000 },
    { month: 'يناير', users: 1250, orders: 980, sales: 290000 },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar />

      <main className="lg:mr-72 p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">التقارير والإحصائيات</h1>
            <p className="text-gray-500">تحليل أداء المنصة</p>
          </div>
          <select
            value={dateRange}
            onChange={e => setDateRange(e.target.value)}
            className="px-4 py-3 rounded-xl border border-gray-200 bg-white"
          >
            <option value="7">آخر 7 أيام</option>
            <option value="30">آخر 30 يوم</option>
            <option value="90">آخر 3 أشهر</option>
            <option value="365">آخر سنة</option>
          </select>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">المستخدمين</p>
            <p className="text-xl font-bold text-gray-900">{stats.totalUsers.value.toLocaleString()}</p>
            <p className={`text-sm ${stats.totalUsers.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.totalUsers.change > 0 ? '↑' : '↓'} {Math.abs(stats.totalUsers.change)}%
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">الطلبات</p>
            <p className="text-xl font-bold text-gray-900">{stats.totalOrders.value.toLocaleString()}</p>
            <p className={`text-sm ${stats.totalOrders.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.totalOrders.change > 0 ? '↑' : '↓'} {Math.abs(stats.totalOrders.change)}%
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">إجمالي المبيعات</p>
            <p className="text-xl font-bold text-gray-900">{(stats.totalSales.value / 1000000).toFixed(1)}M دج</p>
            <p className={`text-sm ${stats.totalSales.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.totalSales.change > 0 ? '↑' : '↓'} {Math.abs(stats.totalSales.change)}%
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">أرباح المنصة</p>
            <p className="text-xl font-bold text-gray-900">{(stats.platformEarnings.value / 1000).toFixed(0)}K دج</p>
            <p className={`text-sm ${stats.platformEarnings.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.platformEarnings.change > 0 ? '↑' : '↓'} {Math.abs(stats.platformEarnings.change)}%
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">الخدمات النشطة</p>
            <p className="text-xl font-bold text-gray-900">{stats.activeServices.value}</p>
            <p className={`text-sm ${stats.activeServices.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.activeServices.change > 0 ? '↑' : '↓'} {Math.abs(stats.activeServices.change)}%
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">النزاعات</p>
            <p className="text-xl font-bold text-gray-900">{stats.disputes.value}</p>
            <p className={`text-sm ${stats.disputes.change < 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.disputes.change > 0 ? '↑' : '↓'} {Math.abs(stats.disputes.change)}%
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Trend */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-6">📈 الاتجاه الشهري</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-right text-gray-500 text-sm border-b">
                    <th className="pb-3 font-medium">الشهر</th>
                    <th className="pb-3 font-medium">المستخدمين</th>
                    <th className="pb-3 font-medium">الطلبات</th>
                    <th className="pb-3 font-medium">المبيعات</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyData.map(data => (
                    <tr key={data.month} className="border-b last:border-0">
                      <td className="py-3 font-medium">{data.month}</td>
                      <td className="py-3 text-gray-600">{data.users}</td>
                      <td className="py-3 text-gray-600">{data.orders}</td>
                      <td className="py-3 font-bold text-primary">{data.sales.toLocaleString()} دج</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Categories */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-6">📊 أفضل التصنيفات</h2>
            <div className="space-y-4">
              {topCategories.map((cat, index) => (
                <div key={cat.name}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{cat.name}</span>
                    <span className="text-sm text-gray-500">{cat.revenue.toLocaleString()} دج</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary rounded-full h-2"
                      style={{ width: `${(cat.revenue / 485000) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Sellers */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mt-6">
          <h2 className="text-xl font-bold mb-6">🏆 أفضل المستقلين</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-right text-gray-500 text-sm border-b">
                  <th className="pb-3 font-medium">#</th>
                  <th className="pb-3 font-medium">الاسم</th>
                  <th className="pb-3 font-medium">الخدمات</th>
                  <th className="pb-3 font-medium">الأرباح</th>
                  <th className="pb-3 font-medium">التقييم</th>
                </tr>
              </thead>
              <tbody>
                {topSellers.map((seller, index) => (
                  <tr key={seller.id} className="border-b last:border-0">
                    <td className="py-4">
                      {index === 0 && '🥇'}
                      {index === 1 && '🥈'}
                      {index === 2 && '🥉'}
                      {index > 2 && index + 1}
                    </td>
                    <td className="py-4 font-medium">{seller.name}</td>
                    <td className="py-4 text-gray-600">{seller.services}</td>
                    <td className="py-4 font-bold text-primary">{seller.earnings.toLocaleString()} دج</td>
                    <td className="py-4">
                      <span className="text-yellow-500">★</span> {seller.rating}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Export Options */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mt-6">
          <h2 className="text-xl font-bold mb-6">📥 تصدير التقارير</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 border-2 border-gray-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-colors flex flex-col items-center gap-2">
              <span className="text-3xl">📊</span>
              <span className="font-medium">تقرير المستخدمين</span>
              <span className="text-sm text-gray-500">CSV</span>
            </button>
            <button className="p-4 border-2 border-gray-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-colors flex flex-col items-center gap-2">
              <span className="text-3xl">💰</span>
              <span className="font-medium">التقرير المالي</span>
              <span className="text-sm text-gray-500">Excel</span>
            </button>
            <button className="p-4 border-2 border-gray-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-colors flex flex-col items-center gap-2">
              <span className="text-3xl">📈</span>
              <span className="font-medium">تقرير شامل</span>
              <span className="text-sm text-gray-500">PDF</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Reports;
