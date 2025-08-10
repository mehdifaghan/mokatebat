import { API } from '../../api.js';

export default async function RolesPage(outlet) {
  const panel = document.createElement('div');
  panel.className = 'panel';
  panel.innerHTML = `
    <div class="toolbar">
      <div class="right"><h2 style="margin:0">مدیریت نقش‌ها</h2></div>
      <div class="left"></div>
    </div>
    <div class="panel" style="padding:0; overflow:auto;">
      <table class="table">
        <thead>
          <tr>
            <th>شناسه کاربر</th>
            <th>نام</th>
            <th>نام کاربری</th>
            <th>نقش</th>
            <th>ذخیره</th>
          </tr>
        </thead>
        <tbody id="rows"><tr><td colspan="5">در حال بارگذاری...</td></tr></tbody>
      </table>
    </div>
  `;
  outlet.appendChild(panel);

  const rows = panel.querySelector('#rows');

  try {
    const [rolesData, usersData] = await Promise.all([
      API.getRoles(),
      API.getUsers(),
    ]);
    const roles = Array.isArray(rolesData?.items) ? rolesData.items : (Array.isArray(rolesData) ? rolesData : []);
    const users = Array.isArray(usersData?.items) ? usersData.items : (Array.isArray(usersData) ? usersData : []);

    rows.innerHTML = users.map(u => {
      const options = roles.map(r => `<option value="${r.name ?? r}">${r.name ?? r}</option>`).join('');
      return `<tr>
        <td>${u.id}</td>
        <td>${u.fullName ?? '—'}</td>
        <td>${u.username ?? '—'}</td>
        <td>
          <select class="select role" data-user="${u.id}">
            ${options}
          </select>
        </td>
        <td><button class="button save" data-user="${u.id}">ذخیره</button></td>
      </tr>`;
    }).join('');

    // set current roles
    rows.querySelectorAll('select.role').forEach(sel => {
      const userId = sel.getAttribute('data-user');
      const user = users.find(x => String(x.id) === String(userId));
      if (user?.role) sel.value = user.role;
    });

    rows.querySelectorAll('button.save').forEach(btn => {
      btn.addEventListener('click', async () => {
        const userId = btn.getAttribute('data-user');
        const sel = rows.querySelector(`select.role[data-user="${userId}"]`);
        const role = sel?.value;
        btn.disabled = true;
        try {
          await API.updateUserRole(userId, role);
          btn.textContent = 'ذخیره شد';
          setTimeout(() => (btn.textContent = 'ذخیره'), 1500);
        } catch (e) {
          btn.textContent = 'خطا';
          // eslint-disable-next-line no-console
          console.error(e);
          setTimeout(() => (btn.textContent = 'ذخیره'), 1500);
        } finally {
          btn.disabled = false;
        }
      });
    });
  } catch (e) {
    rows.innerHTML = `<tr><td colspan="5">خطا در دریافت داده</td></tr>`;
    // eslint-disable-next-line no-console
    console.error(e);
  }
}