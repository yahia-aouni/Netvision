// ==========================================
// Netvision - Real State Management System
// LocalStorage-based CRUD Operations
// ==========================================

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'admin' | 'seller' | 'buyer';
  status: 'active' | 'suspended' | 'pending';
  balance: number;
  rating: number;
  reviewsCount: number;
  completedOrders: number;
  avatar?: string;
  bio?: string;
  skills?: string[];
  portfolio?: { type: 'image' | 'audio'; url: string; title: string }[];
  createdAt: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
  sellerId: string;
  price: { basic: number; standard: number; premium: number };
  deliveryTime: { basic: number; standard: number; premium: number };
  rating: number;
  reviewsCount: number;
  image: string;
  status: 'active' | 'pending' | 'rejected' | 'paused';
  features: { basic: string[]; standard: string[]; premium: string[] };
  createdAt: string;
}

export interface Order {
  id: string;
  serviceId: string;
  buyerId: string;
  sellerId: string;
  buyerName: string;
  serviceTitle: string;
  package: 'basic' | 'standard' | 'premium';
  price: number;
  deliveryTime: number;
  description: string;
  serviceType: 'normal' | 'professional';
  status: 'pending' | 'accepted' | 'in_progress' | 'delivered' | 'completed' | 'cancelled' | 'disputed';
  paymentStatus: 'unpaid' | 'paid' | 'refunded';
  requirements?: string;
  // Delivery fields
  deliveryFiles?: { name: string; url: string; type: string }[];
  deliveryMessage?: string;
  deliveredAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'deposit' | 'withdrawal' | 'order_payment' | 'order_received' | 'commission';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  description: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  type: 'order' | 'service' | 'user' | 'payment' | 'system' | 'delivery';
  title: string;
  message: string;
  // Rich notification data
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
  read: boolean;
  createdAt: string;
}

// Storage Keys
const STORAGE_KEYS = {
  USERS: 'netvision_users',
  SERVICES: 'netvision_services',
  ORDERS: 'netvision_orders',
  TRANSACTIONS: 'netvision_transactions',
  NOTIFICATIONS: 'netvision_notifications',
  CURRENT_USER: 'netvision_current_user',
  ADMIN_USER: 'netvision_admin',
};

// Helper Functions
const generateId = () => Math.random().toString(36).substring(2, 15);

const getFromStorage = <T>(key: string): T[] => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveToStorage = <T>(key: string, data: T[]): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

// ==========================================
// User Management
// ==========================================

