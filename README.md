# سامانه اتوماسیون اداری و اعضا (UI + PHP API)

## اجرای سریع

- UI استاتیک:
  - مسیر `ui/index.html` را روی هر وب‌سروری سرو کنید یا مستقیماً در مرورگر باز کنید.
  - آدرس API را در `index.html` با مقدار `window.UI_CONFIG.apiBaseUrl` تنظیم کنید (پیش‌فرض: `/api`).

- API PHP (بدون فریم‌ورک):
  - پیش‌نیاز: PHP 8+
  - اجرا:
    ```bash
    cd api
    php -S 0.0.0.0:8080 -t public
    ```
  - اندپوینت‌ها:
    - GET `/auth/me`
    - POST `/auth/login`  (دمو: admin/admin یا user/user)
    - POST `/auth/logout`
    - GET `/members`, GET `/members/{id}`
    - GET `/letters?box=inbox|sent|drafts`, GET `/letters/{id}`
    - POST `/letters` (type=draft)
    - GET `/users`
    - GET `/roles`
    - POST `/users/{id}/role`
    - GET `/org-structure`

## نکات
- ذخیره‌سازی فایل‌محور در `api/storage` با داده‌های نمونه Seed شده.
- اگر UI و API روی پورت/دومین متفاوت اجرا می‌شوند، `apiBaseUrl` را مثل `http://localhost:8080` ست کنید.