import React, { useState, useRef } from 'react';
import { OrderService } from '../services/store';

interface DeliveryWorkModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: {
    id: string;
    serviceTitle: string;
    buyerName: string;
    price: number;
    description: string;
    status: string;
  };
  onDeliveryComplete?: () => void;
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  file?: File;
}

const DeliveryWorkModal: React.FC<DeliveryWorkModalProps> = ({
  isOpen,
  onClose,
  order,
  onDeliveryComplete
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [deliveryMessage, setDeliveryMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Allowed file types and max size
  const ALLOWED_TYPES = [
    'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
    'application/pdf',
    'application/zip', 'application/x-zip-compressed',
    'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg',
    'video/mp4', 'video/webm',
    'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return '🖼️';
    if (type.startsWith('audio/')) return '🎵';
    if (type.startsWith('video/')) return '🎬';
    if (type.includes('pdf')) return '📄';
    if (type.includes('zip')) return '📦';
    if (type.includes('word') || type.includes('document')) return '📝';
    return '📁';
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      // Validate type
      if (!ALLOWED_TYPES.includes(file.type)) {
        alert(`نوع الملف ${file.name} غير مدعوم`);
        return;
      }

      // Validate size
      if (file.size > MAX_FILE_SIZE) {
        alert(`الملف ${file.name} كبير جداً. الحد الأقصى 50 ميجابايت`);
        return;
      }

      // Read file
      const reader = new FileReader();
      reader.onload = (event) => {
        const newFile: UploadedFile = {
          id: Math.random().toString(36).substring(2, 11),
          name: file.name,
          size: file.size,
          type: file.type,
          url: event.target?.result as string,
          file,
        };
        setUploadedFiles(prev => [...prev, newFile]);
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    e.target.value = '';
  };

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (uploadedFiles.length === 0) {
      alert('الرجاء إرفاق ملف واحد على الأقل');
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare files for storage
      const files = uploadedFiles.map(f => ({
        name: f.name,
        url: f.url,
        type: f.type,
      }));

      // Deliver work
      OrderService.deliverWork(order.id, files, deliveryMessage);

      // Call callback
      onDeliveryComplete?.();

      // Show success and close
      alert('تم تسليم العمل بنجاح!');
      onClose();

      // Reset form
      setUploadedFiles([]);
      setDeliveryMessage('');
    } catch (error) {
      console.error('Error delivering work:', error);
      alert('حدث خطأ أثناء تسليم العمل');
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
              <h2 className="text-2xl font-bold">تسليم العمل</h2>
              <p className="text-white/80 text-sm mt-1">{order.serviceTitle}</p>
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
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Order Summary */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-bold mb-3">ملخص الطلب</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">العميل:</span>
                  <span className="font-medium mr-2">{order.buyerName}</span>
                </div>
                <div>
                  <span className="text-gray-500">السعر:</span>
                  <span className="font-medium text-primary mr-2">{order.price} دج</span>
                </div>
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-bold mb-3 text-gray-700">
                📎 الملفات المرفقة <span className="text-red-500">*</span>
              </label>

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-primary hover:bg-orange-50/50 transition-colors"
              >
                <div className="text-4xl mb-2">📤</div>
                <p className="font-medium text-gray-700">اسحب الملفات هنا أو اضغط للاختيار</p>
                <p className="text-sm text-gray-500 mt-2">
                  صور، PDF، ZIP، MP3، MP4، DOC (حد أقصى 50MB لكل ملف)
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept={ALLOWED_TYPES.join(',')}
                onChange={handleFileSelect}
                className="hidden"
              />

              {/* Uploaded Files List */}
              {uploadedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  {uploadedFiles.map(file => (
                    <div key={file.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary text-xl">
                        {getFileIcon(file.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{file.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(file.id)}
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

              {/* File count badge */}
              <div className="mt-2 text-center">
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  {uploadedFiles.length} ملف
                </span>
              </div>
            </div>

            {/* Delivery Message */}
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700">
                💬 رسالة التسليم (اختياري)
              </label>
              <textarea
                value={deliveryMessage}
                onChange={e => setDeliveryMessage(e.target.value)}
                placeholder="اكتب رسالة للعميل تشرح فيها ما تم تسليمه..."
                className="w-full h-32 p-4 border-2 border-gray-200 rounded-xl focus:border-primary resize-none"
              />
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">ℹ️</span>
                <div>
                  <p className="font-medium text-blue-800">معلومات مهمة</p>
                  <ul className="text-sm text-blue-600 mt-1 space-y-1">
                    <li>• سيتم إشعار العميل فوراً عند تسليم العمل</li>
                    <li>• يمكن للعميل مراجعة الملفات والموافقة أو طلب تعديلات</li>
                    <li>• لن يتم تحويل الأموال إلا بعد موافقة العميل</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || uploadedFiles.length === 0}
              className="btn-primary w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>جاري التسليم...</span>
                </>
              ) : (
                <>
                  <span>📦</span>
                  <span>تسليم العمل الآن</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DeliveryWorkModal;