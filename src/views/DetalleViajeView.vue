<template>
  <div>
    <div v-if="loading">Cargando...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <div v-else>
      <div class="detalle-viaje-container">
        <!-- Header con información de la ruta -->
        <header class="viaje-header">
          <div class="header-content">
            <div class="viaje-info">
              <div class="viaje-title">
                <h1>{{ destino.nombre }}</h1>
                <span class="viaje-status" :class="destino.status">
                  {{ getStatusText(destino.status) }}
                </span>
              </div>
              <p class="viaje-description">{{ destino.descripcion }}</p>
              <div class="viaje-meta">
                <div class="meta-item">
                  <span class="meta-icon">📅</span>
                  <span>{{ formatDate(destino.startDate) }} - {{ formatDate(destino.endDate) }}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-icon">📍</span>
                  <span>{{ getRegionText(destino.region) }}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-icon">👥</span>
                  <span>{{ destino.participants }} personas</span>
                </div>
                <div class="meta-item">
                  <span class="meta-icon">💰</span>
                  <span>${{ destino.budget }}</span>
                </div>
              </div>
            </div>
            <div class="header-actions">
              <button @click="editarRuta" class="btn-secondary">✏️ Editar</button>
              <button @click="duplicarRuta" class="btn-secondary">📋 Duplicar</button>
              <button @click="eliminarRuta" class="btn-danger">🗑️ Eliminar</button>
            </div>
          </div>
        </header>

        <!-- Estadísticas rápidas -->
        <section class="stats-section">
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon">🎯</div>
              <div class="stat-content">
                <h3>{{ destino.activitiesCount }}</h3>
                <p>Actividades</p>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">📍</div>
              <div class="stat-content">
                <h3>{{ destino.placesCount }}</h3>
                <p>Lugares</p>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">📝</div>
              <div class="stat-content">
                <h3>{{ destino.notesCount }}</h3>
                <p>Notas</p>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">📊</div>
              <div class="stat-content">
                <h3>{{ destino.progress }}%</h3>
                <p>Completado</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Contenido principal -->
        <div class="viaje-content">
          <!-- Columna izquierda -->
          <div class="content-left">
            <!-- Actividades -->
            <section class="section-card">
              <div class="section-header">
                <h2>Actividades</h2>
                <button @click="agregarActividad" class="btn-primary">+ Actividad</button>
              </div>
              <div class="activities-list">
                <div v-for="actividad in actividades" :key="actividad.id" class="activity-item">
                  <div class="activity-header">
                    <div class="activity-icon" :class="actividad.type">
                      {{ getActivityIcon(actividad.type) }}
                    </div>
                    <div class="activity-info">
                      <h4>{{ actividad.name }}</h4>
                      <p>{{ actividad.description }}</p>
                      <div class="activity-meta">
                        <span class="activity-date">{{ formatDate(actividad.date) }}</span>
                        <span class="activity-location">{{ actividad.location }}</span>
                        <span class="activity-duration">{{ actividad.duration }}h</span>
                      </div>
                    </div>
                    <div class="activity-status" :class="actividad.status">
                      {{ getActivityStatusText(actividad.status) }}
                    </div>
                  </div>
                  <div class="activity-actions">
                    <button @click="editarActividad(actividad)" class="btn-edit-small">✏️</button>
                    <button @click="eliminarActividad(actividad.id)" class="btn-delete-small">🗑️</button>
                  </div>
                </div>
              </div>
            </section>

            <!-- Lugares -->
            <section class="section-card">
              <div class="section-header">
                <h2>Lugares a Visitar</h2>
                <button @click="agregarLugar" class="btn-primary">+ Lugar</button>
              </div>
              <div class="places-list">
                <div v-for="lugar in lugares" :key="lugar.id" class="place-item">
                  <img :src="lugar.imageUrl" :alt="lugar.name" class="place-image" />
                  <div class="place-info">
                    <h4>{{ lugar.name }}</h4>
                    <p>{{ lugar.city }}, {{ lugar.province }}</p>
                    <div class="place-meta">
                      <span class="place-category">{{ lugar.category }}</span>
                      <span class="place-rating">⭐ {{ lugar.rating }}</span>
                    </div>
                    <p class="place-description">{{ lugar.description }}</p>
                  </div>
                  <div class="place-actions">
                    <button @click="verLugar(lugar)" class="btn-view-small">Ver</button>
                    <button @click="eliminarLugar(lugar.id)" class="btn-delete-small">🗑️</button>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <!-- Columna derecha -->
          <div class="content-right">
            <!-- Notas -->
            <section class="section-card">
              <div class="section-header">
                <h2>Notas</h2>
                <button @click="agregarNota" class="btn-primary">+ Nota</button>
              </div>
              <div class="notes-list">
                <div v-for="nota in notas" :key="nota.id" class="note-item" :class="{ important: nota.isImportant }">
                  <div class="note-header">
                    <h4>{{ nota.title }}</h4>
                    <span class="note-category">{{ nota.category }}</span>
                  </div>
                  <p>{{ nota.content }}</p>
                  <div class="note-footer">
                    <span class="note-date">{{ formatDate(nota.createdAt) }}</span>
                    <div class="note-actions">
                      <button @click="editarNota(nota)" class="btn-edit-small">✏️</button>
                      <button @click="eliminarNota(nota.id)" class="btn-delete-small">🗑️</button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- Mapa de la ruta -->
            <section class="section-card">
              <div class="section-header">
                <h2>Mapa de la Ruta</h2>
                <button @click="actualizarMapa" class="btn-secondary">🔄 Actualizar</button>
              </div>
              <div class="map-container">
                <div id="map" class="map"></div>
                <div class="map-info">
                  <p>Distancia total: {{ destino.totalDistance }} km</p>
                  <p>Tiempo estimado: {{ destino.estimatedTime }} horas</p>
                </div>
              </div>
            </section>

            <!-- Presupuesto -->
            <section class="section-card">
              <div class="section-header">
                <h2>Presupuesto</h2>
                <button @click="editarPresupuesto" class="btn-secondary">✏️</button>
              </div>
              <div class="budget-info">
                <div class="budget-item">
                  <span>Presupuesto total:</span>
                  <span class="budget-amount">${{ destino.budget }}</span>
                </div>
                <div class="budget-item">
                  <span>Gastado:</span>
                  <span class="budget-spent">${{ destino.spent }}</span>
                </div>
                <div class="budget-item">
                  <span>Restante:</span>
                  <span class="budget-remaining" :class="{ 'negative': destino.spent > destino.budget }">
                    ${{ destino.budget - destino.spent }}
                  </span>
                </div>
                <div class="budget-progress">
                  <div class="progress-bar">
                    <div 
                      class="progress-fill" 
                      :style="{ width: Math.min((destino.spent / destino.budget) * 100, 100) + '%' }"
                      :class="{ 'over-budget': destino.spent > destino.budget }"
                    ></div>
                  </div>
                  <span class="progress-text">{{ Math.round((destino.spent / destino.budget) * 100) }}% usado</span>
                </div>
              </div>
            </section>
          </div>
        </div>

        <!-- Modales para agregar/editar -->
        <!-- Modal de Actividad -->
        <div v-if="mostrarModalActividad" class="modal-overlay" @click="cerrarModalActividad">
          <div class="modal-content" @click.stop>
            <div class="modal-header">
              <h2>{{ actividadEditando ? 'Editar Actividad' : 'Nueva Actividad' }}</h2>
              <button @click="cerrarModalActividad" class="btn-close">×</button>
            </div>
            <form @submit.prevent="guardarActividad" class="activity-form">
              <div class="form-grid">
                <div class="form-group">
                  <label for="activityName">Nombre *</label>
                  <input id="activityName" v-model="formularioActividad.name" type="text" required />
                </div>
                <div class="form-group">
                  <label for="activityType">Tipo *</label>
                  <select id="activityType" v-model="formularioActividad.type" required>
                    <option value="visita">Visita</option>
                    <option value="comida">Comida</option>
                    <option value="transporte">Transporte</option>
                    <option value="alojamiento">Alojamiento</option>
                    <option value="actividad">Actividad</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="activityDate">Fecha *</label>
                  <input id="activityDate" v-model="formularioActividad.date" type="date" required />
                </div>
                <div class="form-group">
                  <label for="activityDuration">Duración (horas)</label>
                  <input id="activityDuration" v-model="formularioActividad.duration" type="number" min="0" />
                </div>
                <div class="form-group">
                  <label for="activityLocation">Ubicación</label>
                  <input id="activityLocation" v-model="formularioActividad.location" type="text" />
                </div>
                <div class="form-group">
                  <label for="activityStatus">Estado</label>
                  <select id="activityStatus" v-model="formularioActividad.status">
                    <option value="pending">Pendiente</option>
                    <option value="confirmed">Confirmado</option>
                    <option value="completed">Completado</option>
                    <option value="cancelled">Cancelado</option>
                  </select>
                </div>
                <div class="form-group full-width">
                  <label for="activityDescription">Descripción</label>
                  <textarea id="activityDescription" v-model="formularioActividad.description" rows="3"></textarea>
                </div>
              </div>
              <div class="form-actions">
                <button type="button" @click="cerrarModalActividad" class="btn-secondary">Cancelar</button>
                <button type="submit" class="btn-primary">
                  {{ actividadEditando ? 'Actualizar' : 'Crear' }} Actividad
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getRoute } from '../services/routesService'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const router = useRouter()
const ruta = ref(null)
const loading = ref(true)
const error = ref('')

