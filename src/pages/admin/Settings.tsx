import React, { useState } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';

const Settings: React.FC = () => {
  const adminToken = localStorage.getItem('admin_token');

  const [settings, setSettings] = useState({
    siteName: 'Netvision',
    siteUrl: 'https://netvision.dz',
    siteEmail: 'contact@netvision.dz',
    sitePhone: '0555123456',
    commissionRate: 10,
    minWithdraw: 5000,
    maxWithdraw: 100000,
    supportEmail: 'support@netvision.dz',
    maintenanceMode: false,
    registrationEnabled: true,
    requireVerification: true,
  });

  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar />

      <main className="lg:mr-72 p-6">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">إعدادات المنصة</h1>
          <p className="text-gray-500">إدارة إعدادات وConfigurations المنصة</p>
        </div>

        {saved && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 flex items-center gap-2">
            <span className="text-xl">✓</span>
            تم حفظ التغييرات بنجاح
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* General Settings */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span>⚙️</span>
              الإعدادات العامة
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">اسم المنصة</label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={e => setSettings({...settings, siteName: e.target.value})}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">رابط الموقع</label>
                <input
                  type="url"
                  value={settings.siteUrl}
                  onChange={e => setSettings({...settings, siteUrl: e.target.value})}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">البريد الإلكتروني</label>
                <input
                  type="email"
                  value={settings.siteEmail}
                  onChange={e => setSettings({...settings, siteEmail: e.target.value})}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">رقم الهاتف</label>
                <input
                  type="tel"
                  value={settings.sitePhone}
                  onChange={e => setSettings({...settings, sitePhone: e.target.value})}
                  className="input-field"
                />
              </div>
            </div>
          </div>

          {/* Financial Settings */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span>💰</span>
              الإعدادات المالية
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">نسبة العمولة (%)</label>
                <input
                  type="number"
                  value={settings.commissionRate}
                  onChange={e => setSettings({...settings, commissionRate: Number(e.target.value)})}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">الحد الأدنى للسحب (دج)</label>
                <input
                  type="number"
                  value={settings.minWithdraw}
                  onChange={e => setSettings({...settings, minWithdraw: Number(e.target.value)})}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">الحد الأقصى للسحب (دج)</label>
                <input
                  type="number"
                  value={settings.maxWithdraw}
                  onChange={e => setSettings({...settings, maxWithdraw: Number(e.target.value)})}
                  className="input-field"
                />
              </div>
            </div>
          </div>

          {/* Payment Settings */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span>💳</span>
              إعدادات الدفع
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">حساب Baridimob</label>
                <input
                  type="text"
                  placeholder="00212345678965412"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">بريد الدعم</label>
                <input
                  type="email"
                  value={settings.supportEmail}
                  onChange={e => setSettings({...settings, supportEmail: e.target.value})}
                  className="input-field"
                />
              </div>
            </div>
          </div>

          {/* Platform Controls */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span>🎛️</span>
              Controls المنصة
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-medium">وضع الصيانة</p>
                  <p className="text-sm text-gray-500">إيقاف الموقع مؤقتاً للزوار</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.maintenanceMode}
                    onChange={e => setSettings({...settings, maintenanceMode: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-medium">تفعيل التسجيل</p>
                  <p className="text-sm text-gray-500">السماح للمستخدمين الجدد بالتسجيل</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.registrationEnabled}
                    onChange={e => setSettings({...settings, registrationEnabled: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-medium">تأكيد البريد الإلكتروني</p>
                  <p className="text-sm text-gray-500">يتطلب التحقق من البريد عند التسجيل</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.requireVerification}
                    onChange={e => setSettings({...settings, requireVerification: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </div>

          <button type="submit" className="btn-primary w-full py-4">
            💾 حفظ جميع الإعدادات
          </button>
        </form>
      </main>
    </div>
  );
};

export default Settings;