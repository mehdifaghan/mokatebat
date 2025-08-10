import { API } from '../../api.js';

function row(letter) {
  const d = letter.date ? new Intl.DateTimeFormat('fa-IR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(letter.date)) : '—';
  return `<tr>
    <td>${letter.id ?? '—'}</td>
    <td>${letter.subject ?? '—'}</td>
    <td>${letter.receiverName ?? '—'}</td>
    <td>${d}</td>
    <td><span class="badge">${letter.status ?? 'ارسال‌شده'}</span></td>
  </tr>`;
}

export default async function SentPage(outlet) {
  const panel = document.createElement('div');
  panel.className = 'panel';
  panel.innerHTML = `
    <div class="toolbar">
      <div class="right"><h2 style="margin:0">نامه‌های ارسالی</h2></div>
      <div class="left">
        <input id="q" class="input" placeholder="جستجو" />
        <button id="search" class="button">فیلتر</button>
      </div>
    </div>
    <div class="panel" style="padding:0; overflow:auto;">
      <table class="table">
        <thead>
          <tr>
            <th>شناسه</th>
            <th>موضوع</th>
            <th>گیرنده</th>
            <th>تاریخ</th>
            <th>وضعیت</th>
          </tr>
        </thead>
        <tbody id="rows"><tr><td colspan="5">در حال بارگذاری...</td></tr></tbody>
      </table>
    </div>
  `;
  outlet.appendChild(panel);

  const rows = panel.querySelector('#rows');
  const q = panel.querySelector('#q');
  const searchBtn = panel.querySelector('#search');

  async function load() {
    rows.innerHTML = `<tr><td colspan="5">در حال بارگذاری...</td></tr>`;
    try {
      const data = await API.getLetters('sent', { q: q.value });
      const items = Array.isArray(data?.items) ? data.items : (Array.isArray(data) ? data : []);
      rows.innerHTML = items.length ? items.map(row).join('') : `<tr><td colspan="5">موردی یافت نشد</td></tr>`;
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