export const UserService = {
  // Initialize default admin if not exists
  initDefaultAdmin: () => {
    const users = getFromStorage<User>(STORAGE_KEYS.USERS);
    const adminExists = users.find(u => u.role === 'admin');

    if (!adminExists) {
      const admin: User = {
        id: generateId(),
        name: 'مدير النظام',
        email: 'admin@netvision.dz',
        phone: '0555000000',
        password: 'admin123',
        role: 'admin',
        status: 'active',
        balance: 0,
        rating: 0,
        reviewsCount: 0,
        completedOrders: 0,
        createdAt: new Date().toISOString(),
      };
      users.push(admin);
      saveToStorage(STORAGE_KEYS.USERS, users);
    }
  },

  // Get all users
  getAll: (): User[] => getFromStorage<User>(STORAGE_KEYS.USERS),

  // Get user by ID
  getById: (id: string): User | undefined => {
    const users = getFromStorage<User>(STORAGE_KEYS.USERS);
    return users.find(u => u.id === id);
  },

  // Get users by role
  getByRole: (role: 'admin' | 'seller' | 'buyer'): User[] => {
    const users = getFromStorage<User>(STORAGE_KEYS.USERS);
    return users.filter(u => u.role === role);
  },

  // Create user
  create: (userData: Omit<User, 'id' | 'createdAt'>): User => {
    const users = getFromStorage<User>(STORAGE_KEYS.USERS);
    const newUser: User = {
      ...userData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    saveToStorage(STORAGE_KEYS.USERS, users);
    return newUser;
  },

  // Update user
  update: (id: string, updates: Partial<User>): User | null => {
    const users = getFromStorage<User>(STORAGE_KEYS.USERS);
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return null;

    users[index] = { ...users[index], ...updates };
    saveToStorage(STORAGE_KEYS.USERS, users);
    return users[index];
  },

  // Delete user
  delete: (id: string): boolean => {
    const users = getFromStorage<User>(STORAGE_KEYS.USERS);
    const filtered = users.filter(u => u.id !== id);
    if (filtered.length === users.length) return false;

    saveToStorage(STORAGE_KEYS.USERS, filtered);
    return true;
  },

  // Login
  login: (email: string, password: string): User | null => {
    const users = getFromStorage<User>(STORAGE_KEYS.USERS);
    const user = users.find(u => u.email === email && u.password === password && u.status === 'active');
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      return user;
    }
    return null;
  },

  // Admin login
  adminLogin: (email: string, password: string): User | null => {
    const users = getFromStorage<User>(STORAGE_KEYS.USERS);
    const admin = users.find(u => u.email === email && u.password === password && u.role === 'admin');
    if (admin) {
      localStorage.setItem(STORAGE_KEYS.ADMIN_USER, JSON.stringify(admin));
      return admin;
    }
    return null;
  },

  // Logout
  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem(STORAGE_KEYS.ADMIN_USER);
  },

  // Get current user
  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  },

  // Get admin user
  getAdminUser: (): User | null => {
    const data = localStorage.getItem(STORAGE_KEYS.ADMIN_USER);
    return data ? JSON.parse(data) : null;
  },

  // Check if is admin
  isAdmin: (): boolean => {
    return UserService.getAdminUser() !== null;
  },

  // Check if logged in
  isLoggedIn: (): boolean => {
    return UserService.getCurrentUser() !== null || UserService.getAdminUser() !== null;
  },
};

// ==========================================
// Service Management
// ==========================================

