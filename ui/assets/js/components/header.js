export function renderHeader(container) {
  container.innerHTML = `
    <div class="brand" aria-label="سامانه">
      <span class="dot" aria-hidden="true"></span>
      <span>سامانه اتوماسیون و اعضا</span>
    </div>
    <div class="right" style="display:flex; align-items:center; gap:10px;">
      <input class="input" id="global-search" placeholder="جستجو..." aria-label="جستجو" />
      <button class="button ghost" id="toggle-sidebar" aria-label="باز/بسته کردن منو">منو</button>
      <div class="badge" title="کاربر فعلی">کاربر</div>
    </div>
  `;
  const toggleBtn = container.querySelector('#toggle-sidebar');
  toggleBtn.addEventListener('click', () => {
    document.querySelector('.sidebar')?.classList.toggle('hidden');
  });
}