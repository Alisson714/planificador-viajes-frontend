const API_URL = 'http://localhost:3000/places';

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getPlaces(category) {
  const url = category ? `${API_URL}?category=${category}` : API_URL;
  const response = await fetch(url, {
    headers: {
      ...getAuthHeaders(),
    },
  });
  if (!response.ok) throw new Error('Error al obtener lugares');
  return response.json();
}

export async function getPlace(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    headers: {
      ...getAuthHeaders(),
    },
  });
  if (!response.ok) throw new Error('Error al obtener lugar');
  return response.json();
}

export async function createPlace(placeData) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(placeData),
  });
  if (!response.ok) throw new Error('Error al crear lugar');
  return response.json();
}

export async function updatePlace(id, placeData) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(placeData),
  });
  if (!response.ok) throw new Error('Error al actualizar lugar');
  return response.json();
}

export async function deletePlace(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      ...getAuthHeaders(),
    },
  });
  if (!response.ok) throw new Error('Error al eliminar lugar');
  return response;
}

export async function getAllPlaces() {
  const response = await axios.get('http://localhost:3000/places');
  return response.data;
} 