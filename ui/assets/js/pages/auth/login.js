import { Auth } from '../../auth.js';

export default async function LoginPage(outlet) {
  const panel = document.createElement('div');
  panel.className = 'panel';
  panel.style.maxWidth = '520px';
  panel.style.margin = '40px auto';
  panel.innerHTML = `
    <div class="toolbar">
      <div class="right"><h2 style="margin:0">ورود به سامانه</h2></div>
      <div class="left"></div>
    </div>
    <div style="display:grid; gap:10px;">
      <label>نام کاربری
        <input id="username" class="input" placeholder="username" />
      </label>
      <label>کلمه عبور
        <input id="password" type="password" class="input" placeholder="••••••" />
      </label>
      <div style="display:flex; gap:8px; align-items:center;">
        <button id="login" class="button primary">ورود</button>
        <span id="msg" class="badge" style="display:none"></span>
      </div>
    </div>
  `;
  outlet.innerHTML = '';
  outlet.appendChild(panel);

  const username = panel.querySelector('#username');
  const password = panel.querySelector('#password');
  const loginBtn = panel.querySelector('#login');
  const msg = panel.querySelector('#msg');

  async function doLogin() {
    msg.style.display = 'none';
    try {
      await Auth.login(username.value, password.value);
      window.location.hash = '#/';
    } catch (e) {
      msg.textContent = 'نام کاربری یا کلمه عبور نادرست است';
      msg.style.display = 'inline-flex';
      // eslint-disable-next-line no-console
      console.error(e);
    }
  }

  loginBtn.addEventListener('click', doLogin);
  password.addEventListener('keydown', (e) => { if (e.key === 'Enter') doLogin(); });
}