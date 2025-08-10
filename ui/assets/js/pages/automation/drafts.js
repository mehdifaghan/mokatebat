import { API } from '../../api.js';

function row(letter) {
  const d = letter.updatedAt ? new Intl.DateTimeFormat('fa-IR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(letter.updatedAt)) : '—';
  return `<tr>
    <td>${letter.id ?? '—'}</td>
    <td>${letter.subject ?? '—'}</td>
    <td>${d}</td>
    <td><span class="badge">پیش‌نویس</span></td>
  </tr>`;
}

export default async function DraftsPage(outlet) {
  const panel = document.createElement('div');
  panel.className = 'panel';
  panel.innerHTML = `
    <div class="toolbar">
      <div class="right"><h2 style="margin:0">پیش‌نویس‌ها</h2></div>
      <div class="left"><button id="new-draft" class="button primary">پیش‌نویس جدید</button></div>
    </div>

    <div id="form" class="panel" style="display:none; margin-bottom:12px;">
      <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 8px;">
        <input class="input" id="subject" placeholder="موضوع" />
        <input class="input" id="receiver" placeholder="گیرنده (شناسه/نام)" />
      </div>
      <div style="height:8px"></div>
      <textarea class="input" id="body" placeholder="متن نامه" rows="6"></textarea>
      <div style="height:8px"></div>
      <button id="save" class="button primary">ذخیره پیش‌نویس</button>
      <span id="msg" class="badge" style="margin-inline-start:8px; display:none"></span>
    </div>

    <div class="panel" style="padding:0; overflow:auto;">
      <table class="table">
        <thead>
          <tr>
            <th>شناسه</th>
            <th>موضوع</th>
            <th>آخرین تغییر</th>
            <th>وضعیت</th>
          </tr>
        </thead>
        <tbody id="rows"><tr><td colspan="4">در حال بارگذاری...</td></tr></tbody>
      </table>
    </div>
  `;
  outlet.appendChild(panel);

  const rows = panel.querySelector('#rows');
  const newBtn = panel.querySelector('#new-draft');
  const form = panel.querySelector('#form');
  const subject = panel.querySelector('#subject');
  const receiver = panel.querySelector('#receiver');
  const body = panel.querySelector('#body');
  const save = panel.querySelector('#save');
  const msg = panel.querySelector('#msg');

  function toggleForm() { form.style.display = form.style.display === 'none' ? 'block' : 'none'; }

  async function load() {
    rows.innerHTML = `<tr><td colspan="4">در حال بارگذاری...</td></tr>`;
    try {
      const data = await API.getLetters('drafts');
      const items = Array.isArray(data?.items) ? data.items : (Array.isArray(data) ? data : []);
      rows.innerHTML = items.length ? items.map(row).join('') : `<tr><td colspan="4">موردی یافت نشد</td></tr>`;
    } catch (e) {
      rows.innerHTML = `<tr><td colspan="4">خطا در دریافت داده</td></tr>`;
      // eslint-disable-next-line no-console
      console.error(e);
    }
  }

  async function saveDraft() {
    msg.style.display = 'none';
    try {
      const payload = { subject: subject.value, receiver: receiver.value, body: body.value };
      await API.createDraft(payload);
      msg.textContent = 'ذخیره شد';
      msg.style.display = 'inline-flex';
      subject.value = receiver.value = body.value = '';
      load();
    } catch (e) {
      msg.textContent = 'خطا در ذخیره';
      msg.style.display = 'inline-flex';
      // eslint-disable-next-line no-console
      console.error(e);
    }
  }

  newBtn.addEventListener('click', toggleForm);
  save.addEventListener('click', saveDraft);
  load();
}