<template>
  <div class="actividades-container">
    <h1>Todas mis actividades</h1>
    <button class="btn-primary" @click="abrirFormulario">+ Nueva Actividad</button>
    <div v-if="mostrarFormulario" class="modal-overlay" @click.self="cerrarFormulario">
      <div class="modal-content">
        <h2>Nueva Actividad</h2>
        <form @submit.prevent="crearActividad">
          <div class="form-group">
            <label>Ruta (Viaje) *</label>
            <select v-model="nuevaActividad.route" required>
              <option value="" disabled>Selecciona una ruta</option>
              <option v-for="ruta in rutas" :key="ruta.id" :value="ruta.id">{{ ruta.name }}</option>
            </select>
          </div>
          <div class="form-group">
            <label>Lugar Turístico</label>
            <select v-model="nuevaActividad.place">
              <option value="">(Opcional) Selecciona un lugar</option>
              <option v-for="lugar in lugares" :key="lugar.id" :value="lugar.id">{{ lugar.name }}</option>
            </select>
          </div>
          <div class="form-group">
            <label>Nombre *</label>
            <input v-model="nuevaActividad.name" required />
          </div>
          <div class="form-group">
            <label>Descripción</label>
            <input v-model="nuevaActividad.description" />
          </div>
          <div class="form-group">
            <label>Fecha *</label>
            <input v-model="nuevaActividad.date" type="date" required />
          </div>
          <div class="form-group">
            <label>Estado</label>
            <select v-model="nuevaActividad.status">
              <option value="pending">Pendiente</option>
              <option value="active">Activa</option>
              <option value="completed">Completada</option>
              <option value="cancelled">Cancelada</option>
            </select>
          </div>
          <div class="form-actions">
            <button type="button" @click="cerrarFormulario" class="btn-secondary">Cancelar</button>
            <button type="submit" class="btn-primary">Crear</button>
          </div>
        </form>
      </div>
    </div>
    <div v-if="loading" class="loading-message">Cargando actividades...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <div v-else-if="actividades.length === 0" class="no-data-message">No tienes actividades registradas.</div>
    <div v-else>
      <div v-for="actividad in actividades" :key="actividad.id" class="actividad-card">
        <div class="actividad-info">
          <h3>{{ actividad.name }}</h3>
          <p>{{ actividad.description }}</p>
          <div class="actividad-meta">
            <span>{{ formatDate(actividad.date) }}</span>
            <span class="actividad-status">{{ actividad.status }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { getAllActivitiesByUser, createActivity } from '../services/activitiesService'
import { getRoutesByUser } from '../services/routesService'
import { getAllPlaces } from '../services/placesService'

const auth = useAuthStore()
const actividades = ref([])
const loading = ref(true)
const error = ref(null)
const mostrarFormulario = ref(false)
const rutas = ref([])
const lugares = ref([])
const nuevaActividad = ref({
  route: '',
  place: '',
  name: '',
  description: '',
  date: '',
  status: 'pending',
})

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

function cerrarFormulario() {
  mostrarFormulario.value = false
  nuevaActividad.value = { route: '', place: '', name: '', description: '', date: '', status: 'pending' }
}

async function abrirFormulario() {
  mostrarFormulario.value = true
  if (auth.user && auth.user.id) {
    rutas.value = await getRoutesByUser(auth.user.id)
  }
  lugares.value = await getAllPlaces()
}

async function crearActividad() {
  try {
    if (!auth.user || !auth.user.id) return
    const actividadData = {
      ...nuevaActividad.value,
      route: nuevaActividad.value.route,
      place: nuevaActividad.value.place || null,
      date: nuevaActividad.value.date,
    }
    await createActivity(actividadData)
    actividades.value = await getAllActivitiesByUser(auth.user.id)
    cerrarFormulario()
  } catch (e) {
    alert('Error al crear actividad')
  }
}

onMounted(async () => {
  loading.value = true
  error.value = null
  try {
    if (auth.user && auth.user.id) {
      actividades.value = await getAllActivitiesByUser(auth.user.id)
    } else {
      actividades.value = []
    }
  } catch (e) {
    error.value = 'Error al cargar actividades'
    console.error(e)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.actividades-container {
  max-width: 800px;
  margin: 2rem auto;
  background: white;
  border-radius: 18px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(67, 233, 123, 0.1);
}
.loading-message, .error-message, .no-data-message {
  text-align: center;
  color: #888;
  margin: 2rem 0;
}
.actividad-card {
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8f9fa;
}
.actividad-info h3 {
  margin: 0 0 0.5rem 0;
  color: var(--color-primario);
}
.actividad-meta {
  font-size: 0.9rem;
  color: #666;
  display: flex;
  gap: 1rem;
}
.actividad-status {
  font-weight: bold;
  color: var(--color-acento);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  min-width: 320px;
  max-width: 400px;
  box-shadow: 0 4px 20px rgba(67, 233, 123, 0.15);
}
.form-group {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
}
.form-group label {
  font-weight: bold;
  margin-bottom: 0.3rem;
}
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}
.btn-primary {
  background: var(--color-primario);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.7rem 1.5rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-primary:hover {
  background: var(--color-acento);
}
.btn-secondary {
  background: var(--color-azul);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.7rem 1.5rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-secondary:hover {
  background: var(--color-acento2);
}
</style> 