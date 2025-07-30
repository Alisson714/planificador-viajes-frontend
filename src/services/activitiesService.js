const API_URL = 'http://localhost:3000/activities';
import axios from 'axios';

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getActivities(routeId) {
  const url = routeId ? `${API_URL}?routeId=${routeId}` : API_URL;
  const response = await fetch(url, {
    headers: {
      ...getAuthHeaders(),
    },
  });
  if (!response.ok) throw new Error('Error al obtener actividades');
  return response.json();
}

export async function getActivity(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    headers: {
      ...getAuthHeaders(),
    },
  });
  if (!response.ok) throw new Error('Error al obtener actividad');
  return response.json();
}

export async function createActivity(activityData) {
  const response = await axios.post('http://localhost:3000/activities', activityData);
  return response.data;
}

export async function updateActivity(id, activityData) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(activityData),
  });
  if (!response.ok) throw new Error('Error al actualizar actividad');
  return response.json();
}

export async function deleteActivity(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      ...getAuthHeaders(),
    },
  });
  if (!response.ok) throw new Error('Error al eliminar actividad');
  return response;
}

export async function getUpcomingActivities(userId) {
  const response = await axios.get(`http://localhost:3000/activities/upcoming/${userId}`);
  return response.data;
}

export async function getAllActivitiesByUser(userId) {
  const response = await axios.get(`http://localhost:3000/activities/user/${userId}`);
  return response.data;
} 