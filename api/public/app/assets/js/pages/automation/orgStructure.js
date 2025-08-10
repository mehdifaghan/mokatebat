import { API } from '../../api.js';

function renderNode(node) {
  const children = Array.isArray(node.children) ? node.children : [];
  return `<li>
    <div class="badge">${node.title ?? '—'}</div>
    ${children.length ? `<ul>${children.map(renderNode).join('')}</ul>` : ''}
  </li>`;
}

export default async function OrgStructurePage(outlet) {
  const panel = document.createElement('div');
  panel.className = 'panel';
  panel.innerHTML = `
    <div class="toolbar">
      <div class="right"><h2 style="margin:0">ساختار اداری</h2></div>
      <div class="left"></div>
    </div>
    <div id="tree" class="panel"></div>
  `;
  outlet.appendChild(panel);

  const tree = panel.querySelector('#tree');

  try {
    const data = await API.getOrgStructure();
    const root = data?.root || data;
    if (!root) {
      tree.innerHTML = 'اطلاعاتی موجود نیست';
      return;
    }
    tree.innerHTML = `<ul>${renderNode(root)}</ul>`;
  } catch (e) {
    tree.innerHTML = 'خطا در دریافت ساختار';
    // eslint-disable-next-line no-console
    console.error(e);
  }
}