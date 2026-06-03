import React, { useState } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';

const WalletManagement: React.FC = () => {
  const adminToken = localStorage.getItem('admin_token');
  const [activeTab, setActiveTab] = useState('overview');

  // Platform wallet
  const platformWallet = {
    balance: 500000,
    pending: 75000,
    totalEarnings: 125000,
    withdrawalsPending: 45000,
  };

  // Recent transactions
  const transactions = [
    { id: 1, type: 'deposit', amount: 1500, user: 'أحمد محمد', date: '2024-01-20', status: 'completed', method: 'Baridimob' },
    { id: 2, type: 'withdrawal', amount: 5000, user: 'سارة أحمد', date: '2024-01-19', status: 'pending', method: 'Baridimob' },
    { id: 3, type: 'commission', amount: 150, user: 'محمد علي', date: '2024-01-18', status: 'completed', method: 'منصة' },
    { id: 4, type: 'deposit', amount: 3000, user: 'نورة سعيد', date: '2024-01-17', status: 'completed', method: 'Baridimob' },
    { id: 5, type: 'withdrawal', amount: 8000, user: 'خالد عمر', date: '2024-01-16', status: 'rejected', method: 'Baridimob' },
  ];

  // Pending withdrawals
  const pendingWithdrawals = [
    { id: 1, user: 'أحمد محمد', amount: 15000, method: 'Baridimob CIB', account: '002123456789', date: '2024-01-20' },
    { id: 2, user: 'سارة أحمد', amount: 8500, method: 'Baridimob CCP', account: '1598745632', date: '2024-01-19' },
    { id: 3, user: 'محمد علي', amount: 22000, method: 'Baridimob BNA', account: '007894563215', date: '2024-01-18' },
  ];

  const tabs = [
    { id: 'overview', label: 'نظرة عامة', icon: '📊' },
    { id: 'transactions', label: 'المعاملات', icon: '💳' },
    { id: 'withdrawals', label: 'السحوبات', icon: '💸' },
    { id: 'commission', label: 'العمولات', icon: '💎' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar />

      <main className="lg:mr-72 p-6">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">إدارة المحفظ والTransactions</h1>
          <p className="text-gray-500">إدارة المالية والمحافظ في المنصة</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm mb-6 p-2">
          <div className="flex gap-2 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'overview' && (
          <>
            {/* Platform Wallet Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl">💰</span>
                </div>
                <h3 className="text-sm opacity-80 mb-1">الرصيد المتاح</h3>
                <p className="text-3xl font-bold">{platformWallet.balance.toLocaleString()} دج</p>
              </div>
              <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl">⏳</span>
                </div>
                <h3 className="text-sm opacity-80 mb-1">معلق</h3>
                <p className="text-3xl font-bold">{platformWallet.pending.toLocaleString()} دج</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl">💎</span>
                </div>
                <h3 className="text-sm opacity-80 mb-1">إجمالي الأرباح</h3>
                <p className="text-3xl font-bold">{platformWallet.totalEarnings.toLocaleString()} دج</p>
              </div>
              <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl">💸</span>
                </div>
                <h3 className="text-sm opacity-80 mb-1">طلبات السحب</h3>
                <p className="text-3xl font-bold">{platformWallet.withdrawalsPending.toLocaleString()} دج</p>
              </div>
            </div>

            {/* Baridimob Settings */}
            <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
              <h2 className="text-xl font-bold mb-4">⚙️ إعدادات Baridimob</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">حساب Baridimob للمنصة</label>
                  <input
                    type="text"
                    defaultValue="00212345678965412"
                    className="input-field"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">نسبة العمولة (%)</label>
                  <input
                    type="number"
                    defaultValue="10"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">الحد الأدنى للسحب (دج)</label>
                  <input
                    type="number"
                    defaultValue="5000"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">الحد الأقصى للسحب (دج)</label>
                  <input
                    type="number"
                    defaultValue="100000"
                    className="input-field"
                  />
                </div>
              </div>
              <button className="btn-primary mt-6">حفظ التغييرات</button>
            </div>
          </>
        )}

        {activeTab === 'transactions' && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold">سجل المعاملات</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 text-right text-gray-600 text-sm">
                    <th className="p-4 font-medium">رقم</th>
                    <th className="p-4 font-medium">النوع</th>
                    <th className="p-4 font-medium">المبلغ</th>
                    <th className="p-4 font-medium">المستخدم</th>
                    <th className="p-4 font-medium">الطريقة</th>
                    <th className="p-4 font-medium">الحالة</th>
                    <th className="p-4 font-medium">التاريخ</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map(tx => (
                    <tr key={tx.id} className="border-t">
                      <td className="p-4 font-medium">#{tx.id}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          tx.type === 'deposit' ? 'bg-green-100 text-green-700' :
                          tx.type === 'withdrawal' ? 'bg-red-100 text-red-700' :
                          'bg-purple-100 text-purple-700'
                        }`}>
                          {tx.type === 'deposit' && 'إيداع'}
                          {tx.type === 'withdrawal' && 'سحب'}
                          {tx.type === 'commission' && 'عمولة'}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-primary">{tx.amount.toLocaleString()} دج</td>
                      <td className="p-4">{tx.user}</td>
                      <td className="p-4 text-gray-600">{tx.method}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          tx.status === 'completed' ? 'bg-green-100 text-green-700' :
                          tx.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {tx.status === 'completed' && 'مكتمل'}
                          {tx.status === 'pending' && 'معلق'}
                          {tx.status === 'rejected' && 'مرفوض'}
                        </span>
                      </td>
                      <td className="p-4 text-gray-500">{tx.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'withdrawals' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold">طلبات السحب المعلقة</h2>
              </div>
              <div className="divide-y">
                {pendingWithdrawals.map(withdrawal => (
                  <div key={withdrawal.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <p className="font-bold text-lg">{withdrawal.user}</p>
                      <p className="text-gray-500 text-sm">{withdrawal.method} - {withdrawal.account}</p>
                      <p className="text-gray-400 text-xs mt-1">{withdrawal.date}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold text-primary">{withdrawal.amount.toLocaleString()} دج</span>
                      <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                        ✓ موافقة
                      </button>
                      <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                        ✗ رفض
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default WalletManagement;