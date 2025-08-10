import { API } from '../../api.js';

export default async function MemberDetailPage(outlet, params) {
  const id = params?.id;
  const panel = document.createElement('div');
  panel.className = 'panel';
  panel.innerHTML = `
    <div class="toolbar">
      <div class="right"><h2 style="margin:0">پرونده عضو</h2></div>
      <div class="left"><a class="button ghost" href="#/members">بازگشت به لیست</a></div>
    </div>
    <div id="body">در حال بارگذاری...</div>
  `;
  outlet.appendChild(panel);

  const body = panel.querySelector('#body');
  try {
    const data = await API.getMemberById(id);
    const member = data?.item || data || {};
    body.innerHTML = `
      <div class="card-grid">
        <div class="card">
          <div class="label">نام و نام خانوادگی</div>
          <div class="value">${member.fullName ?? '—'}</div>
        </div>
        <div class="card">
          <div class="label">کد ملی</div>
          <div class="value">${member.nationalId ?? '—'}</div>
        </div>
        <div class="card">
          <div class="label">کد عضویت</div>
          <div class="value">${member.code ?? '—'}</div>
        </div>
        <div class="card">
          <div class="label">وضعیت</div>
          <div class="value"><span class="badge">${member.status ?? 'فعال'}</span></div>
        </div>
      </div>
      <div style="height:12px"></div>
      <div class="panel">
        <h3 style="margin-top:0">اطلاعات تماس</h3>
        <div>تلفن: ${member.phone ?? '—'}</div>
        <div>ایمیل: ${member.email ?? '—'}</div>
        <div>آدرس: ${member.address ?? '—'}</div>
      </div>
    `;
  } catch (e) {
    body.innerHTML = `خطا در دریافت اطلاعات عضو`;
    // eslint-disable-next-line no-console
    console.error(e);
  }
}