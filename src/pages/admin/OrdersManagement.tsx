import React, { useState, useEffect, useCallback } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { OrderService, NotificationService } from '../../services/store';

interface Order {
  id: string;
  serviceId: string;
  buyerId: string;
  sellerId: string;
  packageType: 'basic' | 'standard' | 'premium';
  price: number;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled' | 'disputed';
  paymentStatus: 'unpaid' | 'paid' | 'refunded';
  message: string;
  requirements?: string;
  createdAt: string;
  updatedAt: string;
}

const OrdersManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Load orders from store
  const loadOrders = useCallback(() => {
    const allOrders = OrderService.getAll();
    setOrders(allOrders);
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.serviceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.buyerId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (id: string, newStatus: Order['status']) => {
    OrderService.updateStatus(id, newStatus);
    loadOrders();
    // Create notification
    NotificationService.create({
      type: 'order',
      title: 'تم تحديث حالة الطلب',
      message: `تم تحديث الطلب ${id} إلى: ${getStatusLabel(newStatus)}`,
      read: false,
    });
  };

  const handlePaymentStatusChange = (id: string, paymentStatus: Order['paymentStatus']) => {
    OrderService.updatePaymentStatus(id, paymentStatus);
    loadOrders();
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    accepted: 'bg-blue-100 text-blue-700',
    in_progress: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    disputed: 'bg-red-100 text-red-700',
    cancelled: 'bg-gray-100 text-gray-700',
  };

  const statusLabels: Record<string, string> = {
    pending: 'معلق',
    accepted: 'مقبول',
    in_progress: 'قيد التنفيذ',
    completed: 'مكتمل',
    disputed: 'نزاع',
    cancelled: 'ملغي',
  };

  const getStatusLabel = (status: string) => statusLabels[status] || status;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-DZ');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar />

      <main className="lg:mr-72 p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">إدارة الطلبات</h1>
          <p className="text-gray-500">إجمالي {orders.length} طلب</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-500">المعلق</p>
            <p className="text-2xl font-bold text-yellow-600">{orders.filter(o => o.status === 'pending').length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-500">قيد التنفيذ</p>
            <p className="text-2xl font-bold text-blue-600">{orders.filter(o => o.status === 'in_progress').length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-500">المكتمل</p>
            <p className="text-2xl font-bold text-green-600">{orders.filter(o => o.status === 'completed').length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-500">النزاعات</p>
            <p className="text-2xl font-bold text-red-600">{orders.filter(o => o.status === 'disputed').length}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="ابحث برقم الطلب أو اسم الخدمة أو العميل..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="px-4 py-3 rounded-xl border border-gray-200 bg-gray-50"
            >
              <option value="all">جميع الحالات</option>
              <option value="pending">معلق</option>
              <option value="accepted">مقبول</option>
              <option value="in_progress">قيد التنفيذ</option>
              <option value="completed">مكتمل</option>
              <option value="disputed">نزاع</option>
              <option value="cancelled">ملغي</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-right text-gray-600 text-sm">
                  <th className="p-4 font-medium">رقم الطلب</th>
                  <th className="p-4 font-medium">المعرف</th>
                  <th className="p-4 font-medium">المستقل</th>
                  <th className="p-4 font-medium">الباقة</th>
                  <th className="p-4 font-medium">المبلغ</th>
                  <th className="p-4 font-medium">الحالة</th>
                  <th className="p-4 font-medium">الدفع</th>
                  <th className="p-4 font-medium">التاريخ</th>
                  <th className="p-4 font-medium">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-gray-500">
                      <div className="text-4xl mb-2">📋</div>
                      <p>لا توجد طلبات</p>
                      <p className="text-sm">سيظهر هنا الطلب الجديد عند استلامها</p>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map(order => (
                    <tr key={order.id} className="border-t hover:bg-gray-50">
                      <td className="p-4 font-medium">{order.id}</td>
                      <td className="p-4 text-gray-600 font-mono text-sm">{order.serviceId.slice(0, 12)}...</td>
                      <td className="p-4 text-gray-600">{order.sellerId.slice(0, 12)}...</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          order.packageType === 'premium' ? 'bg-purple-100 text-purple-700' :
                          order.packageType === 'standard' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {order.packageType === 'basic' ? 'ابتدائي' :
                           order.packageType === 'standard' ? 'قياسي' : 'متقدم'}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-primary">{order.price.toLocaleString()} دج</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                          {statusLabels[order.status]}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' :
                          order.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {order.paymentStatus === 'paid' ? 'مدفوع' :
                           order.paymentStatus === 'unpaid' ? 'غير مدفوع' : 'معاد'}
                        </span>
                      </td>
                      <td className="p-4 text-gray-500 text-sm">{formatDate(order.createdAt)}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {order.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleStatusChange(order.id, 'accepted')}
                                className="px-3 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600"
                              >
                                ✓ قبول
                              </button>
                              <button
                                onClick={() => handleStatusChange(order.id, 'cancelled')}
                                className="px-3 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600"
                              >
                                ✗ رفض
                              </button>
                            </>
                          )}
                          {order.status === 'accepted' && (
                            <button
                              onClick={() => handleStatusChange(order.id, 'in_progress')}
                              className="px-3 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
                            >
                              ▶️ بدء التنفيذ
                            </button>
                          )}
                          {order.status === 'in_progress' && (
                            <button
                              onClick={() => handleStatusChange(order.id, 'completed')}
                              className="px-3 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600"
                            >
                              ✓ إكمال
                            </button>
                          )}
                          {order.status === 'disputed' && (
                            <button className="px-3 py-2 bg-purple-500 text-white rounded-lg text-sm hover:bg-purple-600">
                              🔍 حل النزاع
                            </button>
                          )}
                          {order.status === 'completed' && (
                            <span className="text-green-500">✓ مكتمل</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions Info */}
        <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <h3 className="font-medium text-blue-900 mb-2">💡 معلومات</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• الطلبات الجديدة تظهر تلقائياً عند إنشائها من المستخدمين</li>
            <li>• يمكنك إدارة حالة كل طلب من خلال الأزرار المتاحة</li>
            <li>• سيتم إرسال تنبيهات فورية عند كل تغيير</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default OrdersManagement;