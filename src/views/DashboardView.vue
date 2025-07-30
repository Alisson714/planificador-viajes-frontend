<template>
  <div class="dashboard-container">
    <!-- Header del Dashboard -->
    <header class="dashboard-header">
      <div class="header-content">
        <div class="user-welcome">
          <img :src="getAvatarUrl(user.avatar)" alt="Avatar" class="user-avatar" />
          <div>
            <h1>¡Hola, {{ user.name }}!</h1>
            <p>¿A dónde quieres viajar hoy?</p>
          </div>
        </div>
        <div class="header-actions">
          <button class="btn-notification">🔔</button>
          <div class="user-menu">
            <router-link to="/perfil" class="btn-profile">Mi Perfil</router-link>
            <button @click="logout" class="btn-logout">Cerrar sesión</button>
          </div>
        </div>
      </div>
    </header>

    <!-- Estadísticas del Usuario -->
    <section class="stats-section">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">🗺️</div>
          <div class="stat-content">
            <h3>{{ stats.totalRoutes }}</h3>
            <p>Rutas Creadas</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🎯</div>
          <div class="stat-content">
            <h3>{{ stats.activeRoutes }}</h3>
            <p>Rutas Activas</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">✅</div>
          <div class="stat-content">
            <h3>{{ stats.completedRoutes }}</h3>
            <p>Rutas Completadas</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">💰</div>
          <div class="stat-content">
            <h3>${{ stats.totalBudget }}</h3>
            <p>Presupuesto Total</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Contenido Principal -->
    <div class="dashboard-content">
      <!-- Columna Izquierda -->
      <div class="content-left">
        <!-- Rutas Recientes -->
        <section class="section-card">
          <div class="section-header">
            <h2>Mis Rutas Recientes</h2>
            <button class="btn-primary" @click="crearRuta">Crear Nueva Ruta</button>
          </div>
          <div class="routes-list">
            <div v-if="loading" class="loading-message">Cargando rutas...</div>
            <div v-else-if="error" class="error-message">{{ error }}</div>
            <div v-else-if="rutasRecientes.length === 0" class="no-data-message">No hay rutas recientes.</div>
            <div v-else>
              <div v-for="ruta in rutasRecientes" :key="ruta.id" class="route-card" :class="ruta.status">
                <div class="route-info">
                  <h3>{{ ruta.name }}</h3>
                  <p>{{ ruta.description }}</p>
                  <div class="route-meta">
                    <span class="route-dates">{{ formatDate(ruta.startDate) }} - {{ formatDate(ruta.endDate) }}</span>
                    <span class="route-status">{{ getStatusText(ruta.status) }}</span>
                  </div>
                </div>
                <div class="route-actions">
                  <button @click="verDetalleRuta(ruta)" class="btn-view">Ver Detalles</button>
                  <button @click="editarRuta(ruta.id)" class="btn-edit">✏️</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Actividades Próximas -->
        <section class="section-card">
          <div class="section-header">
            <h2>Actividades Próximas</h2>
            <router-link to="/actividades" class="btn-secondary">Ver Todas</router-link>
          </div>
          <div class="activities-list">
            <div v-if="loading" class="loading-message">Cargando actividades...</div>
            <div v-else-if="error" class="error-message">{{ error }}</div>
            <div v-else-if="actividadesProximas.length === 0" class="no-data-message">No hay actividades próximas.</div>
            <div v-else>
              <div v-for="actividad in actividadesProximas" :key="actividad.id" class="activity-card">
                <div class="activity-icon" :class="actividad.type">
                  {{ getActivityIcon(actividad.type) }}
                </div>
                <div class="activity-info">
                  <h4>{{ actividad.name }}</h4>
                  <p>{{ actividad.description }}</p>
                  <div class="activity-meta">
                    <span class="activity-date">{{ formatDate(actividad.date) }}</span>
                    <span class="activity-location">{{ actividad.location }}</span>
                  </div>
                </div>
                <div class="activity-status" :class="actividad.status">
                  {{ getActivityStatusText(actividad.status) }}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- Columna Derecha -->
      <div class="content-right">
        <!-- Notas Rápidas -->
        <section class="section-card">
          <div class="section-header">
            <h2>Notas Rápidas</h2>
            <button @click="agregarNota" class="btn-add">+</button>
          </div>
          <div class="notes-list">
            <div v-if="loading" class="loading-message">Cargando notas...</div>
            <div v-else-if="error" class="error-message">{{ error }}</div>
            <div v-else-if="notasRecientes.length === 0" class="no-data-message">No hay notas recientes.</div>
            <div v-else>
              <div v-for="nota in notasRecientes" :key="nota.id" class="note-card" :class="{ important: nota.isImportant }">
                <div class="note-header">
                  <h4>{{ nota.title }}</h4>
                  <span class="note-category">{{ nota.category }}</span>
                </div>
                <p>{{ nota.content }}</p>
                <div class="note-footer">
                  <span class="note-date">{{ formatDate(nota.createdAt) }}</span>
                  <button @click="editarNota(nota.id)" class="btn-edit-small">✏️</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Destinos Recomendados -->
        <section class="section-card">
          <div class="section-header">
            <h2>Destinos Recomendados</h2>
            <router-link to="/lugares" class="btn-secondary">Explorar</router-link>
          </div>
          <div class="places-list">
            <div v-if="loading" class="loading-message">Cargando lugares...</div>
            <div v-else-if="error" class="error-message">{{ error }}</div>
            <div v-else-if="lugaresRecomendados.length === 0" class="no-data-message">No hay lugares recomendados.</div>
            <div v-else>
              <div v-for="lugar in lugaresRecomendados" :key="lugar.id" class="place-card" @click="verLugar(lugar)">
                <img :src="lugar.imageUrl" :alt="lugar.name" class="place-image" />
                <div class="place-info">
                  <h4>{{ lugar.name }}</h4>
                  <p>{{ lugar.city }}, {{ lugar.province }}</p>
                  <div class="place-rating">
                    <span class="stars">⭐ {{ lugar.rating }}</span>
                    <span class="place-category">{{ lugar.category }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
// Importar los servicios
import { getRoutes } from '../services/routesService'
import { getActivities, getUpcomingActivities } from '../services/activitiesService'
import { getNotes } from '../services/notesService'
import { getPlaces } from '../services/placesService'

const router = useRouter()
const auth = useAuthStore()

// Datos del usuario - inicializar con datos del store
const user = ref({ ...auth.user })

// Actualizar datos del usuario cuando cambie la autenticación
watch(() => auth.user, (newUser) => {
  if (newUser) {
    user.value = { ...newUser }
  }
}, { immediate: true })

// Estadísticas
const stats = ref({
  totalRoutes: 0,
  activeRoutes: 0,
  completedRoutes: 0,
  totalBudget: 0
})

// Rutas recientes (cargadas del backend)
const rutasRecientes = ref([])
// Actividades próximas (cargadas del backend)
const actividadesProximas = ref([])
// Notas recientes (cargadas del backend)
const notasRecientes = ref([])
// Lugares recomendados (cargados del backend)
const lugaresRecomendados = ref([])

const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  loading.value = true
  error.value = null
  try {
    // Rutas
    const rutas = await getRoutes()
    rutasRecientes.value = rutas.slice(0, 3) // Mostrar solo las 3 más recientes
    // Estadísticas básicas
    stats.value.totalRoutes = rutas.length
    stats.value.activeRoutes = rutas.filter(r => r.status === 'active').length
    stats.value.completedRoutes = rutas.filter(r => r.status === 'completed').length
    // Actividades próximas
    if (auth.user && auth.user.id) {
      actividadesProximas.value = await getUpcomingActivities(auth.user.id)
    } else {
      actividadesProximas.value = []
    }
    // Notas
    const notas = await getNotes()
    notasRecientes.value = notas.slice(0, 3)
    // Lugares
    const lugares = await getPlaces()
    lugaresRecomendados.value = lugares.slice(0, 3)
  } catch (e) {
    error.value = 'Error al cargar datos del backend'
    console.error(e)
  } finally {
    loading.value = false
  }
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

function getActivityIcon(type) {
  const iconMap = {
    visita: '🏛️',
    comida: '🍽️',
    transporte: '🚌',
    alojamiento: '🏨'
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

function crearRuta() {
  router.push('/ruta/nueva')
}

function editarRuta(id) {
  router.push(`/ruta/${id}/editar`)
}

function agregarNota() {
  // Implementar modal o navegación para agregar nota
  console.log('Agregar nota')
}

function editarNota(id) {
  // Implementar edición de nota
  console.log('Editar nota:', id)
}

function verLugar(lugar) {
  router.push(`/lugar/${lugar.id}`)
}

function verDetalleRuta(ruta) {
  if (!auth.isAuthenticated || !ruta.id) {
    router.push({ name: 'Login', query: { redirected: 'true' } })
    return
  }
  router.push(`/ruta/${ruta.id}`)
}

function logout() {
  auth.logout()
  router.push('/')
}

function getAvatarUrl(avatar) {
  if (!avatar) return 'https://cdn-icons-png.flaticon.com/512/1946/1946429.png'
  if (avatar.startsWith('http')) return avatar
  return 'http://localhost:3000' + avatar
}

onMounted(() => {
  if (!auth.isAuthenticated) {
    router.push('/login')
  }
})
</script>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f6d36522 0%, #43e97b22 100%);
  padding: 2rem;
}

/* Header del Dashboard */
.dashboard-header {
  background: white;
  border-radius: 18px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px rgba(67, 233, 123, 0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-welcome {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
}

.user-welcome h1 {
  font-size: 1.8rem;
  margin-bottom: 0.2rem;
  color: var(--color-primario);
}

.user-welcome p {
  color: #666;
  font-size: 1.1rem;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn-notification {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background 0.2s;
}

.btn-notification:hover {
  background: rgba(67, 233, 123, 0.1);
}

.user-menu {
  display: flex;
  gap: 1rem;
}

.btn-profile, .btn-logout {
  padding: 0.7rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s;
}

.btn-profile {
  background: var(--color-primario);
  color: white;
}

.btn-profile:hover {
  background: var(--color-acento);
}

.btn-logout {
  background: #fda085;
  color: white;
}

.btn-logout:hover {
  background: #e74c3c;
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

/* Contenido Principal */
.dashboard-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}

.content-left, .content-right {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Tarjetas de Sección */
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

/* Rutas */
.routes-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.route-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-radius: 12px;
  border: 2px solid #f0f0f0;
  transition: all 0.2s;
}

.route-card.active {
  border-color: var(--color-primario);
  background: rgba(67, 233, 123, 0.05);
}

.route-card.planning {
  border-color: var(--color-acento);
  background: rgba(246, 211, 101, 0.05);
}

.route-card.completed {
  border-color: var(--color-azul);
  background: rgba(79, 209, 197, 0.05);
}

.route-info h3 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: var(--color-texto);
}

.route-info p {
  color: #666;
  margin-bottom: 0.5rem;
}

.route-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
}

.route-dates {
  color: var(--color-azul);
  font-weight: 500;
}

.route-status {
  padding: 0.2rem 0.8rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: bold;
}

.route-card.active .route-status {
  background: var(--color-primario);
  color: white;
}

.route-card.planning .route-status {
  background: var(--color-acento);
  color: white;
}

.route-card.completed .route-status {
  background: var(--color-azul);
  color: white;
}

.route-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-view, .btn-edit {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s;
}

.btn-view {
  background: var(--color-primario);
  color: white;
  text-decoration: none;
}

.btn-view:hover {
  background: var(--color-acento);
}

.btn-edit {
  background: var(--color-azul);
  color: white;
}

.btn-edit:hover {
  background: var(--color-acento2);
}

/* Actividades */
.activities-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 12px;
  background: #f8f9fa;
  transition: all 0.2s;
}

.activity-card:hover {
  background: rgba(67, 233, 123, 0.05);
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
  font-size: 1rem;
  margin-bottom: 0.2rem;
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

/* Notas */
.notes-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.note-card {
  padding: 1rem;
  border-radius: 12px;
  background: #f8f9fa;
  border-left: 4px solid var(--color-primario);
  transition: all 0.2s;
}

.note-card.important {
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

.note-card p {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
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

.btn-edit-small {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  padding: 0.2rem;
  border-radius: 4px;
  transition: background 0.2s;
}

.btn-edit-small:hover {
  background: rgba(67, 233, 123, 0.1);
}

/* Lugares */
.places-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.place-card {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-radius: 12px;
  background: #f8f9fa;
  cursor: pointer;
  transition: all 0.2s;
}

.place-card:hover {
  background: rgba(67, 233, 123, 0.05);
  transform: translateX(5px);
}

.place-image {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
}

.place-info {
  flex: 1;
}

.place-info h4 {
  font-size: 1rem;
  margin-bottom: 0.2rem;
  color: var(--color-texto);
}

.place-info p {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.place-rating {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
}

.stars {
  color: var(--color-acento);
  font-weight: bold;
}

.place-category {
  color: var(--color-azul);
  font-weight: 500;
}

/* Botones */
.btn-primary, .btn-secondary, .btn-add {
  padding: 0.7rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s;
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

.btn-add {
  background: var(--color-acento);
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-add:hover {
  background: var(--color-acento2);
  transform: scale(1.1);
}

/* Responsive */
@media (max-width: 1024px) {
  .dashboard-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .dashboard-container {
    padding: 1rem;
  }
  
  .header-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .route-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .route-actions {
    width: 100%;
    justify-content: flex-end;
  }
}
</style> 