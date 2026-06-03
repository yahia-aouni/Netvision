import React from 'react';

interface RoleSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (role: 'buyer' | 'seller' | 'admin') => void;
}

const RoleSelectionModal: React.FC<RoleSelectionModalProps> = ({ isOpen, onClose, onSelect }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      <div
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-8 animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 left-4 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-3xl">N</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">مرحباً بك في Netvision!</h2>
          <p className="text-gray-500">اختر كيف تريد البدء</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Buyer Card */}
          <button
            onClick={() => onSelect('buyer')}
            className="group p-6 rounded-2xl border-2 border-gray-200 hover:border-primary hover:bg-primary/5 transition-all text-center"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <span className="text-4xl">🛒</span>
            </div>
            <h3 className="text-xl font-bold mb-2">صاحب مشروع</h3>
            <p className="text-sm text-gray-500 mb-4">أبحث عن مستقلين لتنفيذ مشاريعي</p>
            <span className="text-primary font-medium group-hover:text-primary-dark">
              أبدأ كعميل ←
            </span>
          </button>

          {/* Seller Card */}
          <button
            onClick={() => onSelect('seller')}
            className="group p-6 rounded-2xl border-2 border-gray-200 hover:border-secondary hover:bg-secondary/5 transition-all text-center"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <span className="text-4xl">💼</span>
            </div>
            <h3 className="text-xl font-bold mb-2">مستقل</h3>
            <p className="text-sm text-gray-500 mb-4">أقدم خدماتي وأكسب المال</p>
            <span className="text-secondary font-medium group-hover:text-secondary-dark">
              أبدأ كبائع ←
            </span>
          </button>

          {/* Admin Card */}
          <button
            onClick={() => onSelect('admin')}
            className="group p-6 rounded-2xl border-2 border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-all text-center"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <span className="text-4xl">⚙️</span>
            </div>
            <h3 className="text-xl font-bold mb-2">المشرف</h3>
            <p className="text-sm text-gray-500 mb-4">إدارة المنصة والمحتوى</p>
            <span className="text-purple-600 font-medium group-hover:text-purple-700">
              لوحة التحكم ←
            </span>
          </button>
        </div>

        <p className="text-center text-sm text-gray-400 mt-6">
          يمكنك تغيير اختيارك في أي وقت من ملفك الشخصي
        </p>
      </div>
    </div>
  );
};

export default RoleSelectionModal;