# Nashama 2026 — Production Version

موقع احترافي للمنتخب الأردني في كأس العالم 2026، مبني كبنية إنتاج من البداية:

- Frontend ثابت سريع: HTML/CSS/JavaScript.
- API proxy جاهز: `/api/live`, `/api/fixtures`, `/api/standings`, `/api/events`, `/api/health`.
- لا يتم كشف مفتاح API في المتصفح.
- قائمة الأردن النهائية مدمجة من قائمة FIFA الرسمية الصادرة 12 يونيو 2026.
- بيانات المباريات الرسمية للمجموعة J موجودة كـ fallback عند فشل المزود أو غياب المفتاح.

## التشغيل المحلي

```bash
npm install
cp .env.example .env
# ضع مفتاحك في .env
npm run dev
```

افتح:

```txt
http://localhost:3000
```

## تفعيل الربط الحي

ضع في ملف `.env`:

```env
API_FOOTBALL_KEY=your_real_key
API_FOOTBALL_TEAM_ID=632
API_FOOTBALL_LEAGUE_ID=1
API_FOOTBALL_SEASON=2026
```

ثم افتح:

```txt
http://localhost:3000/api-status.html
```

## النشر على Vercel

1. ارفع المشروع إلى GitHub.
2. افتح Vercel واختر المشروع.
3. أضف Environment Variables:
   - `API_FOOTBALL_KEY`
   - `API_FOOTBALL_TEAM_ID`
   - `API_FOOTBALL_LEAGUE_ID`
   - `API_FOOTBALL_SEASON`
4. Deploy.

## مصادر البيانات المضمنة

- FIFA official squad list — Version 12 June 2026.
- Group J schedule seed: Austria vs Jordan, Jordan vs Algeria, Jordan vs Argentina.

## ملاحظة مهمة

هذه النسخة ليست تحديثًا يدويًا. الواجهة مصممة لتطلب البيانات من `/api/*` دائمًا. بيانات fallback موجودة فقط حتى لا ينهار الموقع عند غياب المفتاح أو عند فشل المزود.
