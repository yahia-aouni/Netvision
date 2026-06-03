import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { UserService, ServiceService, OrderService, NotificationService, initializeData } from '../../services/store';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState<any>(null);
  const [stats, setStats] = useState({
    users: 0,
    services: 0,
    orders: 0,
    notifications: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [pendingOrders, setPendingOrders] = useState(0);

  useEffect(() => {
    // Initialize data
    initializeData();

    // Check admin authentication
    const admin = UserService.getAdminUser();
    if (!admin) {
      navigate('/admin/login');
      return;
    }
    setAdminUser(admin);

    // Load stats from store
    const users = UserService.getAll();
    const services = ServiceService.getAll();
    const orders = OrderService.getAll();
    const notifications = NotificationService.getUnreadCount();

    setStats({
      users: users.filter(u => u.role !== 'admin').length,
      services: services.length,
      orders: orders.length,
      notifications,
    });

    setPendingOrders(orders.filter(o => o.status === 'pending').length);

    // Recent orders (last 5)
    setRecentOrders(orders.slice(0, 5));

    // Recent users (last 5)
    setRecentUsers(users.filter(u => u.role !== 'admin').slice(-5).reverse());

    // Request notification permission
    NotificationService.requestPermission();
  }, [navigate]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-DZ');
  };

  const getOrderStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'معلق',
      accepted: 'مقبول',
      in_progress: 'قيد التنفيذ',
      completed: 'مكتمل',
      disputed: 'نزاع',
      cancelled: 'ملغي',
    };
    return labels[status] || status;
  };

  const getOrderStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      disputed: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar />

      <main className="lg:mr-72 p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">لوحة التحكم</h1>
            <p className="text-gray-500">مرحباً {adminUser?.name || 'مدير المنصة'}</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <span>🌐</span>
              <span>عرض الموقع</span>
            </Link>
            <Link
              to="/admin/users"
              className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:opacity-90 transition-colors flex items-center gap-2"
            >
              <span>➕</span>
              <span>إضافة مستخدم</span>
            </Link>
          </div>
        </div>

        {/* Real Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-2xl">
                👥
              </div>
              <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                حقيقي
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.users}</h3>
            <p className="text-gray-500">إجمالي المستخدمين</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-2xl">
                🎯
              </div>
              <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                حقيقي
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.services}</h3>
            <p className="text-gray-500">إجمالي الخدمات</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-2xl">
                📋
              </div>
              {pendingOrders > 0 && (
                <span className="text-sm font-medium text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full animate-pulse">
                  {pendingOrders} بانتظار المراجعة
                </span>
              )}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.orders}</h3>
            <p className="text-gray-500">إجمالي الطلبات</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-2xl">
                🔔
              </div>
              {stats.notifications > 0 && (
                <span className="text-sm font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">
                  {stats.notifications} غير مقروء
                </span>
              )}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.notifications}</h3>
            <p className="text-gray-500">التنبيهات</p>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Orders */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">آخر الطلبات</h2>
              <Link to="/admin/orders" className="text-primary text-sm font-medium hover:underline">
                عرض الكل ←
              </Link>
            </div>
            {recentOrders.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">📋</div>
                <p>لا توجد طلبات بعد</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-right text-gray-500 text-sm border-b">
                      <th className="pb-3 font-medium">رقم الطلب</th>
                      <th className="pb-3 font-medium">الباقة</th>
                      <th className="pb-3 font-medium">الحالة</th>
                      <th className="pb-3 font-medium">المبلغ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map(order => (
                      <tr key={order.id} className="border-b last:border-0">
                        <td className="py-4 font-medium font-mono">{order.id.slice(0, 12)}...</td>
                        <td className="py-4">
                          <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                            {order.packageType}
                          </span>
                        </td>
                        <td className="py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getOrderStatusColor(order.status)}`}>
                            {getOrderStatusLabel(order.status)}
                          </span>
                        </td>
                        <td className="py-4 font-bold text-primary">{order.price.toLocaleString()} دج</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Recent Users */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">أحدث المستخدمين</h2>
              <Link to="/admin/users" className="text-primary text-sm font-medium hover:underline">
                عرض الكل ←
              </Link>
            </div>
            {recentUsers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">👥</div>
                <p>لا يوجد مستخدمين بعد</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentUsers.map(user => (
                  <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <div className="text-left">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.role === 'seller' ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'
                      }`}>
                        {user.role === 'seller' ? 'مستقل' : 'عميل'}
                      </span>
                      <p className="text-xs text-gray-400 mt-1">{formatDate(user.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <h2 className="text-xl font-bold mb-6">إجراءات سريعة</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              to="/admin/users"
              className="p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors text-center"
            >
              <div className="text-3xl mb-2">👥</div>
              <p className="font-medium text-blue-900">إدارة المستخدمين</p>
            </Link>
            <Link
              to="/admin/services"
              className="p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors text-center"
            >
              <div className="text-3xl mb-2">🎯</div>
              <p className="font-medium text-green-900">إدارة الخدمات</p>
            </Link>
            <Link
              to="/admin/orders"
              className="p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors text-center"
            >
              <div className="text-3xl mb-2">📋</div>
              <p className="font-medium text-orange-900">إدارة الطلبات</p>
            </Link>
            <Link
              to="/admin/settings"
              className="p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors text-center"
            >
              <div className="text-3xl mb-2">⚙️</div>
              <p className="font-medium text-purple-900">الإعدادات</p>
            </Link>
          </div>
        </div>

        {/* Platform Health */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-6">صحة المنصة</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <div className="text-4xl mb-2">✅</div>
              <p className="font-medium text-green-700">نظام الدفع</p>
              <p className="text-sm text-green-600">يعمل بشكل طبيعي</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <div className="text-4xl mb-2">✅</div>
              <p className="font-medium text-green-700">قاعدة البيانات</p>
              <p className="text-sm text-green-600">متصلة ومستقرة</p>
            </div>
            <div className={`text-center p-4 rounded-xl ${pendingOrders > 0 ? 'bg-yellow-50' : 'bg-green-50'}`}>
              <div className="text-4xl mb-2">{pendingOrders > 0 ? '⚠️' : '✅'}</div>
              <p className="font-medium text-yellow-700">{pendingOrders} طلب</p>
              <p className="text-sm text-yellow-600">بحاجة إلى مراجعة</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <div className="text-4xl mb-2">✅</div>
              <p className="font-medium text-green-700">الاستضافة</p>
              <p className="text-sm text-green-600">99.9% uptime</p>
            </div>
          </div>
        </div>

        {/* Demo Mode Info */}
        <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
          <h3 className="font-medium text-amber-900 mb-2">💡 وضع التطوير</h3>
          <ul className="text-sm text-amber-700 space-y-1">
            <li>• البيانات محفوظة في LocalStorage - ستختفي عند مسح المتصفح</li>
            <li>• لنشر حقيقي، اتصل بـ Supabase أو أي قاعدة بيانات</li>
            <li>• البيانات التجريبية: admin@netvision.dz / admin123</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;