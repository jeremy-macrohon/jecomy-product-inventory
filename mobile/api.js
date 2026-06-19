const BASE_URL = 'http://localhost:3000';

async function request(path, method = 'GET', token, body) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || `${res.status} ${res.statusText}`);
  }
  return res.json();
}

export function login(email, password) {
  return request('/auth/login', 'POST', null, { email, password });
}

export function register(email, password, name) {
  return request('/auth/register', 'POST', null, { email, password, name });
}

export function fetchInventory(token) {
  return request('/products', 'GET', token);
}

export function createInventoryItem(token, product) {
  return request('/products', 'POST', token, product);
}

export function fetchInsights(token) {
  return request('/insights', 'GET', token);
}
