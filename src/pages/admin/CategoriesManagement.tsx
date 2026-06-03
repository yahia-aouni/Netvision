import React, { useState } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';

const CategoriesManagement: React.FC = () => {
  const adminToken = localStorage.getItem('admin_token');
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);

  const [categories, setCategories] = useState([
    { id: 1, name: 'التصميم', icon: '🎨', servicesCount: 156, status: 'active', color: 'bg-pink-500' },
    { id: 2, name: 'البرمجة', icon: '💻', servicesCount: 243, status: 'active', color: 'bg-blue-500' },
    { id: 3, name: 'الترجمة', icon: '🌍', servicesCount: 89, status: 'active', color: 'bg-green-500' },
    { id: 4, name: 'الفيديو', icon: '🎬', servicesCount: 67, status: 'active', color: 'bg-purple-500' },
    { id: 5, name: 'التسويق', icon: '📢', servicesCount: 134, status: 'active', color: 'bg-orange-500' },
    { id: 6, name: 'الكتابة', icon: '✍️', servicesCount: 78, status: 'active', color: 'bg-yellow-500' },
    { id: 7, name: 'تعليم', icon: '📚', servicesCount: 45, status: 'inactive', color: 'bg-gray-500' },
  ]);

  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('هل أنت متأكد من حذف هذا التصنيف؟')) {
      setCategories(categories.filter(c => c.id !== id));
    }
  };

  const handleToggleStatus = (id: number) => {
    setCategories(categories.map(c => {
      if (c.id === id) {
        return { ...c, status: c.status === 'active' ? 'inactive' : 'active' };
      }
      return c;
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setShowModal(false);
    setEditingCategory(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar />

      <main className="lg:mr-72 p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">إدارة التصنيفات</h1>
            <p className="text-gray-500">إجمالي {categories.length} تصنيف</p>
          </div>
          <button
            onClick={() => { setEditingCategory(null); setShowModal(true); }}
            className="btn-primary flex items-center gap-2"
          >
            <span>➕</span>
            <span>إضافة تصنيف جديد</span>
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map(category => (
            <div key={category.id} className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 ${category.color} rounded-xl flex items-center justify-center text-2xl text-white`}>
                    {category.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{category.name}</h3>
                    <p className="text-sm text-gray-500">{category.servicesCount} خدمة</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  category.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {category.status === 'active' ? 'نشط' : 'موقوف'}
                </span>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <button
                  onClick={() => handleEdit(category)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  ✏️ تعديل
                </button>
                <button
                  onClick={() => handleToggleStatus(category.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${
                    category.status === 'active'
                      ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {category.status === 'active' ? '⏸️ إيقاف' : '▶️ تفعيل'}
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  🗑️ حذف
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
              <h2 className="text-xl font-bold mb-6">{editingCategory ? 'تعديل التصنيف' : 'إضافة تصنيف جديد'}</h2>
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">اسم التصنيف</label>
                  <input
                    type="text"
                    defaultValue={editingCategory?.name || ''}
                    className="input-field"
                    placeholder="أدخل اسم التصنيف"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">الأيقونة (رمز Emoji)</label>
                  <input
                    type="text"
                    defaultValue={editingCategory?.icon || ''}
                    className="input-field"
                    placeholder="🎨"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">لون التصنيف</label>
                  <div className="flex gap-3">
                    {['bg-pink-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-yellow-500'].map(color => (
                      <label key={color} className="cursor-pointer">
                        <input type="radio" name="color" value={color} className="sr-only peer" />
                        <div className={`w-10 h-10 ${color} rounded-lg peer-checked:ring-2 peer-checked:ring-offset-2 peer-checked:ring-gray-400`}></div>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 btn-outline">
                    إلغاء
                  </button>
                  <button type="submit" className="flex-1 btn-primary">
                    {editingCategory ? 'حفظ التغييرات' : 'إضافة'}
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

export default CategoriesManagement;
