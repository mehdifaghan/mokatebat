const BASE_URL = (window.UI_CONFIG && window.UI_CONFIG.apiBaseUrl) || '/api';

function toQuery(params = {}) {
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === '') return;
    usp.append(k, v);
  });
  const s = usp.toString();
  return s ? `?${s}` : '';
}

async function apiGet(path, params) {
  const res = await fetch(`${BASE_URL}${path}${toQuery(params)}`, {
    credentials: 'include',
    headers: { 'Accept': 'application/json' }
  });
  if (!res.ok) throw new Error(`GET ${path} -> ${res.status}`);
  return res.json();
}

async function apiPost(path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(body ?? {})
  });
  if (!res.ok) throw new Error(`POST ${path} -> ${res.status}`);
  return res.json();
}

export const API = {
  getMembers: (params) => apiGet('/members', params),
  getMemberById: (id) => apiGet(`/members/${encodeURIComponent(id)}`),
  getLetters: (box, params) => apiGet('/letters', { box, ...(params || {}) }),
  getUsers: (params) => apiGet('/users', params),
  getOrgStructure: () => apiGet('/org-structure'),
  createDraft: (payload) => apiPost('/letters', { type: 'draft', ...payload }),
};