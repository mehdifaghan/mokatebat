export default async function DashboardPage(outlet) {
  outlet.innerHTML = `
    <div class="panel">
      <div class="toolbar">
        <div class="right"><h2 style="margin:0">داشبورد</h2></div>
        <div class="left"><span class="kbd">Alt</span><span class="kbd">K</span> برای جستجو</div>
      </div>
      <div class="card-grid">
        <div class="card"><div class="label">اعضا</div><div class="value" id="kpi-members">—</div></div>
        <div class="card"><div class="label">نامه‌های دریافتی</div><div class="value" id="kpi-inbox">—</div></div>
        <div class="card"><div class="label">نامه‌های ارسالی</div><div class="value" id="kpi-sent">—</div></div>
        <div class="card"><div class="label">پیش‌نویس‌ها</div><div class="value" id="kpi-drafts">—</div></div>
      </div>
    </div>
  `;
}