const auth = useAuthStore()

onMounted(async () => {
  const id = route.params.id
  // Validar ID y autenticación antes de intentar cargar
  const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/
  if (!auth.isAuthenticated || !id || !uuidRegex.test(id)) {
    error.value = 'No tienes acceso o el recurso no existe.'
    setTimeout(() => router.push('/login?redirected=true'), 1000)
    return
  }
  loading.value = true
  error.value = ''
  try {
    ruta.value = await getRoute(id)
    if (!ruta.value) {
      error.value = 'Ruta no encontrada.'
      setTimeout(() => router.push('/dashboard'), 1500)
    }
  } catch (e) {
    error.value = 'No tienes permiso para ver esta ruta o no existe.'
    setTimeout(() => router.push('/dashboard'), 1500)
  } finally {
    loading.value = false
  }
})

// Estado del componente
const mostrarModalActividad = ref(false)
const actividadEditando = ref(null)

// Datos de la ruta
const destino = ref({})

if (route.params.destino) {
  destino.value = JSON.parse(decodeURIComponent(route.params.destino))
}

// Actividades
const actividades = ref([
  {
    id: 1,
    name: 'Visita al Centro de Interpretación',
    description: 'Aprender sobre la historia natural de las islas',
    date: '2024-03-16',
    location: 'Puerto Ayora, Galápagos',
    type: 'visita',
    status: 'confirmed',
    duration: 2
  },
  {
    id: 2,
    name: 'Snorkeling en Los Túneles',
    description: 'Explorar la vida marina de las islas',
    date: '2024-03-17',
    location: 'Isla Isabela, Galápagos',
    type: 'actividad',
    status: 'pending',
    duration: 4
  },
  {
    id: 3,
    name: 'Cena en Restaurante Local',
    description: 'Degustar la gastronomía local',
    date: '2024-03-16',
    location: 'Puerto Ayora, Galápagos',
    type: 'comida',
    status: 'confirmed',
    duration: 1.5
  }
])

