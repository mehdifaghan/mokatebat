import { API } from '../../api.js';

function row(member) {
  const status = member.status || 'فعال';
  return `<tr>
    <td>${member.code ?? '—'}</td>
    <td>${member.fullName ?? '—'}</td>
    <td>${member.nationalId ?? '—'}</td>
    <td><span class="badge">${status}</span></td>
    <td><a class="button" href="#/members/${encodeURIComponent(member.id)}">مشاهده</a></td>
  </tr>`;
}

export default async function MembersListPage(outlet) {
  const wrapper = document.createElement('div');
  wrapper.className = 'panel';
  wrapper.innerHTML = `
    <div class="toolbar">
      <div class="right">
        <h2 style="margin:0">لیست اعضا</h2>
      </div>
      <div class="left">
        <input id="q" class="input" placeholder="جستجوی نام/کد ملی" />
        <button id="search" class="button primary">جستجو</button>
      </div>
    </div>
    <div class="panel" style="padding:0; overflow:auto;">
      <table class="table">
        <thead>
          <tr>
            <th>کد</th>
            <th>نام و نام خانوادگی</th>
            <th>کد ملی</th>
            <th>وضعیت</th>
            <th>عملیات</th>
          </tr>
        </thead>
        <tbody id="rows"><tr><td colspan="5">در حال بارگذاری...</td></tr></tbody>
      </table>
    </div>
  `;
  outlet.appendChild(wrapper);

  const rows = wrapper.querySelector('#rows');
  const q = wrapper.querySelector('#q');
  const searchBtn = wrapper.querySelector('#search');

  async function load() {
    rows.innerHTML = `<tr><td colspan="5">در حال بارگذاری...</td></tr>`;
    try {
      const data = await API.getMembers({ q: q.value });
      const members = Array.isArray(data?.items) ? data.items : (Array.isArray(data) ? data : []);
      if (!members.length) {
        rows.innerHTML = `<tr><td colspan="5">موردی یافت نشد</td></tr>`;
        return;
      }
      rows.innerHTML = members.map(row).join('');
    } catch (e) {
      rows.innerHTML = `<tr><td colspan="5">خطا در دریافت داده</td></tr>`;
      // eslint-disable-next-line no-console
      console.error(e);
    }
  }

  searchBtn.addEventListener('click', load);
  q.addEventListener('keydown', (e) => { if (e.key === 'Enter') load(); });
  load();
}