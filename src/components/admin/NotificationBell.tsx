import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { NotificationService } from '../../services/store';

interface Notification {
  id: string;
  type: 'order' | 'service' | 'user' | 'payment' | 'system' | 'delivery';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  orderId?: string;
  orderDetails?: {
    clientName?: string;
    serviceTitle?: string;
    description?: string;
    price?: number;
    serviceType?: 'normal' | 'professional';
    package?: 'basic' | 'standard' | 'premium';
    deliveryFiles?: { name: string; url: string }[];
    deliveryMessage?: string;
  };
}

interface ToastData {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
}

const NotificationBell: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [toasts, setToasts] = useState<ToastData[]>([]);

  // Toast helper functions
  const showToast = useCallback((type: ToastData['type'], title: string, message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    const toast: ToastData = { id, type, title, message };
    setToasts(prev => [...prev, toast]);

    // Auto-remove after 4 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const hideToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Load notifications
  const loadNotifications = useCallback(() => {
    const all = NotificationService.getAll();
    const newNotifications = all.slice(0, 20);
    const newUnreadCount = NotificationService.getUnreadCount();

    // Check for new notifications (for toast)
    if (newUnreadCount > unreadCount && unreadCount > 0) {
      const latestUnread = newNotifications.find(n => !n.read);
      if (latestUnread) {
        showToast('info', latestUnread.title, latestUnread.message);
      }
    }

    setNotifications(newNotifications);
    setUnreadCount(newUnreadCount);
  }, [unreadCount, showToast]);

  // Initial load and polling
  useEffect(() => {
    loadNotifications();

    // Poll for new notifications every 5 seconds
    const interval = setInterval(loadNotifications, 5000);

    return () => clearInterval(interval);
  }, [loadNotifications]);

  // Request browser notification permission
  useEffect(() => {
    NotificationService.requestPermission();
  }, []);

  const handleMarkAsRead = (id: string) => {
    NotificationService.markAsRead(id);
    loadNotifications();
  };

  const handleMarkAllAsRead = () => {
    NotificationService.markAllAsRead();
    loadNotifications();
  };

  const handleDelete = (id: string) => {
    NotificationService.delete(id);
    loadNotifications();
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      handleMarkAsRead(notification.id);
    }

    // Navigate based on notification type
    switch (notification.type) {
      case 'order':
        navigate('/orders');
        break;
      case 'service':
        navigate('/seller/dashboard');
        break;
      default:
        break;
    }

    setIsOpen(false);
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'order': return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
      case 'service': return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      );
      case 'user': return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      );
      case 'payment': return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      );
      case 'system': return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
      default: return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2 2 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      );
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'order': return 'bg-blue-100 text-blue-600';
      case 'service': return 'bg-green-100 text-green-600';
      case 'user': return 'bg-purple-100 text-purple-600';
      case 'payment': return 'bg-yellow-100 text-yellow-600';
      case 'system': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getToastStyles = (type: ToastData['type']) => {
    switch (type) {
      case 'success': return 'bg-green-500 text-white';
      case 'error': return 'bg-red-500 text-white';
      case 'warning': return 'bg-yellow-500 text-gray-900';
      case 'info': return 'bg-blue-500 text-white';
    }
  };

  const getToastIcon = (type: ToastData['type']) => {
    switch (type) {
      case 'success': return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
      case 'error': return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
      case 'warning': return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      );
      case 'info': return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff < 60000) return 'الآن';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} دقيقة`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} ساعة`;
    return `${Math.floor(diff / 86400000)} يوم`;
  };

  return (
    <>
      {/* Toast Container */}
      <div className="fixed bottom-4 left-4 z-[9999] space-y-3">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 p-4 rounded-xl shadow-2xl animate-slide-in ${getToastStyles(toast.type)}`}
            style={{ minWidth: '320px', maxWidth: '420px' }}
          >
            <span className="flex-shrink-0">{getToastIcon(toast.type)}</span>
            <div className="flex-1">
              <p className="font-bold text-sm">{toast.title}</p>
              <p className="text-sm opacity-90">{toast.message}</p>
            </div>
            <button
              onClick={() => hideToast(toast.id)}
              className="flex-shrink-0 p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      <div className="relative">
        {/* Bell Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative p-2 text-purple-200 hover:bg-purple-800 rounded-lg transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2 2 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* Notifications Dropdown */}
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <div className="absolute left-0 top-full mt-2 w-80 bg-white rounded-xl shadow-2xl z-50 overflow-hidden">
              {/* Header */}
              <div className="p-4 bg-purple-600 text-white flex items-center justify-between">
                <h3 className="font-bold flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2 2 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  التنبيهات
                  {unreadCount > 0 && (
                    <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">{unreadCount}</span>
                  )}
                </h3>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-sm bg-purple-500 px-3 py-1 rounded-lg hover:bg-purple-400 transition-colors"
                  >
                    قراءة الكل
                  </button>
                )}
              </div>

              {/* Notifications List */}
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2 2 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                    </div>
                    <p className="font-medium">لا توجد تنبيهات</p>
                    <p className="text-sm text-gray-400 mt-1">ستظهر التنبيهات هنا</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`p-4 border-b hover:bg-gray-50 transition-colors cursor-pointer ${
                        !notification.read ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 ${getNotificationColor(notification.type)} rounded-full flex items-center justify-center flex-shrink-0`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900">{notification.title}</p>
                          <p className="text-sm text-gray-500 mt-1 whitespace-pre-line">{notification.message}</p>

                          {/* Rich order details */}
                          {notification.orderDetails && (
                            <div className="mt-2 p-3 bg-white rounded-lg border border-gray-200 text-xs">
                              {notification.orderDetails.clientName && (
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-gray-500">العميل:</span>
                                  <span className="font-medium">{notification.orderDetails.clientName}</span>
                                </div>
                              )}
                              {notification.orderDetails.serviceTitle && (
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-gray-500">الخدمة:</span>
                                  <span className="font-medium">{notification.orderDetails.serviceTitle}</span>
                                </div>
                              )}
                              {notification.orderDetails.price && (
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-gray-500">السعر:</span>
                                  <span className="font-medium text-primary">{notification.orderDetails.price} دج</span>
                                </div>
                              )}
                              {notification.orderDetails.serviceType && (
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-gray-500">النوع:</span>
                                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                                    notification.orderDetails.serviceType === 'professional'
                                      ? 'bg-purple-100 text-purple-700'
                                      : 'bg-gray-100 text-gray-600'
                                  }`}>
                                    {notification.orderDetails.serviceType === 'professional' ? 'احترافي' : 'عادي'}
                                  </span>
                                </div>
                              )}
                              {notification.orderDetails.description && (
                                <div className="mt-2 pt-2 border-t">
                                  <span className="text-gray-500 block mb-1">الوصف:</span>
                                  <p className="text-gray-700 line-clamp-2">{notification.orderDetails.description}</p>
                                </div>
                              )}
                            </div>
                          )}

                          <p className="text-xs text-gray-400 mt-2">{formatTime(notification.createdAt)}</p>
                        </div>
                        <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                          {!notification.read && (
                            <button
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              title="قراءة"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(notification.id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="حذف"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="p-3 bg-gray-50 text-center border-t">
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-sm text-purple-600 hover:text-purple-800 font-medium transition-colors"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default NotificationBell;