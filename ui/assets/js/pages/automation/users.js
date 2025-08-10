import { API } from '../../api.js';

function row(user) {
  return `<tr>
    <td>${user.id ?? '—'}</td>
    <td>${user.fullName ?? '—'}</td>
    <td>${user.username ?? '—'}</td>
    <td><span class="badge">${user.role ?? 'کاربر'}</span></td>
  </tr>`;
}

export default async function UsersPage(outlet) {
  const panel = document.createElement('div');
  panel.className = 'panel';
  panel.innerHTML = `
    <div class="toolbar">
      <div class="right"><h2 style="margin:0">کاربران</h2></div>
      <div class="left"></div>
    </div>
    <div class="panel" style="padding:0; overflow:auto;">
      <table class="table">
        <thead>
          <tr>
            <th>شناسه</th>
            <th>نام</th>
            <th>نام کاربری</th>
            <th>نقش</th>
          </tr>
        </thead>
        <tbody id="rows"><tr><td colspan="4">در حال بارگذاری...</td></tr></tbody>
      </table>
    </div>
  `;
  outlet.appendChild(panel);

  const rows = panel.querySelector('#rows');

  async function load() {
    rows.innerHTML = `<tr><td colspan="4">در حال بارگذاری...</td></tr>`;
    try {
      const data = await API.getUsers();
      const items = Array.isArray(data?.items) ? data.items : (Array.isArray(data) ? data : []);
      rows.innerHTML = items.length ? items.map(row).join('') : `<tr><td colspan="4">موردی یافت نشد</td></tr>`;
    } catch (e) {
      rows.innerHTML = `<tr><td colspan="4">خطا در دریافت داده</td></tr>`;
      // eslint-disable-next-line no-console
      console.error(e);
    }
  }

  load();
}