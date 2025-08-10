# سامانه اتوماسیون اداری و اعضا (UI + PHP API)

## اجرای یکپارچه روی یک هاست

- اجرا:
  ```bash
  cd api
  php -S 0.0.0.0:8080 -t public
  ```
- دسترسی:
  - UI: `http://localhost:8080/app/index.html`
  - API: مسیر پایه `/api`
- UI از قبل به `apiBaseUrl: '/api'` تنظیم شده است.

## اجرای جدا (اختیاری)
- UI (استاتیک):
  ```bash
  cd ui
  python3 -m http.server 5500
  ```
  سپس در `ui/index.html` مقدار `apiBaseUrl` را روی `http://localhost:8080/api` بگذارید.

- API (PHP): مطابق بخش بالا.

## اندپوینت‌ها
- GET `/api/auth/me`
- POST `/api/auth/login`  (دمو: admin/admin یا user/user)
- POST `/api/auth/logout`
- GET `/api/members`, GET `/api/members/{id}`
- GET `/api/letters?box=inbox|sent|drafts`, GET `/api/letters/{id}`
- POST `/api/letters` (type=draft)
- GET `/api/users`
- GET `/api/roles`
- POST `/api/users/{id}/role`
- GET `/api/org-structure`