const API_URL = 'http://localhost:3000/users';

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getUsers() {
  const response = await fetch(API_URL, {
    headers: {
      ...getAuthHeaders(),
    },
  });
  if (!response.ok) throw new Error('Error al obtener usuarios');
  return response.json();
}

export async function getUser(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    headers: {
      ...getAuthHeaders(),
    },
  });
  if (!response.ok) throw new Error('Error al obtener usuario');
  return response.json();
}

export async function createUser(userData) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(userData),
  });
  if (!response.ok) throw new Error('Error al crear usuario');
  return response.json();
}

export async function updateUser(id, userData) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(userData),
  });
  if (!response.ok) throw new Error('Error al actualizar usuario');
  return response.json();
}

export async function deleteUser(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      ...getAuthHeaders(),
    },
  });
  if (!response.ok) throw new Error('Error al eliminar usuario');
  return response;
} 