export const ServiceService = {
  // Initialize default services if empty
  initDefaultServices: () => {
    const services = getFromStorage<Service>(STORAGE_KEYS.SERVICES);
    if (services.length === 0) {
      const defaultServices: Service[] = [
        {
          id: generateId(),
          title: 'سأصمم لك شعار احترافي يعكس هوية علامتك التجارية',
          description: 'هل تبحث عن شعار فريد ومميز يعكس شخصية علامتك التجارية؟ أنا مصمم محترف بخبرة 8 سنوات.',
          category: 'التصميم',
          sellerId: 'default-seller-1',
          price: { basic: 50, standard: 100, premium: 200 },
          deliveryTime: { basic: 3, standard: 5, premium: 7 },
          rating: 4.9,
          reviewsCount: 245,
          image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&h=400&fit=crop',
          status: 'active',
          features: {
            basic: ['تصميم شعار واحد', 'ملف PNG', '3 تعديلات'],
            standard: ['تصميم 3 شعارات', 'ملفات PNG + SVG', '5 تعديلات'],
            premium: ['تصميم 5 شعارات', 'ملفات بكافة الصيغ', 'تعديلات غير محدودة']
          },
          createdAt: new Date().toISOString(),
        },
        {
          id: generateId(),
          title: 'سأبني لك موقع ويب احترافي بتقنية React',
          description: 'سأقوم ببناء موقع ويب احترافي وسريع باستخدام React و TypeScript.',
          category: 'البرمجة والتطوير',
          sellerId: 'default-seller-2',
          price: { basic: 200, standard: 400, premium: 800 },
          deliveryTime: { basic: 7, standard: 14, premium: 30 },
          rating: 4.8,
          reviewsCount: 189,
          image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=400&fit=crop',
          status: 'active',
          features: {
            basic: ['صفحة واحدة', 'تصميم متجاوب', '5 أقسام'],
            standard: ['5 صفحات', 'تصميم متجاوب', 'نظام إدارة محتوى'],
            premium: ['10+ صفحات', 'تصميم متجاوب', 'نظام إدارة محتوى متقدم']
          },
          createdAt: new Date().toISOString(),
        },
        {
          id: generateId(),
          title: 'سأترجم لك documents من العربية إلى الإنجليزية',
          description: 'أقدم خدمات ترجمة احترافية بين العربية والإنجليزية في مجالات متعددة.',
          category: 'الترجمة',
          sellerId: 'default-seller-3',
          price: { basic: 30, standard: 60, premium: 120 },
          deliveryTime: { basic: 2, standard: 5, premium: 10 },
          rating: 4.7,
          reviewsCount: 156,
          image: 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=600&h=400&fit=crop',
          status: 'active',
          features: {
            basic: ['ترجمة حتى 1000 كلمة', 'تدقيق أساسي'],
            standard: ['ترجمة حتى 3000 كلمة', 'تدقيق كامل'],
            premium: ['ترجمة غير محدودة', 'تدقيق متقدم']
          },
          createdAt: new Date().toISOString(),
        },
      ];
      saveToStorage(STORAGE_KEYS.SERVICES, defaultServices);
    }
  },

  // Get all services
  getAll: (): Service[] => getFromStorage<Service>(STORAGE_KEYS.SERVICES),

  // Get service by ID
  getById: (id: string): Service | undefined => {
    const services = getFromStorage<Service>(STORAGE_KEYS.SERVICES);
    return services.find(s => s.id === id);
  },

  // Get services by seller
  getBySeller: (sellerId: string): Service[] => {
    const services = getFromStorage<Service>(STORAGE_KEYS.SERVICES);
    return services.filter(s => s.sellerId === sellerId);
  },

  // Get active services
  getActive: (): Service[] => {
    const services = getFromStorage<Service>(STORAGE_KEYS.SERVICES);
    return services.filter(s => s.status === 'active');
  },

  // Create service
  create: (serviceData: Omit<Service, 'id' | 'createdAt'>): Service => {
    const services = getFromStorage<Service>(STORAGE_KEYS.SERVICES);
    const newService: Service = {
      ...serviceData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    services.push(newService);
    saveToStorage(STORAGE_KEYS.SERVICES, services);
    return newService;
  },

  // Update service
  update: (id: string, updates: Partial<Service>): Service | null => {
    const services = getFromStorage<Service>(STORAGE_KEYS.SERVICES);
    const index = services.findIndex(s => s.id === id);
    if (index === -1) return null;

    services[index] = { ...services[index], ...updates };
    saveToStorage(STORAGE_KEYS.SERVICES, services);
    return services[index];
  },

  // Delete service
  delete: (id: string): boolean => {
    const services = getFromStorage<Service>(STORAGE_KEYS.SERVICES);
    const filtered = services.filter(s => s.id !== id);
    if (filtered.length === services.length) return false;

    saveToStorage(STORAGE_KEYS.SERVICES, filtered);
    return true;
  },

  // Approve service
  approve: (id: string): Service | null => {
    return ServiceService.update(id, { status: 'active' });
  },

  // Reject service
  reject: (id: string): Service | null => {
    return ServiceService.update(id, { status: 'rejected' });
  },

  // Pause service
  pause: (id: string): Service | null => {
    return ServiceService.update(id, { status: 'paused' });
  },
};

// ==========================================
// Order Management
// ==========================================

export const OrderService = {
  // Get all orders
  getAll: (): Order[] => getFromStorage<Order>(STORAGE_KEYS.ORDERS),

  // Get order by ID
  getById: (id: string): Order | undefined => {
    const orders = getFromStorage<Order>(STORAGE_KEYS.ORDERS);
    return orders.find(o => o.id === id);
  },

  // Get orders by buyer
  getByBuyer: (buyerId: string): Order[] => {
    const orders = getFromStorage<Order>(STORAGE_KEYS.ORDERS);
    return orders.filter(o => o.buyerId === buyerId);
  },

  // Get orders by seller
  getBySeller: (sellerId: string): Order[] => {
    const orders = getFromStorage<Order>(STORAGE_KEYS.ORDERS);
    return orders.filter(o => o.sellerId === sellerId);
  },

  // Get pending orders (for admin)
  getPending: (): Order[] => {
    const orders = getFromStorage<Order>(STORAGE_KEYS.ORDERS);
    return orders.filter(o => o.status === 'pending');
  },

  // Create order
  create: (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Order => {
    const orders = getFromStorage<Order>(STORAGE_KEYS.ORDERS);
    const now = new Date().toISOString();
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${generateId().toUpperCase()}`,
      createdAt: now,
      updatedAt: now,
      paymentStatus: 'unpaid',
    };
    orders.push(newOrder);
    saveToStorage(STORAGE_KEYS.ORDERS, orders);

    // Rich notification for ADMIN
    NotificationService.create({
      type: 'order',
      title: '📋 طلب خدمة جديد!',
      message: `عميل: ${orderData.buyerName} | الخدمة: ${orderData.serviceTitle} | السعر: ${orderData.price} دج`,
      orderId: newOrder.id,
      orderDetails: {
        clientName: orderData.buyerName,
        serviceTitle: orderData.serviceTitle,
        description: orderData.description,
        price: orderData.price,
        serviceType: orderData.serviceType,
        package: orderData.package,
      },
      read: false,
    });

    // Rich notification for SELLER (service provider)
    const sellerNotification: any = {
      type: 'order',
      title: '🎉 لديك طلب خدمة جديد!',
      message: `عميل: ${orderData.buyerName}\n${orderData.serviceTitle}\nالسعر: ${orderData.price} دج\nالنوع: ${orderData.serviceType === 'professional' ? 'احترافي' : 'عادي'}`,
      orderId: newOrder.id,
      orderDetails: {
        clientName: orderData.buyerName,
        serviceTitle: orderData.serviceTitle,
        description: orderData.description,
        price: orderData.price,
        serviceType: orderData.serviceType,
        package: orderData.package,
      },
      read: false,
    };
    NotificationService.create(sellerNotification);

    // Browser notification for admin
    NotificationService.sendBrowserNotification(
      'طلب خدمة جديد!',
      `${orderData.buyerName} - ${orderData.serviceTitle} - ${orderData.price} دج`
    );

    return newOrder;
  },

  // Update order status
  updateStatus: (id: string, status: Order['status']): Order | null => {
    const orders = getFromStorage<Order>(STORAGE_KEYS.ORDERS);
    const index = orders.findIndex(o => o.id === id);
    if (index === -1) return null;

    orders[index] = { ...orders[index], status, updatedAt: new Date().toISOString() };
    saveToStorage(STORAGE_KEYS.ORDERS, orders);
    return orders[index];
  },

  // Update payment status
  updatePaymentStatus: (id: string, paymentStatus: Order['paymentStatus']): Order | null => {
    const orders = getFromStorage<Order>(STORAGE_KEYS.ORDERS);
    const index = orders.findIndex(o => o.id === id);
    if (index === -1) return null;

    orders[index] = { ...orders[index], paymentStatus, updatedAt: new Date().toISOString() };
    saveToStorage(STORAGE_KEYS.ORDERS, orders);
    return orders[index];
  },

  // Deliver work - add files and message
  deliverWork: (
    id: string,
    files: { name: string; url: string; type: string }[],
    message: string
  ): Order | null => {
    const orders = getFromStorage<Order>(STORAGE_KEYS.ORDERS);
    const index = orders.findIndex(o => o.id === id);
    if (index === -1) return null;

    const now = new Date().toISOString();
    orders[index] = {
      ...orders[index],
      status: 'delivered',
      deliveryFiles: files,
      deliveryMessage: message,
      deliveredAt: now,
      updatedAt: now,
    };
    saveToStorage(STORAGE_KEYS.ORDERS, orders);

    const order = orders[index];

    // Notify CLIENT about delivery
    NotificationService.create({
      type: 'delivery',
      title: '📦 تم تسليم العمل!',
      message: `تم تسليم العمل على طلب "${order.serviceTitle}"\n${message ? `رسالة: ${message}` : ''}`,
      orderId: order.id,
      orderDetails: {
        serviceTitle: order.serviceTitle,
        deliveryFiles: files,
        deliveryMessage: message,
      },
      read: false,
    });

    // Browser notification
    NotificationService.sendBrowserNotification(
      'تم تسليم العمل!',
      `تم تسليم العمل على طلب "${order.serviceTitle}"`
    );

    return orders[index];
  },

  // Complete order
  completeOrder: (id: string): Order | null => {
    const orders = getFromStorage<Order>(STORAGE_KEYS.ORDERS);
    const index = orders.findIndex(o => o.id === id);
    if (index === -1) return null;

    const now = new Date().toISOString();
    orders[index] = {
      ...orders[index],
      status: 'completed',
      completedAt: now,
      updatedAt: now,
    };
    saveToStorage(STORAGE_KEYS.ORDERS, orders);
    return orders[index];
  },
};

// ==========================================
// Notification System
// ==========================================

export const NotificationService = {
  // Get all notifications
  getAll: (): Notification[] => getFromStorage<Notification>(STORAGE_KEYS.NOTIFICATIONS),

  // Get unread notifications
  getUnread: (): Notification[] => {
    const notifications = getFromStorage<Notification>(STORAGE_KEYS.NOTIFICATIONS);
    return notifications.filter(n => !n.read);
  },

  // Get unread count
  getUnreadCount: (): number => {
    return NotificationService.getUnread().length;
  },

  // Create notification
  create: (notificationData: Omit<Notification, 'id' | 'createdAt'>): Notification => {
    const notifications = getFromStorage<Notification>(STORAGE_KEYS.NOTIFICATIONS);
    const newNotification: Notification = {
      ...notificationData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    notifications.unshift(newNotification);
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, notifications);
    return newNotification;
  },

  // Mark as read
  markAsRead: (id: string): void => {
    const notifications = getFromStorage<Notification>(STORAGE_KEYS.NOTIFICATIONS);
    const index = notifications.findIndex(n => n.id === id);
    if (index !== -1) {
      notifications[index].read = true;
      saveToStorage(STORAGE_KEYS.NOTIFICATIONS, notifications);
    }
  },

  // Mark all as read
  markAllAsRead: (): void => {
    const notifications = getFromStorage<Notification>(STORAGE_KEYS.NOTIFICATIONS);
    notifications.forEach(n => n.read = true);
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, notifications);
  },

  // Delete notification
  delete: (id: string): void => {
    const notifications = getFromStorage<Notification>(STORAGE_KEYS.NOTIFICATIONS);
    const filtered = notifications.filter(n => n.id !== id);
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, filtered);
  },

  // Clear all notifications
  clearAll: (): void => {
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, []);
  },

  // Send browser notification
  sendBrowserNotification: (title: string, body: string): void => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        dir: 'rtl',
        lang: 'ar',
      });
    }
  },

  // Request notification permission
  requestPermission: async (): Promise<boolean> => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  },
};

// ==========================================
// Transaction Management
// ==========================================

export const TransactionService = {
  // Get all transactions
  getAll: (): Transaction[] => getFromStorage<Transaction>(STORAGE_KEYS.TRANSACTIONS),

  // Get transactions by user
  getByUser: (userId: string): Transaction[] => {
    const transactions = getFromStorage<Transaction>(STORAGE_KEYS.TRANSACTIONS);
    return transactions.filter(t => t.userId === userId);
  },

  // Create transaction
  create: (transactionData: Omit<Transaction, 'id' | 'createdAt'>): Transaction => {
    const transactions = getFromStorage<Transaction>(STORAGE_KEYS.TRANSACTIONS);
    const newTransaction: Transaction = {
      ...transactionData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    transactions.unshift(newTransaction);
    saveToStorage(STORAGE_KEYS.TRANSACTIONS, transactions);
    return newTransaction;
  },

  // Update transaction status
  updateStatus: (id: string, status: Transaction['status']): Transaction | null => {
    const transactions = getFromStorage<Transaction>(STORAGE_KEYS.TRANSACTIONS);
    const index = transactions.findIndex(t => t.id === id);
    if (index === -1) return null;

    transactions[index] = { ...transactions[index], status };
    saveToStorage(STORAGE_KEYS.TRANSACTIONS, transactions);
    return transactions[index];
  },
};

// ==========================================
// Initialize Data
// ==========================================

export const initializeData = () => {
  UserService.initDefaultAdmin();
  ServiceService.initDefaultServices();
};

// Export default
export default {
  UserService,
  ServiceService,
  OrderService,
  NotificationService,
  TransactionService,
  initializeData,
};