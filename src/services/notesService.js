const API_URL = 'http://localhost:3000/notes';

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getNotes({ userId, routeId } = {}) {
  let url = API_URL;
  if (userId) url += `?userId=${userId}`;
  else if (routeId) url += `?routeId=${routeId}`;
  const response = await fetch(url, {
    headers: {
      ...getAuthHeaders(),
    },
  });
  if (!response.ok) throw new Error('Error al obtener notas');
  return response.json();
}

export async function getNote(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    headers: {
      ...getAuthHeaders(),
    },
  });
  if (!response.ok) throw new Error('Error al obtener nota');
  return response.json();
}

export async function createNote(noteData) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(noteData),
  });
  if (!response.ok) throw new Error('Error al crear nota');
  return response.json();
}

export async function updateNote(id, noteData) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(noteData),
  });
  if (!response.ok) throw new Error('Error al actualizar nota');
  return response.json();
}

export async function deleteNote(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      ...getAuthHeaders(),
    },
  });
  if (!response.ok) throw new Error('Error al eliminar nota');
  return response;
} 