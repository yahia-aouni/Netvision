import React, { useState, useEffect } from 'react';
import { OrderService, UserService, NotificationService } from '../services/store';

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  onStatusChange?: () => void;
}

interface ReviewData {
  rating: number;
  comment: string;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  isOpen,
  onClose,
  orderId,
  onStatusChange
}) => {
  const [order, setOrder] = useState<any>(null);
  const [buyer, setBuyer] = useState<any>(null);
  const [attachments, setAttachments] = useState<any[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewData, setReviewData] = useState<ReviewData>({ rating: 5, comment: '' });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    if (orderId) {
      const orderData = OrderService.getById(orderId);
      if (orderData) {
        setOrder(orderData);

        // Get buyer info
        const buyerData = UserService.getById(orderData.buyerId);
        setBuyer(buyerData);

        // Parse attachments from requirements
        if (orderData.requirements) {
          try {
            const reqData = JSON.parse(orderData.requirements);
            setAttachments(reqData.attachments || []);
          } catch {
            setAttachments([]);
          }
        }
      }
    }
  }, [orderId]);

  const formatFileSize = (bytes: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (type: string) => {
    if (!type) return '📁';
    if (type.startsWith('image/')) return '🖼️';
    if (type.startsWith('audio/')) return '🎵';
    if (type.startsWith('video/')) return '🎬';
    if (type.includes('pdf')) return '📄';
    if (type.includes('zip')) return '📦';
    if (type.includes('word') || type.includes('document')) return '📝';
    return '📁';
  };

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

  const handleDownloadFile = (file: any) => {
    // Create a temporary link to download the file
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    link.click();
  };

  const handleAcceptOrder = () => {
    if (order) {
      OrderService.updateStatus(order.id, 'accepted');
      NotificationService.create({
        type: 'order',
        title: '✓ تم قبول طلبك',
        message: `تم قبول طلبك "${order.serviceTitle}"`,
        orderId: order.id,
        read: false,
      });
      onStatusChange?.();
      onClose();
    }
  };

  const handleStartWork = () => {
    if (order) {
      OrderService.updateStatus(order.id, 'in_progress');
      onStatusChange?.();
      onClose();
    }
  };

  const handleSubmitReview = () => {
    if (!reviewData.comment.trim()) {
      alert('الرجاء كتابة تقييمك');
      return;
    }

    setIsSubmittingReview(true);

    // Save review (in a real app, this would be saved to the backend)
    const review = {
      id: Math.random().toString(36).substring(2, 11),
      orderId: order.id,
      rating: reviewData.rating,
      comment: reviewData.comment,
      createdAt: new Date().toISOString(),
    };

    // Store review in localStorage
    const reviews = JSON.parse(localStorage.getItem('netvision_reviews') || '[]');
    reviews.push(review);
    localStorage.setItem('netvision_reviews', JSON.stringify(reviews));

    // Update order status to completed if not already
    if (order.status !== 'completed') {
      OrderService.completeOrder(order.id);
    }

    setIsSubmittingReview(false);
    setShowReviewForm(false);
    onStatusChange?.();
    alert('شكراً لك! تم إرسال تقييمك بنجاح');
    onClose();
  };

  const renderStars = () => {
    return [1, 2, 3, 4, 5].map(star => (
      <button
        key={star}
        type="button"
        onClick={() => setReviewData({ ...reviewData, rating: star })}
        className={`text-3xl transition-colors ${star <= reviewData.rating ? 'text-yellow-400' : 'text-gray-300'}`}
      >
        ★
      </button>
    ));
  };

  if (!isOpen || !order) return null;

  const currentUser = JSON.parse(localStorage.getItem('netvision_current_user') || '{}');
  const isSeller = currentUser.role === 'seller';
  const canReview = !isSeller && order.status === 'delivered';

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-l from-primary to-secondary p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">تفاصيل الطلب</h2>
              <p className="text-white/80 text-sm mt-1">رقم الطلب: {order.id}</p>
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
          {/* Order Status */}
          <div className="flex items-center gap-4 mb-6">
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
              {getStatusLabel(order.status)}
            </span>
            <span className="text-gray-500 text-sm">
              {new Date(order.createdAt).toLocaleDateString('ar-DZ', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>

          {/* Service Info */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <h3 className="font-bold text-lg mb-2">{order.serviceTitle}</h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-500">الباقة:</span>
                <span className="font-medium mr-2">
                  {order.package === 'basic' ? 'أساسية' : order.package === 'standard' ? 'قياسية' : 'احترافية'}
                </span>
              </div>
              <div>
                <span className="text-gray-500">النوع:</span>
                <span className="font-medium mr-2">
                  {order.serviceType === 'professional' ? '🔷 احترافي' : '⚪ عادي'}
                </span>
              </div>
              <div>
                <span className="text-gray-500">المدة:</span>
                <span className="font-medium mr-2">{order.deliveryTime} يوم</span>
              </div>
              <div>
                <span className="text-gray-500">السعر:</span>
                <span className="font-bold text-primary mr-2">{order.price} دج</span>
              </div>
            </div>
          </div>

          {/* Client Info (for sellers) */}
          {isSeller && buyer && (
            <div className="bg-blue-50 rounded-xl p-4 mb-6">
              <h3 className="font-bold mb-3">👤 معلومات العميل</h3>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-xl">{buyer.name?.charAt(0) || '?'}</span>
                </div>
                <div>
                  <p className="font-medium">{buyer.name || 'عميل'}</p>
                  <p className="text-sm text-gray-500">{buyer.email || ''}</p>
                  {buyer.phone && <p className="text-sm text-gray-500">{buyer.phone}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="mb-6">
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <span>📝</span>
              <span>تفاصيل المشروع</span>
            </h3>
            <div className="bg-white border-2 border-gray-100 rounded-xl p-4">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {order.description || 'لا يوجد وصف'}
              </p>
            </div>
          </div>

          {/* Attachments */}
          {attachments.length > 0 && (
            <div className="mb-6">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <span>📎</span>
                <span>الملفات المرفقة ({attachments.length})</span>
              </h3>
              <div className="space-y-2">
                {attachments.map((file, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary text-xl">
                      {getFileIcon(file.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{file.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                    <button
                      onClick={() => handleDownloadFile(file)}
                      className="px-3 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary/90 transition-colors flex items-center gap-1"
                    >
                      <span>⬇️</span>
                      <span>تحميل</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Delivered Files (for buyers) */}
          {!isSeller && order.deliveryFiles && order.deliveryFiles.length > 0 && (
            <div className="mb-6">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <span>📦</span>
                <span>العمل المسلّم ({order.deliveryFiles.length})</span>
              </h3>
              <div className="space-y-2">
                {order.deliveryFiles.map((file: any, index: number) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 text-xl">
                      {getFileIcon(file.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{file.name}</p>
                    </div>
                    <button
                      onClick={() => handleDownloadFile(file)}
                      className="px-3 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition-colors flex items-center gap-1"
                    >
                      <span>⬇️</span>
                      <span>تحميل</span>
                    </button>
                  </div>
                ))}
              </div>

              {order.deliveryMessage && (
                <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                  <p className="text-gray-700">{order.deliveryMessage}</p>
                </div>
              )}
            </div>
          )}

          {/* Review Form */}
          {showReviewForm ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
              <h3 className="font-bold mb-4">⭐ قيم هذا الطلب</h3>

              {/* Star Rating */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-gray-600">تقييمك:</span>
                <div className="flex gap-1">
                  {renderStars()}
                </div>
              </div>

              {/* Comment */}
              <textarea
                value={reviewData.comment}
                onChange={e => setReviewData({ ...reviewData, comment: e.target.value })}
                placeholder="اكتب تقييمك هنا... ما الذي أعجبك؟ هل هناك شيء يمكن تحسينه؟"
                className="w-full h-32 p-4 border-2 border-gray-200 rounded-xl focus:border-primary resize-none mb-4"
              />

              <div className="flex gap-3">
                <button
                  onClick={handleSubmitReview}
                  disabled={isSubmittingReview}
                  className="flex-1 bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {isSubmittingReview ? 'جاري الإرسال...' : 'إرسال التقييم'}
                </button>
                <button
                  onClick={() => setShowReviewForm(false)}
                  className="px-6 py-3 border-2 border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </div>
          ) : canReview ? (
            <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-green-800">تم تسليم العمل!</h3>
                  <p className="text-sm text-green-600 mt-1">هل أنت راضٍ عن العمل؟ قيم هذا الطلب</p>
                </div>
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <span>⭐</span>
                  <span>قيّم الطلب</span>
                </button>
              </div>
            </div>
          ) : null}

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            {isSeller && order.status === 'pending' && (
              <button
                onClick={handleAcceptOrder}
                className="flex-1 bg-primary text-white py-4 rounded-xl font-medium hover:bg-primary/90 transition-colors"
              >
                ✓ قبول الطلب
              </button>
            )}

            {isSeller && order.status === 'accepted' && (
              <button
                onClick={handleStartWork}
                className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-medium hover:bg-blue-700 transition-colors"
              >
                ▶️ بدء التنفيذ
              </button>
            )}

            {!isSeller && order.status === 'delivered' && !order.completedAt && (
              <button
                onClick={() => {
                  if (confirm('هل أنت متأكد من إتمام الطلب؟')) {
                    OrderService.completeOrder(order.id);
                    onStatusChange?.();
                    onClose();
                  }
                }}
                className="flex-1 bg-green-600 text-white py-4 rounded-xl font-medium hover:bg-green-700 transition-colors"
              >
                ✓ إتمام الطلب
              </button>
            )}

            <button
              onClick={onClose}
              className="px-6 py-4 border-2 border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;