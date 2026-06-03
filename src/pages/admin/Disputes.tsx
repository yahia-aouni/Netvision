import React, { useState } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';

const Disputes: React.FC = () => {
  const adminToken = localStorage.getItem('admin_token');
  const [selectedDispute, setSelectedDispute] = useState<any>(null);

  const [disputes, setDisputes] = useState([
    {
      id: 'DSP-001',
      orderId: 'ORD-004',
      service: 'مونتاج فيديو احترافي',
      buyer: 'فاطمة م.',
      seller: 'أحمد ر.',
      amount: 2000,
      status: 'open',
      reason: 'جودة العمل أقل من المتوقع',
      createdAt: '2024-01-17',
      messages: [
        { from: 'buyer', text: 'العمل المسلّم لا يطابق المطلوب', time: '2024-01-17 10:30' },
        { from: 'seller', text: 'لقد أطلعتكم على العمل قبل التسليم النهائي', time: '2024-01-17 11:45' },
      ]
    },
    {
      id: 'DSP-002',
      orderId: 'ORD-012',
      service: 'تصميم شعار',
      buyer: 'خالد س.',
      seller: 'ليلى س.',
      amount: 500,
      status: 'open',
      reason: 'تأخر تسليم العمل',
      createdAt: '2024-01-16',
      messages: [
        { from: 'buyer', text: 'مضى الموعد المحدد للتسليم', time: '2024-01-16 09:00' },
        { from: 'seller', text: 'كنت بإنتظار ردكم على التعديلات', time: '2024-01-16 10:30' },
      ]
    },
    {
      id: 'DSP-003',
      orderId: 'ORD-025',
      service: 'ترجمة قانونية',
      buyer: 'نورة ف.',
      seller: 'عمر ك.',
      amount: 1200,
      status: 'resolved',
      reason: 'نزاع حول جودة الترجمة',
      createdAt: '2024-01-10',
      resolution: 'تم إعادة 50% من المبلغ للعميل',
      messages: []
    },
  ]);

  const handleResolve = (id: string, resolution: string) => {
    setDisputes(disputes.map(d => {
      if (d.id === id) {
        return { ...d, status: 'resolved', resolution };
      }
      return d;
    }));
    setSelectedDispute(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar />

      <main className="lg:mr-72 p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">إدارة النزاعات</h1>
          <p className="text-gray-500">{disputes.filter(d => d.status === 'open').length} نزاع مفتوح</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-500">إجمالي النزاعات</p>
            <p className="text-2xl font-bold text-gray-900">{disputes.length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-500">مفتوحة</p>
            <p className="text-2xl font-bold text-red-600">{disputes.filter(d => d.status === 'open').length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-500">قيد المراجعة</p>
            <p className="text-2xl font-bold text-yellow-600">{disputes.filter(d => d.status === 'reviewing').length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-500">تم الحل</p>
            <p className="text-2xl font-bold text-green-600">{disputes.filter(d => d.status === 'resolved').length}</p>
          </div>
        </div>

        {/* Disputes List */}
        <div className="space-y-4">
          {disputes.filter(d => d.status === 'open').map(dispute => (
            <div key={dispute.id} className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">⚠️</span>
                  </div>
                  <div>
                    <p className="font-bold text-lg">{dispute.id}</p>
                    <p className="text-sm text-gray-500">{dispute.orderId} - {dispute.service}</p>
                  </div>
                </div>
                <div className="text-left">
                  <p className="text-2xl font-bold text-primary">{dispute.amount.toLocaleString()} دج</p>
                  <p className="text-sm text-gray-500">{dispute.createdAt}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500 mb-1">العميل</p>
                  <p className="font-medium">{dispute.buyer}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500 mb-1">المستقل</p>
                  <p className="font-medium">{dispute.seller}</p>
                </div>
              </div>

              <div className="p-4 bg-red-50 rounded-xl mb-4">
                <p className="text-sm text-red-600 mb-1">سبب النزاع</p>
                <p className="font-medium text-red-800">{dispute.reason}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setSelectedDispute(dispute)}
                  className="flex-1 px-4 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark"
                >
                  🔍 مراجعة النزاع
                </button>
                <button
                  onClick={() => handleResolve(dispute.id, 'تم رد 100% من المبلغ للعميل')}
                  className="flex-1 px-4 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600"
                >
                  ✓ رد المبلغ للعميل
                </button>
                <button
                  onClick={() => handleResolve(dispute.id, 'تم تحويل 100% للمستقل')}
                  className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
                >
                  ✓ تحويل للمستقل
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Resolved Disputes */}
        {disputes.filter(d => d.status === 'resolved').length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">✅ النزاعات المحلولة</h2>
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 text-right text-gray-600 text-sm">
                    <th className="p-4 font-medium">رقم النزاع</th>
                    <th className="p-4 font-medium">الطلب</th>
                    <th className="p-4 font-medium">المبلغ</th>
                    <th className="p-4 font-medium">الحل</th>
                  </tr>
                </thead>
                <tbody>
                  {disputes.filter(d => d.status === 'resolved').map(dispute => (
                    <tr key={dispute.id} className="border-t">
                      <td className="p-4 font-medium">{dispute.id}</td>
                      <td className="p-4">{dispute.orderId}</td>
                      <td className="p-4 font-bold text-primary">{dispute.amount.toLocaleString()} دج</td>
                      <td className="p-4 text-green-600">{dispute.resolution}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Dispute Detail Modal */}
        {selectedDispute && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedDispute(null)}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">مراجعة النزاع {selectedDispute.id}</h2>
                <button onClick={() => setSelectedDispute(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                  ✕
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500">الخدمة</p>
                  <p className="font-medium">{selectedDispute.service}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-500">العميل</p>
                    <p className="font-medium">{selectedDispute.buyer}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-500">المستقل</p>
                    <p className="font-medium">{selectedDispute.seller}</p>
                  </div>
                </div>
                <div className="p-4 bg-red-50 rounded-xl">
                  <p className="text-sm text-red-600">سبب النزاع</p>
                  <p className="font-medium">{selectedDispute.reason}</p>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-bold mb-4">اتخاذ القرار</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => handleResolve(selectedDispute.id, 'تم رد كامل المبلغ للعميل')}
                    className="w-full p-4 text-right border-2 border-green-200 rounded-xl hover:border-green-500 hover:bg-green-50"
                  >
                    <p className="font-medium">✓ رد كامل المبلغ ({selectedDispute.amount} دج) للعميل</p>
                    <p className="text-sm text-gray-500">المستقل لم يلتزم بالتعاقد</p>
                  </button>
                  <button
                    onClick={() => handleResolve(selectedDispute.id, 'تم رد 50% لكل طرف')}
                    className="w-full p-4 text-right border-2 border-yellow-200 rounded-xl hover:border-yellow-500 hover:bg-yellow-50"
                  >
                    <p className="font-medium">✓ تقسيم المبلغ بالتساوي ({selectedDispute.amount / 2} دج لكل طرف)</p>
                    <p className="text-sm text-gray-500">لم يلتزم أي طرف بشكل كامل</p>
                  </button>
                  <button
                    onClick={() => handleResolve(selectedDispute.id, 'تم تحويل كامل المبلغ للمستقل')}
                    className="w-full p-4 text-right border-2 border-blue-200 rounded-xl hover:border-blue-500 hover:bg-blue-50"
                  >
                    <p className="font-medium">✓ تحويل كامل المبلغ ({selectedDispute.amount} دج) للمستقل</p>
                    <p className="text-sm text-gray-500">العميل أخطأ في التقييم</p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Disputes;
