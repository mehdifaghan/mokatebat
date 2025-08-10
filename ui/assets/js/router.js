function parseLocation() {
  const hash = window.location.hash || '#/';
  const path = hash.replace(/^#/, '');
  return path;
}

function matchRoute(routes, currentPath) {
  const currentParts = currentPath.split('?')[0].split('/').filter(Boolean);
  for (const route of routes) {
    const routeParts = route.path.split('/').filter(Boolean);
    if (routeParts.length !== currentParts.length) continue;
    const params = {};
    let matched = true;
    for (let i = 0; i < routeParts.length; i++) {
      const rp = routeParts[i];
      const cp = currentParts[i];
      if (rp.startsWith(':')) {
        params[rp.slice(1)] = decodeURIComponent(cp);
      } else if (rp !== cp) {
        matched = false;
        break;
      }
    }
    if (matched) return { route, params };
  }
  // fallback to root
  const root = routes.find(r => r.path === '/');
  return { route: root, params: {} };
}

export function initRouter({ routes, outlet, onRoute }) {
  async function render() {
    const path = parseLocation();
    const { route, params } = matchRoute(routes, path);
    if (typeof onRoute === 'function') onRoute(route.path);
    if (!route) return;
    outlet.innerHTML = '';
    try {
      const component = route.component;
      await component(outlet, params);
    } catch (err) {
      outlet.innerHTML = `<div class="panel">در بارگذاری صفحه خطایی رخ داد.</div>`;
      // eslint-disable-next-line no-console
      console.error(err);
    }
  }
  window.addEventListener('hashchange', render);
  if (!window.location.hash) window.location.hash = '#/';
  render();
}