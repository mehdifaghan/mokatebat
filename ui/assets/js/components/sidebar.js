import { Auth } from '../auth.js';

function link(href, text) {
  return `<li><a href="#${href}" data-href="${href}">${text}</a></li>`;
}

export function renderSidebar(container) {
  const isAuth = Auth.isAuthenticated();
  container.innerHTML = `
    <div class="nav-section">
      <div class="nav-title">عمومی</div>
      <ul class="nav">${link('/','داشبورد')}</ul>
    </div>

    ${isAuth ? `
    <div class="nav-section">
      <div class="nav-title">اعضا</div>
      <ul class="nav">${link('/members','لیست اعضا')}</ul>
    </div>

    <div class="nav-section">
      <div class="nav-title">اتوماسیون اداری</div>
      <ul class="nav">
        ${link('/automation/inbox','نامه‌های دریافتی')}
        ${link('/automation/sent','نامه‌های ارسالی')}
        ${link('/automation/drafts','پیش‌نویس‌ها')}
        ${link('/automation/users','کاربران')}
        ${link('/automation/roles','نقش‌ها')}
        ${link('/automation/org-structure','ساختار اداری')}
      </ul>
    </div>` : `
    <div class="nav-section">
      <div class="nav-title">دسترسی</div>
      <ul class="nav">${link('/login','ورود')}</ul>
    </div>`}
  `;
}

export function highlightActiveLink(activePath) {
  const links = document.querySelectorAll('.sidebar a[data-href]');
  links.forEach(a => {
    if (a.getAttribute('data-href') === activePath) a.classList.add('active');
    else a.classList.remove('active');
  });
}