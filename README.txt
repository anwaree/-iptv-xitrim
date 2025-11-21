ixstrim IPTV - Simple project (Front + Admin)
=============================================
محتويات المشروع:
- index.html             : الواجهة الرئيسية (يعرض السيرفرات فقط + إعلانات)
- admin/dashboard.html   : لوحة تحكم موحدة (تسجيل دخول + إدارة السيرفرات/المشرفين/Extreme/Ads)
- admin/login.html       : redirect to dashboard (placeholder)
- assets/js/admin.js     : منطق لوحة التحكم (localStorage)
- database.json          : بيانات تجريبية أولية
- assets/css/style.css   : ملف CSS احتياطي (نستخدم Tailwind CDN لأساسيات)

تعليمات سريعة:
1) افتح index.html لمعاينة واجهة التحميل (سيقرأ localStorage إن وُجد، وإلا سيستخدم database.json).
2) افتح admin/dashboard.html لتسجيل الدخول. الحساب الافتراضي: admin / admin123
3) استخدم لوحة التحكم لإضافة سيرفرات/مشرفين/حسابات Extreme ولصق كود AdSense.
4) البيانات تحفظ في localStorage (key: ix_database_v1) — يمكنك تصدير أو تعديل database.json يدوياً.

ملاحظة أمان:
- هذه نسخة محلية للتجربة. تخزين كلمات المرور أو أكواد الإعلانات في localStorage غير آمن للإنتاج.
- للتشغيل على الإنترنت بشكل آمن، يُنصح بإضافة باك-إند مع مصادقة وحفظ في قاعدة بيانات مؤمّنة.