// Lugares
const lugares = ref([
  {
    id: 1,
    name: 'Centro de Interpretación de Galápagos',
    city: 'Puerto Ayora',
    province: 'Galápagos',
    category: 'Educativo',
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    description: 'Centro educativo sobre la biodiversidad de las islas'
  },
  {
    id: 2,
    name: 'Los Túneles',
    city: 'Isla Isabela',
    province: 'Galápagos',
    category: 'Naturaleza',
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    description: 'Formaciones de lava submarinas ideales para snorkeling'
  }
])

// Notas
const notas = ref([
  {
    id: 1,
    title: 'Recordatorio Equipamiento',
    content: 'Llevar protector solar, repelente de mosquitos y traje de baño',
    category: 'recordatorio',
    isImportant: true,
    createdAt: '2024-03-15'
  },
  {
    id: 2,
    title: 'Gastos de Transporte',
    content: 'Taxi desde aeropuerto: $25, Buses interislas: $15 cada uno',
    category: 'gastos',
    isImportant: false,
    createdAt: '2024-03-14'
  }
])

// Formulario de actividad
const formularioActividad = ref({
  name: '',
  description: '',
  date: '',
  location: '',
  type: 'visita',
  status: 'pending',
  duration: 1
})

// Funciones
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short'
  })
}

