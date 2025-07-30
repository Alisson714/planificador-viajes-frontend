const API_URL = 'http://localhost:3000/routes';

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getRoutes(userId) {
  const url = userId ? `${API_URL}?userId=${userId}` : API_URL;
  const response = await fetch(url, {
    headers: {
      ...getAuthHeaders(),
    },
  });
  if (!response.ok) throw new Error('Error al obtener rutas');
  return response.json();
}

export async function getRoute(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    headers: {
      ...getAuthHeaders(),
    },
  });
  if (!response.ok) throw new Error('Error al obtener ruta');
  return response.json();
}

export async function createRoute(routeData) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(routeData),
  });
  if (!response.ok) throw new Error('Error al crear ruta');
  return response.json();
}

export async function updateRoute(id, routeData) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(routeData),
  });
  if (!response.ok) throw new Error('Error al actualizar ruta');
  return response.json();
}

export async function deleteRoute(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      ...getAuthHeaders(),
    },
  });
  if (!response.ok) throw new Error('Error al eliminar ruta');
  return response;
}

export async function getRoutesByUser(userId) {
  const response = await axios.get(`http://localhost:3000/routes/user/${userId}`);
  return response.data;
} 