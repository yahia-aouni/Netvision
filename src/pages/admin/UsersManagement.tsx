import React, { useState, useEffect, useCallback } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { UserService, NotificationService } from '../../services/store';

interface User {
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
  createdAt: string;
}

const UsersManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Load users from store
  const loadUsers = useCallback(() => {
    const allUsers = UserService.getAll();
    // Don't show admin in the list
    setUsers(allUsers.filter(u => u.role !== 'admin'));
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || user.role === filterType;
    return matchesSearch && matchesType;
  });

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
      UserService.delete(id);
      loadUsers();
      // Create notification
      NotificationService.create({
        type: 'user',
        title: 'تم حذف مستخدم',
        message: `تم حذف مستخدم من المنصة`,
        read: false,
      });
    }
  };

  // APPROVE - Make provider visible to clients
  const handleApprove = (id: string) => {
    const user = users.find(u => u.id === id);
    if (user) {
      UserService.update(id, { status: 'active' });
      loadUsers(); // Refresh list
      NotificationService.create({
        type: 'user',
        title: '✓ تم تفعيل الحساب',
        message: `تم تفعيل حساب "${user.name}" بنجاح - أصبح ظاهراً للعملاء`,
        read: false,
      });
    }
  };

  // REJECT - Keep provider hidden from clients
  const handleReject = (id: string) => {
    if (confirm('هل أنت متأكد من رفض هذا الطلب؟')) {
      const user = users.find(u => u.id === id);
      UserService.update(id, { status: 'suspended' });
      loadUsers();
      NotificationService.create({
        type: 'user',
        title: '✗ تم رفض الطلب',
        message: `تم رفض طلب "${user?.name}" - الحساب غير مفعّل`,
        read: false,
      });
    }
  };

  const handleStatusToggle = (id: string) => {
    const user = users.find(u => u.id === id);
    if (user) {
      const newStatus = user.status === 'active' ? 'suspended' : 'active';
      UserService.update(id, { status: newStatus });
      loadUsers();
      // Create notification
      NotificationService.create({
        type: 'user',
        title: newStatus === 'active' ? 'تم تفعيل حساب' : 'تم إيقاف حساب',
        message: `تم ${newStatus === 'active' ? 'تفعيل' : 'إيقاف'} حساب ${user.name}`,
        read: false,
      });
    }
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (editingUser) {
      // Update existing user
      UserService.update(editingUser.id, {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        role: formData.get('role') as 'seller' | 'buyer',
        status: formData.get('status') as 'active' | 'suspended',
      });
      NotificationService.create({
        type: 'user',
        title: 'تم تحديث مستخدم',
        message: `تم تحديث بيانات ${formData.get('name')}`,
        read: false,
      });
    } else {
      // Create new user
      UserService.create({
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        password: formData.get('password') as string || 'password123',
        role: formData.get('role') as 'seller' | 'buyer',
        status: 'active',
        balance: 0,
        rating: 0,
        reviewsCount: 0,
        completedOrders: 0,
      });
      NotificationService.create({
        type: 'user',
        title: 'مستخدم جديد',
        message: `تم إضافة مستخدم جديد: ${formData.get('name')}`,
        read: false,
      });
    }

    setShowModal(false);
    setEditingUser(null);
    loadUsers();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar />

      <main className="lg:mr-72 p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">إدارة المستخدمين</h1>
            <p className="text-gray-500">إجمالي {users.length} مستخدم</p>
          </div>
          <button
            onClick={() => { setEditingUser(null); setShowModal(true); }}
            className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-medium hover:opacity-90 transition-all flex items-center gap-2"
          >
            <span>➕</span>
            <span>إضافة مستخدم</span>
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="ابحث بالاسم أو البريد الإلكتروني..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className="px-4 py-3 rounded-xl border border-gray-200 bg-gray-50"
            >
              <option value="all">جميع الأنواع</option>
              <option value="seller">مستقلين</option>
              <option value="buyer">عملاء</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-right text-gray-600 text-sm">
                  <th className="p-4 font-medium">المستخدم</th>
                  <th className="p-4 font-medium">البريد الإلكتروني</th>
                  <th className="p-4 font-medium">الهاتف</th>
                  <th className="p-4 font-medium">النوع</th>
                  <th className="p-4 font-medium">الرصيد</th>
                  <th className="p-4 font-medium">الحالة</th>
                  <th className="p-4 font-medium">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id} className="border-t hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-xs text-gray-400">#{user.id.slice(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">{user.email}</td>
                    <td className="p-4 text-gray-600">{user.phone}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.role === 'seller' ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'
                      }`}>
                        {user.role === 'seller' ? 'مستقل' : 'عميل'}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-primary">{user.balance.toLocaleString()} دج</td>
                    <td className="p-4">
                      {/* STATUS BADGE - Shows pending status for sellers */}
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.status === 'active' ? 'bg-green-100 text-green-700' :
                        user.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {user.status === 'active' ? 'نشط' : user.status === 'pending' ? 'في انتظار الموافقة' : 'موقوف'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {/* Show APPROVE/REJECT buttons for PENDING sellers */}
                        {user.role === 'seller' && user.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(user.id)}
                              className="px-3 py-1 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 transition-colors flex items-center gap-1"
                              title="موافقة"
                            >
                              ✓ موافقة
                            </button>
                            <button
                              onClick={() => handleReject(user.id)}
                              className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700 transition-colors flex items-center gap-1"
                              title="رفض"
                            >
                              ✗ رفض
                            </button>
                          </>
                        )}

                        {/* Regular actions for other users */}
                        {user.status !== 'pending' && (
                          <>
                            <button
                              onClick={() => handleEdit(user)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="تعديل"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleStatusToggle(user.id)}
                              className={`p-2 rounded-lg transition-colors ${
                                user.status === 'active'
                                  ? 'text-yellow-600 hover:bg-yellow-50'
                                  : 'text-green-600 hover:bg-green-50'
                              }`}
                              title={user.status === 'active' ? 'إيقاف' : 'تفعيل'}
                            >
                              {user.status === 'active' ? '⏸️' : '▶️'}
                            </button>
                          </>
                        )}

                        <button
                          onClick={() => handleDelete(user.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="حذف"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit/Add Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
              <h2 className="text-xl font-bold mb-6">{editingUser ? 'تعديل المستخدم' : 'إضافة مستخدم جديد'}</h2>
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">الاسم</label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={editingUser?.name || ''}
                    className="input-field"
                    placeholder="أدخل اسم المستخدم"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">البريد الإلكتروني</label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={editingUser?.email || ''}
                    className="input-field"
                    placeholder="example@email.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">رقم الهاتف</label>
                  <input
                    type="tel"
                    name="phone"
                    defaultValue={editingUser?.phone || ''}
                    className="input-field"
                    placeholder="05XXXXXXXX"
                    required
                  />
                </div>
                {!editingUser && (
                  <div>
                    <label className="block text-sm font-medium mb-2">كلمة المرور</label>
                    <input
                      type="password"
                      name="password"
                      className="input-field"
                      placeholder="كلمة المرور"
                      defaultValue="password123"
                    />
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">نوع الحساب</label>
                    <select name="role" defaultValue={editingUser?.role || 'buyer'} className="input-field">
                      <option value="buyer">عميل</option>
                      <option value="seller">مستقل</option>
                    </select>
                  </div>
                  {editingUser && (
                    <div>
                      <label className="block text-sm font-medium mb-2">الحالة</label>
                      <select name="status" defaultValue={editingUser?.status || 'active'} className="input-field">
                        <option value="active">نشط</option>
                        <option value="suspended">موقوف</option>
                      </select>
                    </div>
                  )}
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50">
                    إلغاء
                  </button>
                  <button type="submit" className="flex-1 px-4 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl">
                    {editingUser ? 'حفظ التغييرات' : 'إضافة'}
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

export default UsersManagement;