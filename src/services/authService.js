const API_URL = 'http://localhost:3000/auth';

export async function login(email, password) {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!response.ok) throw new Error('Error en login');
  return response.json();
}

export async function register(email, password, name, extraData = {}) {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name, ...extraData })
  });
  if (!response.ok) throw new Error('Error en registro');
  return response.json();
} 