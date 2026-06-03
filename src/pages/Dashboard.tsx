import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import DeliveryWorkModal from '../components/DeliveryWorkModal';
import OrderDetailsModal from '../components/OrderDetailsModal';
import { UserService, OrderService, ServiceService, initializeData } from '../services/store';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');

  useEffect(() => {
    initializeData();
    const user = UserService.getCurrentUser();
    if (!user) {
      navigate('/login');
      return;
    }
    setCurrentUser(user);

    // Load orders based on role
    if (user.role === 'seller') {
      const userOrders = OrderService.getBySeller(user.id);
      setOrders(userOrders);
      const userServices = ServiceService.getBySeller(user.id);
      setServices(userServices);
    } else {
      const userOrders = OrderService.getByBuyer(user.id);
      setOrders(userOrders);
    }
  }, [navigate]);

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'معلق',
      accepted: 'مقبول',
      in_progress: 'قيد التنفيذ',
      delivered: 'تم التسليم',
      completed: 'مكتمل',
      disputed: 'نزاع',
      cancelled: 'ملغي',
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-blue-100 text-blue-800',
      delivered: 'bg-purple-100 text-purple-800',
      completed: 'bg-green-100 text-green-800',
      disputed: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100';
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('ar-DZ') + ' دج';
  };

  const handleDeliverWork = (order: any) => {
    setSelectedOrder(order);
    setShowDeliveryModal(true);
  };

  const handleDeliveryComplete = () => {
    // Reload orders
    if (currentUser.role === 'seller') {
      const userOrders = OrderService.getBySeller(currentUser.id);
      setOrders(userOrders);
    } else {
      const userOrders = OrderService.getByBuyer(currentUser.id);
      setOrders(userOrders);
    }
    setShowDeliveryModal(false);
    setSelectedOrder(null);
  };

  const handleViewOrderDetails = (orderId: string) => {
    setSelectedOrderId(orderId);
    setShowOrderDetails(true);
  };

  const handleOrderStatusChange = () => {
    // Reload orders
    if (currentUser.role === 'seller') {
      const userOrders = OrderService.getBySeller(currentUser.id);
      setOrders(userOrders);
    } else {
      const userOrders = OrderService.getByBuyer(currentUser.id);
      setOrders(userOrders);
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

  const isSeller = currentUser.role === 'seller';
  const needsProfileCompletion = isSeller && !currentUser.bio;

  // Calculate stats
  const completedOrders = orders.filter(o => o.status === 'completed');
  const pendingOrders = orders.filter(o => o.status === 'pending');
  const activeOrders = orders.filter(o => o.status === 'in_progress' || o.status === 'accepted');
  const deliveredOrders = orders.filter(o => o.status === 'delivered');
  const totalEarnings = completedOrders.reduce((sum, o) => sum + o.price, 0);
  const pendingEarnings = pendingOrders.reduce((sum, o) => sum + o.price, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <div className="bg-secondary text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">لوحة التحكم</h1>
              <p className="text-white/80">مرحباً، {currentUser.name}!</p>
            </div>
            {isSeller && (
              <div className="flex items-center gap-3">
                {needsProfileCompletion && (
                  <Link
                    to="/seller-profile/complete"
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
                  >
                    <span>📝</span>
                    إكمال الملف الشخصي
                  </Link>
                )}
                <Link
                  to="/seller-profile/complete"
                  className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
                >
                  عرض حسابي
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Profile Completion Alert for Sellers */}
        {needsProfileCompletion && (
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-2xl">
                ⚠️
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-orange-900">أكمل ملفك الشخصي</h3>
                <p className="text-orange-700 text-sm">
                  يجب إكمال ملفك الشخصي ليظهر في قائمة المستقلين ويستقبل طلبات جديدة.
                </p>
              </div>
              <Link
                to="/seller-profile/complete"
                className="px-6 py-2 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-colors"
              >
                إكمال الآن
              </Link>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl">
                💰
              </div>
              <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                {isSeller ? 'أرباحك' : 'مُنفق'}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{formatPrice(totalEarnings)}</h3>
            <p className="text-gray-500 text-sm">
              {isSeller ? 'إجمالي الأرباح' : 'إجمالي المُنفق'}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center text-2xl">
                ⏳
              </div>
              {pendingEarnings > 0 && (
                <span className="text-sm font-medium text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full animate-pulse">
                  {formatPrice(pendingEarnings)}
                </span>
              )}
            </div>
            <h3 className="text-2xl font-bold text-yellow-600 mb-1">{formatPrice(pendingEarnings)}</h3>
            <p className="text-gray-500 text-sm">أرباح معلقة</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl">
                ✅
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{completedOrders.length}</h3>
            <p className="text-gray-500 text-sm">طلبات مكتملة</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">
                🔄
              </div>
              {activeOrders.length > 0 && (
                <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                  نشط
                </span>
              )}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{activeOrders.length}</h3>
            <p className="text-gray-500 text-sm">طلبات نشطة</p>
          </div>
        </div>

        {/* Services for Sellers */}
        {isSeller && services.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">خدماتي</h2>
              <Link to="/seller-profile/complete" className="text-primary text-sm font-medium hover:underline">
                إضافة خدمة ←
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {services.slice(0, 3).map(service => (
                <div key={service.id} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    {service.image ? (
                      <img src={service.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
                    ) : (
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary text-xl">
                        🎯
                      </div>
                    )}
                    <div>
                      <p className="font-medium line-clamp-1">{service.title || service.category}</p>
                      <p className="text-sm text-gray-500">من {formatPrice(service.price.basic)}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      service.status === 'active' ? 'bg-green-100 text-green-700' :
                      service.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {service.status === 'active' ? 'نشط' : service.status === 'pending' ? 'بانتظار الموافقة' : service.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">
              {isSeller ? 'الطلبات الواردة' : 'طلباتي'}
            </h2>
            <Link
              to={isSeller ? '/admin/orders' : '#'}
              className="text-primary text-sm font-medium hover:underline"
            >
              عرض الكل ←
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="text-4xl mb-4">📋</div>
              <p>لا توجد طلبات بعد</p>
              {isSeller ? (
                <p className="text-sm mt-2">أكمل ملفك الشخصي لبدء استقبال الطلبات</p>
              ) : (
                <Link to="/services" className="text-primary mt-4 inline-block hover:underline">
                  تصفح الخدمات
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-right text-gray-500 text-sm border-b">
                    <th className="pb-4 font-medium">رقم الطلب</th>
                    {isSeller && <th className="pb-4 font-medium">العميل</th>}
                    <th className="pb-4 font-medium">الباقة</th>
                    <th className="pb-4 font-medium">الحالة</th>
                    <th className="pb-4 font-medium">المبلغ</th>
                    <th className="pb-4 font-medium">التاريخ</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map(order => (
                    <tr key={order.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                      <td className="py-4">
                        <button
                          onClick={() => handleViewOrderDetails(order.id)}
                          className="font-mono text-sm text-primary hover:underline"
                        >
                          {order.id.slice(0, 12)}...
                        </button>
                      </td>
                      {isSeller && (
                        <td className="py-4">
                          {order.buyerName || order.buyerId?.slice(0, 8) || 'عميل'}
                        </td>
                      )}
                      <td className="py-4">
                        <span className="px-3 py-1 bg-gray-100 rounded-full text-xs">
                          {order.package === 'basic' ? 'أساسية' : order.package === 'standard' ? 'قياسية' : 'احترافية'}
                        </span>
                      </td>
                      <td className="py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusLabel(order.status)}
                        </span>
                      </td>
                      <td className="py-4 font-bold text-primary">{formatPrice(order.price)}</td>
                      <td className="py-4 text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('ar-DZ')}
                      </td>
                      {/* Action Buttons */}
                      <td className="py-4">
                        <div className="flex flex-col gap-2">
                          {/* View Details Button */}
                          <button
                            onClick={() => handleViewOrderDetails(order.id)}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors flex items-center gap-1"
                          >
                            <span>👁️</span>
                            <span>التفاصيل</span>
                          </button>

                          {isSeller && (order.status === 'in_progress' || order.status === 'accepted') && (
                            <button
                              onClick={() => handleDeliverWork(order)}
                              className="px-3 py-1 bg-purple-600 text-white rounded-lg text-xs font-medium hover:bg-purple-700 transition-colors flex items-center gap-1"
                            >
                              <span>📦</span>
                              <span>تسليم العمل</span>
                            </button>
                          )}
                          {/* View Delivered Files for Delivered Status */}
                          {order.status === 'delivered' && order.deliveryFiles && (
                            <div className="text-xs text-purple-600 font-medium">
                              📁 {order.deliveryFiles.length} ملفات
                            </div>
                          )}
                          {/* Complete Order Button for Clients */}
                          {!isSeller && order.status === 'delivered' && (
                            <button
                              onClick={() => {
                                if (confirm('هل أنت متأكد من إتمام الطلب؟')) {
                                  OrderService.completeOrder(order.id);
                                  handleDeliveryComplete();
                                }
                              }}
                              className="px-3 py-1 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 transition-colors flex items-center gap-1"
                            >
                              <span>✓</span>
                              <span>إتمام الطلب</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Withdraw Card for Sellers */}
        {isSeller && (
          <div className="bg-gradient-to-r from-primary to-accent rounded-2xl p-6 text-white">
            <div className="flex items-center gap-4">
              <div className="w-16 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="font-bold text-lg">BM</span>
              </div>
              <div className="flex-1">
                <p className="font-medium">سحب الأرباح</p>
                <p className="text-sm text-white/80">اسحب أرباحك عبر Baridimob</p>
              </div>
              <button className="bg-white text-primary px-6 py-2 rounded-xl font-medium hover:bg-gray-100 transition-colors">
                سحب الآن
              </button>
            </div>
          </div>
        )}

        {/* Delivery Work Modal */}
        <DeliveryWorkModal
          isOpen={showDeliveryModal}
          onClose={() => { setShowDeliveryModal(false); setSelectedOrder(null); }}
          order={selectedOrder}
          onDeliveryComplete={handleDeliveryComplete}
        />

        {/* Order Details Modal */}
        <OrderDetailsModal
          isOpen={showOrderDetails}
          onClose={() => setShowOrderDetails(false)}
          orderId={selectedOrderId}
          onStatusChange={handleOrderStatusChange}
        />
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;