function getStatusText(status) {
  const statusMap = {
    planning: 'Planificando',
    active: 'Activa',
    completed: 'Completada',
    cancelled: 'Cancelada'
  }
  return statusMap[status] || status
}

function getRegionText(region) {
  const regionMap = {
    sierra: 'Sierra',
    costa: 'Costa',
    amazonia: 'Amazonía',
    galapagos: 'Galápagos'
  }
  return regionMap[region] || region
}

function getActivityIcon(type) {
  const iconMap = {
    visita: '🏛️',
    comida: '🍽️',
    transporte: '🚌',
    alojamiento: '🏨',
    actividad: '🎯'
  }
  return iconMap[type] || '📋'
}

function getActivityStatusText(status) {
  const statusMap = {
    pending: 'Pendiente',
    confirmed: 'Confirmado',
    completed: 'Completado',
    cancelled: 'Cancelado'
  }
  return statusMap[status] || status
}

// Acciones de la ruta
function editarRuta() {
  router.push(`/ruta/${destino.value.id}/editar`)
}

function duplicarRuta() {
  // Implementar duplicación
  console.log('Duplicar ruta')
}

function eliminarRuta() {
  if (confirm('¿Estás seguro de que quieres eliminar esta ruta?')) {
    router.push('/planificador')
  }
}

// Acciones de actividades
function agregarActividad() {
  actividadEditando.value = null
  formularioActividad.value = {
    name: '',
    description: '',
    date: '',
    location: '',
    type: 'visita',
    status: 'pending',
    duration: 1
  }
  mostrarModalActividad.value = true
}

function editarActividad(actividad) {
  actividadEditando.value = actividad
  formularioActividad.value = { ...actividad }
  mostrarModalActividad.value = true
}

function eliminarActividad(id) {
  if (confirm('¿Estás seguro de que quieres eliminar esta actividad?')) {
    actividades.value = actividades.value.filter(a => a.id !== id)
  }
}

function guardarActividad() {
  if (actividadEditando.value) {
    // Actualizar actividad existente
    const index = actividades.value.findIndex(a => a.id === actividadEditando.value.id)
    if (index !== -1) {
      actividades.value[index] = { ...actividadEditando.value, ...formularioActividad.value }
    }
  } else {
    // Crear nueva actividad
    const nuevaActividad = {
      id: Date.now(),
      ...formularioActividad.value
    }
    actividades.value.push(nuevaActividad)
  }
  
  cerrarModalActividad()
}

function cerrarModalActividad() {
  mostrarModalActividad.value = false
  actividadEditando.value = null
}

// Acciones de lugares
function agregarLugar() {
  // Implementar modal de lugar
  console.log('Agregar lugar')
}

function verLugar(lugar) {
  router.push(`/lugar/${lugar.id}`)
}

function eliminarLugar(id) {
  if (confirm('¿Estás seguro de que quieres eliminar este lugar?')) {
    lugares.value = lugares.value.filter(l => l.id !== id)
  }
}

// Acciones de notas
function agregarNota() {
  // Implementar modal de nota
  console.log('Agregar nota')
}

function editarNota(nota) {
  // Implementar edición de nota
  console.log('Editar nota:', nota)
}

