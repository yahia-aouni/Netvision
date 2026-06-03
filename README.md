# Netvision - منصة الخدمات الرقمية

<div align="center">

![Netvision Logo](https://raw.githubusercontent.com/nicehash/nicehashminer/main/logo.png#gh-light-mode-only)
![Netvision Logo](https://raw.githubusercontent.com/nicehash/nicehashminer/main/logo.png#gh-dark-mode-only)

**منصة خدمات رقمية جزائرية متكاملة** - بيع وشراء الخدمات المصغرة

[التحديثات](#التحديثات) •
[المميزات](#المميزات) •
[التثبيت المحلي](#التثبيت-المحلي) •
[النشر على Vercel](#النشر-على-vercel) •
[إعداد Supabase](#إعداد-supabase)

</div>

---

## نظرة عامة

Netvision هي منصة خدمات رقمية مبنية بـ React + TypeScript + TailwindCSS، مستوحاة من منصة خمسات. تم تصميمها خصيصاً للسوق الجزائري مع دعم الدفع عبر Baridimob.

---

## المميزات

### للمستخدمين
- 🔐 تسجيل دخول آمن (بائع / مشتري)
- 📦 تصفح الخدمات المصغرة
- 🛒 طلب خدمات مع مرفقات
- 💳 دفع آمن عبر Baridimob
- 📊 لوحة تحكم شاملة

### للبائعين
- ✏️ إكمال الملف الشخصي (سيرة ذاتية، أعمال، أسعار)
- 🎙️ دعم رفع الملفات الصوتية (للتعليق الصوتي)
- 📈 إدارة الطلبات والأرباح
- 💰 سحب الأرباح

### للإدارة
- 📊 لوحة تحكم متكاملة
- 👥 إدارة المستخدمين
- 🎯 مراجعة الخدمات
- 💰 إدارة المعاملات المالية
- ⚠️ حل النزاعات

---

## الفئات المدعومة

| الفئة | الوصف |
|-------|-------|
| 💻 البرمجة والتطوير | تطوير مواقع، تطبيقات، APIs |
| 🎨 التصميم الجرافيكي | شعارات، هويات بصرية، موشن جرافيك |
| 🎙️ التعليق الصوتي | فيديوهات، إعلانات، بودكاست |
| 📱 إدارة التواصل الاجتماعي | محتوى، جدولة، تحليلات |
| 📊 العروض التقديمية | PowerPoint احترافي |
| 🌐 المنصات الإلكترونية | Shopify، WordPress، etc |

---

## المتطلبات التقنية

- **Node.js** 18.x أو أحدث
- **pnpm** 8.x أو أحدث (موصى به)
- **Git** لإدارة الإصدارات

---

## التثبيت المحلي

### الخطوة 1: استنساخ المشروع

```bash
git clone https://github.com/your-username/netvision.git
cd netvision
```

### الخطوة 2: تثبيت الاعتماديات

```bash
# باستخدام pnpm (موصى به)
pnpm install

# أو باستخدام npm
npm install

# أو باستخدام yarn
yarn install
```

### الخطوة 3: نسخ ملف البيئة

```bash
# نسخ ملف .env.example إلى .env
cp .env.example .env
```

### الخطوة 4: تشغيل المشروع

```bash
# وضع التطوير
pnpm dev

# أو
npm run dev

# فتح المتصفح على: http://localhost:5173
```

### بيانات الدخول للاختبار

#### حساب المدير
- **البريد:** admin@netvision.dz
- **كلمة المرور:** admin123
- **الرابط:** http://localhost:5173/admin/login

#### حساب بائع/مشتري
- قم بإنشاء حساب جديد من صفحة التسجيل
- اختر دور "بائع" أو "مشتري"

---

## إعداد Supabase (للإنتاج)

### الخطوة 1: إنشاء مشروع Supabase

1. اذهب إلى [supabase.com](https://supabase.com)
2. أنشئ مشروع جديد
3. انتقل إلى **Settings > API**
4. انسخ **Project URL** و **anon public** key

### الخطوة 2: إعداد قواعد البيانات

```sql
-- إنشاء جدول المستخدمين (Users)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'buyer',
  status TEXT DEFAULT 'active',
  balance DECIMAL DEFAULT 0,
  rating DECIMAL DEFAULT 0,
  bio TEXT,
  skills TEXT[],
  avatar TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- إنشاء جدول الخدمات (Services)
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  seller_id UUID REFERENCES users(id),
  price_basic DECIMAL,
  price_standard DECIMAL,
  price_premium DECIMAL,
  delivery_basic INT,
  delivery_standard INT,
  delivery_premium INT,
  rating DECIMAL DEFAULT 0,
  reviews_count INT DEFAULT 0,
  image TEXT,
  status TEXT DEFAULT 'pending',
  features JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- إنشاء جدول الطلبات (Orders)
CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  service_id UUID REFERENCES services(id),
  buyer_id UUID REFERENCES users(id),
  seller_id UUID REFERENCES users(id),
  package TEXT,
  price DECIMAL NOT NULL,
  delivery_time INT,
  description TEXT,
  service_type TEXT DEFAULT 'normal',
  status TEXT DEFAULT 'pending',
  payment_status TEXT DEFAULT 'unpaid',
  requirements TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- إنشاء جدول المعاملات (Transactions)
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  type TEXT NOT NULL,
  amount DECIMAL NOT NULL,
  status TEXT DEFAULT 'pending',
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- تفعيل Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
```

### الخطوة 3: تحديث ملف .env

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

---

## النشر على Vercel

### الطريقة 1: عبر GitHub (موصى به)

#### الخطوة 1: رفع الكود على GitHub

```bash
# تهيئة Git
git init
git add .
git commit -m "Initial commit"

# إنشاء مستودع على GitHub ثم رفع
git remote add origin https://github.com/your-username/netvision.git
git push -u origin main
```

#### الخطوة 2: النشر من Vercel

1. اذهب إلى [vercel.com](https://vercel.com)
2. سجل دخول بحساب GitHub
3. انقر على **"New Project"**
4. اختر مستودع **netvision**
5. اضغط **"Import"**
6. في إعدادات البناء:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
7. أضف متغيرات البيئة من `.env`
8. انقر **"Deploy"**

#### الخطوة 3: إعداد النطاق المخصص (اختياري)

1. اذهب إلى **Settings > Domains**
2. أضف نطاقك (مثل: netvision.dz)
3. اتبع تعليمات DNS

### الطريقة 2: عبر Vercel CLI

```bash
# تثبيت Vercel CLI
npm i -g vercel

# تسجيل الدخول
vercel login

# النشر
cd netvision
vercel

# للنشر في الإنتاج
vercel --prod
```

---

## متغيرات البيئة

| المتغير | الوصف | مطلوب |
|---------|--------|--------|
| `VITE_APP_NAME` | اسم التطبيق | ✅ |
| `VITE_SUPABASE_URL` | رابط Supabase | ⚠️ للإنتاج |
| `VITE_SUPABASE_ANON_KEY` | مفتاح Supabase العام | ⚠️ للإنتاج |
| `VITE_BARIDIMOB_MERCHANT_ID` | معرف التاجر Baridimob | ⚠️ للدفع |
| `VITE_BARIDIMOB_API_KEY` | مفتاح API Baridimob | ⚠️ للدفع |
| `VITE_ENABLE_NOTIFICATIONS` | تفعيل الإشعارات | ❌ |

---

## هيكل المشروع

```
netvision/
├── public/                  # الملفات الثابتة
│   └── favicon.ico
├── src/
│   ├── components/          # المكونات
│   │   ├── admin/          # مكونات لوحة الإدارة
│   │   ├── Navbar.tsx      # شريط التنقل
│   │   ├── Footer.tsx      # التذييل
│   │   └── ServiceCard.tsx # بطاقة الخدمة
│   ├── pages/               # الصفحات
│   │   ├── Home.tsx        # الصفحة الرئيسية
│   │   ├── Services.tsx    # قائمة الخدمات
│   │   ├── Dashboard.tsx   # لوحة التحكم
│   │   ├── admin/          # صفحات الإدارة
│   │   └── ...
│   ├── services/
│   │   └── store.ts        # إدارة الحالة (LocalStorage)
│   ├── data/
│   │   └── mockData.ts    # البيانات التجريبية
│   ├── App.tsx             # المكون الرئيسي
│   └── main.tsx           # نقطة الدخول
├── .env.example            # نموذج متغيرات البيئة
├── index.html              # قالب HTML
├── package.json            # الاعتماديات
├── tailwind.config.js      # إعدادات Tailwind
├── vite.config.ts         # إعدادات Vite
└── tsconfig.json          # إعدادات TypeScript
```

---

## الأوامر المتاحة

| الأمر | الوصف |
|-------|-------|
| `pnpm dev` | تشغيل في وضع التطوير |
| `pnpm build` | بناء للإنتاج |
| `pnpm preview` | معاينة البناء |
| `pnpm lint` | فحص الكود |

---

## التحديثات

### الإصدار 1.0.0 (الحالي)
- ✅ واجهة RTL عربية كاملة
- ✅ لوحة تحكم بائع/مشتري
- ✅ لوحة إدارة متكاملة
- ✅ إكمال الملف الشخصي (3 خطوات)
- ✅ نظام الطلبات مع مرفقات
- ✅ إشعارات فورية
- ✅ تصميم متجاوب

### المخطط للإصدار 2.0
- 🔄 تكامل Supabase للبيانات
- 🔄 تكامل Baridimob للدفع
- 🔄 لوحة إشراف للبائعين
- 🔄 نظام التقييم والمراجعات

---

## المساهمة

نرحب بمساهماتكم! يرجى:

1. Fork المشروع
2. إنشاء فرع للميزة (`git checkout -b feature/amazing`)
3. commit التغييرات (`git commit -m 'Add amazing feature'`)
4. push إلى الفرع (`git push origin feature/amazing`)
5. فتح Pull Request

---

## الترخيص

MIT License - راجع ملف [LICENSE](LICENSE) للتفاصيل.

---

## التواصل

- 📧 البريد: support@netvision.dz
- 💬 Discord: انضم إلى مجتمعنا
- 📱 Twitter: [@NetvisionDZ](https://twitter.com/NetvisionDZ)

---

<div align="center">

صُنع بـ ❤️ في الجزائر

</div>