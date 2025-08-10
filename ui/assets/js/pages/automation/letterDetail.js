import { API } from '../../api.js';

export default async function LetterDetailPage(outlet, params) {
  const id = params?.id;
  const panel = document.createElement('div');
  panel.className = 'panel';
  panel.innerHTML = `
    <div class="toolbar">
      <div class="right"><h2 style="margin:0">جزئیات نامه</h2></div>
      <div class="left"><a class="button ghost" href="#/automation/inbox">بازگشت</a></div>
    </div>
    <div id="body">در حال بارگذاری...</div>
  `;
  outlet.appendChild(panel);

  const body = panel.querySelector('#body');
  try {
    const data = await API.getLetterById(id);
    const l = data?.item || data || {};
    const dateStr = l.date ? new Intl.DateTimeFormat('fa-IR', { dateStyle: 'full', timeStyle: 'short' }).format(new Date(l.date)) : '—';
    body.innerHTML = `
      <div class="card-grid">
        <div class="card"><div class="label">شناسه</div><div class="value">${l.id ?? '—'}</div></div>
        <div class="card"><div class="label">موضوع</div><div class="value">${l.subject ?? '—'}</div></div>
        <div class="card"><div class="label">فرستنده</div><div class="value">${l.senderName ?? '—'}</div></div>
        <div class="card"><div class="label">گیرنده</div><div class="value">${l.receiverName ?? '—'}</div></div>
        <div class="card"><div class="label">تاریخ</div><div class="value">${dateStr}</div></div>
        <div class="card"><div class="label">وضعیت</div><div class="value"><span class="badge">${l.status ?? '—'}</span></div></div>
      </div>
      <div style="height:12px"></div>
      <div class="panel">
        <h3 style="margin-top:0">متن نامه</h3>
        <div>${(l.body ?? '—').replace(/\n/g,'<br/>')}</div>
      </div>
      ${Array.isArray(l.attachments) && l.attachments.length ? `
      <div class="panel">
        <h3 style="margin-top:0">پیوست‌ها</h3>
        <ul>
          ${l.attachments.map(a => `<li><a href="${a.url}" target="_blank" rel="noopener">${a.name ?? 'پیوست'}</a></li>`).join('')}
        </ul>
      </div>` : ''}
    `;
  } catch (e) {
    body.innerHTML = 'خطا در دریافت نامه';
    // eslint-disable-next-line no-console
    console.error(e);
  }
}