function eliminarNota(id) {
  if (confirm('¿Estás seguro de que quieres eliminar esta nota?')) {
    notas.value = notas.value.filter(n => n.id !== id)
  }
}

// Acciones del mapa
function actualizarMapa() {
  // Implementar actualización del mapa
  console.log('Actualizar mapa')
}

function editarPresupuesto() {
  // Implementar edición de presupuesto
  console.log('Editar presupuesto')
}

onMounted(() => {
  // Cargar datos de la ruta desde el backend usando route.params.id
  console.log('Cargando ruta:', route.params.id)
})
</script>

<style scoped>
.detalle-viaje-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f6d36522 0%, #43e97b22 100%);
  padding: 2rem;
}

/* Header */
.viaje-header {
  background: white;
  border-radius: 18px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px rgba(67, 233, 123, 0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
}

.viaje-title {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.viaje-title h1 {
  font-size: 2.5rem;
  color: var(--color-primario);
}

.viaje-status {
  padding: 0.5rem 1rem;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: bold;
}

.viaje-status.active {
  background: var(--color-primario);
  color: white;
}

.viaje-status.planning {
  background: var(--color-acento);
  color: white;
}

.viaje-status.completed {
  background: var(--color-azul);
  color: white;
}

.viaje-description {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.viaje-meta {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  color: #666;
}

.meta-icon {
  font-size: 1.2rem;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

/* Estadísticas */
.stats-section {
  margin-bottom: 2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 4px 20px rgba(67, 233, 123, 0.1);
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-icon {
  font-size: 2rem;
  padding: 1rem;
  background: linear-gradient(135deg, var(--color-primario), var(--color-acento));
  border-radius: 12px;
  color: white;
}

.stat-content h3 {
  font-size: 2rem;
  margin-bottom: 0.2rem;
  color: var(--color-primario);
}

.stat-content p {
  color: #666;
  font-weight: 500;
}

/* Contenido principal */
.viaje-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}

.content-left, .content-right {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Tarjetas de sección */
.section-card {
  background: white;
  border-radius: 18px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(67, 233, 123, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h2 {
  font-size: 1.5rem;
  color: var(--color-primario);
}

/* Actividades */
.activities-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  border: 2px solid #f0f0f0;
  border-radius: 12px;
  padding: 1rem;
  transition: all 0.2s;
}

.activity-item:hover {
  border-color: var(--color-primario);
  background: rgba(67, 233, 123, 0.05);
}

.activity-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
}

.activity-icon {
  font-size: 1.5rem;
  padding: 0.8rem;
  border-radius: 8px;
  background: var(--color-primario);
  color: white;
}

.activity-info {
  flex: 1;
}

.activity-info h4 {
  font-size: 1.1rem;
  margin-bottom: 0.3rem;
  color: var(--color-texto);
}

.activity-info p {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.activity-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.8rem;
}

.activity-date {
  color: var(--color-azul);
  font-weight: 500;
}

.activity-location {
  color: var(--color-acento);
}

.activity-duration {
  color: #666;
}

.activity-status {
  padding: 0.3rem 0.8rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: bold;
}

.activity-status.confirmed {
  background: var(--color-primario);
  color: white;
}

.activity-status.pending {
  background: var(--color-acento);
  color: white;
}

.activity-status.completed {
  background: var(--color-azul);
  color: white;
}

.activity-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

/* Lugares */
.places-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.place-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border: 2px solid #f0f0f0;
  border-radius: 12px;
  transition: all 0.2s;
}

.place-item:hover {
  border-color: var(--color-primario);
  background: rgba(67, 233, 123, 0.05);
}

.place-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
}

.place-info {
  flex: 1;
}

.place-info h4 {
  font-size: 1.1rem;
  margin-bottom: 0.3rem;
  color: var(--color-texto);
}

.place-info p {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.place-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.place-category {
  color: var(--color-azul);
  font-weight: 500;
  font-size: 0.8rem;
}

.place-rating {
  color: var(--color-acento);
  font-weight: bold;
  font-size: 0.8rem;
}

.place-description {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.4;
}

.place-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* Notas */
.notes-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.note-item {
  padding: 1rem;
  border-radius: 12px;
  background: #f8f9fa;
  border-left: 4px solid var(--color-primario);
  transition: all 0.2s;
}

.note-item.important {
  border-left-color: var(--color-acento2);
  background: rgba(253, 160, 133, 0.05);
}

.note-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.note-header h4 {
  font-size: 1rem;
  color: var(--color-texto);
}

.note-category {
  padding: 0.2rem 0.6rem;
  border-radius: 8px;
  font-size: 0.7rem;
  font-weight: bold;
  background: var(--color-primario);
  color: white;
}

.note-item p {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

.note-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.note-date {
  font-size: 0.8rem;
  color: #999;
}

.note-actions {
  display: flex;
  gap: 0.5rem;
}

/* Mapa */
.map-container {
  position: relative;
}

.map {
  width: 100%;
  height: 300px;
  background: #f0f0f0;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 1.1rem;
}

.map-info {
  margin-top: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.map-info p {
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: #666;
}

/* Presupuesto */
.budget-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.budget-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.budget-amount {
  font-weight: bold;
  color: var(--color-primario);
}

.budget-spent {
  font-weight: bold;
  color: var(--color-acento);
}

.budget-remaining {
  font-weight: bold;
  color: var(--color-azul);
}

.budget-remaining.negative {
  color: #e74c3c;
}

.budget-progress {
  margin-top: 1rem;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: var(--color-primario);
  border-radius: 4px;
  transition: width 0.3s;
}

.progress-fill.over-budget {
  background: #e74c3c;
}

.progress-text {
  font-size: 0.8rem;
  color: #666;
  font-weight: 500;
}

/* Botones */
.btn-primary, .btn-secondary, .btn-danger {
  padding: 0.7rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary {
  background: var(--color-primario);
  color: white;
}

.btn-primary:hover {
  background: var(--color-acento);
  transform: translateY(-1px);
}

.btn-secondary {
  background: var(--color-azul);
  color: white;
}

.btn-secondary:hover {
  background: var(--color-acento2);
}

.btn-danger {
  background: #e74c3c;
  color: white;
}

.btn-danger:hover {
  background: #c0392b;
}

.btn-view-small, .btn-edit-small, .btn-delete-small {
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.2s;
}

.btn-view-small {
  background: var(--color-primario);
  color: white;
}

.btn-view-small:hover {
  background: var(--color-acento);
}

.btn-edit-small {
  background: var(--color-azul);
  color: white;
}

.btn-edit-small:hover {
  background: var(--color-acento2);
}

.btn-delete-small {
  background: #e74c3c;
  color: white;
}

.btn-delete-small:hover {
  background: #c0392b;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
}

.modal-content {
  background: white;
  border-radius: 18px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 2rem 1rem;
  border-bottom: 1px solid #f0f0f0;
}

.modal-header h2 {
  color: var(--color-primario);
}

.btn-close {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #666;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background 0.2s;
}

.btn-close:hover {
  background: rgba(231, 76, 60, 0.1);
  color: #e74c3c;
}

/* Formulario */
.activity-form {
  padding: 2rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: var(--color-texto);
}

.form-group input,
.form-group textarea,
.form-group select {
  padding: 0.8rem;
  border: 2px solid #f0f0f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--color-primario);
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

/* Responsive */
@media (max-width: 1024px) {
  .viaje-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .detalle-viaje-container {
    padding: 1rem;
  }
  
  .header-content {
    flex-direction: column;
    gap: 1rem;
  }
  
  .viaje-title {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .viaje-title h1 {
    font-size: 2rem;
  }
  
  .viaje-meta {
    flex-direction: column;
    gap: 1rem;
  }
  
  .header-actions {
    width: 100%;
    justify-content: center;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .activity-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .place-item {
    flex-direction: column;
  }
  
  .place-image {
    width: 100%;
    height: 200px;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
}
</style> 