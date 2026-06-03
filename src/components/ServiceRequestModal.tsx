import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { OrderService, ServiceService, NotificationService } from '../services/store';

interface ServiceRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: any;
  seller: any;
  selectedPackage: 'basic' | 'standard' | 'premium';
  onSuccess?: (order: any) => void;
}

interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  file?: File;
}

const ServiceRequestModal: React.FC<ServiceRequestModalProps> = ({
  isOpen,
  onClose,
  service,
  seller,
  selectedPackage,
  onSuccess
}) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [description, setDescription] = useState('');
  const [serviceType, setServiceType] = useState<'normal' | 'professional'>('normal');
  const [budget, setBudget] = useState(service?.price?.[selectedPackage] || '');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'baridimob' | 'carteEdahabiya'>('carteEdahabiya');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  // Minimum budget for Algerian market
  const minBudgets: Record<string, { normal: number; professional: number }> = {
    'التصميم': { normal: 500, professional: 2000 },
    'التصميم الجرافيكي': { normal: 500, professional: 2000 },
    'التعليق الصوتي': { normal: 500, professional: 2000 },
    'إدارة مواقع التواصل الاجتماعي': { normal: 2000, professional: 8000 },
    'إنشاء العروض التقديمية': { normal: 1000, professional: 5000 },
    'إنشاء المنصات الإلكترونية': { normal: 10000, professional: 50000 },
    'default': { normal: 500, professional: 2000 },
  };

  const categoryBudget = minBudgets[service?.category] || minBudgets['default'];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        alert(`الملف ${file.name} كبير جداً. الحد الأقصى 10 ميجابايت`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const newAttachment: Attachment = {
          id: Math.random().toString(36).substring(2, 9),
          name: file.name,
          size: file.size,
          type: file.type,
          url: event.target?.result as string,
          file,
        };
        setAttachments(prev => [...prev, newAttachment]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!description.trim()) {
      alert('الرجاء كتابة وصف تفصيلي للمشروع');
      return;
    }

    if (serviceType === 'professional' && Number(budget) < categoryBudget.professional) {
      alert(`للمشاريع الاحترافية، الحد الأدنى للسعر هو ${categoryBudget.professional} دج`);
      return;
    }

    if (Number(budget) < categoryBudget.normal) {
      alert(`الحد الأدنى للسعر هو ${categoryBudget.normal} دج`);
      return;
    }

    setShowPayment(true);
  };

  const handlePayment = async () => {
    if (!cardNumber || !expiry || !cvv) {
      alert('الرجاء إدخال بيانات الدفع');
      return;
    }

    setIsSubmitting(true);

    try {
      // Get current user
      const currentUser = JSON.parse(localStorage.getItem('netvision_current_user') || '{}');

      if (!currentUser.id) {
        alert('الرجاء تسجيل الدخول أولاً');
        setIsSubmitting(false);
        return;
      }

      // Create order with rich data
      const orderAttachments = attachments.map(a => ({
        name: a.name,
        size: a.size,
        type: a.type,
        url: a.url, // Store the base64 URL
      }));

      const order = OrderService.create({
        serviceId: service.id,
        buyerId: currentUser.id,
        buyerName: currentUser.name,
        sellerId: seller?.id || service.sellerId,
        serviceTitle: service.title,
        package: selectedPackage,
        price: Number(budget),
        deliveryTime: service.deliveryTime[selectedPackage],
        description,
        serviceType,
        status: 'pending',
        requirements: JSON.stringify({
          attachments: orderAttachments,
        }),
      });

      // Browser notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('تم إرسال طلبك بنجاح!', {
          body: `رقم الطلب: ${order.id}\nالسعر: ${budget} دج`,
          dir: 'rtl',
          lang: 'ar',
        });
      }

      onSuccess?.(order);
      onClose();
      navigate('/orders');

    } catch (error) {
      console.error('Error creating order:', error);
      alert('حدث خطأ أثناء إنشاء الطلب');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-l from-primary to-secondary p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">طلب خدمة</h2>
              <p className="text-white/80 text-sm mt-1">{service?.title}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {!showPayment ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Service Type Selection */}
              <div>
                <label className="block text-sm font-bold mb-3 text-gray-700">نوع الخدمة</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setServiceType('normal')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      serviceType === 'normal'
                        ? 'border-primary bg-orange-50 text-primary'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-2">📋</div>
                    <p className="font-bold">عادي</p>
                    <p className="text-sm text-gray-500">تطوير عادي</p>
                    <p className="text-xs text-gray-400 mt-1">من {categoryBudget.normal} دج</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setServiceType('professional')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      serviceType === 'professional'
                        ? 'border-primary bg-orange-50 text-primary'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-2">💎</div>
                    <p className="font-bold">احترافي</p>
                    <p className="text-sm text-gray-500">مشروع متكامل</p>
                    <p className="text-xs text-gray-400 mt-1">من {categoryBudget.professional} دج</p>
                  </button>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700">
                  وصف الخدمة المطلوبة بالتفصيل <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="اكتب تفاصيل المشروع بشكل واضح ومفصل...
• ما الذي تحتاجه بالضبط؟
• ما هي المتطلبات الفنية؟
• هل لديك مراجع أو أمثلة؟
• ما هي المعايير التي ستستخدمها للتقييم؟"
                  className="w-full h-48 p-4 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-0 resize-none text-right"
                  required
                />
                <p className="text-xs text-gray-500 mt-1 text-right">
                  {description.length} حرف - الحد الأدنى 50 حرف
                </p>
              </div>

              {/* Budget */}
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700">
                  الميزانية المقترحة (دج) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={budget}
                    onChange={e => setBudget(e.target.value)}
                    className="w-full p-4 pr-16 border-2 border-gray-200 rounded-xl focus:border-primary text-xl font-bold"
                    min={serviceType === 'professional' ? categoryBudget.professional : categoryBudget.normal}
                    required
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">دج</span>
                </div>
                <div className="flex items-center gap-2 mt-2 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    Number(budget) >= (serviceType === 'professional' ? categoryBudget.professional : categoryBudget.normal)
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    الحد الأدنى: {serviceType === 'professional' ? categoryBudget.professional : categoryBudget.normal} دج
                  </span>
                </div>
              </div>

              {/* File Attachments */}
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700">
                  الملفات المرفقة <span className="text-gray-400 font-normal">(اختياري)</span>
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-primary hover:bg-orange-50/50 transition-colors"
                >
                  <div className="text-4xl mb-2">📎</div>
                  <p className="font-medium text-gray-700">اضغط لإرفاق ملفات</p>
                  <p className="text-sm text-gray-500 mt-1">PNG, JPG, PDF, MP3, WAV (حد أقصى 10MB لكل ملف)</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".png,.jpg,.jpeg,.pdf,.mp3,.wav,.doc,.docx"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {attachments.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {attachments.map(attachment => (
                      <div key={attachment.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                          {attachment.type.startsWith('image/') ? '🖼️' :
                           attachment.type.startsWith('audio/') ? '🎵' : '📄'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{attachment.name}</p>
                          <p className="text-xs text-gray-500">{formatFileSize(attachment.size)}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeAttachment(attachment.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-bold mb-3">ملخص الطلب</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">الباقة</span>
                    <span className="font-medium">{selectedPackage === 'basic' ? 'الأساسية' : selectedPackage === 'standard' ? 'القياسية' : 'الاحترافية'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">نوع الخدمة</span>
                    <span className="font-medium">{serviceType === 'normal' ? 'عادي' : 'احترافي'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">مدة التسليم</span>
                    <span className="font-medium">{service?.deliveryTime?.[selectedPackage]} أيام</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="font-bold">المجموع</span>
                    <span className="text-2xl font-bold text-primary">{budget} دج</span>
                  </div>
                </div>
              </div>

              <button type="submit" className="btn-primary w-full py-4 text-lg">
                <span>ادفع {budget} دج</span>
                <span>→</span>
              </button>
            </form>
          ) : (
            /* Payment Section */
            <div className="space-y-6">
              {/* Payment Method Selection */}
              <div>
                <h3 className="font-bold mb-3">اختر طريقة الدفع</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('carteEdahabiya')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      paymentMethod === 'carteEdahabiya'
                        ? 'border-primary bg-orange-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-3xl mb-2">💳</div>
                    <p className="font-bold text-sm">البطاقة الذهبية</p>
                    <p className="text-xs text-gray-500">Carte Edahabiya</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('baridimob')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      paymentMethod === 'baridimob'
                        ? 'border-primary bg-orange-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-3xl mb-2">📱</div>
                    <p className="font-bold text-sm">بريدي موب</p>
                    <p className="text-xs text-gray-500">Baridimob</p>
                  </button>
                </div>
              </div>

              {/* Payment Form */}
              {paymentMethod === 'carteEdahabiya' ? (
                <div className="space-y-4">
                  <div className="bg-gradient-to-l from-yellow-500 to-yellow-600 text-white p-4 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <span className="text-2xl font-bold">DZ</span>
                      </div>
                      <div>
                        <p className="font-bold">البطاقة الذهبية</p>
                        <p className="text-sm text-white/80">الدفع الآمن عبر CIB / EDAHABIYA</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">رقم البطاقة</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={e => setCardNumber(e.target.value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim())}
                        placeholder="0000 0000 0000 0000"
                        maxLength={19}
                        className="w-full p-4 border-2 border-gray-200 rounded-xl font-mono text-lg focus:border-primary"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">تاريخ الانتهاء</label>
                        <input
                          type="text"
                          value={expiry}
                          onChange={e => {
                            let value = e.target.value.replace(/\D/g, '');
                            if (value.length >= 2) {
                              value = value.slice(0, 2) + '/' + value.slice(2, 4);
                            }
                            setExpiry(value);
                          }}
                          placeholder="MM/YY"
                          maxLength={5}
                          className="w-full p-4 border-2 border-gray-200 rounded-xl font-mono focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">رمز الأمان (CVV)</label>
                        <input
                          type="text"
                          value={cvv}
                          onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                          placeholder="123"
                          maxLength={4}
                          className="w-full p-4 border-2 border-gray-200 rounded-xl font-mono focus:border-primary"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">اسم حامل البطاقة</label>
                      <input
                        type="text"
                        placeholder="الاسم كما هو مدون على البطاقة"
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-primary"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-gradient-to-l from-green-500 to-green-600 text-white p-4 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <span className="text-2xl font-bold">BM</span>
                      </div>
                      <div>
                        <p className="font-bold">الدفع عبر Baridimob</p>
                        <p className="text-sm text-white/80">آمن وموثوق 100%</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <p className="text-sm text-blue-800">
                      <strong>طريقة الدفع:</strong> قم بتحويل المبلغ إلى رقم الحساب التالي عبر تطبيق Baridimob أو من أي مكتب بريد.
                    </p>
                    <div className="mt-3 p-3 bg-white rounded-lg">
                      <p className="text-sm text-gray-600">رقم الحساب:</p>
                      <p className="font-mono font-bold text-lg">007 999 888 777 666 554 443</p>
                    </div>
                    <p className="text-xs text-blue-600 mt-2">
                      ⚠️ هذا وضع تجريبي - لن يتم خصم أي مبالغ حقيقية
                    </p>
                  </div>
                </div>
              )}

              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg">المجموع</span>
                  <span className="text-3xl font-bold text-primary">{budget} دج</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowPayment(false)}
                  className="flex-1 btn-outline py-4"
                >
                  رجوع
                </button>
                <button
                  type="button"
                  onClick={handlePayment}
                  disabled={isSubmitting}
                  className="flex-1 btn-primary py-4 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      جاري المعالجة...
                    </span>
                  ) : (
                    <span>تأكيد الدفع ({budget} دج)</span>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceRequestModal;